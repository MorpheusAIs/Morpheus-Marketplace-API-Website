'use client';

import React from 'react';
import { useNotification } from '@/lib/NotificationContext';
import NotificationBanner from './NotificationBanner';

/**
 * NotificationManager component that displays notifications globally.
 * This component is separate from NotificationBanner to allow it to access the notification context.
 */
export default function NotificationManager() {
  const { notification, dismissNotification } = useNotification();

  return (
    <NotificationBanner 
      notification={notification} 
      onDismiss={dismissNotification} 
    />
  );
}

