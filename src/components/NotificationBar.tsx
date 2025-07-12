import React, { useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type NotificationType = "success" | "error" | "info" | "warning";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationBarProps {
  notification: Notification | null;
  onDismiss: () => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: "border-l-success bg-success/5",
  error: "border-l-destructive bg-destructive/5",
  info: "border-l-primary bg-primary/5",
  warning: "border-l-yellow-500 bg-yellow-500/5",
};

export function NotificationBar({ notification, onDismiss }: NotificationBarProps) {
  if (!notification) return null;

  const Icon = iconMap[notification.type];
  const colorClass = colorMap[notification.type];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className={`border-l-4 ${colorClass} shadow-large animate-fade-in`}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Icon className="h-5 w-5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {notification.action && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={notification.action.onClick}
                >
                  {notification.action.label}
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onDismiss}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (notif: Omit<Notification, "id">) => {
    setNotification({
      ...notif,
      id: Date.now().toString(),
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showNotification,
    dismissNotification,
  };
}