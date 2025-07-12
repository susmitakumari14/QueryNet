import React, { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { api, Notification } from "@/lib/api";
import { 
  Bell, 
  MessageSquare, 
  User, 
  Award,
  Check,
  Trash2,
  Filter,
  Clock,
  Mail,
  Loader2
} from "lucide-react";

export default function Notifications() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const loadNotifications = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      const currentPage = reset ? 1 : page;
      const response = await api.getNotifications({
        page: currentPage,
        limit: 20,
        filter: filter as 'all' | 'unread' | 'read',
      });

      if (response.success && response.data) {
        if (reset) {
          setNotifications(response.data);
        } else {
          setNotifications(prev => [...prev, ...response.data!]);
        }

        setUnreadCount(response.meta?.unreadCount || 0);
        setHasMore((response.pagination?.pages || 1) > currentPage);
        setPage(currentPage + 1);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to load notifications",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, [filter, page, toast]);

  useEffect(() => {
    loadNotifications(true);
  }, [filter, loadNotifications]);

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
      case "vote":
        return <Award className="h-4 w-4 text-indigo-600" />;
      case "accept":
        return <Check className="h-4 w-4 text-green-600" />;
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
      case "vote":
        return "bg-indigo-50 border-indigo-200";
      case "accept":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await api.markNotificationRead(id);
      if (response.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === id ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to mark notification as read",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      const response = await api.markNotificationUnread(id);
      if (response.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === id ? { ...notif, isRead: false } : notif
          )
        );
        setUnreadCount(prev => prev + 1);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to mark notification as unread",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Mark as unread error:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as unread",
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await api.deleteNotification(id);
      if (response.success) {
        const notificationToDelete = notifications.find(n => n._id === id);
        setNotifications(prev => prev.filter(notif => notif._id !== id));
        if (notificationToDelete && !notificationToDelete.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        toast({
          title: "Success",
          description: "Notification deleted",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete notification",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Delete notification error:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await api.markAllNotificationsRead();
      if (response.success) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
        toast({
          title: "Success",
          description: "All notifications marked as read",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to mark all notifications as read",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications;

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </Layout>
    );
  }

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
                key={notification._id} 
                className={`shadow-sm border-border/50 transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
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
                            {formatTimeAgo(notification.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.isRead ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => markAsRead(notification._id)}
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => markAsUnread(notification._id)}
                              title="Mark as unread"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => deleteNotification(notification._id)}
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
                              <h3 className={`font-medium ${!notification.isRead ? 'text-blue-900' : 'text-foreground'}`}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(notification.createdAt)}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              {!notification.isRead ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => markAsRead(notification._id)}
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => markAsUnread(notification._id)}
                                  title="Mark as unread"
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700"
                                onClick={() => deleteNotification(notification._id)}
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
                        <h3 className={`font-medium mb-2 ${!notification.isRead ? 'text-blue-900' : 'text-foreground'}`}>
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
        {filteredNotifications.length > 0 && hasMore && (
          <div className="flex justify-center pt-4">
            <Button 
              variant="outline" 
              className={isMobile ? "w-full" : ""}
              onClick={() => loadNotifications(false)}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Notifications'
              )}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
