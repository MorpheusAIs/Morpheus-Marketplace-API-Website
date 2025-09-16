# Cognito Integration via API - Developer Guide

A practical guide for integrating AWS Cognito authentication through the Morpheus API, based on lessons learned from real implementation.

## 1. Set Up Your Input Styling First

**Important:** Handle CSS styling issues early to avoid hours of debugging later!

```css
/* Add to your global CSS to ensure readable input text */
input, textarea, select {
  color: var(--light-text-color) !important;
}

/* For light background inputs (white/gray) */
.bg-white input, .bg-gray-100 input, 
input.bg-white, input.bg-gray-100 {
  color: var(--dark-text-color) !important;
}
```

### CSS Gotchas to Avoid
- Global CSS can override inline styles with `!important`
- Always test input text visibility on both light and dark backgrounds
- Use specific selectors instead of `!important` when possible
- Test typing in inputs - placeholder text might look fine while actual text is invisible

## 2. Basic Auth Modal Structure

```jsx
const [authMode, setAuthMode] = useState('signin'); // 'signin', 'signup', 'confirm', 'forgot'
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [confirmationCode, setConfirmationCode] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
```

## 3. API Endpoints

```javascript
const API_BASE = 'https://api.dev.mor.org'; // Update for your environment

// Sign Up
POST /auth/signup
Body: { email, password }
Response: { message: "User created successfully" }

// Sign In  
POST /auth/signin
Body: { email, password }
Response: { token: "jwt_token_here", user: {...} }

// Confirm Account
POST /auth/confirm
Body: { email, confirmationCode }
Response: { message: "Account confirmed successfully" }

// Forgot Password
POST /auth/forgot-password
Body: { email }
Response: { message: "Reset code sent to email" }

// Reset Password
POST /auth/reset-password
Body: { email, confirmationCode, newPassword }
Response: { message: "Password reset successfully" }
```

## 4. Essential Form Validation

```javascript
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

const validateConfirmationCode = (code) => {
  return code.length === 6 && /^\d+$/.test(code);
};
```

## 5. Error Handling

```javascript
const handleAuthError = (error) => {
  const commonErrors = {
    'UserNotFoundException': 'No account found with this email',
    'NotAuthorizedException': 'Invalid email or password',
    'CodeMismatchException': 'Invalid confirmation code',
    'ExpiredCodeException': 'Confirmation code expired',
    'UsernameExistsException': 'An account with this email already exists',
    'InvalidPasswordException': 'Password must be at least 8 characters',
    'LimitExceededException': 'Too many attempts. Please try again later'
  };
  
  return commonErrors[error.code] || error.message || 'Something went wrong';
};
```

## 6. Sample Implementation

### Sign Up Flow
```jsx
const handleSignUp = async () => {
  if (!validateEmail(email)) {
    setError('Please enter a valid email address');
    return;
  }
  
  if (!validatePassword(password)) {
    setError('Password must be at least 8 characters');
    return;
  }
  
  if (!validatePasswordMatch(password, confirmPassword)) {
    setError('Passwords do not match');
    return;
  }

  setIsLoading(true);
  setError('');
  
  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      setAuthMode('confirm');
      setError('');
    } else {
      const errorData = await response.json();
      setError(handleAuthError(errorData));
    }
  } catch (err) {
    setError('Network error. Please check your connection.');
  } finally {
    setIsLoading(false);
  }
};
```

### Sign In Flow
```jsx
const handleSignIn = async () => {
  if (!validateEmail(email) || !password) {
    setError('Please enter valid email and password');
    return;
  }

  setIsLoading(true);
  setError('');
  
  try {
    const response = await fetch(`${API_BASE}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const { token, user } = await response.json();
      
      // Store token securely (consider httpOnly cookies for production)
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      onSuccess(user);
    } else {
      const errorData = await response.json();
      setError(handleAuthError(errorData));
    }
  } catch (err) {
    setError('Network error. Please check your connection.');
  } finally {
    setIsLoading(false);
  }
};
```

### Confirmation Flow
```jsx
const handleConfirmation = async () => {
  if (!validateConfirmationCode(confirmationCode)) {
    setError('Please enter a valid 6-digit confirmation code');
    return;
  }

  setIsLoading(true);
  setError('');
  
  try {
    const response = await fetch(`${API_BASE}/auth/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, confirmationCode })
    });
    
    if (response.ok) {
      setAuthMode('signin');
      setError('');
      // Show success message
    } else {
      const errorData = await response.json();
      setError(handleAuthError(errorData));
    }
  } catch (err) {
    setError('Network error. Please check your connection.');
  } finally {
    setIsLoading(false);
  }
};
```

## 7. UX Best Practices

### User Flow
1. **Sign Up** → Email confirmation → Sign in
2. **Clear error messages** for each step
3. **Loading states** for all API calls
4. **Auto-focus** next input after successful steps
5. **Remember email** across different auth modes

### Input Field Styling
```jsx
// Example input with proper styling
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full p-3 bg-gray-100 border-0 rounded font-semibold focus:outline-none focus:ring-0 focus:bg-white"
  placeholder="name@example.com"
  required
/>
```

### Loading States
```jsx
<button
  onClick={handleSignIn}
  disabled={isLoading}
  className="w-full bg-[#106F48] hover:bg-[#0e5a3c] text-white p-3 rounded font-medium transition-colors disabled:opacity-50"
>
  {isLoading ? 'Signing in...' : 'Sign in'}
</button>
```

## 8. Security Considerations

### Token Storage
```javascript
// For development - localStorage is fine
localStorage.setItem('authToken', token);

// For production - consider httpOnly cookies
// Set-Cookie: authToken=jwt_token; HttpOnly; Secure; SameSite=Strict
```

### Token Usage
```javascript
// Include token in API requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};
```

### Token Refresh (if implemented)
```javascript
const refreshToken = async () => {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include' // for httpOnly cookies
    });
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('authToken', token);
      return token;
    }
  } catch (err) {
    // Redirect to login
    window.location.href = '/login';
  }
};
```

## 9. Testing Checklist

- [ ] **CSS Styling**: Input text is visible and readable when typing
- [ ] **Sign Up Flow**: Email → Password → Confirm Password → Submit
- [ ] **Email Confirmation**: Receive code → Enter code → Confirm
- [ ] **Sign In Flow**: Email → Password → Submit
- [ ] **Forgot Password**: Email → Reset code → New password
- [ ] **Error Handling**: Network errors, invalid credentials, expired codes
- [ ] **Loading States**: All buttons show loading state during API calls
- [ ] **Form Validation**: Client-side validation before API calls
- [ ] **Token Storage**: Tokens are stored and used correctly
- [ ] **Responsive Design**: Works on mobile and desktop

## 10. Common Issues and Solutions

### Issue: Input text is barely visible
**Solution**: Check global CSS for input color overrides. Add specific selectors for your input backgrounds.

### Issue: Confirmation code not working
**Solution**: Ensure code is exactly 6 digits and numeric. Check email for the latest code.

### Issue: "User already exists" on sign up
**Solution**: Direct user to sign in instead, or implement "forgot password" flow.

### Issue: Token expires quickly
**Solution**: Implement token refresh logic or increase token expiry time.

### Issue: CORS errors
**Solution**: Ensure API server has proper CORS headers for your domain.

---

## Quick Start Template

```jsx
import React, { useState } from 'react';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Add your implementation here using the patterns above

  return (
    <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
      {/* Your modal content */}
    </div>
  );
};

export default AuthModal;
```

Remember: Start with the CSS styling - it'll save you hours of debugging! 🎨
