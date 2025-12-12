# 🚀 Zyndrx Backend - Complete Setup Guide

This guide will walk you through setting up the Zyndrx backend from scratch.

## ✅ Prerequisites

- Node.js v20+ installed
- npm or yarn package manager
- Supabase account (free tier works)
- Git installed

## 📦 Step 1: Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## 🗄️ Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `zyndrx` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** (takes ~2 minutes)

### 2.2 Get Your API Keys

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### 2.3 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the contents of `database/schema.sql` and paste it
4. Click **"Run"** to execute the schema
5. Verify tables were created: Go to **Table Editor** → You should see all tables

### 2.4 Set Up Storage Buckets

1. Go to **Storage** in the Supabase dashboard
2. Create three buckets:
   - **Name**: `documents` → Make it **public** or **private** (your choice)
   - **Name**: `avatars` → Make it **public**
   - **Name**: `attachments` → Make it **private**

## 🔐 Step 3: Configure Environment Variables

1. Open the `.env` file in the root directory
2. Replace the placeholder values:

```env
# Update these with your actual Supabase credentials
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
SUPABASE_ANON_KEY=eyJhbGc...your-anon-key

# Generate a secure JWT secret (or use the one provided)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```

**⚠️ IMPORTANT**: 
- Never commit the actual `.env` file to Git
- The `.gitignore` already excludes it
- Use `.env.example` as a template for team members

### Generate a Secure JWT Secret

Run this command to generate a random 64-character secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

## 🏃 Step 4: Run the Server

### Development Mode (with hot reload):

```bash
npm run dev
```

You should see:

```
✅ Database connection successful
🚀 Server is running on port 5000
📝 Environment: development
🌐 Health check: http://localhost:5000/health
📡 API Base: http://localhost:5000/api/v1
```

### Test the Server:

Open your browser or use curl:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Zyndrx API is running",
  "timestamp": "2024-12-12T10:30:00.000Z",
  "environment": "development"
}
```

## 🧪 Step 5: Verify Setup

Run TypeScript type checking:

```bash
npm run type-check
```

Should complete without errors.

## 🔧 Step 6: Optional Integrations

### GitHub Integration (for CI/CD tracking)

1. Go to GitHub → Settings → Developer settings → GitHub Apps
2. Create a new GitHub App
3. Add webhook URL: `https://your-api.com/api/v1/webhooks/github`
4. Generate a webhook secret and add to `.env`:
   ```
   GITHUB_WEBHOOK_SECRET=your-webhook-secret
   ```

### Email Service (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   EMAIL_FROM=noreply@yourdomain.com
   ```

### Slack Integration (Optional)

1. Create a Slack App at [api.slack.com](https://api.slack.com)
2. Enable incoming webhooks
3. Add to `.env`:
   ```
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
   ```

## 📁 Project Structure Overview

```
zyndrx-backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── env.ts           # Environment variables validation
│   │   ├── supabase.ts      # Supabase client setup
│   │   └── logger.ts        # Winston logger configuration
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # JWT authentication & authorization
│   │   ├── validation.ts    # Request validation with Zod
│   │   ├── errorHandler.ts  # Global error handling
│   │   └── rateLimiter.ts   # Rate limiting configuration
│   │
│   ├── modules/             # Feature modules (to be built)
│   │   ├── auth/            # Authentication endpoints
│   │   ├── users/           # User management
│   │   ├── projects/        # Project CRUD
│   │   ├── prds/            # PRD management
│   │   ├── documents/       # Document uploads
│   │   ├── tasks/           # Task tracker
│   │   ├── notifications/   # Notification system
│   │   ├── integrations/    # External integrations
│   │   ├── analytics/       # Analytics & reporting
│   │   └── comments/        # Comments & mentions
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # All shared types
│   │
│   ├── utils/               # Utility functions
│   │   ├── responses.ts     # Standardized API responses
│   │   └── jwt.ts           # JWT utilities
│   │
│   ├── app.ts               # Express app configuration
│   └── server.ts            # Server entry point
│
├── database/
│   └── schema.sql           # PostgreSQL database schema
│
├── .env                     # Environment variables (DO NOT COMMIT)
├── .env.example             # Template for environment variables
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## 🛠️ Available Scripts

```bash
# Development (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Code formatting
npm run format
```

## 🚢 Step 7: Deployment (Future)

### Recommended Hosting:

**Backend API**: Railway or Render
- Push your code to GitHub
- Connect your repository
- Set environment variables
- Deploy!

**Database**: Supabase (already hosted)

**Frontend**: Vercel (when ready)

## 🐛 Troubleshooting

### "Database connection failed"

- Check your Supabase URL and keys in `.env`
- Ensure your Supabase project is active
- Verify you ran the schema SQL script

### "Invalid environment variables"

- Check that all required variables in `.env` are filled
- Ensure no extra spaces or quotes around values
- Verify JWT_SECRET is at least 32 characters

### Port already in use

```bash
# Change PORT in .env to a different value
PORT=5001
```

Or kill the process using port 5000:

```bash
# On Linux/Mac
lsof -ti:5000 | xargs kill -9

# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## 📚 Next Steps

Now that the tech stack is set up, you can start building:

1. ✅ **Authentication Module** - Login, register, OAuth
2. ✅ **User Management** - CRUD, roles, permissions
3. ✅ **Project Module** - Create, manage projects
4. ✅ **PRD Module** - Document creation, versioning
5. ✅ **Task Module** - Kanban boards, assignments
6. ✅ **Notifications** - Email, Slack, in-app
7. ✅ **Integrations** - GitHub, GitLab webhooks
8. ✅ **Analytics** - Metrics and reporting

## 🤝 Need Help?

- Check the main README.md for feature details
- Review the database schema in `database/schema.sql`
- Examine the type definitions in `src/types/index.ts`

---

**🎉 Your Zyndrx backend is now ready for development!**
