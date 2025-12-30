# How to Connect Supabase to Google OAuth

## Step-by-Step Guide

### Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project (or create a new one)

2. **Enable Google+ API** (if not already enabled)
   - Go to **APIs & Services → Library**
   - Search for "Google+ API" or "Google Identity"
   - Click **Enable**

3. **Create OAuth 2.0 Credentials**
   - Go to **APIs & Services → Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - If prompted, configure OAuth consent screen first:
     - **User Type**: External (or Internal if using Google Workspace)
     - **App name**: Your app name (e.g., "ZynDrx")
     - **User support email**: Your email
     - **Developer contact**: Your email
     - Click **Save and Continue**
     - Add scopes: `email`, `profile`, `openid`
     - Add test users (if in testing mode)
     - Click **Save and Continue**

4. **Create OAuth Client ID**
   - **Application type**: Web application
   - **Name**: "Supabase OAuth" (or any name)
   - **Authorized JavaScript origins**:
     ```
     https://your-project-id.supabase.co
     ```
   - **Authorized redirect URIs**:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Click **Create**
   - **Copy the Client ID and Client Secret** (you'll need these)

### Step 2: Configure Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com/
   - Select your project

2. **Navigate to Authentication → Providers**
   - In the left sidebar, click **Authentication**
   - Click **Providers** tab
   - Find **Google** in the list

3. **Enable and Configure Google Provider**
   - Toggle **Google** to **Enabled**
   - Enter your **Client ID** (from Google Cloud Console)
   - Enter your **Client Secret** (from Google Cloud Console)
   - Click **Save**

### Step 3: Configure Supabase Redirect URLs

1. **Go to Authentication → URL Configuration**
   - Still in Authentication section
   - Click **URL Configuration** tab

2. **Set Site URL**
   - **Site URL**: Your frontend URL
     - Production: `https://your-app.vercel.app`
     - Development: `http://localhost:3000`

3. **Add Redirect URLs**
   - Click **Add URL** and add:
     - `https://your-app.vercel.app/auth/callback` (production)
     - `http://localhost:3000/auth/callback` (development)
   - Click **Save**

### Step 4: Verify Your Frontend Environment Variables

Make sure your `.env` file has:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
REACT_APP_API_URL=https://your-backend-url.com/api/v1
```

**To find your Supabase credentials:**
- Go to Supabase Dashboard → **Settings** → **API**
- Copy **Project URL** → This is your `REACT_APP_SUPABASE_URL`
- Copy **anon public** key → This is your `REACT_APP_SUPABASE_ANON_KEY`

### Step 5: Test the Connection

1. **Start your React app**
   ```bash
   npm start
   ```

2. **Navigate to login page**
   - Go to `http://localhost:3000/login`

3. **Click "Login with Google"**
   - Should redirect to Google OAuth consent screen
   - After authorizing, should redirect back to your app

## Important Notes

### Redirect URI Must Match Exactly

The redirect URI in **three places** must match:

1. **Google Cloud Console** → OAuth Client → Authorized redirect URIs:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```

2. **Supabase Dashboard** → Authentication → URL Configuration → Redirect URLs:
   ```
   https://your-app.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

3. **Your Frontend Code** (already configured):
   ```javascript
   redirectTo: `${window.location.origin}/auth/callback`
   ```

### The Flow

```
User clicks "Login with Google"
    ↓
Frontend calls: supabase.auth.signInWithOAuth({ provider: 'google' })
    ↓
Supabase redirects to: https://accounts.google.com/oauth/authorize
    ↓
User authorizes on Google
    ↓
Google redirects to: https://your-project-id.supabase.co/auth/v1/callback
    ↓
Supabase processes callback and creates session
    ↓
Supabase redirects to: https://your-app.vercel.app/auth/callback
    ↓
Your OAuthCallback component gets the session
    ↓
Frontend exchanges Supabase token with your backend
```

## Troubleshooting

### Issue: "redirect_uri_mismatch" error

**Solution:**
- Check Google Cloud Console → Authorized redirect URIs
- Must include: `https://your-project-id.supabase.co/auth/v1/callback`
- No trailing slashes
- Must be exact match

### Issue: "Invalid client" error

**Solution:**
- Verify Client ID and Client Secret in Supabase Dashboard
- Make sure they're copied correctly (no extra spaces)
- Check that OAuth consent screen is configured

### Issue: "Access blocked" error

**Solution:**
- If app is in testing mode, add user email to test users
- Or publish the OAuth consent screen

### Issue: Session not found after redirect

**Solution:**
- Check Supabase URL Configuration → Redirect URLs
- Must include your frontend callback URL
- Verify Site URL is set correctly

## Quick Checklist

- [ ] Google Cloud Console: OAuth 2.0 Client ID created
- [ ] Google Cloud Console: Redirect URI added: `https://your-project-id.supabase.co/auth/v1/callback`
- [ ] Supabase Dashboard: Google provider enabled
- [ ] Supabase Dashboard: Client ID and Secret entered
- [ ] Supabase Dashboard: Site URL set to your frontend URL
- [ ] Supabase Dashboard: Redirect URLs include `/auth/callback`
- [ ] Frontend `.env`: `REACT_APP_SUPABASE_URL` set
- [ ] Frontend `.env`: `REACT_APP_SUPABASE_ANON_KEY` set

## Visual Guide Locations

### Google Cloud Console
```
APIs & Services
  → Credentials
    → OAuth 2.0 Client IDs
      → Create / Edit
        → Authorized redirect URIs
```

### Supabase Dashboard
```
Project Settings
  → Authentication
    → Providers
      → Google (toggle on, enter credentials)
    → URL Configuration
      → Site URL
      → Redirect URLs
```

Once these are configured, your Google OAuth should work!

