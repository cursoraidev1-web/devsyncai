# Backend Priority Roadmap
## Endpoints and Database Requirements (Least → Most Important)

**⚠️ IMPORTANT:** This document provides priorities and overview. For detailed endpoint specifications (request/response formats, status codes, error handling), see `API_REQUIREMENTS.md`.

**📋 Document Purpose:**
- Prioritize implementation from least to most important
- Provide database schema requirements
- Give implementation timeline guidance
- Quick reference for what's needed

**🔗 For Detailed Specs:** See `API_REQUIREMENTS.md` for complete endpoint documentation with request/response formats.

---

This document prioritizes backend implementation from nice-to-have features to critical core functionality.

---

## 🔵 Phase 1: Nice-to-Have Features (Low Priority)

### Endpoints
1. **Feedback System**
   - `GET /api/v1/feedback` - Get feedback items
   - `POST /api/v1/feedback` - Submit feedback

2. **Activity Feed** (Can use mock data initially)
   - `GET /api/v1/activity` - Get activity feed
   - `GET /api/v1/activity?project_id=:id` - Get project-specific activity

3. **Integrations Management**
   - `GET /api/v1/integrations` - Get available integrations
   - `POST /api/v1/integrations/:type/connect` - Connect integration (GitHub, Figma, Slack)
   - `DELETE /api/v1/integrations/:id` - Disconnect integration

4. **CI/CD Integration** (Can use mock data initially)
   - `GET /api/v1/ci-cd/pipelines` - Get CI/CD pipelines
   - `GET /api/v1/ci-cd/deployments` - Get deployments
   - `GET /api/v1/ci-cd/commits` - Get recent commits

5. **Handoff System** (Currently using mock data)
   - `GET /api/v1/handoffs` - Get all handoffs
   - `GET /api/v1/handoffs/:id` - Get single handoff
   - `POST /api/v1/handoffs` - Create handoff
   - `PATCH /api/v1/handoffs/:id` - Update handoff status
   - `POST /api/v1/handoffs/:id/review` - Submit handoff review

### Database Tables
- `feedback` table (optional)
- `activity_log` table (optional)
- `integrations` table (optional)
- `ci_cd_pipelines` table (optional)
- `handoffs` table (optional)

**Priority Justification:** These features enhance the platform but aren't essential for core functionality. Can be added later.

---

## 🟡 Phase 2: Important Features (Medium Priority)

### Endpoints
1. **Company/Workspace Management**
   - `GET /api/v1/auth/companies` - Get user's companies
   - `POST /api/v1/auth/switch-company` - Switch active company
   - `POST /api/v1/companies` - Create new company
   - `GET /api/v1/companies/:id` - Get company details
   - `POST /api/v1/companies/:id/invite` - Invite user to company
   - `POST /api/v1/companies/accept-invite` - Accept company invitation

2. **Analytics**
   - `GET /api/v1/analytics?project_id=:projectId` - Get project analytics
   - Returns KPIs, project progress, team performance

3. **PRD Management** (Product Requirements Documents)
   - `POST /api/v1/prds` - Create PRD
   - `GET /api/v1/prds/:id` - Get PRD
   - `PATCH /api/v1/prds/:id/status` - Update PRD status

4. **Teams Management** (Beyond project members)
   - `GET /api/v1/teams` - Get all teams (if separate from project members)
   - `POST /api/v1/teams` - Create team
   - `GET /api/v1/teams/:id/members` - Get team members

5. **User Management in Company**
   - `GET /api/v1/companies/:id/members` - Get company members
   - `PATCH /api/v1/companies/:id/members/:userId` - Update user role in company
   - `DELETE /api/v1/companies/:id/members/:userId` - Remove user from company

### Database Tables
- `companies` table ⚠️ **CRITICAL for multi-tenancy**
- `user_companies` table ⚠️ **CRITICAL for multi-tenancy**
- `analytics_cache` table (optional, can compute on-the-fly)
- `prds` table
- `teams` table (if separate from projects)

**Priority Justification:** These features add significant value but core functionality can work without them initially. Company management becomes critical if implementing multi-tenancy.

---

## 🟠 Phase 3: Core Features (High Priority)

### Endpoints
1. **Document Management**
   - `GET /api/v1/documents?project_id=:projectId` - Get documents
   - `POST /api/v1/documents` - Create/upload document
   - `DELETE /api/v1/documents/:id` - Delete document

2. **Task Management** (Full CRUD)
   - `GET /api/v1/tasks?project_id=:projectId` - Get tasks by project
   - `POST /api/v1/tasks` - Create task
   - `PATCH /api/v1/tasks/:id` - Update task
   - `DELETE /api/v1/tasks/:id` - Delete task

3. **Project Management** (Full CRUD)
   - `GET /api/v1/projects` - Get all projects
   - `GET /api/v1/projects/:id` - Get single project
   - `POST /api/v1/projects` - Create project
   - `PATCH /api/v1/projects/:id` - Update project
   - `DELETE /api/v1/projects/:id` - Delete project

4. **Team Invitations (Project-based)**
   - `POST /api/v1/teams/invite` - Invite user to project
   - `POST /api/v1/teams/accept-invite` - Accept project invitation
   - `GET /api/v1/teams/:projectId/members` - Get project members

5. **Notifications**
   - `GET /api/v1/notifications` - Get notifications
   - `PATCH /api/v1/notifications/:id/read` - Mark notification as read
   - `PATCH /api/v1/notifications/mark-all-read` - Mark all as read

### Database Tables
- `documents` table ⚠️ **REQUIRED**
- `tasks` table ⚠️ **REQUIRED**
- `projects` table ⚠️ **REQUIRED**
- `notifications` table ⚠️ **REQUIRED**
- `project_invitations` table (or extend teams table)
- `project_members` table (or user_projects junction table)

**Priority Justification:** These are essential for the platform's core workflow. Users need projects, tasks, documents, and notifications to use the platform effectively.

---

## 🔴 Phase 4: Critical Core (Highest Priority)

### Authentication Endpoints ⚠️ **MUST HAVE FIRST**

1. **User Registration**
   - `POST /api/v1/auth/register`
   - **Request Body:** `{ email, password, fullName, companyName }` ⚠️ **companyName is required**
   - **Response:** `{ success: true, data: { user, token, companies, currentCompany }, message }`
   - **Action Required:** 
     - Create default company with provided `companyName`
     - Add user to company as "admin" role
     - Create `free` subscription with `trial` status (30-day trial)
     - Set `trial_start_date` and `trial_end_date` (30 days from now)
     - Return company info and subscription info in response
   - **Status:** ⚠️ Needs company creation logic and subscription creation added

2. **User Login**
   - `POST /api/v1/auth/login`
   - Authenticates user
   - Returns: `{ user, token }` or `{ require2fa: true }`
   - **Status:** ✅ Already implemented

3. **Get Current User**
   - `GET /api/v1/auth/me`
   - Returns authenticated user data
   - **Status:** ✅ Already implemented

4. **Update Profile**
   - `PUT /api/v1/auth/profile`
   - Updates user profile (fullName, avatarUrl)
   - **Status:** ✅ Already implemented

5. **Logout**
   - `POST /api/v1/auth/logout`
   - Invalidates session/token
   - **Status:** ✅ Already implemented

6. **Password Reset**
   - `POST /api/v1/auth/forgot-password` - Request reset
   - `POST /api/v1/auth/reset-password` - Reset password
   - **Status:** ✅ Already implemented

7. **OAuth Authentication**
   - `POST /api/v1/auth/google` - Google OAuth login
     - **Request Body:** `{ accessToken }` OR `{ code, redirect_uri }` (for code exchange)
     - Backend should handle both: direct accessToken or exchange code for token
   - `POST /api/v1/auth/github` - GitHub OAuth login
     - **Request Body:** `{ accessToken }`
   - **Status:** ⚠️ Google needs code exchange support

8. **2FA (Two-Factor Authentication)**
   - `POST /api/v1/auth/2fa/setup` - Setup 2FA
   - `POST /api/v1/auth/2fa/enable` - Enable 2FA
   - `POST /api/v1/auth/2fa/verify` - Verify 2FA code
   - **Status:** ✅ Already implemented

### Database Tables (Critical)

1. **`users` table** ⚠️ **ABSOLUTELY CRITICAL**
   ```sql
   - id (UUID, primary key)
   - email (string, unique, required)
   - password_hash (string, required)
   - full_name (string, required)
   - role (enum: admin, product_manager, developer, qa, devops, designer)
   - avatar_url (string, optional)
   - email_verified (boolean, default false)
   - two_factor_enabled (boolean, default false)
   - two_factor_secret (string, optional)
   - created_at (timestamp)
   - updated_at (timestamp)
   ```

2. **`companies` table** ⚠️ **CRITICAL for multi-tenancy**
   ```sql
   - id (UUID, primary key)
   - name (string, required)
   - slug (string, unique, optional)
   - created_at (timestamp)
   - updated_at (timestamp)
   ```

3. **`user_companies` table** ⚠️ **CRITICAL for multi-tenancy**
   ```sql
   - id (UUID, primary key)
   - user_id (UUID, foreign key → users.id)
   - company_id (UUID, foreign key → companies.id)
   - role (string: admin, member, viewer)
   - status (string: active, pending, inactive)
   - joined_at (timestamp)
   - UNIQUE(user_id, company_id)
   ```

4. **`projects` table** ⚠️ **REQUIRED for core functionality**
   ```sql
   - id (UUID, primary key)
   - name (string, required)
   - description (text, optional)
   - status (string: active, archived, completed)
   - company_id (UUID, foreign key → companies.id) ⚠️ CRITICAL
   - start_date (date, optional)
   - end_date (date, optional)
   - created_by (UUID, foreign key → users.id)
   - created_at (timestamp)
   - updated_at (timestamp)
   ```

5. **`tasks` table** ⚠️ **REQUIRED for core functionality**
   ```sql
   - id (UUID, primary key)
   - title (string, required)
   - description (text, optional)
   - status (enum: todo, in_progress, in_review, completed)
   - priority (string: low, medium, high)
   - project_id (UUID, foreign key → projects.id)
   - company_id (UUID, foreign key → companies.id) ⚠️ CRITICAL
   - assignee_id (UUID, foreign key → users.id, optional)
   - due_date (timestamp, optional)
   - created_by (UUID, foreign key → users.id)
   - created_at (timestamp)
   - updated_at (timestamp)
   ```

6. **`documents` table** ⚠️ **REQUIRED for core functionality**
   ```sql
   - id (UUID, primary key)
   - title (string, required)
   - file_url (string, required)
   - file_type (string, required)
   - file_size (integer, optional)
   - project_id (UUID, foreign key → projects.id)
   - company_id (UUID, foreign key → companies.id) ⚠️ CRITICAL
   - created_by (UUID, foreign key → users.id)
   - created_at (timestamp)
   - updated_at (timestamp)
   ```

7. **`notifications` table** ⚠️ **REQUIRED for core functionality**
   ```sql
   - id (UUID, primary key)
   - user_id (UUID, foreign key → users.id)
   - company_id (UUID, foreign key → companies.id) ⚠️ CRITICAL
   - type (string: task_assigned, project_updated, etc.)
   - title (string, required)
   - message (text, required)
   - read (boolean, default false)
   - related_id (UUID, optional) - ID of related entity
   - related_type (string, optional) - Type of related entity
   - created_at (timestamp)
   ```

8. **`subscriptions` table** ⚠️ **REQUIRED for monetization** (Phase 2)
   ```sql
   - id (UUID, primary key)
   - company_id (UUID, foreign key → companies.id) ⚠️ CRITICAL - subscriptions are per company
   - plan_type (enum: free, pro, enterprise)
   - status (enum: active, trial, expired, cancelled)
   - trial_start_date (timestamp, nullable)
   - trial_end_date (timestamp, nullable)
   - current_period_start (timestamp, nullable)
   - current_period_end (timestamp, nullable)
   - cancel_at_period_end (boolean, default false)
   - stripe_subscription_id (string, nullable)
   - stripe_customer_id (string, nullable)
   - created_at (timestamp)
   - updated_at (timestamp)
   ```

9. **`plan_limits` table** ⚠️ **REQUIRED for monetization** (Phase 2)
   ```sql
   - plan_type (enum: free, pro, enterprise, primary key)
   - max_projects (integer, -1 for unlimited)
   - max_tasks (integer, -1 for unlimited)
   - max_team_members (integer, -1 for unlimited)
   - max_documents (integer, -1 for unlimited)
   - max_storage_gb (integer, -1 for unlimited)
   - features (jsonb, optional)
   ```

10. **`sessions` or JWT management** ⚠️ **CRITICAL for security**
   - Token storage/blacklist (if using token revocation)
   - Or rely on JWT expiration only

**Priority Justification:** Without these, the platform cannot function. Authentication is the foundation, and the core tables are essential for any functionality.

---

## 📊 Implementation Priority Matrix

### Week 1-2: Critical Core (Phase 4)
- ✅ Authentication endpoints (most already done)
- ✅ Core database tables (users, companies, user_companies, projects, tasks, documents, notifications)
- ✅ Add `company_id` to all data tables
- ✅ Update JWT to include `company_id`
- ✅ Filter all queries by `company_id`

### Week 3-4: Core Features (Phase 3)
- ✅ Project CRUD endpoints
- ✅ Task CRUD endpoints
- ✅ Document endpoints
- ✅ Notification endpoints
- ✅ Team invitation endpoints

### Week 5-6: Important Features (Phase 2)
- ✅ Company management endpoints
- ✅ Analytics endpoint
- ✅ PRD endpoints
- ✅ Teams management (if separate from projects)

### Week 7+: Nice-to-Have (Phase 1)
- ⏳ Handoff system
- ⏳ CI/CD integration
- ⏳ Activity feed
- ⏳ Integrations management
- ⏳ Feedback system

---

## 🗄️ Database Schema Priority

### Must Create First:
1. `users` - Foundation table
2. `companies` - Multi-tenancy foundation
3. `user_companies` - Multi-tenancy junction
4. `projects` - Core feature
5. `tasks` - Core feature
6. `documents` - Core feature
7. `notifications` - Core feature

### Add company_id to:
- ✅ `projects` table
- ✅ `tasks` table
- ✅ `documents` table
- ✅ `notifications` table
- ✅ Any other data tables created later

### Important Indexes:
```sql
-- Performance critical indexes
CREATE INDEX idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX idx_user_companies_company_id ON user_companies(company_id);
CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_tasks_company_id ON tasks(company_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_documents_company_id ON documents(company_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_company_id ON notifications(company_id);
CREATE INDEX idx_users_email ON users(email);
```

---

## 🔐 Security Requirements (Critical)

1. **JWT Token Structure:**
   ```json
   {
     "userId": "uuid",
     "companyId": "uuid",  // ⚠️ REQUIRED for multi-tenancy
     "email": "user@example.com",
     "role": "developer",
     "exp": 1234567890
   }
   ```

2. **Row-Level Security:**
   - ALWAYS filter by `company_id` from JWT
   - NEVER return data from other companies
   - Verify user is member of company before operations
   - Use parameterized queries to prevent SQL injection

3. **Authorization:**
   - Verify user belongs to company for all operations
   - Check user role within company for permissions
   - Validate project belongs to company

---

## 📝 Quick Start Checklist

### Minimum Viable Product (MVP)
- [ ] Users table with authentication
- [ ] Companies table
- [ ] User_companies junction table
- [ ] Projects table with company_id
- [ ] Tasks table with company_id
- [ ] Registration endpoint (creates default company)
- [ ] Login endpoint
- [ ] Get current user endpoint
- [ ] Get projects endpoint (filtered by company)
- [ ] Get tasks endpoint (filtered by company)
- [ ] Create project endpoint
- [ ] Create task endpoint
- [ ] Update task endpoint
- [ ] JWT includes company_id

### Full Feature Set
- [ ] All MVP items
- [ ] Documents table and endpoints
- [ ] Notifications table and endpoints
- [ ] Company switching endpoints
- [ ] Team invitation endpoints
- [ ] PRD endpoints
- [ ] Analytics endpoint
- [ ] Company management endpoints

---

## 🎯 Success Criteria

The backend is ready for production when:
1. ✅ Users can register and login
2. ✅ Users get default company on registration
3. ✅ Users can switch between companies
4. ✅ All data is isolated per company
5. ✅ Projects, tasks, documents work with company filtering
6. ✅ Notifications work per company
7. ✅ Team invitations work
8. ✅ JWT tokens include company context
9. ✅ All endpoints verify company membership
10. ✅ No data leaks between companies

---

---

## 📋 Critical Implementation Notes

### Registration Endpoint Changes Required:
1. **Accept `companyName` in request body** (required field)
2. **Create company automatically** with the provided name
3. **Add user to company** as "admin" role in `user_companies` table
4. **Return company info** in response:
   ```json
   {
     "success": true,
     "data": {
       "user": { /* user object */ },
       "token": "jwt-token",
       "companies": [{ "id": "uuid", "name": "Company Name", "role": "admin" }],
       "currentCompany": { "id": "uuid", "name": "Company Name" }
     }
   }
   ```

### Company/Workspace Context:
- **ALL data endpoints** must filter by `company_id` from JWT token
- **Verify user is member** of the company before any operation
- **JWT must include `companyId`** as current active company
- **Company switching** updates JWT `companyId` (optional: return new token)

### Task Status Values:
- Backend uses: `todo`, `in_progress`, `in_review`, `completed`
- Frontend normalizes: `in-progress` ↔ `in_progress`, `in-review` ↔ `in_review`
- API should accept both formats or standardize on one

### Response Format Standard:
All endpoints should return:
```json
{
  "success": true,  // or false
  "data": { /* response data */ },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 📚 Additional Resources

### Required Reading for Backend Developer:
1. **`API_REQUIREMENTS.md`** ⚠️ **CRITICAL** - Complete endpoint specifications with request/response formats
2. **`MULTI_COMPANY_ARCHITECTURE.md`** - Detailed multi-tenancy architecture guide
3. **`WORKSPACE_IMPLEMENTATION.md`** - Frontend implementation details (for reference)

### Quick Reference:
- **Base URL:** All endpoints prefixed with `/api/v1`
- **Authentication:** Bearer token in `Authorization` header
- **Content-Type:** `application/json` for all requests
- **Dates:** ISO 8601 format (`2024-01-01T00:00:00Z`)

---

## ✅ Checklist for Backend Developer

Before starting implementation, ensure you have:
- [ ] Read `API_REQUIREMENTS.md` for detailed endpoint specs
- [ ] Reviewed `MULTI_COMPANY_ARCHITECTURE.md` for multi-tenancy design
- [ ] Understood JWT token structure (must include `companyId`)
- [ ] Planned database schema (all tables with `company_id`)
- [ ] Planned security (row-level filtering, parameterized queries)
- [ ] Set up error handling (consistent response format)

After implementation:
- [ ] Test all endpoints with Postman/Insomnia
- [ ] Verify company isolation (users can't access other companies' data)
- [ ] Test company switching
- [ ] Verify registration creates company
- [ ] Test all error scenarios
- [ ] Verify JWT includes `companyId`

