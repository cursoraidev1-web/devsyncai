# Backend Requirements - Missing Endpoints & Features

This document lists all backend endpoints and features that are still needed for the ZynDrx platform.

## ✅ Already Implemented (Working)

### Authentication
- ✅ `POST /api/v1/auth/login` - User login
- ✅ `POST /api/v1/auth/register` - User registration
- ✅ `GET /api/v1/auth/me` - Get current user
- ✅ `POST /api/v1/auth/logout` - Logout
- ✅ `GET /api/v1/auth/companies` - Get user companies
- ✅ `POST /api/v1/auth/switch-company` - Switch company context

### Projects
- ✅ `GET /api/v1/projects` - List all projects
- ✅ `GET /api/v1/projects/:id` - Get single project
- ✅ `POST /api/v1/projects` - Create project

### Tasks
- ✅ `GET /api/v1/tasks?project_id=:id` - Get tasks by project
- ✅ `POST /api/v1/tasks` - Create task
- ✅ `PATCH /api/v1/tasks/:id` - Update task
- ✅ `DELETE /api/v1/tasks/:id` - Delete task

### Notifications
- ✅ `GET /api/v1/notifications` - Get notifications
- ✅ `PATCH /api/v1/notifications/:id/read` - Mark notification as read
- ✅ `PATCH /api/v1/notifications/mark-all-read` - Mark all as read

### Documents
- ✅ `GET /api/v1/documents?project_id=:id` - Get documents by project
- ✅ `POST /api/v1/documents` - Create document

### Subscription
- ✅ `GET /api/v1/subscription` - Get subscription info
- ✅ `GET /api/v1/subscription/limits` - Get plan limits
- ✅ `GET /api/v1/plans` - Get available plans
- ✅ `POST /api/v1/subscription/upgrade` - Upgrade subscription
- ✅ `POST /api/v1/subscription/cancel` - Cancel subscription

---

## ❌ Missing Backend Endpoints

### 1. Projects

#### Missing Endpoints:
- ❌ `PATCH /api/v1/projects/:id` - Update project
- ❌ `DELETE /api/v1/projects/:id` - Delete project
- ❌ `POST /api/v1/projects/:id/invite` - Invite users to project
- ❌ `GET /api/v1/projects/:id/members` - Get project members
- ❌ `DELETE /api/v1/projects/:id/members/:userId` - Remove member from project

**Status:** Basic CRUD partially working. Update and delete operations not available.

---

### 2. Tasks

#### Missing Endpoints:
- ❌ `GET /api/v1/tasks/:id` - Get single task (may be needed for detail views)
- ❌ `GET /api/v1/tasks` (without project_id) - Get all tasks for user/company
- ❌ `POST /api/v1/tasks/:id/comments` - Add comment to task
- ❌ `GET /api/v1/tasks/:id/comments` - Get task comments
- ❌ `POST /api/v1/tasks/:id/attachments` - Upload attachment to task
- ❌ `GET /api/v1/tasks/:id/attachments` - Get task attachments

**Status:** Basic CRUD working. Comments and attachments not implemented.

---

### 3. PRD (Product Requirements Documents)

#### Missing Endpoints:
- ❌ `GET /api/v1/prds` - List all PRDs (by project or company)
- ❌ `GET /api/v1/prds/:id` - Get single PRD (partially implemented but needs testing)
- ❌ `POST /api/v1/prds` - Create PRD (partially implemented but needs testing)
- ❌ `PATCH /api/v1/prds/:id` - Update PRD content
- ❌ `DELETE /api/v1/prds/:id` - Delete PRD
- ❌ `PATCH /api/v1/prds/:id/status` - Update PRD status (partially implemented)
- ❌ `POST /api/v1/prds/:id/versions` - Create new version of PRD
- ❌ `GET /api/v1/prds/:id/versions` - Get PRD version history
- ❌ `POST /api/v1/prds/:id/sections` - Add section to PRD
- ❌ `PATCH /api/v1/prds/:id/sections/:sectionId` - Update PRD section
- ❌ `DELETE /api/v1/prds/:id/sections/:sectionId` - Delete PRD section
- ❌ `POST /api/v1/prds/:id/assignees` - Add assignee to PRD
- ❌ `DELETE /api/v1/prds/:id/assignees/:userId` - Remove assignee

**Status:** Basic structure exists but full CRUD not implemented. PRD Designer page uses local state only.

**Current Implementation:**
- `src/api/prds.js` has `createPRD`, `getPRD`, `updatePRDStatus` but they're not being used in `PRDDesigner.js`
- PRD Designer page creates PRDs locally only

---

### 4. Documents

#### Missing Endpoints:
- ❌ `GET /api/v1/documents/:id` - Get single document
- ❌ `PATCH /api/v1/documents/:id` - Update document metadata
- ❌ `DELETE /api/v1/documents/:id` - Delete document
- ❌ `POST /api/v1/documents/upload` - Upload file (with multipart/form-data)
- ❌ `GET /api/v1/documents/:id/download` - Download document file
- ❌ `GET /api/v1/documents` (without project_id) - Get all documents for user/company

**Status:** Create and list working. Delete, update, and file upload/download not implemented.

**Current Implementation:**
- `DocumentStore.js` has a delete handler but it's not calling an API
- File upload is expected but not implemented (needs multipart/form-data handling)

---

### 5. Handoffs

#### Missing Endpoints:
- ❌ `GET /api/v1/handoffs` - List all handoffs (by project, status, or user)
- ❌ `GET /api/v1/handoffs/:id` - Get single handoff
- ❌ `POST /api/v1/handoffs` - Create handoff
- ❌ `PATCH /api/v1/handoffs/:id` - Update handoff
- ❌ `DELETE /api/v1/handoffs/:id` - Delete handoff
- ❌ `POST /api/v1/handoffs/:id/approve` - Approve handoff
- ❌ `POST /api/v1/handoffs/:id/reject` - Reject handoff
- ❌ `POST /api/v1/handoffs/:id/comments` - Add comment to handoff
- ❌ `GET /api/v1/handoffs/:id/comments` - Get handoff comments
- ❌ `POST /api/v1/handoffs/:id/attachments` - Upload attachment to handoff

**Status:** Completely missing. HandoffSystem and HandoffDetails pages use empty arrays.

**Current Implementation:**
- `HandoffSystem.js` has `const handoffs = []` (empty array)
- `HandoffDetails.js` has `const handoff = null` (no API call)
- No API file exists for handoffs

---

### 6. Teams

#### Missing Endpoints:
- ❌ `GET /api/v1/teams` - List all teams
- ❌ `GET /api/v1/teams/:id` - Get single team
- ❌ `POST /api/v1/teams` - Create team
- ❌ `PATCH /api/v1/teams/:id` - Update team
- ❌ `DELETE /api/v1/teams/:id` - Delete team
- ❌ `GET /api/v1/teams/:id/members` - Get team members (partially exists as `/teams/:projectId/members`)
- ❌ `POST /api/v1/teams/:id/members` - Add member to team
- ❌ `DELETE /api/v1/teams/:id/members/:userId` - Remove member from team
- ❌ `POST /api/v1/teams/invite` - Invite to project (exists but may need team context)
- ❌ `POST /api/v1/teams/accept-invite` - Accept invite (exists)

**Status:** Partially implemented. Team invitation exists but team CRUD operations missing.

**Current Implementation:**
- `src/api/teams.js` only has `inviteToProject`, `acceptInvite`, `getProjectMembers`
- `Teams.js` page uses empty arrays for teams and teamMembers
- No team creation/management endpoints

---

### 7. Integrations

#### Missing Endpoints:
- ❌ `GET /api/v1/integrations` - List available integrations
- ❌ `GET /api/v1/integrations/:id` - Get integration status
- ❌ `POST /api/v1/integrations/:id/connect` - Connect integration (e.g., GitHub, Slack)
- ❌ `POST /api/v1/integrations/:id/disconnect` - Disconnect integration
- ❌ `GET /api/v1/integrations/:id/config` - Get integration configuration
- ❌ `PATCH /api/v1/integrations/:id/config` - Update integration configuration
- ❌ `POST /api/v1/integrations/github/oauth` - GitHub OAuth callback
- ❌ `POST /api/v1/integrations/slack/oauth` - Slack OAuth callback
- ❌ `GET /api/v1/integrations/:id/sync` - Trigger integration sync

**Status:** Completely missing. Integrations page shows static catalog only.

**Current Implementation:**
- `Integrations.js` has hardcoded integration catalog
- All integrations default to `connected: false`
- No API calls for connecting/disconnecting integrations

---

### 8. CI/CD Integration

#### Missing Endpoints:
- ❌ `GET /api/v1/cicd/pipelines` - List CI/CD pipelines
- ❌ `GET /api/v1/cicd/pipelines/:id` - Get pipeline details
- ❌ `GET /api/v1/cicd/pipelines/:id/logs` - Get pipeline logs
- ❌ `POST /api/v1/cicd/pipelines/:id/trigger` - Trigger pipeline
- ❌ `POST /api/v1/cicd/pipelines/:id/cancel` - Cancel pipeline
- ❌ `GET /api/v1/cicd/deployments` - List deployments
- ❌ `GET /api/v1/cicd/deployments/:id` - Get deployment details
- ❌ `POST /api/v1/cicd/deployments/:id/rollback` - Rollback deployment
- ❌ `GET /api/v1/cicd/commits` - List recent commits
- ❌ `GET /api/v1/cicd/commits/:id` - Get commit details
- ❌ `GET /api/v1/cicd/metrics` - Get CI/CD metrics (build times, success rates, etc.)

**Status:** Completely missing. CI/CD page shows empty states only.

**Current Implementation:**
- `CICDIntegration.js` has empty arrays for pipelines, deployments, commits
- All data is hardcoded as empty
- No API integration exists

---

### 9. Analytics

#### Missing Endpoints:
- ❌ `GET /api/v1/analytics?project_id=:id` - Get analytics for project (partially exists but needs full implementation)
- ❌ `GET /api/v1/analytics/kpi?project_id=:id` - Get KPI cards
- ❌ `GET /api/v1/analytics/progress?project_id=:id` - Get project progress metrics
- ❌ `GET /api/v1/analytics/team-performance?project_id=:id` - Get team performance metrics
- ❌ `GET /api/v1/analytics/deployments?project_id=:id` - Get deployment metrics
- ❌ `GET /api/v1/analytics/sprint-velocity?project_id=:id` - Get sprint velocity
- ❌ `GET /api/v1/analytics/tasks?project_id=:id` - Get task analytics
- ❌ `GET /api/v1/analytics/time-range?project_id=:id&range=:range` - Get analytics for time range

**Status:** Partially implemented. Basic endpoint exists but needs full data structure.

**Current Implementation:**
- `src/api/analytics.js` has `getAnalytics(projectId)` but returns empty data
- `Analytics.js` page expects specific data structure (kpiCards, projectProgress, etc.) that's not returned

---

### 10. Activity Feed

#### Missing Endpoints:
- ❌ `GET /api/v1/activity` - Get activity feed
- ❌ `GET /api/v1/activity?project_id=:id` - Get activity for project
- ❌ `GET /api/v1/activity?type=:type` - Filter by activity type (task, comment, file, etc.)
- ❌ `GET /api/v1/activity?user_id=:id` - Get activity for user
- ❌ `POST /api/v1/activity` - Create activity entry (for system events)

**Status:** Completely missing. Activity page uses hardcoded demo data.

**Current Implementation:**
- `Activity.js` has hardcoded activities array
- No API integration exists

---

### 11. Feedback

#### Missing Endpoints:
- ❌ `POST /api/v1/feedback` - Submit feedback
- ❌ `GET /api/v1/feedback` - Get feedback (admin only)
- ❌ `GET /api/v1/feedback/:id` - Get single feedback item
- ❌ `PATCH /api/v1/feedback/:id/status` - Update feedback status (admin)

**Status:** Completely missing. Feedback page only shows local success message.

**Current Implementation:**
- `Feedback.js` has form submission but no API call
- Form data is reset locally after submission

---

### 12. Documentation Editor

#### Missing Endpoints:
- ❌ `GET /api/v1/documentation/:id` - Get documentation content
- ❌ `POST /api/v1/documentation` - Create documentation
- ❌ `PATCH /api/v1/documentation/:id` - Update documentation
- ❌ `DELETE /api/v1/documentation/:id` - Delete documentation
- ❌ `POST /api/v1/documentation/:id/publish` - Publish documentation
- ❌ `GET /api/v1/documentation` - List all documentation

**Status:** Unknown - need to check DocumentationEditor.js implementation.

---

### 13. User Management

#### Missing Endpoints:
- ❌ `PUT /api/v1/auth/profile` - Update user profile (exists but may need testing)
- ❌ `POST /api/v1/auth/change-password` - Change password
- ❌ `POST /api/v1/auth/forgot-password` - Forgot password (exists but needs testing)
- ❌ `POST /api/v1/auth/reset-password` - Reset password (exists but needs testing)
- ❌ `POST /api/v1/auth/2fa/setup` - Setup 2FA (exists but needs testing)
- ❌ `POST /api/v1/auth/2fa/enable` - Enable 2FA (exists but needs testing)
- ❌ `POST /api/v1/auth/2fa/verify` - Verify 2FA (exists but needs testing)
- ❌ `POST /api/v1/auth/2fa/disable` - Disable 2FA
- ❌ `GET /api/v1/users` - List users (admin)
- ❌ `GET /api/v1/users/:id` - Get user details
- ❌ `PATCH /api/v1/users/:id` - Update user (admin)
- ❌ `DELETE /api/v1/users/:id` - Delete user (admin)

**Status:** Partially implemented. Basic auth endpoints exist but profile management may need work.

---

### 14. Company/Workspace Management

#### Missing Endpoints:
- ❌ `GET /api/v1/companies/:id` - Get company details (exists but needs testing)
- ❌ `POST /api/v1/companies` - Create company (exists but needs testing)
- ❌ `PATCH /api/v1/companies/:id` - Update company
- ❌ `DELETE /api/v1/companies/:id` - Delete company
- ❌ `GET /api/v1/companies/:id/members` - Get company members
- ❌ `POST /api/v1/companies/:id/invite` - Invite user to company
- ❌ `DELETE /api/v1/companies/:id/members/:userId` - Remove member from company

**Status:** Partially implemented. Basic endpoints exist but full CRUD may be missing.

---

## 🔧 Features Needing Backend Support

### 1. File Upload/Download
- **Status:** Not implemented
- **Needed For:** Documents, Task attachments, Handoff attachments
- **Requirements:**
  - Multipart/form-data file upload endpoint
  - File storage (S3, local, etc.)
  - File download endpoints
  - File size limits
  - File type validation

### 2. Real-time Updates
- **Status:** Not implemented
- **Needed For:** Tasks, Notifications, Activity feed, Comments
- **Requirements:**
  - WebSocket or Server-Sent Events (SSE)
  - Real-time task status updates
  - Real-time notifications
  - Live activity feed

### 3. Search Functionality
- **Status:** Not implemented
- **Needed For:** Projects, Tasks, Documents, PRDs, Teams
- **Requirements:**
  - Full-text search endpoints
  - Search filters
  - Search suggestions/autocomplete

### 4. Comments System
- **Status:** Not implemented
- **Needed For:** Tasks, Handoffs, PRDs
- **Requirements:**
  - Comment CRUD endpoints
  - Comment threading
  - Mention users in comments
  - Comment notifications

### 5. Notifications System Enhancement
- **Status:** Basic implementation exists
- **Needed Improvements:**
  - Real-time notifications
  - Notification preferences
  - Email notifications
  - Push notifications (PWA)

### 6. Permissions & Roles
- **Status:** Basic role system exists
- **Needed Improvements:**
  - Fine-grained permissions
  - Project-level permissions
  - Team-level permissions
  - Permission management endpoints

---

## 📊 Priority Recommendations

### High Priority (Core Functionality)
1. **PRD CRUD** - PRD Designer is a key feature but not connected to backend
2. **Handoffs System** - Completely missing, needed for workflow
3. **Document Upload/Download** - File management is essential
4. **Project Update/Delete** - Complete project management
5. **Task Comments** - Collaboration feature

### Medium Priority (Enhanced Features)
1. **CI/CD Integration** - For DevOps dashboard
2. **Analytics Full Implementation** - Complete data structure
3. **Teams Management** - Full team CRUD
4. **Integrations** - Connect external services
5. **Activity Feed** - User engagement

### Low Priority (Nice to Have)
1. **Feedback System** - User feedback collection
2. **Documentation Editor** - If separate from Document Store
3. **Advanced Search** - Enhanced user experience
4. **Real-time Updates** - Performance enhancement

---

## 📝 Notes

- All endpoints should follow the existing API structure: `{ success: true, data: {...}, message: "..." }`
- Authentication is required for all endpoints unless specified
- Response format should be consistent across all endpoints
- Error handling should return proper HTTP status codes
- Consider pagination for list endpoints
- Consider filtering and sorting options for list endpoints

---

## 🧪 Testing Status

### Tested & Working
- ✅ Authentication (Login, Register, Logout)
- ✅ Projects (List, Get, Create)
- ✅ Tasks (List, Create, Update, Delete)
- ✅ Notifications (List, Mark Read)
- ✅ Documents (List, Create)
- ✅ Subscription (Get, Limits)

### Needs Testing
- ⚠️ PRD endpoints (if implemented)
- ⚠️ User profile update
- ⚠️ Password reset flow
- ⚠️ 2FA setup/verification
- ⚠️ Company management

### Not Implemented
- ❌ Handoffs
- ❌ CI/CD
- ❌ Integrations
- ❌ Activity Feed
- ❌ Feedback
- ❌ Teams (full CRUD)

---

**Last Updated:** Based on codebase review on current date
**Next Steps:** Prioritize and implement missing endpoints based on business requirements


