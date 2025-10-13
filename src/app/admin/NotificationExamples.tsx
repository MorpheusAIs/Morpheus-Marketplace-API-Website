/**
 * EXAMPLE FILE - Notification Usage Patterns for Admin Page
 * 
 * This file demonstrates how to use the global notification system in the Admin page.
 * You can copy these patterns into your actual admin/page.tsx file.
 */

'use client';

import { useNotification } from '@/lib/NotificationContext';

export function AdminPageWithNotifications() {
  const { success, error, warning, info } = useNotification();

  // Example 1: API Key Creation Success
  const handleCreateApiKey = async () => {
    try {
      // ... API key creation logic ...
      
      success(
        'API Key Created',
        'Your new API key has been created successfully. Make sure to copy it now as it won\'t be shown again.'
      );
    } catch (err) {
      error(
        'Failed to Create API Key',
        'There was an error creating your API key. Please try again or contact support if the problem persists.',
        {
          actionLabel: 'Contact Support',
          actionUrl: '/support',
          duration: 10000,
        }
      );
    }
  };

  // Example 2: API Key Deletion Warning
  const handleDeleteApiKey = async (keyId: number, keyName: string) => {
    try {
      // Show warning before deletion
      warning(
        'API Key Will Be Deleted',
        `You are about to delete the API key "${keyName}". This action cannot be undone.`,
        {
          duration: 8000,
        }
      );
      
      // ... deletion logic ...
      
      success(
        'API Key Deleted',
        `The API key "${keyName}" has been permanently deleted.`
      );
    } catch (err) {
      error(
        'Deletion Failed',
        'Failed to delete the API key. Please try again.',
        {
          duration: 8000,
        }
      );
    }
  };

  // Example 3: Automation Settings Update
  const handleSaveAutomationSettings = async () => {
    try {
      // ... save logic ...
      
      success(
        'Settings Saved',
        'Your automation settings have been updated successfully.'
      );
    } catch (err) {
      error(
        'Save Failed',
        'Failed to save your automation settings. Please check your connection and try again.'
      );
    }
  };

  // Example 4: API Key Verification
  const handleVerifyApiKey = async (apiKey: string) => {
    try {
      // ... verification logic ...
      
      success(
        'API Key Verified',
        'Your API key has been verified and is ready to use with Chat and Test features.',
        {
          duration: 5000,
        }
      );
    } catch (err) {
      error(
        'Verification Failed',
        'The API key you entered is invalid. Please check and try again.',
        {
          duration: 8000,
        }
      );
    }
  };

  // Example 5: Informational Message
  const showFirstTimeUserHelp = () => {
    info(
      'Getting Started',
      'Create your first API key to start using the Morpheus API Gateway. Each key can be configured with different automation settings.',
      {
        actionLabel: 'Learn More',
        actionUrl: '/docs',
        duration: 10000,
      }
    );
  };

  // Example 6: Form Validation Warning
  const validateForm = (keyName: string) => {
    if (!keyName.trim()) {
      warning(
        'Name Required',
        'Please enter a name for your API key to help you identify it later.',
        {
          duration: 5000,
        }
      );
      return false;
    }
    return true;
  };

  // Example 7: Network Error
  const handleNetworkError = (err: any) => {
    error(
      'Connection Error',
      'Unable to connect to the server. Please check your internet connection and try again.',
      {
        duration: 8000,
      }
    );
  };

  // Example 8: Session Expiration Warning
  const handleSessionExpiring = () => {
    warning(
      'Session Expiring Soon',
      'Your session will expire in 5 minutes. Please save your work.',
      {
        duration: 10000,
      }
    );
  };

  return <div>Admin Page Content...</div>;
}

