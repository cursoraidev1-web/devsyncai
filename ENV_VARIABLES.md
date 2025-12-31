# Environment Variables Setup

## Overview
Next.js uses a different naming convention than Create React App for environment variables. All client-side variables must be prefixed with `NEXT_PUBLIC_`.

## Local Development

### .env.local (Already Created ✅)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://zyndrx-backend-blgx.onrender.com/api/v1

# OAuth Configuration
NEXT_PUBLIC_GITHUB_CLIENT_ID=Ov23liW3GoZJrTgmcPKw
NEXT_PUBLIC_GOOGLE_CLIENT_ID=460639053200-f00ni0do9rcd5ik1hcnhn26bfp2949fc.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=Ov23liNGGGXWhHeSWlEt

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rlzdtlfabtqicofrrxnc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsemR0bGZhYnRxaWNvZnJyeG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NDE5ODMsImV4cCI6MjA4MjExNzk4M30.KZmRsHh3s-WbfksAiLPGMvLeeIyk7Gliw0_C9F6mCiU
```

## Vercel Deployment

### Setting Environment Variables in Vercel

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add each variable:**

| Variable Name | Value | Environments |
|---------------|-------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://zyndrx-backend-blgx.onrender.com/api/v1` | Production, Preview, Development |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | `Ov23liW3GoZJrTgmcPKw` | Production, Preview, Development |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `460639053200-f00ni0do9rcd5ik1hcnhn26bfp2949fc.apps.googleusercontent.com` | Production, Preview, Development |
| `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET` | `Ov23liNGGGXWhHeSWlEt` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rlzdtlfabtqicofrrxnc.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsemR0bGZhYnRxaWNvZnJyeG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NDE5ODMsImV4cCI6MjA4MjExNzk4M30.KZmRsHh3s-WbfksAiLPGMvLeeIyk7Gliw0_C9F6mCiU` | Production, Preview, Development |

### Using Vercel CLI

You can also add environment variables using the Vercel CLI:

```bash
# Add a single variable
vercel env add NEXT_PUBLIC_API_URL

# Pull environment variables from Vercel to local
vercel env pull .env.local
```

## Changes Made from CRA to Next.js

### Before (Create React App)
```bash
REACT_APP_API_URL=...
REACT_APP_GITHUB_CLIENT_ID=...
REACT_APP_GOOGLE_CLIENT_ID=...
REACT_APP_SUPABASE_URL=...
REACT_APP_SUPABASE_ANON_KEY=...
```

### After (Next.js)
```bash
NEXT_PUBLIC_API_URL=...
NEXT_PUBLIC_GITHUB_CLIENT_ID=...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Files Updated

The following files were updated to use the new environment variable names:

1. **`utils/supabase.js`**
   - `REACT_APP_SUPABASE_URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **`utils/supabaseAuth.js`**
   - `REACT_APP_SUPABASE_URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **`api/client.js`**
   - `REACT_APP_API_URL` → `NEXT_PUBLIC_API_URL`

## How Next.js Handles Environment Variables

### Client-Side Variables (NEXT_PUBLIC_)
- Variables prefixed with `NEXT_PUBLIC_` are embedded into the browser bundle
- Accessible in both client and server components
- Available as `process.env.NEXT_PUBLIC_*`

### Server-Side Variables (No Prefix)
- Variables without `NEXT_PUBLIC_` are only available on the server
- Not exposed to the browser
- Used for secrets, API keys, database URLs, etc.

## Testing

To verify environment variables are working:

```bash
# Build the app
npm run build

# Start production server
npm start

# Check browser console - should show API calls to your backend
# Check Supabase connection - should allow OAuth login
```

## Troubleshooting

### Variables Not Loading?

1. **Restart dev server after adding/changing .env.local**
   ```bash
   # Stop dev server (Ctrl+C)
   npm run dev
   ```

2. **Check variable names are correct**
   - Must start with `NEXT_PUBLIC_` for client-side
   - No spaces around the `=` sign
   - Values can be in quotes or without

3. **Check .env.local is in .gitignore**
   ```bash
   # Should be ignored (don't commit secrets!)
   cat .gitignore | grep env
   ```

4. **Verify in code**
   ```javascript
   console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
   console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
   ```

### Vercel Deployment Not Working?

1. **Check all variables are set in Vercel dashboard**
2. **Ensure variables are set for the correct environments** (Production, Preview, Development)
3. **Redeploy after adding variables**
   ```bash
   vercel --prod
   ```

## Security Notes

⚠️ **Important:**
- `NEXT_PUBLIC_` variables are exposed to the browser
- Never put sensitive secrets in `NEXT_PUBLIC_` variables
- The SUPABASE_ANON_KEY is safe to expose (it's designed for client-side use)
- OAuth client secrets should typically be server-side, but Supabase handles OAuth flow

## Git Configuration

The `.env.local` file should be in your `.gitignore`:

```bash
# Environment files
.env
.env*.local
```

✅ **Status:** Environment variables are properly configured and working!

## Quick Reference

| Purpose | Variable | Exposed to Browser? |
|---------|----------|---------------------|
| Backend API | `NEXT_PUBLIC_API_URL` | ✅ Yes |
| GitHub OAuth | `NEXT_PUBLIC_GITHUB_CLIENT_ID` | ✅ Yes |
| Google OAuth | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ✅ Yes |
| Google OAuth Secret | `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET` | ⚠️ Should be server-side |
| Supabase URL | `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes |
| Supabase Anon Key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes (safe) |

## Next Steps

1. ✅ Environment variables configured locally
2. ✅ Code updated to use `NEXT_PUBLIC_` prefix
3. ✅ Safe localStorage wrapper added
4. ✅ Edge Runtime configured
5. 🚀 Ready to deploy to Vercel!

Add environment variables to Vercel dashboard, then deploy:
```bash
vercel --prod
```
