# CORS Error Fix

## Problem
The backend is blocking requests from `http://localhost:3000` due to CORS (Cross-Origin Resource Sharing) policy.

## Frontend Fix (Development) ✅

I've added a **proxy** to `package.json` that will:
- Route all API requests through the React dev server
- Avoid CORS issues during development
- Automatically proxy `/api/*` requests to the backend

**To use the proxy:**
1. Restart your dev server: `npm start`
2. The proxy will automatically handle CORS for you

## Backend Fix Required ⚠️

The backend **MUST** be configured to allow CORS from your frontend origin. Here's what needs to be done:

### Option 1: Allow All Origins (Development Only)
```python
# In your FastAPI backend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (NOT for production!)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Option 2: Allow Specific Origins (Recommended)
```python
# In your FastAPI backend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development
        "http://localhost:3001",   # Alternative dev port
        "https://your-production-domain.com",  # Production
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

### Option 3: Environment-Based CORS (Best Practice)
```python
import os
from fastapi.middleware.cors import CORSMiddleware

# Get allowed origins from environment
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

## Testing

1. **With Proxy (Development)**: 
   - Restart dev server: `npm start`
   - Try registration again
   - Should work without CORS errors

2. **Without Proxy (Production)**:
   - Backend must have CORS configured
   - Set `REACT_APP_API_URL` in `.env` file
   - Build: `npm run build`
   - Deploy

## Current Backend URL
```
https://zyndrx-backend-blgx.onrender.com
```

## What the Proxy Does

When you make a request to `/api/v1/auth/register`:
- **Without proxy**: `http://localhost:3000` → `https://zyndrx-backend-blgx.onrender.com/api/v1/auth/register` ❌ CORS error
- **With proxy**: `http://localhost:3000/api/v1/auth/register` → React dev server → `https://zyndrx-backend-blgx.onrender.com/api/v1/auth/register` ✅ No CORS error

## Important Notes

1. **Proxy only works in development** (`npm start`)
2. **Production builds** need backend CORS configured
3. **Backend must allow** `http://localhost:3000` in CORS origins
4. **Preflight requests** (OPTIONS) must be handled by backend

## Quick Fix for Now

The proxy I added should fix the issue immediately. Just restart your dev server:

```bash
npm start
```

Then try registering again. The CORS error should be gone!

