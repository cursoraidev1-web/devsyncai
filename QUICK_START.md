# ⚡ Zyndrx Backend - Quick Start

## 🎯 What's Done

✅ **Complete Tech Stack Setup**
- Node.js + TypeScript (strict mode)
- Express.js web framework
- Supabase client configured
- All dependencies installed (365 packages)
- Security middleware (Helmet, CORS, Rate Limiting)
- JWT authentication system
- Zod validation
- Winston logging
- Database schema (15+ tables)

## 🚀 Get Started in 3 Steps

### 1️⃣ Set Up Supabase (5 minutes)

```bash
# 1. Go to https://supabase.com and create a project
# 2. Copy your credentials to .env file:
#    - SUPABASE_URL
#    - SUPABASE_SERVICE_ROLE_KEY
#    - SUPABASE_ANON_KEY
# 3. Run database/schema.sql in Supabase SQL Editor
# 4. Create storage buckets: documents, avatars, attachments
```

### 2️⃣ Configure Environment

Edit `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-key
SUPABASE_ANON_KEY=eyJhbG...your-key
JWT_SECRET=generate-32-char-secret-here
```

### 3️⃣ Run the Server

```bash
npm run dev
```

Visit: http://localhost:5000/health

## 📂 Project Structure

```
src/
├── config/          ✅ Env, Supabase, Logger
├── middleware/      ✅ Auth, Validation, Errors, Rate Limiting
├── types/           ✅ TypeScript definitions
├── utils/           ✅ JWT, API responses
├── modules/         🔜 Feature modules (empty, ready for development)
│   ├── auth/
│   ├── users/
│   ├── projects/
│   ├── prds/
│   ├── documents/
│   ├── tasks/
│   ├── notifications/
│   ├── integrations/
│   ├── analytics/
│   └── comments/
├── app.ts           ✅ Express app setup
└── server.ts        ✅ Server entry point
```

## 🎯 What to Build Next

### Priority 1: Authentication Module
```
src/modules/auth/
├── auth.routes.ts
├── auth.controller.ts
├── auth.service.ts
└── auth.validation.ts
```

**Endpoints to create:**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Priority 2: User Management
```
src/modules/users/
├── users.routes.ts
├── users.controller.ts
├── users.service.ts
└── users.validation.ts
```

### Priority 3: Projects Module
```
src/modules/projects/
├── projects.routes.ts
├── projects.controller.ts
├── projects.service.ts
└── projects.validation.ts
```

## 🛠️ Useful Commands

```bash
# Development
npm run dev          # Start with hot reload
npm run type-check   # Check TypeScript types
npm run lint         # Lint code
npm run format       # Format code

# Production
npm run build        # Compile TypeScript
npm start            # Run production build
```

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `src/config/env.ts` | Environment variable validation |
| `src/config/supabase.ts` | Database client & table names |
| `src/types/index.ts` | All TypeScript types |
| `src/middleware/auth.ts` | JWT authentication |
| `src/utils/responses.ts` | Standardized API responses |
| `database/schema.sql` | Database structure |

## 🔐 Authentication Flow

```typescript
// 1. Import middleware
import { authenticate, authorize } from './middleware/auth';
import { UserRole } from './types';

// 2. Protect routes
router.get('/protected', authenticate, controller);

// 3. Authorize specific roles
router.post('/admin-only', 
  authenticate, 
  authorize(UserRole.ADMIN), 
  controller
);
```

## ✅ Validation Example

```typescript
import { z } from 'zod';
import { validate } from './middleware/validation';

const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(255),
    description: z.string().optional(),
  }),
});

router.post('/projects', 
  validate(createProjectSchema), 
  controller
);
```

## 📊 Database Access

```typescript
import { supabase, TABLES } from './config/supabase';

// Query example
const { data, error } = await supabase
  .from(TABLES.USERS)
  .select('*')
  .eq('email', email)
  .single();
```

## 🎨 API Response Format

```typescript
import { sendSuccess, sendError } from './utils/responses';

// Success
sendSuccess(res, data, 'User created successfully', 201);

// Error
sendError(res, 'User not found', 404);

// Response format:
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

## 🐛 Common Issues

**Port in use?**
```bash
# Change PORT in .env
PORT=5001
```

**Type errors?**
```bash
npm run type-check
```

**Database connection failed?**
- Check Supabase credentials in `.env`
- Verify schema was run in Supabase SQL Editor

## 📖 Full Documentation

- **Detailed Setup**: See `SETUP_GUIDE.md`
- **Tech Stack**: See `TECH_STACK_SUMMARY.md`
- **Features**: See `README.md`

---

**🎉 You're all set! Start building your first module.**

**Recommended**: Start with the Auth module (`src/modules/auth/`)
