# 🚀 Zyndrx Backend API

Backend API for **Zyndrx** - A Project Management & Development Coordination Platform that brings together Product Managers, Designers, Developers, QA, and DevOps teams.

## 📋 Tech Stack

- **Runtime**: Node.js v20+ (LTS)
- **Framework**: Express.js with TypeScript (Strict Mode)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth + JWT + OAuth2
- **File Storage**: Supabase Storage
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston + Morgan

## 🏗️ Project Structure

```
zyndrx-backend/
├── src/
│   ├── config/           # Environment & Supabase configuration
│   ├── middleware/       # Auth, validation, error handling
│   ├── modules/          # Feature-based modules
│   │   ├── auth/         # Authentication & authorization
│   │   ├── users/        # User management & roles
│   │   ├── projects/     # Project CRUD operations
│   │   ├── prds/         # PRD designer & versioning
│   │   ├── documents/    # Document management
│   │   ├── tasks/        # Task tracker & Kanban boards
│   │   ├── notifications/# Notification engine
│   │   ├── integrations/ # GitHub, GitLab, Slack, Figma
│   │   ├── analytics/    # Metrics & reporting
│   │   └── comments/     # Comments & mentions
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Helper functions & validators
│   ├── app.ts            # Express app configuration
│   └── server.ts         # Application entry point
├── database/
│   └── schema.sql        # Supabase database schema
└── ...config files
```

## 🚀 Getting Started

### Prerequisites

- Node.js v20+ installed
- npm or yarn package manager
- Supabase account (free tier is sufficient)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual credentials
   ```

3. **Configure Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and API keys to `.env`
   - Run the database schema (instructions below)

4. **Run database migrations**:
   ```bash
   # Execute database/schema.sql in your Supabase SQL editor
   ```

### Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

### Critical Variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only)
- `SUPABASE_ANON_KEY` - Anonymous key (public)
- `JWT_SECRET` - Secret for JWT signing
- `RESEND_API_KEY` - For transactional emails

## 📚 API Documentation

API endpoints will be documented here as they are developed.

### Base URL
- Development: `http://localhost:5000/api/v1`
- Production: TBD

## 🛡️ Security Features

- JWT-based authentication
- OAuth2 integration (GitHub, GitLab)
- Role-Based Access Control (RBAC)
- Rate limiting
- Helmet security headers
- CORS configuration
- Request validation with Zod
- Audit logging

## 🎯 Core Features

- ✅ Multi-role authentication system
- ✅ PRD management with versioning
- ✅ Document storage and tagging
- ✅ Task tracking with Kanban boards
- ✅ Automated role-based notifications
- ✅ CI/CD integration (GitHub/GitLab webhooks)
- ✅ Real-time analytics and reporting
- ✅ Comprehensive audit logging

## 📦 Deployment

Recommended hosting platforms:
- **Backend API**: Railway or Render
- **Database**: Supabase (managed PostgreSQL)
- **Frontend**: Vercel

## 🤝 Contributing

This is a private project. For development guidelines, please refer to the team documentation.

## 📄 License

MIT

---

**Built with ❤️ for seamless team collaboration**
