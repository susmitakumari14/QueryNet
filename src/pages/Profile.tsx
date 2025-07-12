import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Mail, 
  Camera,
  Save,
  Edit3,
  Award,
  MessageSquare,
  ThumbsUp,
  Eye,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Lock,
  Globe,
  Monitor,
  Sun,
  Moon,
  Smartphone,
  Key,
} from "lucide-react";

export default function Profile() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useIsMobile();

  // Handle URL parameters for direct navigation to tabs
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'settings', 'notifications', 'privacy'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);
  const [profile, setProfile] = useState({
    username: "john_doe",
    email: "john@example.com",
    fullName: "John Doe",
    bio: "Full-stack developer passionate about React and Node.js. Love helping others solve coding problems.",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    joinDate: "January 2023",
    reputation: 1234,
    questionsAsked: 15,
    answersGiven: 23,
    acceptedAnswers: 18,
    profileViews: 456
  });

  const [notifications, setNotifications] = useState({
    emailQuestions: true,
    emailAnswers: true,
    emailComments: false,
    pushNotifications: true,
    weeklyDigest: true,
    promotionalEmails: false
  });

  const [settings, setSettings] = useState({
    theme: "auto", // auto, light, dark
    language: "en",
    timezone: "UTC-8",
    twoFactorEnabled: false,
    publicProfile: true,
    showEmail: false
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showTwoFactorForm, setShowTwoFactorForm] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    password: ""
  });

  const handleProfileSave = () => {
    setIsEditing(false);
    // Here you would save to backend
    console.log("Profile saved:", profile);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    // Here you would save to backend
    console.log("Notification setting updated:", key, value);
  };

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    // Here you would save to backend
    console.log("Setting updated:", key, value);
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }
    // Here you would call the API to change password
    console.log("Password change requested");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswordForm(false);
  };

  const handleEmailChange = () => {
    // Here you would call the API to change email
    console.log("Email change requested:", emailForm.newEmail);
    setEmailForm({ newEmail: "", password: "" });
    setShowEmailForm(false);
  };

  const handleTwoFactorToggle = () => {
    handleSettingChange("twoFactorEnabled", !settings.twoFactorEnabled);
    setShowTwoFactorForm(!settings.twoFactorEnabled);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield }
  ];

  const userStats = [
    { label: "Reputation", value: profile.reputation, icon: Award, color: "text-yellow-600" },
    { label: "Questions", value: profile.questionsAsked, icon: MessageSquare, color: "text-blue-600" },
    { label: "Answers", value: profile.answersGiven, icon: ThumbsUp, color: "text-green-600" },
    { label: "Profile Views", value: profile.profileViews, icon: Eye, color: "text-purple-600" }
  ];

  const recentActivity = [
    { type: "question", title: "How to implement JWT authentication in React?", time: "2 hours ago" },
    { type: "answer", title: "Best practices for React state management", time: "1 day ago" },
    { type: "answer", title: "Optimizing React performance", time: "3 days ago" },
    { type: "question", title: "Understanding TypeScript generics", time: "1 week ago" }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="shadow-sm border-border/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative mx-auto sm:mx-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                </div>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold">{profile.fullName}</h1>
                  <Button
                    variant="outline"
                    size={isMobile ? "sm" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full sm:w-auto"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
                <p className="text-muted-foreground mb-2">@{profile.username}</p>
                <p className="text-sm mb-4">{profile.bio}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a href={profile.website} className="text-blue-600 hover:underline truncate">
                      {profile.website}
                    </a>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {profile.joinDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
              {userStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`flex items-center justify-center mb-2 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="font-semibold text-base sm:text-lg">{stat.value.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Tab Navigation */}
        {isMobile ? (
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-2">
              <div className="grid grid-cols-2 gap-1">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                    onClick={() => setActiveTab(tab.id)}
                    size="sm"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="text-xs">{tab.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-4'} gap-6`}>
          {/* Desktop Sidebar Navigation */}
          {!isMobile && (
            <div className="space-y-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>
          )}

          {/* Main Content */}
          <div className={isMobile ? 'col-span-1' : 'lg:col-span-3'}>
            {activeTab === "profile" && (
              <Card className="shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={profile.fullName}
                            onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={profile.username}
                            onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          placeholder="Tell us about yourself..."
                          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={profile.bio}
                          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={profile.location}
                            onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profile.website}
                            onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleProfileSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                          {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                              <div className={`p-2 rounded-full ${
                                activity.type === 'question' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                              }`}>
                                {activity.type === 'question' ? 
                                  <MessageSquare className="h-4 w-4" /> : 
                                  <ThumbsUp className="h-4 w-4" />
                                }
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{activity.title}</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-4">Badges & Achievements</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            🏆 First Question
                          </Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            ✅ Accepted Answer
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            📚 Scholar
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            🎯 Popular Question
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card className="shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { key: "emailQuestions", label: "New questions in your tags", description: "Get notified when someone asks a question in your favorite tags" },
                        { key: "emailAnswers", label: "Answers to your questions", description: "Receive emails when someone answers your questions" },
                        { key: "emailComments", label: "Comments on your posts", description: "Get notified when someone comments on your questions or answers" },
                        { key: "weeklyDigest", label: "Weekly digest", description: "Weekly summary of top questions and trending topics" },
                        { key: "promotionalEmails", label: "Promotional emails", description: "Updates about new features and community events" }
                      ].map((item) => (
                        <div key={item.key} className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 border border-border/50 rounded-md gap-3">
                          <div className="flex-1">
                            <div className="font-medium text-sm sm:text-base">{item.label}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">{item.description}</div>
                          </div>
                          <Button
                            variant={notifications[item.key as keyof typeof notifications] ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleNotificationChange(item.key, !notifications[item.key as keyof typeof notifications])}
                            className="w-full sm:w-auto"
                          >
                            {notifications[item.key as keyof typeof notifications] ? "On" : "Off"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Push Notifications</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border/50 rounded-md gap-3">
                      <div>
                        <div className="font-medium text-sm sm:text-base">Browser notifications</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Real-time notifications in your browser</div>
                      </div>
                      <Button
                        variant={notifications.pushNotifications ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange("pushNotifications", !notifications.pushNotifications)}
                        className="w-full sm:w-auto"
                      >
                        {notifications.pushNotifications ? "On" : "Off"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Password & Security Section */}
                <Card className="shadow-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Password & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Change Password */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-border/50 rounded-md">
                        <div>
                          <div className="font-medium">Password</div>
                          <div className="text-sm text-muted-foreground">Last changed 3 months ago</div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowPasswordForm(!showPasswordForm)}
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                      </div>

                      {showPasswordForm && (
                        <Card className="bg-muted/30">
                          <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input
                                id="currentPassword"
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                placeholder="Enter current password"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input
                                id="newPassword"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                placeholder="Enter new password (min 8 characters)"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                placeholder="Confirm new password"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setShowPasswordForm(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handlePasswordChange}>
                                Update Password
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-md">
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-muted-foreground">
                          {settings.twoFactorEnabled ? "Enabled via authenticator app" : "Add an extra layer of security"}
                        </div>
                      </div>
                      <Button 
                        variant={settings.twoFactorEnabled ? "default" : "outline"}
                        onClick={handleTwoFactorToggle}
                      >
                        <Smartphone className="h-4 w-4 mr-2" />
                        {settings.twoFactorEnabled ? "Enabled" : "Enable"}
                      </Button>
                    </div>

                    {showTwoFactorForm && !settings.twoFactorEnabled && (
                      <Card className="bg-muted/30">
                        <CardContent className="pt-6">
                          <div className="text-center space-y-4">
                            <div className="w-32 h-32 bg-white border-2 border-dashed border-border rounded-md mx-auto flex items-center justify-center">
                              <div className="text-sm text-muted-foreground">QR Code</div>
                            </div>
                            <div>
                              <p className="font-medium mb-2">Setup Code:</p>
                              <code className="bg-muted px-2 py-1 rounded text-sm">ABCD EFGH IJKL MNOP</code>
                            </div>
                            <div className="space-y-2">
                              <Label>Enter verification code from your app:</Label>
                              <Input placeholder="000000" maxLength={6} className="text-center" />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setShowTwoFactorForm(false)}>
                                Cancel
                              </Button>
                              <Button>Verify & Enable</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Change Email */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-border/50 rounded-md">
                        <div>
                          <div className="font-medium">Email Address</div>
                          <div className="text-sm text-muted-foreground">{profile.email}</div>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => setShowEmailForm(!showEmailForm)}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Change Email
                        </Button>
                      </div>

                      {showEmailForm && (
                        <Card className="bg-muted/30">
                          <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="newEmail">New Email Address</Label>
                              <Input
                                id="newEmail"
                                type="email"
                                value={emailForm.newEmail}
                                onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
                                placeholder="Enter new email address"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="emailPassword">Current Password</Label>
                              <Input
                                id="emailPassword"
                                type="password"
                                value={emailForm.password}
                                onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="Confirm with your current password"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setShowEmailForm(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleEmailChange}>
                                Update Email
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Preferences Section */}
                <Card className="shadow-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Theme Setting */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border/50 rounded-md gap-4">
                      <div>
                        <div className="font-medium text-sm sm:text-base">Theme</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Choose your interface appearance</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 w-full sm:w-auto">
                        {[
                          { key: "light", label: "Light", icon: Sun },
                          { key: "dark", label: "Dark", icon: Moon },
                          { key: "auto", label: "Auto", icon: Monitor }
                        ].map((theme) => (
                          <Button
                            key={theme.key}
                            variant={settings.theme === theme.key ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSettingChange("theme", theme.key)}
                            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 h-auto sm:h-9 py-2 sm:py-0"
                          >
                            <theme.icon className="h-4 w-4" />
                            <span className="text-xs sm:text-sm">{theme.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Language Setting */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border/50 rounded-md gap-4">
                      <div>
                        <div className="font-medium text-sm sm:text-base">Language</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Choose your preferred language</div>
                      </div>
                      <div className="grid grid-cols-2 sm:flex gap-1 w-full sm:w-auto">
                        {[
                          { key: "en", label: "English" },
                          { key: "es", label: "Spanish" },
                          { key: "fr", label: "French" },
                          { key: "de", label: "German" }
                        ].map((lang) => (
                          <Button
                            key={lang.key}
                            variant={settings.language === lang.key ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSettingChange("language", lang.key)}
                            className="flex items-center gap-1 text-xs sm:text-sm"
                          >
                            <Globe className="h-4 w-4" />
                            {lang.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Timezone Setting */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border/50 rounded-md gap-4">
                      <div>
                        <div className="font-medium text-sm sm:text-base">Time Zone</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Your local timezone for date display</div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-1 w-full sm:w-auto">
                        {[
                          { key: "UTC-8", label: "PST (UTC-8)" },
                          { key: "UTC-5", label: "EST (UTC-5)" },
                          { key: "UTC+0", label: "GMT (UTC+0)" },
                          { key: "UTC+1", label: "CET (UTC+1)" }
                        ].map((tz) => (
                          <Button
                            key={tz.key}
                            variant={settings.timezone === tz.key ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSettingChange("timezone", tz.key)}
                            className="text-xs sm:text-sm"
                          >
                            {tz.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Profile Visibility */}
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-md">
                      <div>
                        <div className="font-medium">Public Profile</div>
                        <div className="text-sm text-muted-foreground">Make your profile visible to everyone</div>
                      </div>
                      <Button
                        variant={settings.publicProfile ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSettingChange("publicProfile", !settings.publicProfile)}
                      >
                        {settings.publicProfile ? "Public" : "Private"}
                      </Button>
                    </div>

                    {/* Email Visibility */}
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-md">
                      <div>
                        <div className="font-medium">Show Email</div>
                        <div className="text-sm text-muted-foreground">Display your email on your public profile</div>
                      </div>
                      <Button
                        variant={settings.showEmail ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSettingChange("showEmail", !settings.showEmail)}
                      >
                        {settings.showEmail ? "Visible" : "Hidden"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Data & Privacy Section */}
                <Card className="shadow-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Data & Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      Download My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Activity Log
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Login Sessions
                    </Button>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="shadow-sm border-red-200 bg-red-50/30">
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-md bg-red-50">
                      <div>
                        <div className="font-medium text-red-800">Deactivate Account</div>
                        <div className="text-sm text-red-600">Temporarily disable your account</div>
                      </div>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">
                        Deactivate
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-md bg-red-50">
                      <div>
                        <div className="font-medium text-red-800">Delete Account</div>
                        <div className="text-sm text-red-600">Permanently delete your account and all data</div>
                      </div>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "privacy" && (
              <Card className="shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Profile Visibility</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-border/50 rounded-md">
                        <div>
                          <div className="font-medium">Public Profile</div>
                          <div className="text-sm text-muted-foreground">Make your profile visible to everyone</div>
                        </div>
                        <Button variant="default" size="sm">Public</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-border/50 rounded-md">
                        <div>
                          <div className="font-medium">Show Real Name</div>
                          <div className="text-sm text-muted-foreground">Display your real name on your profile</div>
                        </div>
                        <Button variant="default" size="sm">On</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-border/50 rounded-md">
                        <div>
                          <div className="font-medium">Show Location</div>
                          <div className="text-sm text-muted-foreground">Display your location on your profile</div>
                        </div>
                        <Button variant="default" size="sm">On</Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4 text-red-600">Danger Zone</h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                        Export My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
