'use client';

import React from 'react';
import { useCognitoAuth } from '@/lib/auth/CognitoAuthContext';
import NotificationBanner from './NotificationBanner';

/**
 * NotificationManager component that displays notifications from the auth context.
 * This component is separate from NotificationBanner to allow it to access the auth context.
 */
export default function NotificationManager() {
  const { notification, dismissNotification } = useCognitoAuth();

  return (
    <NotificationBanner 
      notification={notification} 
      onDismiss={dismissNotification} 
    />
  );
}

