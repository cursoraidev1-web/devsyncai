# Project Onboarding — devsyncai

## Purpose

- Web application built with Next.js using the App Router, React components, server-side API routes, and integrations for authentication and notifications.

## Primary stack

- Framework: Next.js (App Router)
- UI: React (JSX/JS components), component-level CSS files
- Backend endpoints: Next API routes in `api/` (Node.js)
- Testing: Jest (`jest.config.js`, `jest.setup.js`)
- Deploy targets: Vercel / Netlify (configs & docs included)

## Top-level files to know

- `package.json` — scripts, dependencies
- `next.config.js` — Next configuration
- `middleware.js` — app middleware / edge logic
- `netlify.toml` — Netlify config (if used)
- `VERCEL_DEPLOYMENT.md`, `VERCEL_FIX_APPLIED.md` — Vercel notes
- Jest: `jest.config.js`, `jest.setup.js`
- Docs: `README_NEXT.md`, `ENV_SETUP_INSTRUCTIONS.md`, `ENV_VARIABLES.md`, `DEPLOYMENT_CHECKLIST.md`, and many feature-specific .md files

## Important directories (what they contain and why)

- `api/` — Server-side endpoints (Next API routes). Key files:
  - `auth.js` — authentication endpoints (login/register/verify/2FA)
  - `client.js` — backend API client or helpers
  - `tasks.js`, `projects.js`, `comments.js`, `documents.js`, `notifications.js`, `cicd.js`, etc. — resource handlers and webhook receivers
  - Purpose: acts as the backend surface for frontend calls and external webhooks.

- `app/` — Next.js App Router pages and route handlers.
  - `layout.jsx` — shared layout and providers
  - `page.jsx` — root page
  - `not-found.jsx` — 404 UI
  - Subroutes for auth and protected flows: `auth/`, `login/`, `register/`, `verify-2fa/`, `reset-password/`, `reset-password-success/`, `accept-company-invite/`, etc.
  - Purpose: primary UI routes and server/client components.

- `components/` — Reusable UI components with paired CSS files.
  - Examples: `Header.jsx` / `Header.css`, `Sidebar.jsx` / `Sidebar.css`, `LoadingSpinner.jsx`, `PasswordInput.jsx`, `DocumentViewer.jsx`, `ServiceWorkerRegistration.jsx`.
  - Purpose: UI building blocks, shared widgets, and layout pieces.

- `context/` — React Context providers for global state (auth, app settings, etc.).

- `hooks/` — Custom React hooks encapsulating logic and fetch patterns.

- `design-system/` — Shared design tokens and primitives for consistent UI.

- `public/` — Static assets (images, icons, manifest).

- `styles/` — Global CSS and shared style files.

- `utils/` — Helper functions, formatters, and shared utilities.

## Notable conventions & features

- File types: `.js` and `.jsx` for components and API routes.
- Styling: component-level `.css` files (no explicit Tailwind evidence).
- Auth: dedicated pages and docs for OAuth and 2FA (`SUPABASE_GOOGLE_OAUTH_SETUP.md`, `verify-2fa/`).
- Edge/runtime: `middleware.js` and `EDGE_RUNTIME_FIX.md` indicate edge middleware usage.
- Tests: Jest is configured; run `npm test` to execute tests.

## Condensed repo tree (developer-focused)

Root

- package.json
- next.config.js
- middleware.js
- jest.config.js
- jest.setup.js
- netlify.toml
- README_NEXT.md
- ENV_SETUP_INSTRUCTIONS.md
- (many operational docs `.md`)

Directories

- api/ — server endpoints (auth.js, tasks.js, projects.js, ...)
- app/ — Next App Router pages (`layout.jsx`, `page.jsx`, auth routes...)
- components/ — UI components + CSS
- context/ — React providers
- hooks/ — custom hooks
- design-system/ — tokens and primitives
- public/ — static assets
- styles/ — global styles
- utils/ — helpers/utilities

## Quick start (local)

1. Install dependencies

```bash
npm install
```

2. Set required environment variables — see `ENV_SETUP_INSTRUCTIONS.md` and `ENV_VARIABLES.md`.
3. Run development server

```bash
npm run dev
```

4. Run tests

```bash
npm test
```

## Where to look first (for a new dev)

- UI flow: `app/layout.jsx`, `app/page.jsx`, `app/auth/*` routes
- Auth/backend: `api/auth.js`, `components/PasswordInput.jsx` and `components/EmailVerificationMessage.jsx`
- API examples: `api/tasks.js`, `api/projects.js` to learn request/response patterns
- Env and deployment: `ENV_SETUP_INSTRUCTIONS.md`, `VERCEL_DEPLOYMENT.md`, `netlify.toml`

## Next recommended steps

- Add `ONBOARDING.md` (this file) to the repo root so new devs have a single reference.
- Optionally generate a full markdown tree or visual diagram for broader context.
- Run the app locally using the quick start and confirm env variables are set.

## Contact & context

- See repository docs for owner/maintainers and feature-specific notes. For questions about specific routes or APIs, open the corresponding file under `api/` or `app/` and check related `.md` files in the root.

-- End of onboarding file
