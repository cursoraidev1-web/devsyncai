# OAuth Implementation Update

## Summary

The OAuth implementation has been updated to match the official OAuth Frontend Implementation Guide. The main changes include:

1. **API Endpoint Update**: Changed from `/auth/supabase` to `/auth/oauth/session`
2. **Payload Format**: Updated to use `accessToken` (camelCase) instead of `access_token`
3. **Company Name Support**: Added support for passing `companyName` during OAuth signup
4. **Response Handling**: Enhanced to handle companies and currentCompany data

## Changes Made

### 1. API Endpoint (`src/api/auth.js`)

**Before:**
```javascript
return api.post('/auth/supabase', { 
  access_token: session.access_token,
  provider: session.user?.app_metadata?.provider || 'unknown',
  user_metadata: session.user?.user_metadata || {},
}, { auth: false });
```

**After:**
```javascript
return api.post('/auth/oauth/session', {
  accessToken: session.access_token, // camelCase as per guide
  companyName: companyName, // Optional for new signups
}, { auth: false });
```

### 2. OAuth Functions (`src/utils/oauth.js`)

- Added `companyName` parameter support to `signInWithGoogle()` and `signInWithGitHub()`
- Company name is stored in `sessionStorage` before OAuth redirect
- Retrieved in callback and passed to session exchange

### 3. OAuth Callback (`src/pages/auth/OAuthCallback.js`)

- Retrieves `companyName` from `sessionStorage` if present
- Passes `companyName` to `syncSupabaseSession()`
- Cleans up `sessionStorage` after use

### 4. Auth Context (`src/context/AuthContext.js`)

- Updated `syncSupabaseSession()` to accept `companyName` parameter
- Enhanced response handling to store `companies` and `currentCompany` data
- Improved 2FA detection and handling

### 5. Register Page (`src/pages/auth/Register.js`)

- Passes `workspaceName` as `companyName` to OAuth functions when signing up

## API Request Format

### POST `/api/v1/auth/oauth/session`

**Request Body:**
```json
{
  "accessToken": "supabase_access_token_here",
  "companyName": "Optional company name for new signups"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "User Name",
      "role": "developer",
      "avatarUrl": "https://..."
    },
    "token": "jwt_token_here",
    "companyId": "uuid",
    "companies": [
      {
        "id": "uuid",
        "name": "Company Name",
        "role": "admin"
      }
    ],
    "currentCompany": {
      "id": "uuid",
      "name": "Company Name"
    }
  },
  "message": "OAuth login successful"
}
```

**Response (2FA Required):**
```json
{
  "success": true,
  "data": {
    "require2fa": true,
    "email": "user@example.com"
  },
  "message": "2FA verification required. Please enter your code."
}
```

## Flow Diagram

```
User clicks "Login with Google/GitHub"
    ↓
signInWithGoogle({ companyName }) or signInWithGitHub({ companyName })
    ↓
Store companyName in sessionStorage (if provided)
    ↓
Redirect to Supabase OAuth → Google/GitHub
    ↓
User authenticates with provider
    ↓
Redirect back to /auth/callback
    ↓
OAuthCallback component:
  - Get Supabase session
  - Retrieve companyName from sessionStorage
  - Call syncSupabaseSession(session, companyName)
    ↓
Backend /auth/oauth/session:
  - Verifies Supabase token
  - Creates/updates user
  - Returns JWT token + user data
    ↓
Frontend stores:
  - JWT token
  - User data
  - Companies data (if provided)
  - Current company (if provided)
    ↓
Redirect to dashboard
```

## Testing Checklist

- [ ] Google OAuth login works
- [ ] GitHub OAuth login works
- [ ] OAuth signup with company name works (Register page)
- [ ] OAuth signup without company name works (UserSignup page)
- [ ] 2FA flow works when required
- [ ] Companies data is stored correctly
- [ ] Current company is set correctly
- [ ] Error handling works for invalid tokens
- [ ] Error handling works for network failures

## Environment Variables

Ensure these are set in your `.env` file:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=https://your-backend-url.com/api/v1
```

## Backend Requirements

The backend must implement the `/auth/oauth/session` endpoint that:

1. Accepts `accessToken` (Supabase access token) and optional `companyName`
2. Verifies the Supabase token
3. Creates or updates the user in your database
4. Returns JWT token and user data
5. Handles 2FA requirement if enabled for the user

## Notes

- The implementation uses `sessionStorage` to pass `companyName` through the OAuth flow since Supabase OAuth doesn't natively support custom parameters
- The `companyName` is only used for new user signups (when creating a workspace)
- Existing users logging in don't need to provide `companyName`
- All OAuth flows now use the standardized `/auth/oauth/session` endpoint

