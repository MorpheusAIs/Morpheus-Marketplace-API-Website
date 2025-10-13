# Global Notification System

## Overview

A comprehensive, reusable notification system that can be used anywhere in the application to display user-friendly messages for errors, warnings, info, and success states.

## Architecture

The notification system consists of three main parts:

1. **NotificationContext** (`/src/lib/NotificationContext.tsx`) - Global state management
2. **NotificationBanner** (`/src/components/NotificationBanner.tsx`) - UI component
3. **NotificationManager** (`/src/components/NotificationManager.tsx`) - Bridge component

## Features

- 🎨 **Four notification types**: Success, Error, Warning, Info
- ⏱️ **Auto-dismiss** with configurable duration
- 🔘 **Manual dismiss** button
- 🔗 **Action buttons** with links
- 🎬 **Smooth animations**
- 🎯 **Type-safe** with TypeScript
- 🪝 **Simple hook API** - use anywhere with `useNotification()`

## Quick Start

### Basic Usage

```typescript
'use client';

import { useNotification } from '@/lib/NotificationContext';

export function MyComponent() {
  const { success, error, warning, info } = useNotification();

  const handleAction = async () => {
    try {
      // ... your logic ...
      
      success('Action Completed', 'Your action was successful!');
    } catch (err) {
      error('Action Failed', 'Something went wrong. Please try again.');
    }
  };

  return <button onClick={handleAction}>Do Something</button>;
}
```

## API Reference

### Hook: `useNotification()`

Returns an object with the following methods:

#### Convenience Methods (Recommended)

```typescript
// Success notification (green, 5s duration)
success(title: string, message: string, options?: NotificationOptions)

// Error notification (red, 10s duration)
error(title: string, message: string, options?: NotificationOptions)

// Warning notification (yellow, 8s duration)
warning(title: string, message: string, options?: NotificationOptions)

// Info notification (blue, 6s duration)
info(title: string, message: string, options?: NotificationOptions)
```

#### Advanced Method

```typescript
// Full control over notification
showNotification(notification: {
  type: 'success' | 'error' | 'warning' | 'info',
  title: string,
  message: string,
  duration?: number,        // milliseconds
  actionLabel?: string,     // button text
  actionUrl?: string,       // button link
})
```

#### Dismiss Method

```typescript
// Manually dismiss notification
dismissNotification(id: string)
```

### Notification Options

```typescript
interface NotificationOptions {
  duration?: number;      // How long to show (ms), default varies by type
  actionLabel?: string;   // Text for action button
  actionUrl?: string;     // URL for action button
}
```

## Usage Examples

### 1. Simple Success Message

```typescript
const handleSave = async () => {
  await saveData();
  success('Saved', 'Your changes have been saved successfully.');
};
```

### 2. Error with Action Button

```typescript
const handleApiCall = async () => {
  try {
    await apiCall();
  } catch (err) {
    error(
      'API Error',
      'Failed to connect to the server. Please try again or contact support.',
      {
        actionLabel: 'Contact Support',
        actionUrl: '/support',
        duration: 10000  // Show for 10 seconds
      }
    );
  }
};
```

### 3. Warning Before Destructive Action

```typescript
const handleDelete = async (itemName: string) => {
  warning(
    'Confirm Deletion',
    `Are you sure you want to delete "${itemName}"? This cannot be undone.`,
    {
      duration: 8000
    }
  );
  
  // ... deletion logic ...
};
```

### 4. Info with Custom Duration

```typescript
const showHelp = () => {
  info(
    'Getting Started',
    'Click on "Create API Key" to generate your first key.',
    {
      actionLabel: 'Learn More',
      actionUrl: '/docs',
      duration: 15000  // Show for 15 seconds
    }
  );
};
```

### 5. Form Validation Error

```typescript
const validateAndSubmit = () => {
  if (!form.email) {
    error('Email Required', 'Please enter your email address.');
    return;
  }
  
  if (!isValidEmail(form.email)) {
    warning('Invalid Email', 'Please enter a valid email address.');
    return;
  }
  
  // Submit form...
};
```

### 6. Network Error Handling

```typescript
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    success('Data Loaded', 'Your data has been refreshed.');
  } catch (err) {
    if (err.message.includes('Failed to fetch')) {
      error(
        'Connection Error',
        'Unable to reach the server. Check your internet connection.',
        {
          duration: 10000
        }
      );
    } else {
      error('Load Failed', 'Failed to load data. Please try again.');
    }
  }
};
```

### 7. Authentication Issues

```typescript
const handleAuthError = (statusCode: number) => {
  if (statusCode === 401) {
    warning(
      'Session Expired',
      'Your session has expired. Please log in again.',
      {
        actionLabel: 'Log In',
        actionUrl: '/login',
        duration: 10000
      }
    );
  } else if (statusCode === 403) {
    error(
      'Access Denied',
      'You do not have permission to perform this action.',
      {
        duration: 8000
      }
    );
  }
};
```

### 8. Multi-Step Process

```typescript
const handleMultiStepProcess = async () => {
  try {
    info('Processing', 'Step 1 of 3: Validating data...');
    await validateData();
    
    info('Processing', 'Step 2 of 3: Uploading files...');
    await uploadFiles();
    
    info('Processing', 'Step 3 of 3: Finalizing...');
    await finalize();
    
    success('Complete', 'All steps completed successfully!');
  } catch (err) {
    error('Process Failed', `Failed at step: ${err.message}`);
  }
};
```

## Real-World Integration Examples

### Admin Page - API Key Management

```typescript
'use client';

import { useNotification } from '@/lib/NotificationContext';

export function AdminPage() {
  const { success, error, warning } = useNotification();

  const handleCreateApiKey = async (keyName: string) => {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        body: JSON.stringify({ name: keyName }),
      });

      if (!response.ok) throw new Error('Failed to create key');

      const data = await response.json();
      
      success(
        'API Key Created',
        `Your new API key "${keyName}" has been created. Copy it now as it won't be shown again.`
      );
      
      return data;
    } catch (err) {
      error(
        'Creation Failed',
        'Failed to create API key. Please try again.',
        {
          duration: 8000
        }
      );
    }
  };

  const handleDeleteApiKey = async (keyId: number, keyName: string) => {
    try {
      warning(
        'Deleting API Key',
        `Permanently deleting "${keyName}". This cannot be undone.`,
        {
          duration: 5000
        }
      );

      await fetch(`/api/keys/${keyId}`, { method: 'DELETE' });
      
      success('Deleted', `API key "${keyName}" has been deleted.`);
    } catch (err) {
      error('Deletion Failed', 'Failed to delete API key.');
    }
  };

  return <div>{/* Admin UI */}</div>;
}
```

### Chat Page - Message Handling

```typescript
'use client';

import { useNotification } from '@/lib/NotificationContext';

export function ChatPage() {
  const { error, warning } = useNotification();

  const sendMessage = async (message: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });

      if (response.status === 401) {
        warning(
          'Authentication Required',
          'Please verify your API key to continue chatting.',
          {
            actionLabel: 'Go to Admin',
            actionUrl: '/admin',
            duration: 10000
          }
        );
        return;
      }

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      error(
        'Message Failed',
        'Failed to send your message. Please try again.',
        {
          duration: 8000
        }
      );
    }
  };

  return <div>{/* Chat UI */}</div>;
}
```

## Current Implementations

The notification system is already integrated in:

### 1. Authentication Flow (CognitoAuthContext)

- ✅ **API Key Verified** - Success notification when default key is auto-decrypted
- ⚠️ **Verification Required** - Warning when auto-decryption fails
- ℹ️ **API Key Available** - Info when key exists but needs manual verification
- ℹ️ **Welcome** - Info for first-time users with no keys
- ❌ **Setup Error** - Error when API key setup fails

### 2. 404 Page (not-found.tsx)

Redirects invalid URLs to home page with user-friendly message.

## Best Practices

### DO ✅

- Use clear, action-oriented titles
- Provide specific, helpful messages
- Include action buttons when users need to do something
- Use appropriate notification types (don't use error for warnings)
- Set longer durations for important messages (10s for errors)
- Handle network errors gracefully

### DON'T ❌

- Show notifications for every single action (avoid notification fatigue)
- Use generic messages like "Error occurred"
- Stack multiple notifications (current system shows one at a time)
- Use notifications for debugging (use console.log instead)
- Leave users hanging - always explain what happened and what to do next

## Styling

Notifications are styled with:
- Tailwind CSS classes
- CSS variables from your design system (--neon-mint, --eclipse, etc.)
- Smooth animations (fade in/out, slide down)
- Responsive design (works on mobile and desktop)
- High contrast for accessibility

## Testing

To test notifications:

```typescript
// In any component
const { success, error, warning, info } = useNotification();

// Test all types
const testNotifications = () => {
  success('Test Success', 'This is a success message');
  
  setTimeout(() => {
    error('Test Error', 'This is an error message');
  }, 2000);
  
  setTimeout(() => {
    warning('Test Warning', 'This is a warning message');
  }, 4000);
  
  setTimeout(() => {
    info('Test Info', 'This is an info message');
  }, 6000);
};
```

## Troubleshooting

### Notification doesn't appear

- Ensure `NotificationProvider` is in your layout above the component
- Check browser console for errors
- Verify you're calling the hook inside a component

### Notification disappears too quickly

- Increase the `duration` option (in milliseconds)
- Error notifications default to 10s, others less

### Want to prevent auto-dismiss

- Set a very long duration: `duration: 999999999`
- User can still manually dismiss

## Future Enhancements

Potential improvements:

- 📚 Notification queue for multiple notifications
- 💾 Persistent notifications across page navigation
- 🔊 Optional sound/vibration for critical alerts
- 📜 Notification history/log
- 🎨 Custom positioning (corners, center)
- 🌓 Dark/light theme variations
- ⌨️ Keyboard shortcuts for dismissing
- 📱 Better mobile optimizations

## Architecture Decision Records

### Why a global context?

- Single source of truth for notifications
- Works anywhere in the app without prop drilling
- Easy to test and maintain

### Why one notification at a time?

- Avoids overwhelming users
- Cleaner UI/UX
- Can be extended to queue if needed

### Why separate NotificationBanner component?

- Reusability - can be used outside the context if needed
- Testability - component logic separate from state management
- Flexibility - easy to swap different notification UIs

## Migration Guide

If you have existing error handling:

```typescript
// BEFORE
const [error, setError] = useState('');
// ...
setError('Something went wrong');
// ...
{error && <div className="error">{error}</div>}

// AFTER
const { error: showError } = useNotification();
// ...
showError('Error', 'Something went wrong');
// (notification shows automatically, no JSX needed)
```

---

**Last Updated**: October 2024  
**Version**: 1.0.0  
**Maintainer**: Morpheus API Gateway Team
