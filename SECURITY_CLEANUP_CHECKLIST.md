# Security Cleanup Checklist - OpenBeta Docs

## ⚠️ CRITICAL ITEMS TO FIX BEFORE GITHUB MIGRATION

### 1. Exposed API Keys (CRITICAL PRIORITY)
- [ ] Remove/obfuscate API key from `docs-resources/Launchplan.md` line 97, 123, 143
- [ ] Remove/obfuscate API key from `Launchplan.md` line 97, 123, 143
- [ ] Replace with placeholder: `sk-example-your-api-key-here`

### 2. Domain-Specific URLs (MEDIUM PRIORITY)
**81 references to `api.dev.mor.org` need to be made configurable:**

Files with hardcoded URLs:
- `src/lib/api/config.ts`
- `src/app/chat/page.tsx`
- `src/lib/auth/AuthContext.tsx`
- Multiple documentation pages in `src/app/docs/`
- All files in `docs-resources/`

### 3. Environment Variables Setup
- [x] Created `env.example` template
- [ ] Update code to use `NEXT_PUBLIC_API_BASE_URL` consistently
- [ ] Add .env.local to .gitignore (create .gitignore if needed)

### 4. Cognito Configuration
- [ ] Replace hardcoded domain `auth.mor.org` with environment variable
- [ ] Make Cognito configuration fully environment-driven

## Recommended Approach:
1. **Immediate**: Remove/obfuscate the exposed API keys
2. **Before Migration**: Replace all hardcoded URLs with environment variables
3. **Post-Migration**: Set up environment-specific deployments

## Files Requiring Updates:
1. `docs-resources/Launchplan.md` - CRITICAL (API keys)
2. `Launchplan.md` - CRITICAL (API keys) 
3. `src/lib/api/config.ts`
4. `src/app/chat/page.tsx`
5. `src/lib/auth/cognito-auth.ts`
6. All documentation pages with hardcoded URLs
7. Create `.gitignore` file

## Environment Variables for Production:
- NEXT_PUBLIC_API_BASE_URL
- NEXT_PUBLIC_COGNITO_DOMAIN  
- NEXT_PUBLIC_COGNITO_REGION
- NEXT_PUBLIC_COGNITO_USER_POOL_ID
- NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID
