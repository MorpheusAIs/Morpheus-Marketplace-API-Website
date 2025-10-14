'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'error' | 'warning' | 'info' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  actionLabel?: string;
  actionUrl?: string;
}

interface NotificationContextType {
  notification: Notification | null;
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
  // Convenience methods for common notification types
  success: (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => void;
  error: (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => void;
  warning: (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => void;
  info: (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    setNotification({
      id,
      ...notification,
    });
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotification(null);
  }, []);

  // Convenience method for success notifications
  const success = useCallback((
    title: string, 
    message: string, 
    options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>
  ) => {
    showNotification({
      type: 'success',
      title,
      message,
      duration: 5000,
      ...options,
    });
  }, [showNotification]);

  // Convenience method for error notifications
  const error = useCallback((
    title: string, 
    message: string, 
    options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>
  ) => {
    showNotification({
      type: 'error',
      title,
      message,
      duration: 10000,
      ...options,
    });
  }, [showNotification]);

  // Convenience method for warning notifications
  const warning = useCallback((
    title: string, 
    message: string, 
    options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>
  ) => {
    showNotification({
      type: 'warning',
      title,
      message,
      duration: 8000,
      ...options,
    });
  }, [showNotification]);

  // Convenience method for info notifications
  const info = useCallback((
    title: string, 
    message: string, 
    options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>
  ) => {
    showNotification({
      type: 'info',
      title,
      message,
      duration: 6000,
      ...options,
    });
  }, [showNotification]);

  const value = {
    notification,
    showNotification,
    dismissNotification,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

