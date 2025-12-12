# 🏗️ Zyndrx Backend Architecture

## 📐 Design Principles

1. **Modular Architecture** - Each feature is self-contained
2. **Separation of Concerns** - Routes → Controllers → Services → Database
3. **Type Safety** - Strict TypeScript throughout
4. **Validation First** - Validate at API boundaries with Zod
5. **Consistent Responses** - Use standardized response utilities
6. **Security by Default** - Authentication & authorization on all routes
7. **Audit Everything** - Log all critical actions

## 🎯 Module Structure Pattern

Every feature module follows this structure:

```
src/modules/{feature}/
├── {feature}.routes.ts      # Express routes
├── {feature}.controller.ts  # Request handlers
├── {feature}.service.ts     # Business logic
├── {feature}.validation.ts  # Zod schemas
└── {feature}.types.ts       # Feature-specific types (optional)
```

### Example: Auth Module Structure

```typescript
// ============================================
// auth.routes.ts
// ============================================
import { Router } from 'express';
import { validate } from '../../middleware/validation';
import { authLimiter } from '../../middleware/rateLimiter';
import * as authController from './auth.controller';
import { registerSchema, loginSchema } from './auth.validation';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);

export default router;

// ============================================
// auth.controller.ts
// ============================================
import { Response } from 'express';
import { AuthRequest } from '../../types';
import { asyncHandler } from '../../middleware/errorHandler';
import { sendSuccess } from '../../utils/responses';
import * as authService from './auth.service';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.registerUser(req.body);
  sendSuccess(res, result, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.loginUser(req.body);
  sendSuccess(res, result, 'Login successful');
});

// ============================================
// auth.service.ts
// ============================================
import { supabase, TABLES } from '../../config/supabase';
import { AppError } from '../../middleware/errorHandler';
import { generateTokens } from '../../utils/jwt';
import bcrypt from 'bcryptjs';

interface RegisterDTO {
  email: string;
  password: string;
  full_name: string;
  role?: string;
}

export const registerUser = async (data: RegisterDTO) => {
  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  // Create user
  const { data: user, error } = await supabase
    .from(TABLES.USERS)
    .insert({
      email: data.email,
      full_name: data.full_name,
      role: data.role || 'viewer',
    })
    .select()
    .single();

  if (error) {
    throw new AppError('User already exists', 400);
  }

  // Generate tokens
  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, ...tokens };
};

// ============================================
// auth.validation.ts
// ============================================
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['viewer', 'developer', 'designer', 'qa_tester', 'devops']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});
```

## 🔐 Authentication & Authorization

### 1. Public Routes (No Auth)
```typescript
// Health check, public info
router.get('/health', controller);
```

### 2. Protected Routes (Auth Required)
```typescript
import { authenticate } from '../../middleware/auth';

router.get('/profile', authenticate, controller);
```

### 3. Role-Based Routes
```typescript
import { authenticate, authorize } from '../../middleware/auth';
import { UserRole } from '../../types';

// Only admins can access
router.delete('/users/:id', 
  authenticate, 
  authorize(UserRole.ADMIN), 
  controller
);

// Multiple roles allowed
router.post('/projects', 
  authenticate, 
  authorize(UserRole.ADMIN, UserRole.PRODUCT_MANAGER, UserRole.PRODUCT_OWNER), 
  controller
);
```

## 📊 Database Access Patterns

### Basic Query
```typescript
import { supabase, TABLES } from '../../config/supabase';

const { data, error } = await supabase
  .from(TABLES.PROJECTS)
  .select('*')
  .eq('owner_id', userId);

if (error) {
  throw new AppError('Failed to fetch projects', 500);
}
```

### With Relations
```typescript
const { data, error } = await supabase
  .from(TABLES.TASKS)
  .select(`
    *,
    assigned_user:users!assigned_to(id, full_name, email),
    project:projects(id, name)
  `)
  .eq('project_id', projectId);
```

### Pagination
```typescript
const page = parseInt(req.query.page as string) || 1;
const limit = parseInt(req.query.limit as string) || 20;
const offset = (page - 1) * limit;

const { data, error, count } = await supabase
  .from(TABLES.TASKS)
  .select('*', { count: 'exact' })
  .range(offset, offset + limit - 1);

sendPaginated(res, data || [], page, limit, count || 0);
```

### Transactions (Multiple Inserts)
```typescript
// Create project and add owner as member
const { data: project } = await supabase
  .from(TABLES.PROJECTS)
  .insert({ name, owner_id: userId })
  .select()
  .single();

await supabase
  .from(TABLES.PROJECT_MEMBERS)
  .insert({
    project_id: project.id,
    user_id: userId,
    role: UserRole.ADMIN,
  });
```

## 🎨 Response Patterns

### Success Response
```typescript
import { sendSuccess } from '../../utils/responses';

// Simple success
sendSuccess(res, data);

// With message and custom status
sendSuccess(res, data, 'Project created successfully', 201);
```

### Error Response
```typescript
import { sendError } from '../../utils/responses';

sendError(res, 'Project not found', 404);
```

### Paginated Response
```typescript
import { sendPaginated } from '../../utils/responses';

sendPaginated(res, items, page, limit, totalCount);

// Response format:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Throwing Errors
```typescript
import { AppError } from '../../middleware/errorHandler';

// Will be caught by global error handler
throw new AppError('Invalid project ID', 400);
throw new AppError('Unauthorized access', 403);
throw new AppError('Project not found', 404);
```

## 🔔 Notification Pattern

```typescript
import { createNotification } from '../notifications/notifications.service';
import { NotificationType } from '../../types';

// Send notification when task is assigned
await createNotification({
  user_id: task.assigned_to,
  type: NotificationType.TASK_ASSIGNED,
  title: 'New Task Assigned',
  message: `You have been assigned to task: ${task.title}`,
  data: { task_id: task.id, project_id: task.project_id },
});
```

## 📝 Audit Logging Pattern

```typescript
import { logAudit } from '../audit/audit.service';

// Log critical actions
await logAudit({
  user_id: req.userId,
  action: 'project.created',
  entity_type: 'project',
  entity_id: project.id,
  metadata: { name: project.name },
  ip_address: req.ip,
  user_agent: req.headers['user-agent'],
});
```

## 🔗 Integration Webhook Pattern

```typescript
// webhooks/github.controller.ts
import crypto from 'crypto';
import { env } from '../../config/env';

export const handleGithubWebhook = asyncHandler(async (req, res) => {
  // Verify signature
  const signature = req.headers['x-hub-signature-256'];
  const hash = crypto
    .createHmac('sha256', env.GITHUB_WEBHOOK_SECRET || '')
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (`sha256=${hash}` !== signature) {
    throw new AppError('Invalid signature', 401);
  }

  // Process webhook event
  const event = req.headers['x-github-event'];
  
  switch (event) {
    case 'push':
      await handlePushEvent(req.body);
      break;
    case 'pull_request':
      await handlePullRequestEvent(req.body);
      break;
  }

  sendSuccess(res, { received: true });
});
```

## 📈 Analytics Event Tracking

```typescript
// Track events for analytics
await supabase
  .from(TABLES.ANALYTICS_EVENTS)
  .insert({
    project_id,
    event_type: 'task.completed',
    event_data: {
      task_id: task.id,
      completion_time: task.completed_at,
      assigned_to: task.assigned_to,
    },
  });
```

## 🔄 File Upload Pattern

```typescript
import { supabase, BUCKETS } from '../../config/supabase';
import multer from 'multer';
import { env } from '../../config/env';

// Configure multer
const upload = multer({
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Upload endpoint
export const uploadDocument = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    throw new AppError('No file provided', 400);
  }

  // Upload to Supabase Storage
  const filePath = `${req.userId}/${Date.now()}-${file.originalname}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKETS.DOCUMENTS)
    .upload(filePath, file.buffer);

  if (uploadError) {
    throw new AppError('Failed to upload file', 500);
  }

  // Save metadata to database
  const { data: document } = await supabase
    .from(TABLES.DOCUMENTS)
    .insert({
      project_id: req.body.project_id,
      name: file.originalname,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.mimetype,
      uploaded_by: req.userId,
    })
    .select()
    .single();

  sendSuccess(res, document, 'File uploaded successfully', 201);
});
```

## 🎯 Testing Strategy

### Unit Tests (Future)
```typescript
// auth.service.test.ts
describe('AuthService', () => {
  it('should register a new user', async () => {
    const result = await registerUser({
      email: 'test@example.com',
      password: 'password123',
      full_name: 'Test User',
    });
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('accessToken');
  });
});
```

### Integration Tests (Future)
```typescript
// auth.routes.test.ts
describe('POST /api/v1/auth/register', () => {
  it('should register a user and return tokens', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        full_name: 'Test User',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

## 📦 Module Integration

### Register Routes in app.ts

```typescript
// src/app.ts
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import projectRoutes from './modules/projects/projects.routes';

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authenticate, userRoutes);
app.use('/api/v1/projects', authenticate, projectRoutes);
```

## 🚀 Deployment Checklist

- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Set up file storage buckets
- [ ] Configure CORS origins
- [ ] Set up monitoring/logging
- [ ] Enable rate limiting
- [ ] Set up backup strategy
- [ ] Configure SSL/TLS
- [ ] Set up CI/CD pipeline
- [ ] Create deployment documentation

---

**🎓 Follow this architecture for consistent, maintainable code!**
