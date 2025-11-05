# CodexFlow - API Documentation

> Complete REST API reference for CodexFlow platform

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Pagination](#pagination)
6. [Authentication Endpoints](#authentication-endpoints)
7. [User Endpoints](#user-endpoints)
8. [Project Endpoints](#project-endpoints)
9. [Task Endpoints](#task-endpoints)
10. [PRD Endpoints](#prd-endpoints)
11. [AI Endpoints](#ai-endpoints)
12. [Analytics Endpoints](#analytics-endpoints)
13. [Integration Endpoints](#integration-endpoints)
14. [Webhook Events](#webhook-events)

---

## API Overview

### Base URL

```
Production:  https://api.codexflow.io/v1
Staging:     https://api-staging.codexflow.io/v1
Development: https://api-dev.codexflow.io/v1
```

### Content Type

All requests and responses use `application/json` unless otherwise specified.

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer <access_token>
X-Request-ID: <optional-request-id>
```

### Response Format

**Success Response**:
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2025-11-05T12:00:00Z",
    "requestId": "req_abc123xyz"
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-11-05T12:00:00Z",
    "requestId": "req_abc123xyz"
  }
}
```

---

## Authentication

CodexFlow uses **Bearer Token Authentication** with JWT tokens issued by AWS Cognito.

### Obtaining Tokens

1. **Login** to get tokens:
   ```http
   POST /v1/auth/login
   ```

2. Include `access_token` in subsequent requests:
   ```http
   Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Refresh** expired tokens:
   ```http
   POST /v1/auth/refresh
   ```

### Token Types

| Token | Purpose | Expiration |
|-------|---------|------------|
| Access Token | API authorization | 1 hour |
| Refresh Token | Token renewal | 30 days |
| ID Token | User identity | 1 hour |

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content returned |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (duplicate) |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Codes

| Code | Description |
|------|-------------|
| `AUTH_FAILED` | Authentication failed |
| `TOKEN_EXPIRED` | Access token expired |
| `TOKEN_INVALID` | Invalid or malformed token |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Input validation failed |
| `DUPLICATE_ERROR` | Resource already exists |
| `RATE_LIMITED` | Rate limit exceeded |
| `SERVER_ERROR` | Internal server error |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable |

---

## Rate Limiting

### Limits

| Tier | Requests per minute | Burst |
|------|---------------------|-------|
| Free | 60 | 100 |
| Starter | 300 | 500 |
| Growth | 1000 | 2000 |
| Enterprise | Custom | Custom |

### Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1699200000
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded. Please try again later.",
    "retryAfter": 60
  }
}
```

---

## Pagination

### Query Parameters

```http
GET /v1/projects?page=1&limit=20&sort=createdAt:desc
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page (max 100) |
| `sort` | string | createdAt:desc | Sort field and order |

### Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "totalItems": 95,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## Authentication Endpoints

### Register User

Create a new user account.

```http
POST /v1/auth/register
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "role": "developer"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "userId": "usr_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false
  },
  "meta": {
    "message": "Verification email sent"
  }
}
```

---

### Login

Authenticate and receive tokens.

```http
POST /v1/auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIi...",
    "idToken": "eyJraWQiOiJVY...",
    "expiresIn": 3600,
    "tokenType": "Bearer",
    "user": {
      "userId": "usr_abc123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "developer"
    }
  }
}
```

---

### Refresh Token

Refresh an expired access token.

```http
POST /v1/auth/refresh
```

**Request Body**:
```json
{
  "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIi..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

---

### Logout

Invalidate current session.

```http
POST /v1/auth/logout
```

**Response** (204 No Content)

---

### Forgot Password

Request password reset email.

```http
POST /v1/auth/forgot-password
```

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "meta": {
    "message": "Password reset email sent"
  }
}
```

---

### Reset Password

Reset password with verification code.

```http
POST /v1/auth/reset-password
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewSecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "meta": {
    "message": "Password reset successful"
  }
}
```

---

## User Endpoints

### Get Current User

Get authenticated user's profile.

```http
GET /v1/users/me
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "userId": "usr_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "developer",
    "avatar": "https://cdn.codexflow.io/avatars/usr_abc123.jpg",
    "preferences": {
      "theme": "dark",
      "notifications": true,
      "timezone": "America/New_York"
    },
    "createdAt": "2025-11-05T12:00:00Z",
    "updatedAt": "2025-11-05T12:00:00Z"
  }
}
```

---

### Update User Profile

Update authenticated user's profile.

```http
PUT /v1/users/me
```

**Request Body**:
```json
{
  "name": "John Smith",
  "avatar": "https://example.com/avatar.jpg",
  "preferences": {
    "theme": "light",
    "notifications": false
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "userId": "usr_abc123",
    "name": "John Smith",
    ...
  }
}
```

---

### List Users

Get list of users (requires admin role).

```http
GET /v1/users?page=1&limit=20&search=john
```

**Query Parameters**:
- `search` (string): Search by name or email
- `role` (string): Filter by role
- `status` (string): Filter by status (active, inactive)

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "userId": "usr_abc123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "developer",
      "status": "active"
    }
  ],
  "pagination": {...}
}
```

---

### Get User by ID

Get specific user's profile.

```http
GET /v1/users/:userId
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "userId": "usr_abc123",
    "name": "John Doe",
    "role": "developer",
    "avatar": "https://cdn.codexflow.io/avatars/usr_abc123.jpg"
  }
}
```

---

## Project Endpoints

### Create Project

Create a new project.

```http
POST /v1/projects
```

**Request Body**:
```json
{
  "name": "CodexFlow MVP",
  "description": "Minimum viable product for CodexFlow",
  "startDate": "2025-11-03",
  "endDate": "2025-12-15",
  "priority": "high",
  "teamMembers": ["usr_abc123", "usr_def456"],
  "tags": ["mvp", "urgent"]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "projectId": "prj_xyz789",
    "name": "CodexFlow MVP",
    "description": "Minimum viable product for CodexFlow",
    "status": "active",
    "owner": "usr_abc123",
    "startDate": "2025-11-03",
    "endDate": "2025-12-15",
    "priority": "high",
    "teamMembers": [
      {
        "userId": "usr_abc123",
        "name": "John Doe",
        "role": "developer"
      }
    ],
    "metrics": {
      "tasksCompleted": 0,
      "totalTasks": 0,
      "progress": 0
    },
    "createdAt": "2025-11-05T12:00:00Z",
    "updatedAt": "2025-11-05T12:00:00Z"
  }
}
```

---

### List Projects

Get list of projects.

```http
GET /v1/projects?status=active&sort=createdAt:desc
```

**Query Parameters**:
- `status` (string): Filter by status (planning, active, on-hold, completed)
- `priority` (string): Filter by priority (low, medium, high, critical)
- `owner` (string): Filter by owner ID
- `search` (string): Search by name or description

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "projectId": "prj_xyz789",
      "name": "CodexFlow MVP",
      "status": "active",
      "priority": "high",
      "progress": 45,
      "owner": {
        "userId": "usr_abc123",
        "name": "John Doe"
      },
      "teamSize": 5,
      "dueDate": "2025-12-15",
      "createdAt": "2025-11-05T12:00:00Z"
    }
  ],
  "pagination": {...}
}
```

---

### Get Project

Get project details.

```http
GET /v1/projects/:projectId
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "projectId": "prj_xyz789",
    "name": "CodexFlow MVP",
    "description": "Minimum viable product for CodexFlow",
    "status": "active",
    "priority": "high",
    "owner": {
      "userId": "usr_abc123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "teamMembers": [...],
    "startDate": "2025-11-03",
    "endDate": "2025-12-15",
    "metrics": {
      "tasksCompleted": 25,
      "totalTasks": 50,
      "progress": 50,
      "velocity": 8.5
    },
    "tags": ["mvp", "urgent"],
    "createdAt": "2025-11-05T12:00:00Z",
    "updatedAt": "2025-11-05T12:00:00Z"
  }
}
```

---

### Update Project

Update project details.

```http
PUT /v1/projects/:projectId
```

**Request Body**:
```json
{
  "name": "CodexFlow MVP - Phase 1",
  "status": "on-hold",
  "endDate": "2025-12-20"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "projectId": "prj_xyz789",
    "name": "CodexFlow MVP - Phase 1",
    ...
  }
}
```

---

### Delete Project

Delete a project (soft delete).

```http
DELETE /v1/projects/:projectId
```

**Response** (204 No Content)

---

### Get Project Analytics

Get project analytics and insights.

```http
GET /v1/projects/:projectId/analytics
```

**Query Parameters**:
- `startDate` (string): Start date for analytics (ISO 8601)
- `endDate` (string): End date for analytics (ISO 8601)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "projectId": "prj_xyz789",
    "period": {
      "start": "2025-11-01",
      "end": "2025-11-30"
    },
    "summary": {
      "tasksCompleted": 25,
      "totalTasks": 50,
      "velocity": 8.5,
      "averageCompletionTime": 3.2,
      "onTimeDelivery": 0.88
    },
    "tasksByStatus": {
      "todo": 10,
      "in-progress": 15,
      "review": 8,
      "done": 25
    },
    "tasksByPriority": {
      "low": 5,
      "medium": 20,
      "high": 15,
      "critical": 10
    },
    "teamPerformance": [
      {
        "userId": "usr_abc123",
        "name": "John Doe",
        "tasksCompleted": 12,
        "hoursLogged": 96,
        "efficiency": 0.92
      }
    ],
    "velocityTrend": [
      { "week": "2025-W44", "velocity": 7.5 },
      { "week": "2025-W45", "velocity": 8.5 }
    ]
  }
}
```

---

## Task Endpoints

### Create Task

Create a new task.

```http
POST /v1/tasks
```

**Request Body**:
```json
{
  "projectId": "prj_xyz789",
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication using AWS Cognito",
  "assignee": "usr_abc123",
  "priority": "high",
  "status": "todo",
  "estimatedHours": 8,
  "dueDate": "2025-11-10",
  "labels": ["backend", "security"],
  "dependencies": []
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "taskId": "tsk_123abc",
    "projectId": "prj_xyz789",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication using AWS Cognito",
    "status": "todo",
    "priority": "high",
    "assignee": {
      "userId": "usr_abc123",
      "name": "John Doe"
    },
    "reporter": {
      "userId": "usr_def456",
      "name": "Jane Smith"
    },
    "estimatedHours": 8,
    "actualHours": 0,
    "dueDate": "2025-11-10",
    "labels": ["backend", "security"],
    "dependencies": [],
    "createdAt": "2025-11-05T12:00:00Z",
    "updatedAt": "2025-11-05T12:00:00Z"
  }
}
```

---

### List Tasks

Get list of tasks.

```http
GET /v1/tasks?projectId=prj_xyz789&status=in-progress&assignee=usr_abc123
```

**Query Parameters**:
- `projectId` (string): Filter by project
- `assignee` (string): Filter by assignee
- `status` (string): Filter by status
- `priority` (string): Filter by priority
- `labels` (string): Filter by labels (comma-separated)
- `dueDate` (string): Filter by due date (lt, gt, eq operators)

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "taskId": "tsk_123abc",
      "title": "Implement user authentication",
      "status": "in-progress",
      "priority": "high",
      "assignee": {
        "userId": "usr_abc123",
        "name": "John Doe",
        "avatar": "..."
      },
      "dueDate": "2025-11-10",
      "progress": 60,
      "createdAt": "2025-11-05T12:00:00Z"
    }
  ],
  "pagination": {...}
}
```

---

### Get Task

Get task details.

```http
GET /v1/tasks/:taskId
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "taskId": "tsk_123abc",
    "projectId": "prj_xyz789",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication using AWS Cognito",
    "status": "in-progress",
    "priority": "high",
    "assignee": {...},
    "reporter": {...},
    "estimatedHours": 8,
    "actualHours": 5.5,
    "dueDate": "2025-11-10",
    "labels": ["backend", "security"],
    "dependencies": [],
    "subtasks": [
      {
        "id": "sub_001",
        "title": "Setup Cognito User Pool",
        "completed": true
      }
    ],
    "attachments": [
      {
        "id": "att_001",
        "filename": "auth-flow.png",
        "url": "https://cdn.codexflow.io/attachments/att_001.png",
        "size": 125000,
        "uploadedBy": "usr_abc123",
        "uploadedAt": "2025-11-05T13:00:00Z"
      }
    ],
    "comments": [
      {
        "id": "cmt_001",
        "author": {
          "userId": "usr_abc123",
          "name": "John Doe"
        },
        "text": "Started implementation",
        "createdAt": "2025-11-05T14:00:00Z"
      }
    ],
    "activityLog": [...],
    "createdAt": "2025-11-05T12:00:00Z",
    "updatedAt": "2025-11-05T15:30:00Z"
  }
}
```

---

### Update Task

Update task details.

```http
PUT /v1/tasks/:taskId
```

**Request Body**:
```json
{
  "status": "review",
  "actualHours": 7.5,
  "assignee": "usr_def456"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "taskId": "tsk_123abc",
    "status": "review",
    "actualHours": 7.5,
    ...
  }
}
```

---

### Update Task Status

Quick status update.

```http
PATCH /v1/tasks/:taskId/status
```

**Request Body**:
```json
{
  "status": "done"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "taskId": "tsk_123abc",
    "status": "done",
    "completedAt": "2025-11-05T16:00:00Z"
  }
}
```

---

### Add Task Comment

Add comment to task.

```http
POST /v1/tasks/:taskId/comments
```

**Request Body**:
```json
{
  "text": "Completed authentication flow. Ready for review.",
  "mentions": ["usr_def456"]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "commentId": "cmt_002",
    "taskId": "tsk_123abc",
    "author": {
      "userId": "usr_abc123",
      "name": "John Doe"
    },
    "text": "Completed authentication flow. Ready for review.",
    "mentions": ["usr_def456"],
    "createdAt": "2025-11-05T16:00:00Z"
  }
}
```

---

### Delete Task

Delete a task.

```http
DELETE /v1/tasks/:taskId
```

**Response** (204 No Content)

---

## PRD Endpoints

### Create PRD

Create a Product Requirement Document.

```http
POST /v1/prds
```

**Request Body**:
```json
{
  "projectId": "prj_xyz789",
  "title": "User Authentication Requirements",
  "content": {
    "overview": "Implement secure user authentication...",
    "objectives": ["Enable user login", "Secure API endpoints"],
    "requirements": {
      "functional": ["JWT-based auth", "OAuth support"],
      "nonFunctional": ["99.9% uptime", "< 200ms latency"]
    },
    "userStories": [
      {
        "id": "US-001",
        "description": "As a user, I want to log in...",
        "acceptanceCriteria": ["Valid credentials accepted"]
      }
    ]
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "prdId": "prd_abc123",
    "projectId": "prj_xyz789",
    "version": 1,
    "title": "User Authentication Requirements",
    "content": {...},
    "approvalStatus": "draft",
    "createdBy": "usr_abc123",
    "createdAt": "2025-11-05T12:00:00Z"
  }
}
```

---

### Generate PRD with AI

Generate PRD using AI.

```http
POST /v1/prds/generate
```

**Request Body**:
```json
{
  "projectType": "web-app",
  "description": "A project management tool for development teams",
  "features": ["task tracking", "team collaboration", "analytics"],
  "constraints": {
    "timeline": "6 weeks",
    "budget": "$50,000",
    "teamSize": 5
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "title": "Project Management Tool - Requirements",
    "content": {
      "overview": "...",
      "objectives": [...],
      "requirements": {...},
      "userStories": [...],
      "technicalSpecs": {...},
      "timeline": {...}
    },
    "aiGenerated": true,
    "confidence": 0.92
  }
}
```

---

## AI Endpoints

### Get AI Insights

Get AI-powered insights for a project.

```http
POST /v1/ai/insights
```

**Request Body**:
```json
{
  "projectId": "prj_xyz789",
  "analysisType": "risk" // or "bottleneck", "optimization", "prediction"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "projectId": "prj_xyz789",
    "analysisType": "risk",
    "insights": [
      {
        "type": "high_risk_task",
        "taskId": "tsk_123abc",
        "riskScore": 0.85,
        "factors": [
          "Complex implementation",
          "Tight deadline",
          "Single assignee"
        ],
        "recommendations": [
          "Add additional developer",
          "Extend deadline by 2 days",
          "Break into smaller subtasks"
        ]
      }
    ],
    "overallRiskScore": 0.65,
    "confidence": 0.88,
    "generatedAt": "2025-11-05T12:00:00Z"
  }
}
```

---

### Analyze Task Risk

Analyze risk for a specific task.

```http
POST /v1/ai/risk-analysis
```

**Request Body**:
```json
{
  "taskId": "tsk_123abc"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "taskId": "tsk_123abc",
    "riskScore": 0.75,
    "riskLevel": "high",
    "factors": [
      {
        "factor": "complexity",
        "score": 0.9,
        "weight": 0.3
      },
      {
        "factor": "timeline",
        "score": 0.7,
        "weight": 0.25
      }
    ],
    "recommendations": [
      "Consider breaking into smaller tasks",
      "Assign a senior developer",
      "Add buffer time"
    ],
    "confidence": 0.87
  }
}
```

---

### Get Smart Suggestions

Get AI suggestions for task improvements.

```http
POST /v1/ai/suggestions
```

**Request Body**:
```json
{
  "projectId": "prj_xyz789",
  "context": "task_creation"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "missing_task",
        "title": "Setup CI/CD pipeline",
        "description": "Automated deployment is missing from the project",
        "priority": "high",
        "estimatedHours": 4,
        "confidence": 0.91
      },
      {
        "type": "dependency",
        "taskId": "tsk_123abc",
        "suggestedDependency": "tsk_456def",
        "reason": "Authentication must be completed before API endpoints"
      }
    ]
  }
}
```

---

## Analytics Endpoints

### Get Dashboard Metrics

Get overview metrics for dashboard.

```http
GET /v1/analytics/dashboard
```

**Query Parameters**:
- `period` (string): Time period (7d, 30d, 90d, 1y)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "metrics": {
      "activeProjects": 5,
      "totalTasks": 150,
      "completedTasks": 75,
      "teamVelocity": 8.5,
      "averageCompletionTime": 3.2,
      "onTimeDelivery": 0.88
    },
    "trends": {
      "velocityChange": 0.15,
      "productivityChange": 0.10
    },
    "upcomingDeadlines": [
      {
        "taskId": "tsk_123abc",
        "title": "Implement authentication",
        "dueDate": "2025-11-10",
        "daysRemaining": 5
      }
    ]
  }
}
```

---

### Get Team Analytics

Get team performance analytics.

```http
GET /v1/analytics/team
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "teamSize": 10,
    "metrics": {
      "totalTasksCompleted": 250,
      "averageVelocity": 8.5,
      "utilizationRate": 0.85
    },
    "members": [
      {
        "userId": "usr_abc123",
        "name": "John Doe",
        "role": "developer",
        "tasksCompleted": 35,
        "hoursLogged": 160,
        "velocity": 9.2,
        "efficiency": 0.92
      }
    ],
    "collaborationMetrics": {
      "communicationFrequency": 0.85,
      "pairProgrammingHours": 40
    }
  }
}
```

---

## Integration Endpoints

### GitHub Webhook

Receive GitHub webhook events.

```http
POST /v1/integrations/github/webhook
```

**Headers**:
```http
X-GitHub-Event: push
X-Hub-Signature-256: sha256=...
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "processed": true,
    "tasksUpdated": ["tsk_123abc"]
  }
}
```

---

### Slack Integration

Handle Slack commands and interactions.

```http
POST /v1/integrations/slack/webhook
```

**Request Body** (Slack payload):
```json
{
  "type": "slash_command",
  "command": "/codexflow",
  "text": "tasks",
  "user_id": "U123ABC",
  "team_id": "T456DEF"
}
```

**Response** (200 OK):
```json
{
  "response_type": "in_channel",
  "text": "Your Tasks",
  "attachments": [...]
}
```

---

## Webhook Events

CodexFlow can send webhook events to your server.

### Configure Webhook

```http
POST /v1/webhooks
```

**Request Body**:
```json
{
  "url": "https://your-server.com/webhooks/codexflow",
  "events": ["task.created", "task.updated", "project.completed"],
  "secret": "your_webhook_secret"
}
```

### Event Types

| Event | Description |
|-------|-------------|
| `task.created` | Task was created |
| `task.updated` | Task was updated |
| `task.deleted` | Task was deleted |
| `task.completed` | Task marked as done |
| `project.created` | Project was created |
| `project.updated` | Project was updated |
| `project.completed` | Project completed |
| `comment.created` | Comment added |
| `user.invited` | User invited to project |

### Webhook Payload

```json
{
  "event": "task.completed",
  "timestamp": "2025-11-05T16:00:00Z",
  "data": {
    "taskId": "tsk_123abc",
    "projectId": "prj_xyz789",
    "completedBy": "usr_abc123",
    "completedAt": "2025-11-05T16:00:00Z"
  },
  "signature": "sha256=..."
}
```

### Verifying Webhooks

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import { CodexFlowClient } from '@codexflow/sdk';

const client = new CodexFlowClient({
  apiKey: process.env.CODEXFLOW_API_KEY,
  baseURL: 'https://api.codexflow.io/v1',
});

// Create a project
const project = await client.projects.create({
  name: 'My Project',
  description: 'Project description',
});

// Create a task
const task = await client.tasks.create({
  projectId: project.id,
  title: 'Implement feature',
  assignee: 'usr_abc123',
});

// Get AI insights
const insights = await client.ai.getInsights({
  projectId: project.id,
  analysisType: 'risk',
});
```

### Python

```python
from codexflow import CodexFlowClient

client = CodexFlowClient(
    api_key=os.environ['CODEXFLOW_API_KEY'],
    base_url='https://api.codexflow.io/v1'
)

# Create a project
project = client.projects.create(
    name='My Project',
    description='Project description'
)

# Create a task
task = client.tasks.create(
    project_id=project.id,
    title='Implement feature',
    assignee='usr_abc123'
)

# Get AI insights
insights = client.ai.get_insights(
    project_id=project.id,
    analysis_type='risk'
)
```

---

## Rate Limits & Best Practices

### Best Practices

1. **Cache responses** when possible
2. **Use pagination** for large datasets
3. **Implement exponential backoff** for retries
4. **Handle errors gracefully**
5. **Validate input** before sending requests
6. **Use webhooks** instead of polling
7. **Keep access tokens secure**
8. **Monitor your usage**

### Example: Retry with Exponential Backoff

```typescript
async function requestWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 || error.status >= 500) {
        const delay = Math.min(1000 * Math.pow(2, i), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Support

### API Status

Check API status at: [https://status.codexflow.io](https://status.codexflow.io)

### Help & Documentation

- **Full Docs**: https://docs.codexflow.io
- **API Reference**: https://api-docs.codexflow.io
- **SDK Docs**: https://sdk.codexflow.io
- **Support Email**: api-support@codexflow.io
- **Community Forum**: https://community.codexflow.io

---

**API Version**: v1  
**Document Version**: 1.0.0  
**Last Updated**: November 5, 2025  
**Maintained By**: CodexFlow API Team
