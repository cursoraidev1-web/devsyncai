# Frontend Environment Variables Setup

## Create `.env` File

Create a `.env` file in the root of your project (`c:\server\zyndrx2\.env`) with the following content:

```env
# Frontend Environment Variables
# React requires REACT_APP_ prefix for environment variables

# Supabase Configuration
REACT_APP_SUPABASE_URL=https://rlzdtlfabtqicofrrxnc.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsemR0bGZhYnRxaWNvZnJyeG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NDE5ODMsImV4cCI6MjA4MjExNzk4M30.KZmRsHh3s-WbfksAiLPGMvLeeIyk7Gliw0_C9F6mCiU

# Backend API Configuration
# In development, this can be omitted to use the proxy in package.json
# In production, set this to your backend URL
REACT_APP_API_URL=https://zyndrx-backend-blgx.onrender.com/api/v1
```

## Important Notes

### 1. React Environment Variable Naming
- All frontend environment variables **must** start with `REACT_APP_`
- This is a React requirement for security reasons
- Variables without this prefix won't be accessible in the browser

### 2. Development vs Production

**Development:**
- `REACT_APP_API_URL` is optional
- If not set, the app uses the proxy in `package.json` (`https://zyndrx-backend-blgx.onrender.com`)
- API calls will go through: `http://localhost:3000/api/v1` → proxy → backend

**Production:**
- `REACT_APP_API_URL` should be set to your production backend URL
- Example: `REACT_APP_API_URL=https://zyndrx-backend-blgx.onrender.com/api/v1`

### 3. After Creating `.env` File

1. **Restart your development server**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm start
   ```

2. **Verify variables are loaded**
   - Open browser console
   - Type: `process.env.REACT_APP_SUPABASE_URL`
   - Should show your Supabase URL

### 4. Security Warning

⚠️ **Never commit `.env` to git!**

The `.env` file is already in `.gitignore`, but double-check:
- `.env` should be listed in `.gitignore`
- Never push `.env` to GitHub or any public repository
- The `.env.example` file is safe to commit (it has no real secrets)

## Environment Variables Explained

| Variable | Purpose | Where to Get It |
|----------|---------|----------------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Supabase Dashboard → Settings → API → anon public key |
| `REACT_APP_API_URL` | Your backend API URL | Your backend deployment URL + `/api/v1` |

## Quick Setup Commands

### Windows (PowerShell)
```powershell
# Create .env file
@"
# Frontend Environment Variables
REACT_APP_SUPABASE_URL=https://rlzdtlfabtqicofrrxnc.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsemR0bGZhYnRxaWNvZnJyeG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NDE5ODMsImV4cCI6MjA4MjExNzk4M30.KZmRsHh3s-WbfksAiLPGMvLeeIyk7Gliw0_C9F6mCiU
REACT_APP_API_URL=https://zyndrx-backend-blgx.onrender.com/api/v1
"@ | Out-File -FilePath .env -Encoding utf8
```

### Linux/Mac
```bash
cat > .env << 'EOF'
# Frontend Environment Variables
REACT_APP_SUPABASE_URL=https://rlzdtlfabtqicofrrxnc.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsemR0bGZhYnRxaWNvZnJyeG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NDE5ODMsImV4cCI6MjA4MjExNzk4M30.KZmRsHh3s-WbfksAiLPGMvLeeIyk7Gliw0_C9F6mCiU
REACT_APP_API_URL=https://zyndrx-backend-blgx.onrender.com/api/v1
EOF
```

## Verification

After creating the `.env` file and restarting your server:

1. **Check in browser console:**
   ```javascript
   console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
   console.log('Supabase Key:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set ✓' : 'Missing ✗');
   console.log('API URL:', process.env.REACT_APP_API_URL);
   ```

2. **Test Google OAuth:**
   - Go to `/login`
   - Click "Login with Google"
   - Should redirect to Google (if Supabase is configured)

## Troubleshooting

### Variables not loading?
- ✅ Restart the dev server after creating `.env`
- ✅ Check variable names start with `REACT_APP_`
- ✅ No spaces around `=` sign
- ✅ No quotes needed around values

### Still not working?
- Check `.env` file is in project root (same level as `package.json`)
- Check file encoding is UTF-8
- Check for typos in variable names

