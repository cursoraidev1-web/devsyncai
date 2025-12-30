# Google OAuth Implementation Checklist

## Current Implementation Status

✅ **Frontend Code**: Fully implemented and updated to match the OAuth guide
✅ **OAuth Flow**: Complete with proper session handling
✅ **Error Handling**: Comprehensive error handling in place
✅ **Route Configuration**: `/auth/callback` route is properly configured

## What Needs to Be Verified

### 1. Environment Variables

Ensure these are set in your `.env` file:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
REACT_APP_API_URL=https://your-backend-url.com/api/v1
```

**Check:**
- [ ] `REACT_APP_SUPABASE_URL` is set and correct
- [ ] `REACT_APP_SUPABASE_ANON_KEY` is set and correct
- [ ] `REACT_APP_API_URL` points to your backend

### 2. Supabase Configuration

**In Supabase Dashboard:**

1. **Authentication → Providers → Google**
   - [ ] Google provider is enabled
   - [ ] Client ID is configured
   - [ ] Client Secret is configured
   - [ ] Authorized redirect URLs include:
     - `https://your-project.supabase.co/auth/v1/callback`
     - Your frontend URL (if using custom domain)

2. **Authentication → URL Configuration**
   - [ ] Site URL is set to your frontend URL (e.g., `https://your-app.vercel.app`)
   - [ ] Redirect URLs include:
     - `https://your-app.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback` (for development)

### 3. Google Cloud Console Configuration

**In Google Cloud Console:**

1. **APIs & Services → Credentials**
   - [ ] OAuth 2.0 Client ID is created
   - [ ] Authorized JavaScript origins include:
     - `https://your-project.supabase.co`
   - [ ] Authorized redirect URIs include:
     - `https://your-project.supabase.co/auth/v1/callback`

2. **OAuth Consent Screen**
   - [ ] OAuth consent screen is configured
   - [ ] Test users are added (if in testing mode)

### 4. Backend Endpoint

**Verify your backend implements:**

- [ ] `POST /api/v1/auth/oauth/session` endpoint exists
- [ ] Endpoint accepts:
  ```json
  {
    "accessToken": "supabase_access_token",
    "companyName": "optional_company_name"
  }
  ```
- [ ] Endpoint returns:
  ```json
  {
    "success": true,
    "data": {
      "user": {...},
      "token": "jwt_token",
      "companyId": "...",
      "companies": [...],
      "currentCompany": {...}
    }
  }
  ```
- [ ] Or for 2FA:
  ```json
  {
    "success": true,
    "data": {
      "require2fa": true,
      "email": "user@example.com"
    }
  }
  ```

### 5. Testing the Flow

**Step-by-step test:**

1. [ ] Navigate to `/login` page
2. [ ] Click "Continue with Google" button
3. [ ] Should redirect to Google OAuth consent screen
4. [ ] After authorizing, should redirect to `/auth/callback`
5. [ ] Callback should show "Completing authentication..."
6. [ ] Should redirect to `/dashboard` on success
7. [ ] User should be logged in and see dashboard

### 6. Common Issues & Solutions

#### Issue: "Failed to initiate Google login"
**Solution:**
- Check Supabase credentials in `.env`
- Verify Google provider is enabled in Supabase
- Check browser console for specific error

#### Issue: "No session found"
**Solution:**
- Verify redirect URL in Supabase matches exactly
- Check that `detectSessionInUrl: true` is set in Supabase client config
- Ensure URL hash fragments are not being stripped (check if using hash router vs browser router)

#### Issue: "Invalid Supabase session: missing access_token"
**Solution:**
- Verify Supabase session is valid
- Check that session object has `access_token` property
- Ensure Supabase client is properly initialized

#### Issue: "OAuth session exchange failed"
**Solution:**
- Verify backend endpoint `/auth/oauth/session` exists
- Check backend logs for errors
- Verify backend has correct Supabase service role key
- Check CORS configuration on backend

#### Issue: Redirect URI mismatch
**Solution:**
- In Supabase: Authentication → URL Configuration → Redirect URLs
- Add: `https://your-frontend-url.com/auth/callback`
- In Google Cloud Console: Add `https://your-project.supabase.co/auth/v1/callback`

## Code Flow Verification

The current implementation follows this flow:

1. **User clicks "Login with Google"**
   - `signInWithGoogle()` is called
   - Company name stored in sessionStorage (if provided)
   - Supabase redirects to Google OAuth

2. **User authenticates with Google**
   - Google redirects back to Supabase
   - Supabase processes the callback
   - Supabase redirects to `/auth/callback` with hash fragments

3. **OAuthCallback component**
   - Gets Supabase session from hash fragments
   - Retrieves companyName from sessionStorage
   - Calls `syncSupabaseSession(session, companyName)`

4. **Backend exchange**
   - Frontend sends `accessToken` to `/auth/oauth/session`
   - Backend verifies token with Supabase
   - Backend creates/updates user
   - Backend returns JWT token + user data

5. **Frontend stores data**
   - JWT token stored in localStorage
   - User data stored
   - Companies data stored (if provided)
   - Redirects to dashboard

## Debugging Tips

1. **Check browser console** for errors
2. **Check network tab** to see API calls
3. **Check Supabase Dashboard → Authentication → Users** to see if user was created
4. **Check backend logs** for session exchange errors
5. **Verify environment variables** are loaded (check in browser console: `process.env.REACT_APP_SUPABASE_URL`)

## Quick Test Command

To verify environment variables are set:

```javascript
// In browser console on your app
console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('Supabase Key:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
console.log('API URL:', process.env.REACT_APP_API_URL);
```

## Next Steps if Not Working

1. **Verify all checkboxes above are checked**
2. **Test with a simple Supabase OAuth flow** (without backend) to isolate issues
3. **Check backend logs** when calling `/auth/oauth/session`
4. **Verify Supabase session is valid** by checking the session object in callback
5. **Test with GitHub OAuth** to see if issue is Google-specific or OAuth-general

## Implementation Files

- ✅ `src/utils/oauth.js` - OAuth initiation functions
- ✅ `src/utils/supabaseAuth.js` - Supabase client initialization
- ✅ `src/pages/auth/OAuthCallback.js` - Callback handler
- ✅ `src/api/auth.js` - API endpoint for session exchange
- ✅ `src/context/AuthContext.js` - Session syncing logic
- ✅ `src/App.js` - Route configuration

All files are properly implemented and should work once the configuration steps above are completed.

