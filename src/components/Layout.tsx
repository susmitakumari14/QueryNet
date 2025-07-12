import React, { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Plus, User, Menu, LogIn, LogOut, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const isMobile = useIsMobile();
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    // Simulate getting notifications when logged in
    setNotificationCount(3);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setNotificationCount(0);
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
    // Optionally reduce count when visiting notifications page
    // setNotificationCount(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between min-h-[56px]">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <h1 
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
                onClick={() => navigate('/')}
              >
                QueryNet
              </h1>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search questions..."
                  className="pl-10 bg-muted/50 border-border/50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Notifications for all users */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="header-button hover:bg-muted/50 transition-all duration-200 touch-manipulation"
                  onClick={handleNotificationClick}
                  title="Notifications"
                  aria-label={isLoggedIn ? `Notifications (${notificationCount} unread)` : "Notifications"}
                >
                  <Bell className="h-5 w-5 transition-transform hover:scale-110" />
                </Button>
                {isLoggedIn && notificationCount > 0 && (
                  <Badge className="notification-badge bg-red-500 text-white border-2 border-background animate-pulse">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </div>

              {/* Desktop Ask Question Button */}
              <Button 
                variant="default" 
                className="hidden sm:flex bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/ask')}
                size={isMobile ? "sm" : "default"}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>

              {/* Mobile Ask Question Button */}
              <Button 
                variant="default" 
                className="sm:hidden bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/ask')}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>

              <ThemeToggle />

              {/* Settings Button - Desktop only */}
              {isLoggedIn && !isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="header-button hover:bg-muted/50 transition-all duration-200"
                  onClick={() => navigate('/profile?tab=settings')}
                  title="Settings"
                >
                  <Settings className="h-5 w-5 transition-transform hover:rotate-90" />
                </Button>
              )}

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="header-button">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/notifications')}>
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile?tab=settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowLoginModal(true)}
                    className="hidden sm:flex"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowLoginModal(true)}
                    className="sm:hidden"
                    size="sm"
                  >
                    <LogIn className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="header-button md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search questions..."
                className="pl-10 bg-muted/50 border-border/50"
              />
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-3 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/');
                    setShowMobileMenu(false);
                  }}
                >
                  Home
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/ask');
                    setShowMobileMenu(false);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ask Question
                </Button>
                {isLoggedIn && (
                  <>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => {
                        navigate('/profile');
                        setShowMobileMenu(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start relative"
                      onClick={() => {
                        handleNotificationClick();
                        setShowMobileMenu(false);
                      }}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                      {notificationCount > 0 && (
                        <Badge className="ml-auto h-5 w-5 rounded-full p-0 text-[10px] bg-red-500 flex items-center justify-center">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </Badge>
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => {
                        navigate('/profile?tab=settings');
                        setShowMobileMenu(false);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600"
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                )}
                {!isLoggedIn && (
                  <Button 
                    variant="default" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setShowLoginModal(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Login to QueryNet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input placeholder="Enter your email" type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input placeholder="Enter your password" type="password" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button onClick={handleLogin} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Login
                </Button>
                <Button variant="outline" onClick={() => setShowLoginModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}