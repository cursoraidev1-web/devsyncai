# Vercel Deployment Guide - Function Limit Solution

## Problem
Vercel Hobby (free) plan has a limit of **12 Serverless Functions** per deployment, but the app has **34 routes**, causing deployment to fail.

## Solutions

### Option 1: Use Edge Runtime (Recommended for Hobby Plan)
Add `export const runtime = 'edge'` to pages to use Edge Functions instead of Serverless Functions. Edge Functions don't count toward the 12-function limit.

**How to implement:**
Add this to the top of each `page.jsx` file (after 'use client'):

```jsx
'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

export default function MyPage() {
  // ... your component code
}
```

**Limitations of Edge Runtime:**
- No Node.js APIs (fs, child_process, etc.)
- Smaller bundle size limit (1-4MB)
- No npm packages that rely on Node.js APIs
- Since your app is client-side heavy with `'use client'`, this should work fine

### Option 2: Upgrade to Vercel Pro Plan
**Cost:** $20/month per user
**Benefit:** No function limit (unlimited serverless functions)

Visit: https://vercel.com/pricing

### Option 3: Deploy to Alternative Platform

#### 3a. Deploy to Netlify
- Free tier: More generous limits
- Supports Next.js
- No 12-function limit

#### 3b. Deploy to Railway
- $5/month for more resources
- No function limits
- Simple deployment

#### 3c. Deploy to Your Own Server (Self-Host)
Use `output: 'standalone'` in `next.config.js`:

```js
const nextConfig = {
  output: 'standalone',
  // ... rest of config
}
```

Then deploy to:
- DigitalOcean App Platform
- AWS EC2
- Google Cloud Run
- Your own VPS

### Option 4: Consolidate Routes (Partial Solution)
Group related routes to reduce function count. This is complex and may not get you under 12 functions.

## Current Configuration

The app is configured with:
- ✅ Root layout set to `dynamic = 'force-dynamic'` and `runtime = 'nodejs'`
- ✅ Clean next.config.js without conflicting settings

## Recommended Approach

### For Free Deployment (Hobby Plan):

**Step 1:** Add Edge Runtime to all pages
Create a script to add `export const runtime = 'edge'` to all page files:

```bash
# Add to each page.jsx after 'use client';
find app -name "page.jsx" -type f -exec sed -i "/'use client';/a\\\n// Use Edge Runtime to avoid Vercel function limits\nexport const runtime = 'edge';" {} \;
```

**Step 2:** Test locally
```bash
npm run build
npm start
```

**Step 3:** Deploy to Vercel
```bash
vercel deploy --prod
```

### For Production (Paid):

Either:
1. **Upgrade to Pro** ($20/month) - Simplest, no code changes
2. **Use Railway/Netlify** - More generous free tiers
3. **Self-host with standalone** - Full control, requires server management

## Testing Edge Runtime Compatibility

Since your app uses:
- ✅ React client components (`'use client'`)
- ✅ Client-side API calls (Supabase, axios)
- ✅ Browser APIs only
- ❌ No server-side Node.js APIs

**Your app should work perfectly with Edge Runtime!**

## Important Notes

1. **Context Providers:** All your contexts (Auth, Company, Plan, App) are client-side, so they work with Edge Runtime

2. **API Calls:** Your API calls to Supabase and backend are client-side, so they work with Edge Runtime

3. **Middleware:** The `middleware.js` file automatically uses Edge Runtime (it's required)

4. **Static Assets:** Images, CSS, and other assets work the same way

## Quick Fix Script

Run this to add Edge Runtime to all pages:

```bash
#!/bin/bash
echo "Adding Edge Runtime to all pages..."

find app -name "page.jsx" -type f | while read file; do
  # Check if already has runtime export
  if ! grep -q "export const runtime" "$file"; then
    # Add after 'use client';
    sed -i "/'use client';/a\\\n// Use Edge Runtime to avoid Vercel function limits\nexport const runtime = 'edge';" "$file"
    echo "Updated: $file"
  fi
done

echo "Done! All pages now use Edge Runtime."
```

Save as `add-edge-runtime.sh`, make executable, and run:
```bash
chmod +x add-edge-runtime.sh
./add-edge-runtime.sh
npm run build
vercel deploy --prod
```

## Alternative: Vercel Configuration

If you want Vercel to handle it automatically, create `vercel.json`:

```json
{
  "version": 2,
  "regions": ["iad1"],
  "functions": {
    "app/**/*.jsx": {
      "runtime": "@vercel/node@3.0.7",
      "maxDuration": 10
    }
  }
}
```

But this still won't solve the function count limit on Hobby plan.

## Summary

**Best Solution for Your App:**
Add `export const runtime = 'edge'` to all pages. Your app is client-side heavy and doesn't use Node.js APIs, so it will work perfectly with Edge Runtime while bypassing the 12-function limit.

**After deploying with Edge Runtime, you'll have:**
- ✅ Unlimited routes (no function count limit)
- ✅ Faster cold starts
- ✅ Global edge distribution
- ✅ Same functionality
- ✅ Free deployment on Vercel Hobby plan
