# API Requirements Documentation

This document outlines all API endpoints required by the ZynDrx frontend application.

## Base URL
All endpoints should be prefixed with `/api/v1`

**Example:** `https://your-backend.com/api/v1/auth/login`

---

## Authentication & User Management

### 1. User Registration
**Endpoint:** `POST /api/v1/auth/register`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "fullName": "John Doe",
  "companyName": "Acme Corp" // Workspace/Company name (required)
}
```

**Note:** 
- Backend should create a default company/workspace with the provided name
- User should be added to that company as "admin"
- Role is determined by company membership, not registration

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "developer",
      "avatarUrl": null
    },
    "token": "jwt-token-here"
  },
  "message": "Registration successful"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

---

### 2. User Login
**Endpoint:** `POST /api/v1/auth/login`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "developer",
      "avatarUrl": null
    },
    "token": "jwt-token-here"
  },
  "message": "Login successful"
}
```

**Response (2FA Required):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "require2fa": true
  }
}
```

---

### 3. Google OAuth Login
**Endpoint:** `POST /api/v1/auth/google`  
**Auth Required:** No

**Request Body (Option 1 - Access Token):**
```json
{
  "accessToken": "google-access-token"
}
```

**Request Body (Option 2 - Authorization Code):**
```json
{
  "code": "authorization-code",
  "redirect_uri": "http://localhost:3000/auth/google/callback"
}
```

**Response:** Same as Login endpoint

---

### 4. GitHub OAuth Login
**Endpoint:** `POST /api/v1/auth/github`  
**Auth Required:** No

**Request Body:**
```json
{
  "accessToken": "github-access-token"
}
```

**Response:** Same as Login endpoint

---

### 5. Get Current User
**Endpoint:** `GET /api/v1/auth/me`  
**Auth Required:** Yes (Bearer token)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "developer",
    "avatarUrl": null
  }
}
```

---

### 6. Update User Profile
**Endpoint:** `PUT /api/v1/auth/profile`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe Updated",
    "role": "developer",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
}
```

---

### 7. Forgot Password
**Endpoint:** `POST /api/v1/auth/forgot-password`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 8. Reset Password
**Endpoint:** `POST /api/v1/auth/reset-password`  
**Auth Required:** No

**Request Body:**
```json
{
  "accessToken": "reset-token-from-email",
  "password": "NewPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### 9. Logout
**Endpoint:** `POST /api/v1/auth/logout`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 10. Setup 2FA
**Endpoint:** `POST /api/v1/auth/2fa/setup`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "secret": "2FA-secret-key",
    "qrCode": "data:image/png;base64,..."
  }
}
```

---

### 11. Enable 2FA
**Endpoint:** `POST /api/v1/auth/2fa/enable`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "token": "6-digit-2fa-code"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2FA enabled successfully"
}
```

---

### 12. Verify 2FA
**Endpoint:** `POST /api/v1/auth/2fa/verify`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "6-digit-2fa-code"
}
```

**Response:** Same as Login endpoint

---

## Projects

### 13. Get All Projects
**Endpoint:** `GET /api/v1/projects`  
**Auth Required:** Yes

**Query Parameters:**
- `status` (optional): Filter by status
- `company_id` (optional): Filter by company/workspace

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Project Name",
      "description": "Project description",
      "status": "active",
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": "2024-12-31T00:00:00Z",
      "company_id": "uuid"
    }
  ]
}
```

---

### 14. Get Single Project
**Endpoint:** `GET /api/v1/projects/:id`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Project Name",
    "description": "Project description",
    "status": "active",
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-12-31T00:00:00Z",
    "company_id": "uuid"
  }
}
```

---

### 15. Create Project
**Endpoint:** `POST /api/v1/projects`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "Project Name",
  "description": "Project description",
  "status": "active",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-12-31T00:00:00Z",
  "company_id": "uuid" // Optional if user has default company
}
```

**Response:** Same as Get Single Project

---

## Tasks

### 16. Get Tasks by Project
**Endpoint:** `GET /api/v1/tasks?project_id=:projectId`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Task title",
      "description": "Task description",
      "status": "in_progress", // "todo" | "in_progress" | "in_review" | "completed"
      "priority": "high",
      "project_id": "uuid",
      "assignee_id": "uuid",
      "due_date": "2024-12-31T00:00:00Z"
    }
  ]
}
```

**Note:** Backend uses `in_progress` and `in_review`, frontend normalizes to `in-progress` and `in-review`

---

### 17. Create Task
**Endpoint:** `POST /api/v1/tasks`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description",
  "status": "todo",
  "priority": "high",
  "project_id": "uuid",
  "assignee_id": "uuid",
  "due_date": "2024-12-31T00:00:00Z"
}
```

**Response:** Single task object

---

### 18. Update Task
**Endpoint:** `PATCH /api/v1/tasks/:id`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "title": "Updated title",
  "status": "in_progress",
  "priority": "medium"
}
```

**Response:** Updated task object

---

### 19. Delete Task
**Endpoint:** `DELETE /api/v1/tasks/:id`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Teams & Invitations

### 20. Invite User to Project
**Endpoint:** `POST /api/v1/teams/invite`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "projectId": "uuid",
  "email": "user@example.com",
  "role": "developer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invitation sent successfully"
}
```

---

### 21. Accept Invitation
**Endpoint:** `POST /api/v1/teams/accept-invite`  
**Auth Required:** No (token in body)

**Request Body:**
```json
{
  "token": "invitation-token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invitation accepted"
}
```

---

### 22. Get Project Members
**Endpoint:** `GET /api/v1/teams/:projectId/members`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "developer",
      "avatarUrl": null
    }
  ]
}
```

---

## Notifications

### 23. Get Notifications
**Endpoint:** `GET /api/v1/notifications`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "task_assigned",
      "title": "New task assigned",
      "message": "You have been assigned to a new task",
      "read": false,
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 24. Mark Notification as Read
**Endpoint:** `PATCH /api/v1/notifications/:id/read`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### 25. Mark All Notifications as Read
**Endpoint:** `PATCH /api/v1/notifications/mark-all-read`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Documents

### 26. Get Documents
**Endpoint:** `GET /api/v1/documents?project_id=:projectId`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Document title",
      "file_url": "https://example.com/file.pdf",
      "file_type": "pdf",
      "file_size": 1024000,
      "project_id": "uuid",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 27. Create Document
**Endpoint:** `POST /api/v1/documents`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "project_id": "uuid",
  "title": "Document title",
  "file_url": "https://example.com/file.pdf",
  "file_type": "pdf",
  "file_size": 1024000
}
```

**Response:** Single document object

---

## Analytics

### 28. Get Analytics
**Endpoint:** `GET /api/v1/analytics?project_id=:projectId`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "kpi": {
      "totalTasks": 100,
      "completedTasks": 75,
      "inProgressTasks": 15,
      "pendingTasks": 10
    },
    "projectProgress": [
      {
        "date": "2024-01-01",
        "completed": 10,
        "total": 20
      }
    ],
    "teamPerformance": [
      {
        "memberId": "uuid",
        "name": "John Doe",
        "tasksCompleted": 25,
        "tasksInProgress": 5
      }
    ]
  }
}
```

---

## PRDs (Product Requirements Documents)

### 29. Create PRD
**Endpoint:** `POST /api/v1/prds`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "project_id": "uuid",
  "title": "PRD Title",
  "content": "PRD content in markdown or JSON",
  "version": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "project_id": "uuid",
    "title": "PRD Title",
    "content": "PRD content",
    "version": 1,
    "status": "draft",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 30. Get PRD
**Endpoint:** `GET /api/v1/prds/:id`  
**Auth Required:** Yes

**Response:** Single PRD object

---

### 31. Update PRD Status
**Endpoint:** `PATCH /api/v1/prds/:id/status`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "approved" // "draft" | "in_review" | "approved"
}
```

**Response:** Updated PRD object

---

## Missing APIs (Currently Using Mock Data)

The following features are currently using hardcoded data and need backend APIs:

### Handoffs
- `GET /api/v1/handoffs` - Get all handoffs
- `GET /api/v1/handoffs/:id` - Get single handoff
- `POST /api/v1/handoffs` - Create handoff
- `PATCH /api/v1/handoffs/:id` - Update handoff status
- `POST /api/v1/handoffs/:id/review` - Submit handoff review

### Teams/Workspaces
- `GET /api/v1/teams` - Get all teams (if different from project members)
- `POST /api/v1/teams` - Create team
- `GET /api/v1/teams/:id/members` - Get team members

### Activity Feed
- `GET /api/v1/activity` - Get activity feed
- `GET /api/v1/activity?project_id=:id` - Get project-specific activity

### CI/CD Integration
- `GET /api/v1/ci-cd/pipelines` - Get CI/CD pipelines
- `GET /api/v1/ci-cd/deployments` - Get deployments
- `GET /api/v1/ci-cd/commits` - Get recent commits

### Integrations
- `GET /api/v1/integrations` - Get available integrations
- `POST /api/v1/integrations/:type/connect` - Connect integration (GitHub, Figma, Slack)
- `DELETE /api/v1/integrations/:id` - Disconnect integration

### Feedback
- `GET /api/v1/feedback` - Get feedback items
- `POST /api/v1/feedback` - Submit feedback

---

## Response Format Standards

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Error Response (Multiple Errors)
```json
{
  "success": false,
  "errors": ["Error 1", "Error 2"]
}
```

---

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

---

## Error Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Subscription & Billing

### 23. Get Current Subscription
**Endpoint:** `GET /api/v1/subscription`  
**Auth Required:** Yes

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "plan": {
      "type": "free" | "pro" | "enterprise",
      "name": "Free Plan",
      "status": "active" | "trial" | "expired" | "cancelled",
      "trialEndDate": "2024-02-01T00:00:00Z" | null,
      "currentPeriodEnd": "2024-02-01T00:00:00Z" | null,
      "cancelAtPeriodEnd": false
    },
    "limits": {
      "maxProjects": 3,
      "maxTasks": 50,
      "maxTeamMembers": 5,
      "maxDocuments": 20,
      "maxStorageGB": 1
    },
    "usage": {
      "projectsCount": 2,
      "tasksCount": 15,
      "teamMembersCount": 3,
      "documentsCount": 8,
      "storageUsedGB": 0.5
    }
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

### 24. Get Available Plans
**Endpoint:** `GET /api/v1/plans`  
**Auth Required:** No

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "type": "free",
      "name": "Free Plan",
      "price": 0,
      "billingPeriod": "month",
      "features": [
        "3 projects",
        "50 tasks per project",
        "5 team members",
        "20 documents",
        "1 GB storage",
        "Basic analytics",
        "Email support"
      ],
      "limits": {
        "maxProjects": 3,
        "maxTasks": 50,
        "maxTeamMembers": 5,
        "maxDocuments": 20,
        "maxStorageGB": 1
      },
      "trialDays": 30
    },
    {
      "type": "pro",
      "name": "Pro Plan",
      "price": 29,
      "billingPeriod": "month",
      "features": [
        "Unlimited projects",
        "Unlimited tasks",
        "25 team members",
        "Unlimited documents",
        "50 GB storage",
        "Advanced analytics",
        "Priority support",
        "Custom integrations"
      ],
      "limits": {
        "maxProjects": -1,
        "maxTasks": -1,
        "maxTeamMembers": 25,
        "maxDocuments": -1,
        "maxStorageGB": 50
      }
    },
    {
      "type": "enterprise",
      "name": "Enterprise Plan",
      "price": 99,
      "billingPeriod": "month",
      "features": [
        "Unlimited everything",
        "Unlimited team members",
        "Unlimited storage",
        "Advanced analytics & reporting",
        "Dedicated support",
        "Custom integrations",
        "SSO",
        "Advanced security",
        "Custom SLA"
      ],
      "limits": {
        "maxProjects": -1,
        "maxTasks": -1,
        "maxTeamMembers": -1,
        "maxDocuments": -1,
        "maxStorageGB": -1
      }
    }
  ]
}
```

**Note:** `-1` in limits means unlimited.

---

### 25. Upgrade Subscription
**Endpoint:** `POST /api/v1/subscription/upgrade`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "planType": "pro" | "enterprise",
  "paymentMethodId": "pm_xxxxx" // Stripe payment method ID (optional, can be handled by backend)
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "plan": {
        "type": "pro",
        "name": "Pro Plan",
        "status": "active",
        "currentPeriodEnd": "2024-03-01T00:00:00Z"
      },
      "limits": {
        "maxProjects": -1,
        "maxTasks": -1,
        "maxTeamMembers": 25,
        "maxDocuments": -1,
        "maxStorageGB": 50
      }
    },
    "checkoutUrl": "https://checkout.stripe.com/..." // If payment required
  },
  "message": "Subscription upgraded successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Payment failed" | "Plan limit reached" | "Invalid plan type"
}
```

---

### 26. Cancel Subscription
**Endpoint:** `POST /api/v1/subscription/cancel`  
**Auth Required:** Yes

**Request Body (Optional):**
```json
{
  "cancelImmediately": false // If true, cancel now; if false, cancel at period end
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "plan": {
        "type": "pro",
        "status": "cancelled" | "active", // "active" if cancelAtPeriodEnd
        "cancelAtPeriodEnd": true,
        "currentPeriodEnd": "2024-03-01T00:00:00Z"
      }
    }
  },
  "message": "Subscription will be cancelled at the end of the billing period"
}
```

---

### 27. Check Plan Limits
**Endpoint:** `GET /api/v1/subscription/limits`  
**Auth Required:** Yes

**Query Parameters:**
- `resource`: `projects` | `tasks` | `team_members` | `documents` | `storage` (optional, if not provided returns all)

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "limits": {
      "maxProjects": 3,
      "maxTasks": 50,
      "maxTeamMembers": 5,
      "maxDocuments": 20,
      "maxStorageGB": 1
    },
    "usage": {
      "projectsCount": 2,
      "tasksCount": 15,
      "teamMembersCount": 3,
      "documentsCount": 8,
      "storageUsedGB": 0.5
    },
    "canCreate": {
      "project": true,
      "task": true,
      "teamMember": true,
      "document": true
    }
  }
}
```

**Response (Error - Limit Reached):**
```json
{
  "success": false,
  "error": "Plan limit reached: You have reached the maximum number of projects (3) for your Free plan. Upgrade to Pro to create unlimited projects.",
  "limitType": "projects",
  "currentUsage": 3,
  "maxLimit": 3
}
```

---

## Notes

1. All dates should be in ISO 8601 format: `2024-01-01T00:00:00Z`
2. Task status values: Backend uses `in_progress` and `in_review`, frontend normalizes to `in-progress` and `in-review`
3. All UUIDs should be strings
4. File sizes should be in bytes
5. Pagination (if needed) should use `page` and `limit` query parameters
6. **Subscription Limits:** Backend should check plan limits before allowing resource creation (projects, tasks, team members, documents). Return `403` with appropriate error message if limit is reached.
7. **Trial Period:** New users get 30-day free trial with Free plan limits. After trial expires, they must upgrade to continue using the platform.
8. **Plan Types:** `free` (30-day trial), `pro` ($29/month), `enterprise` ($99/month)

