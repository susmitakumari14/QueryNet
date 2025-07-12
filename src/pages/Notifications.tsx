import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Bell, 
  MessageSquare, 
  User, 
  Award,
  Check,
  Trash2,
  Filter,
  Clock,
  Mail
} from "lucide-react";

interface Notification {
  id: string;
  type: "answer" | "comment" | "question" | "badge" | "mention";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

export default function Notifications() {
  const [filter, setFilter] = useState("all");
  const isMobile = useIsMobile();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "answer",
      title: "New answer to your question",
      message: "Someone answered 'How to implement JWT authentication in React?'",
      time: "2 minutes ago",
      read: false,
      actionUrl: "/question/1"
    },
    {
      id: "2", 
      type: "comment",
      title: "New comment on your answer",
      message: "User commented on your answer about React performance optimization",
      time: "1 hour ago",
      read: false,
      actionUrl: "/question/3"
    },
    {
      id: "3",
      type: "badge",
      title: "Badge earned!",
      message: "You earned the 'Scholar' badge for asking a well-received question",
      time: "3 hours ago",
      read: true
    },
    {
      id: "4",
      type: "question",
      title: "Question in your favorite tag",
      message: "New question tagged with 'react': Understanding React Server Components",
      time: "5 hours ago",
      read: true,
      actionUrl: "/question/4"
    },
    {
      id: "5",
      type: "mention",
      title: "You were mentioned",
      message: "@john_doe mentioned you in a comment on 'Best practices for state management'",
      time: "1 day ago",
      read: true,
      actionUrl: "/question/2"
    },
    {
      id: "6",
      type: "answer",
      title: "Answer accepted",
      message: "Your answer to 'How to optimize React performance?' was accepted",
      time: "2 days ago",
      read: true,
      actionUrl: "/question/3"
    }
  ]);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "answer":
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case "question":
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case "badge":
        return <Award className="h-4 w-4 text-yellow-600" />;
      case "mention":
        return <User className="h-4 w-4 text-orange-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "answer":
        return "bg-blue-50 border-blue-200";
      case "comment":
        return "bg-green-50 border-green-200";
      case "question":
        return "bg-purple-50 border-purple-200";
      case "badge":
        return "bg-yellow-50 border-yellow-200";
      case "mention":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: false } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
        {/* Header */}
        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
          <div>
            <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>Notifications</h1>
            <p className="text-muted-foreground text-sm">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "sm"}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className={isMobile ? "w-full" : ""}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-sm border-border/50">
          <CardContent className={`${isMobile ? 'p-4' : 'pt-6'}`}>
            <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
              <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-2'}`}>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>
                <div className={`flex ${isMobile ? 'flex-col gap-2' : 'gap-1'}`}>
                  {[
                    { key: "all", label: "All", count: notifications.length },
                    { key: "unread", label: "Unread", count: unreadCount },
                    { key: "read", label: "Read", count: notifications.length - unreadCount }
                  ].map((option) => (
                    <Button
                      key={option.key}
                      variant={filter === option.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter(option.key)}
                      className={`${isMobile ? 'w-full justify-between' : ''}`}
                    >
                      <span>{option.label}</span>
                      {option.count > 0 && (
                        <Badge variant="secondary" className={`h-5 w-5 p-0 text-xs ${isMobile ? 'ml-auto' : 'ml-2'}`}>
                          {option.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <Card className="shadow-sm border-border/50">
              <CardContent className={`${isMobile ? 'p-4' : 'pt-6'}`}>
                <div className="text-center py-6 sm:py-8">
                  <Bell className={`text-muted-foreground mx-auto mb-4 ${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`} />
                  <h3 className="font-medium mb-2">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    {filter === "unread" ? "All notifications have been read" : "You're all caught up!"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`shadow-sm border-border/50 transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
              >
                <CardContent className={`${isMobile ? 'p-4' : 'pt-4'}`}>
                  <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-start gap-4'}`}>
                    {/* Mobile Header */}
                    {isMobile && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {notification.time}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => markAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => markAsUnread(notification.id)}
                              title="Mark as unread"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => deleteNotification(notification.id)}
                            title="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Desktop Layout */}
                    {!isMobile && (
                      <>
                        {/* Icon */}
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className={`font-medium ${!notification.read ? 'text-blue-900' : 'text-foreground'}`}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {notification.time}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              {!notification.read ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => markAsRead(notification.id)}
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => markAsUnread(notification.id)}
                                  title="Mark as unread"
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700"
                                onClick={() => deleteNotification(notification.id)}
                                title="Delete notification"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Mobile Content */}
                    {isMobile && (
                      <div className="flex-1">
                        <h3 className={`font-medium mb-2 ${!notification.read ? 'text-blue-900' : 'text-foreground'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" className={isMobile ? "w-full" : ""}>
              Load More Notifications
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
