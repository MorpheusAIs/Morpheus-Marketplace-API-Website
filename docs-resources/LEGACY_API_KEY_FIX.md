# Legacy API Key Verification Fix

## Problem
Users with legacy API keys (only prefix stored in `localStorage`, no full key in `sessionStorage`) experienced a bug where:
1. Clicking "Select" on their API key in the Admin page
2. The verification modal would flash open and immediately close
3. They couldn't enter their full API key to verify it

## Root Cause
The issue was in `/src/app/admin/page.tsx`:

1. **Feedback Loop**: The `useEffect` at line 53 had `selectedApiKeyPrefix` in its dependency array (line 108). When a user clicked "Select":
   - `checkAutomationSettings()` would set `selectedApiKeyPrefix` state
   - This triggered the `useEffect` to run again
   - The re-render would interfere with the modal state, causing it to close

2. **Missing Legacy Handling**: The effect didn't properly handle the case where a user had:
   - `localStorage.selected_api_key_prefix` = "mor_xyz..." (stored)
   - `sessionStorage.verified_api_key` = null (not verified)

## Solution

### Change 1: Remove Dependency Loop
```typescript
// Before:
}, [isAuthenticated, authLoading, router, defaultApiKey, selectedApiKeyPrefix]);

// After:
}, [isAuthenticated, authLoading, router, defaultApiKey]);
```

Removing `selectedApiKeyPrefix` from the dependency array prevents the effect from re-running when the user manually selects a key.

### Change 2: Add Legacy Key Handling
```typescript
} else if (storedPrefix && !storedFullKey) {
  // LEGACY CASE: User has a stored prefix but no full key (needs verification)
  // Restore the prefix selection so they can verify it
  setSelectedApiKeyPrefix(storedPrefix);
  console.log('Legacy API key prefix restored - user needs to verify:', storedPrefix);
  // Don't auto-open modal here - let them click Select when ready
  return;
}
```

This ensures that when a legacy user loads the page:
1. Their previously selected prefix is restored
2. The "Selected" button shows their key as already selected
3. They can click "Select" to open the verification modal
4. The modal stays open without interference

## Test Scenarios

### Scenario 1: Legacy User with Stored Prefix
**Setup:**
- `localStorage.selected_api_key_prefix = "mor_abc123"`
- `sessionStorage.verified_api_key = null`

**Expected Behavior:**
1. Admin page loads
2. Key "mor_abc123..." shows as "Selected"
3. User clicks "Select" button
4. Verification modal opens and stays open
5. User enters full key and submits
6. Key is verified and stored in sessionStorage

### Scenario 2: Returning User with Verified Key
**Setup:**
- `localStorage.selected_api_key_prefix = "mor_abc123"`
- `sessionStorage.verified_api_key = "mor_abc123_full_key_here"`
- `sessionStorage.verified_api_key_timestamp = <recent timestamp>`

**Expected Behavior:**
1. Admin page loads
2. Key is automatically restored
3. Automation settings are fetched
4. User can immediately use Chat/Test features

### Scenario 3: New User with Default Key
**Setup:**
- No localStorage data
- `defaultApiKey` exists from API

**Expected Behavior:**
1. Admin page loads
2. Default key is auto-selected
3. Friendly message shown: "Your default API key (KeyName) is ready..."
4. User clicks "Select" to verify

## Files Changed
- `/src/app/admin/page.tsx`
  - Line 108: Removed `selectedApiKeyPrefix` from useEffect dependency array
  - Lines 84-90: Added legacy key handling in useEffect

## Testing Checklist
- [x] Remove dependency loop to prevent modal closing
- [x] Add legacy key prefix restoration
- [x] Ensure no linter errors
- [ ] Manual test: Simulate legacy user by setting localStorage only
- [ ] Manual test: Verify modal stays open when clicking Select
- [ ] Manual test: Verify full key submission works correctly
