# Zyndrx Platform - Next.js

## 🎉 Successfully Migrated to Next.js 15!

This project has been fully migrated from Create React App to Next.js 15 with the App Router.

## Quick Start

```bash
# Install dependencies (if needed)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit: http://localhost:3000

## Environment Setup

Create a `.env.local` file (already done ✅):

```bash
NEXT_PUBLIC_API_URL=https://zyndrx-backend-blgx.onrender.com/api/v1
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See `ENV_VARIABLES.md` for complete setup guide.

## Project Structure

```
/workspace
├── app/                      # Next.js App Router
│   ├── layout.jsx           # Root layout with providers
│   ├── page.jsx             # Home page (redirects)
│   ├── login/               # Auth pages
│   ├── dashboard/           # Dashboard pages
│   └── [other routes]/      # Feature pages
├── components/              # React components
├── context/                 # Context providers
├── utils/                   # Utilities
├── api/                     # API clients
├── hooks/                   # Custom hooks
├── styles/                  # CSS files
├── public/                  # Static assets
├── next.config.js          # Next.js config
└── middleware.js           # Auth middleware
```

## Key Features

### ✅ Fully Migrated
- 34 routes converted from React Router to Next.js
- All components use `.jsx` extension
- Edge Runtime configured (no Vercel function limits)
- Safe localStorage wrapper (SSR compatible)
- Environment variables updated (`NEXT_PUBLIC_*`)

### 🎯 Core Features
- **Authentication:** Email, Google OAuth, GitHub OAuth
- **Dashboards:** Role-based (PM, Developer, QA, DevOps)
- **Project Management:** Projects, tasks, documents
- **Collaboration:** Teams, handoffs, notifications
- **Integrations:** CI/CD, analytics, feedback

## Technologies

- **Framework:** Next.js 15.1.4
- **React:** 18.3.1
- **Runtime:** Edge Runtime (Vercel compatible)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Backend:** https://zyndrx-backend-blgx.onrender.com
- **Styling:** CSS Modules
- **Icons:** Lucide React

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Add environment variables to Vercel dashboard
2. Deploy:

```bash
vercel --prod
```

See `DEPLOYMENT_CHECKLIST.md` for complete guide.

### Alternative Platforms

- **Netlify:** `netlify deploy --prod`
- **Railway:** Connect repo and deploy
- **Self-host:** Use Docker or Node.js server

## Documentation

- `NEXTJS_MIGRATION.md` - Migration summary
- `ENV_VARIABLES.md` - Environment setup
- `DEPLOYMENT_CHECKLIST.md` - Deployment guide
- `VERCEL_FIX_APPLIED.md` - Edge Runtime setup
- `EDGE_RUNTIME_FIX.md` - localStorage fix
- `JSX_CONVERSION.md` - File extension changes

## Architecture Highlights

### Edge Runtime
All routes use Edge Runtime to bypass Vercel's 12-function limit on free tier:

```jsx
'use client';
export const runtime = 'edge';
```

### Safe localStorage
Custom wrapper handles SSR and Edge Runtime:

```jsx
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  }
};
```

### Route Protection
Middleware handles authentication:

```javascript
// middleware.js checks auth tokens
// Redirects unauthenticated users to /login
```

## Development

### Adding New Pages

1. Create `app/your-route/page.jsx`
2. Add `'use client'` directive
3. Add `export const runtime = 'edge'`
4. Import and use existing components

Example:

```jsx
'use client';
export const runtime = 'edge';

export default function YourPage() {
  return <div>Your content</div>;
}
```

### Adding New Components

1. Create `components/YourComponent.jsx`
2. Export as default or named export
3. Import in pages as needed

### Environment Variables

Client-side variables must use `NEXT_PUBLIC_` prefix:

```javascript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### localStorage Errors

Safe localStorage wrapper handles these automatically. If you see errors:
- Check browser console
- Verify variables aren't accessed during SSR

### Environment Variables Not Loading

```bash
# Restart dev server
# Next.js doesn't hot-reload env changes
npm run dev
```

## Performance

### Build Output
- 34 Edge Function routes
- ~102 KB shared First Load JS
- All routes optimized
- Automatic code splitting

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 100
- Best Practices: 95+
- SEO: 100

## Contributing

1. Create a feature branch
2. Make changes
3. Test locally (`npm run build`)
4. Create pull request

## License

Proprietary - Zyndrx Platform

## Support

For issues or questions:
- Check documentation files
- Review error logs in browser console
- Check Vercel deployment logs
- Contact development team

---

## Migration Status: ✅ COMPLETE

All features migrated and tested. Production ready! 🚀

**Last Updated:** December 31, 2025
**Next.js Version:** 15.1.4
**Status:** Production Ready
