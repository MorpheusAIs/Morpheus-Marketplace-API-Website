# User Notification System

## Overview

A comprehensive notification system that displays user-friendly messages for authentication and API key issues, preventing confusion when things don't work as expected.

## Features

### 1. NotificationBanner Component
- **Location**: `/src/components/NotificationBanner.tsx`
- Beautiful, animated notification banner that appears at the top-right
- Auto-dismisses after configurable duration (default 8 seconds)
- Manual dismiss via close button
- Four notification types with distinct styling:
  - ✅ **Success** (green) - Positive confirmations
  - ⚠️ **Warning** (yellow) - Important but non-critical issues
  - ℹ️ **Info** (blue) - Informational messages
  - ❌ **Error** (red) - Critical errors that need attention

### 2. Notification Manager
- **Location**: `/src/components/NotificationManager.tsx`
- Global component integrated into root layout
- Automatically connects to auth context to display notifications

### 3. Auth Context Integration
- **Location**: `/src/lib/auth/CognitoAuthContext.tsx`
- Notifications are managed centrally in the auth context
- Any component can access notification state via `useCognitoAuth()`

## Notification Scenarios

### API Key Decryption Issues

#### 1. **Decryption Failed (Warning)**
- **Trigger**: When auto-decryption of default API key fails
- **User sees**: 
  - Title: "API Key Verification Required"
  - Message: Explains they need to verify their API key
  - Action Button: "Go to Admin" → `/admin`
  - Duration: 10 seconds
- **Prevents**: Redirect loop where users get stuck bouncing between pages

#### 2. **API Key Auto-Selected (Success)**
- **Trigger**: When default API key is successfully auto-decrypted
- **User sees**:
  - Title: "API Key Ready"
  - Message: Shows which key was verified (prefix displayed)
  - Duration: 5 seconds
- **User Experience**: Confirmation that everything is working correctly

#### 3. **API Key Available But Not Decrypted (Info)**
- **Trigger**: When user has an API key but it wasn't auto-decrypted
- **User sees**:
  - Title: "API Key Available"
  - Message: Explains verification is needed
  - Action Button: "Go to Admin" → `/admin`
  - Duration: 8 seconds

#### 4. **First-Time User (Info)**
- **Trigger**: When user has no API keys
- **User sees**:
  - Title: "Welcome!"
  - Message: Friendly prompt to create first API key
  - Action Button: "Create API Key" → `/admin`
  - Duration: 10 seconds

#### 5. **API Key Setup Error (Error)**
- **Trigger**: When there's an exception during API key setup
- **User sees**:
  - Title: "API Key Setup Error"
  - Message: Explains there was an issue
  - Action Button: "Go to Admin" → `/admin`
  - Duration: 10 seconds

## Usage Example

If you want to add notifications from other components:

```typescript
import { useCognitoAuth } from '@/lib/auth/CognitoAuthContext';

function MyComponent() {
  const { notification, dismissNotification } = useCognitoAuth();
  
  // Notifications are displayed automatically via NotificationManager
  // Just access them if you need to check current state
  
  return <div>...</div>;
}
```

To programmatically show a notification (requires adding to auth context):

```typescript
// In CognitoAuthContext.tsx
showNotification({
  type: 'success',
  title: 'Action Completed',
  message: 'Your action was successful!',
  duration: 5000, // 5 seconds
});

// With action button
showNotification({
  type: 'error',
  title: 'Something Went Wrong',
  message: 'Please try again or contact support.',
  actionLabel: 'Contact Support',
  actionUrl: '/support',
  duration: 10000,
});
```

## Design Philosophy

1. **User-Centric**: Always explain what happened and what the user should do next
2. **Non-Intrusive**: Auto-dismiss after reasonable duration, manual dismiss always available
3. **Actionable**: When possible, provide a direct link to fix the issue
4. **Beautiful**: Matches the site's design aesthetic with smooth animations
5. **Accessible**: Proper contrast ratios, clear text, keyboard-accessible dismiss

## Testing

To test the notification system:

1. **Success Notification**: 
   - Log in with a user that has a default API key with working decryption
   - Should see green success notification

2. **Warning Notification**:
   - Log in with a user that has decryption issues
   - Should see yellow warning notification with "Go to Admin" button

3. **First-Time User**:
   - Create a new account with no API keys
   - Should see blue info notification welcoming them

4. **Manual Dismiss**:
   - Any notification should have a working X button to dismiss immediately

5. **Auto-Dismiss**:
   - Notifications should fade out automatically after their duration

## Future Enhancements

Potential improvements:

- Queue system for multiple notifications
- Persistent notifications that survive page navigation
- Sound/vibration options for critical notifications
- Notification history/log
- Custom notification positions (top-left, bottom-right, etc.)
- Dark/light theme support

