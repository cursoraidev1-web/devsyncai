# Login Debug Guide

## Issue
Login is successful (API returns user and token) but navigation to dashboard doesn't work.

## Added Debug Logs

### 1. AuthContext Login Function
```javascript
console.log('Login response:', response);
console.log('Extracted data:', data);
console.log('Persisting session:', { user: apiUser, hasToken: !!apiToken });
```

### 2. Login Page
```javascript
console.log('Attempting login...');
console.log('Login result:', result);
console.log('Login successful, navigating to dashboard...');
```

### 3. Dashboard Page
```javascript
console.log('Dashboard effect:', { loading, isAuthenticated, user });
console.log('Routing to dashboard:', { role: user?.role, route });
```

## How to Debug

### Step 1: Open Browser Console
1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Clear console
4. Keep it open

### Step 2: Try Login
1. Go to http://localhost:3000/login
2. Enter credentials:
   - Email: ogunjobiiyiola906@gmail.com
   - Password: (your password)
3. Click Login

### Step 3: Check Console Output

You should see logs in this order:

```
1. Attempting login...
2. Login response: { success: true, data: {...} }
3. Extracted data: { user: {...}, token: "..." }
4. Persisting session: { user: {...}, hasToken: true }
5. Session persisted, user and token set
6. Login result: { id: "...", email: "...", ... }
7. Login successful, navigating to dashboard...
8. Dashboard effect: { loading: false, isAuthenticated: true, user: {...} }
9. Routing to dashboard: { role: "admin", route: "/dashboard/pm" }
```

## Expected Behavior

After login:
1. ✅ API returns success with user and token
2. ✅ AuthContext stores user and token in state
3. ✅ AuthContext stores in localStorage
4. ✅ isAuthenticated becomes true
5. ✅ Navigate to /dashboard
6. ✅ Dashboard checks auth
7. ✅ Dashboard routes to role-based page (/dashboard/pm for admin)

## Common Issues

### Issue 1: isAuthenticated is false after login
**Check:**
- Is user set? `console.log(user)`
- Is token set? `console.log(token)`
- Both must be truthy for `isAuthenticated: !!user && !!token`

**Fix:** Make sure persistSession is called and sets both values

### Issue 2: Navigation doesn't happen
**Check:**
- Is router.push being called?
- Is there a console error?
- Check Network tab - is there a redirect loop?

**Fix:** Ensure no errors in console, check route exists

### Issue 3: Dashboard redirects back to login
**Check:**
- Is isAuthenticated true when dashboard loads?
- Check localStorage has zyndrx_user and zyndrx_token

**Fix:** Ensure localStorage is accessible (not in incognito with restrictions)

### Issue 4: Infinite redirect loop
**Check:**
- Does /dashboard route exist?
- Does /dashboard/pm route exist?
- Are there console errors about missing routes?

**Fix:** Verify all route files exist in app directory

## Manual Test Steps

### Test 1: Check localStorage
After login, in console:
```javascript
console.log('User:', localStorage.getItem('zyndrx_user'));
console.log('Token:', localStorage.getItem('zyndrx_token'));
```

Should show user JSON and token string.

### Test 2: Check Auth State
In console:
```javascript
// This won't work directly but you can see it in React DevTools
// Look for AuthContext.Provider value
```

### Test 3: Manual Navigation
After login fails, try manually navigating:
```javascript
window.location.href = '/dashboard';
```

If this works, the issue is with router.push()

### Test 4: Check Route Files
```bash
ls -la app/dashboard/page.jsx
ls -la app/dashboard/pm/page.jsx
```

Both should exist.

## Quick Fixes to Try

### Fix 1: Hard Reload
After login, if stuck, try:
```javascript
window.location.href = '/dashboard';
```

Instead of:
```javascript
router.push('/dashboard');
```

### Fix 2: Wait for State Update
Add delay before navigation:
```javascript
setTimeout(() => router.push('/dashboard'), 200);
```

### Fix 3: Use Replace Instead of Push
```javascript
router.replace('/dashboard'); // instead of router.push
```

### Fix 4: Check Edge Runtime Compatibility
Edge Runtime might handle navigation differently. Try temporarily:
```javascript
// Remove: export const runtime = 'edge';
```

## Current Status

✅ Added debug logs to:
- AuthContext.jsx (login function)
- app/login/page.jsx (handleSubmit)
- app/dashboard/page.jsx (useEffect)

✅ Added 100ms delay before navigation
✅ Added localStorage safeguards

## Next Steps

1. Run dev server: `npm run dev`
2. Open browser console
3. Try login
4. Share console output
5. We'll identify exactly where it's failing

## Success Indicators

When working correctly, you should see:
- ✅ "Login successful, navigating to dashboard..." in console
- ✅ URL changes to /dashboard
- ✅ URL quickly changes to /dashboard/pm (for admin)
- ✅ Dashboard content loads
- ✅ No errors in console
