'use client';

import React, { useEffect, useState } from 'react';

export type NotificationType = 'error' | 'warning' | 'info' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // milliseconds, default 8000 (8 seconds)
  actionLabel?: string;
  actionUrl?: string;
}

interface NotificationBannerProps {
  notification: Notification | null;
  onDismiss: (id: string) => void;
}

export default function NotificationBanner({ notification, onDismiss }: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      setIsExiting(false);

      const duration = notification.duration || 8000;
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [notification]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (notification) {
        onDismiss(notification.id);
      }
      setIsExiting(false);
    }, 300);
  };

  if (!notification || !isVisible) return null;

  const getStyles = () => {
    switch (notification.type) {
      case 'error':
        return {
          bg: 'bg-red-900/90',
          border: 'border-red-500',
          text: 'text-red-100',
          icon: '❌',
          titleColor: 'text-red-200'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-900/90',
          border: 'border-yellow-500',
          text: 'text-yellow-100',
          icon: '⚠️',
          titleColor: 'text-yellow-200'
        };
      case 'info':
        return {
          bg: 'bg-blue-900/90',
          border: 'border-blue-500',
          text: 'text-blue-100',
          icon: 'ℹ️',
          titleColor: 'text-blue-200'
        };
      case 'success':
        return {
          bg: 'bg-green-900/90',
          border: 'border-green-500',
          text: 'text-green-100',
          icon: '✅',
          titleColor: 'text-green-200'
        };
      default:
        return {
          bg: 'bg-gray-900/90',
          border: 'border-gray-500',
          text: 'text-gray-100',
          icon: 'ℹ️',
          titleColor: 'text-gray-200'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50 transition-all duration-300 ${
      isExiting ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'
    }`}>
      <div className={`${styles.bg} ${styles.border} border-l-4 rounded-lg shadow-2xl p-4 backdrop-blur-sm`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 text-2xl mr-3">
            {styles.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold ${styles.titleColor} mb-1`}>
              {notification.title}
            </h3>
            <p className={`text-sm ${styles.text}`}>
              {notification.message}
            </p>
            {notification.actionLabel && notification.actionUrl && (
              <a
                href={notification.actionUrl}
                className={`inline-block mt-3 px-4 py-2 text-sm font-medium rounded transition-colors ${
                  notification.type === 'error' 
                    ? 'bg-red-700 hover:bg-red-600 text-white'
                    : notification.type === 'warning'
                    ? 'bg-yellow-700 hover:bg-yellow-600 text-white'
                    : 'bg-blue-700 hover:bg-blue-600 text-white'
                }`}
              >
                {notification.actionLabel}
              </a>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className={`flex-shrink-0 ml-3 ${styles.text} hover:opacity-70 transition-opacity`}
            aria-label="Dismiss notification"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

