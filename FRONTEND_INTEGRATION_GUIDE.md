# Frontend Integration Guide

This guide will help you integrate your frontend application with the Zyndrx backend API.

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Authentication](#authentication)
3. [API Client Setup](#api-client-setup)
4. [Multi-Company/Workspace Context](#multi-companyworkspace-context)
5. [Subscription & Plan Limits](#subscription--plan-limits)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Error Handling](#error-handling)
8. [Common Integration Patterns](#common-integration-patterns)
9. [Code Examples](#code-examples)

---

## Base Configuration

### Base URL

```
Development: http://localhost:5000/api/v1
Production: https://your-backend-domain.com/api/v1
```

### Content-Type

All requests must include:
```
Content-Type: application/json
```

### Authentication Header

For protected endpoints:
```
Authorization: Bearer <jwt-token>
```

**Note:** The JWT token includes `companyId` in its payload. The backend automatically filters all data by the company ID from the token. No additional headers are needed.

### Environment Variables

Create a `.env` file in your frontend project root:

```env
# Backend API URL (REQUIRED)
REACT_APP_API_URL=http://localhost:5000/api/v1
# or for production:
# REACT_APP_API_URL=https://your-backend-domain.com/api/v1

# OAuth Configuration (OPTIONAL - only if using OAuth)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id

# Optional: Frontend URL for OAuth callbacks
REACT_APP_FRONTEND_URL=http://localhost:3000
```

**Note:** For Next.js, use `NEXT_PUBLIC_` prefix instead of `REACT_APP_`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

**Required Environment Variables:**
- `REACT_APP_API_URL` or `NEXT_PUBLIC_API_URL` - **REQUIRED** - Backend API base URL (should include `/api/v1`)

**Optional Environment Variables:**
- `REACT_APP_GOOGLE_CLIENT_ID` - Only needed if implementing Google OAuth
- `REACT_APP_GITHUB_CLIENT_ID` - Only needed if implementing GitHub OAuth
- `REACT_APP_FRONTEND_URL` - Only needed for OAuth callback URLs

---

## Authentication

### 1. User Registration

**Endpoint:** `POST /api/v1/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "fullName": "John Doe",
  "companyName": "Acme Corp"  // Required: Creates default workspace
}
```

**Response:**
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

**Important Notes:**
- `companyName` is **required** - it creates the user's default workspace
- User is automatically added as "admin" of the created company
- A free subscription with 30-day trial is automatically created
- Store the `token` in localStorage/sessionStorage
- After registration, you may need to fetch companies separately: `GET /api/v1/auth/companies`

### 2. User Login

**Endpoint:** `POST /api/v1/auth/login`

**Request:**
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
    "user": { /* user object */ },
    "token": "jwt-token-here"
  }
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

### 3. Get Current User

**Endpoint:** `GET /api/v1/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

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

### 4. OAuth Authentication

#### Google OAuth

**Option 1: Direct Access Token**
```javascript
POST /api/v1/auth/google
{
  "accessToken": "google-access-token-from-client"
}
```

**Option 2: Authorization Code Exchange (Recommended)**
```javascript
POST /api/v1/auth/google
{
  "code": "authorization-code",
  "redirect_uri": "http://localhost:3000/auth/google/callback"
}
```

#### GitHub OAuth

```javascript
POST /api/v1/auth/github
{
  "accessToken": "github-access-token-from-client"
}
```

**Response:** Same format as login response

---

## API Client Setup

### Option 1: Modular/Functional Approach (Recommended for React)

This is the approach used in the current Zyndrx frontend implementation:

```javascript
// api/client.js - Base API client
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const getAuthHeader = () => {
  const token = localStorage.getItem('zyndrx_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiRequest = async (path, { method = 'GET', body, headers = {}, auth = true } = {}) => {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? getAuthHeader() : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    if (response.status === 401) {
      localStorage.removeItem('zyndrx_token');
      window.location.href = '/login';
    }
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
};

export const api = {
  get: (path, options = {}) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => apiRequest(path, { ...options, method: 'POST', body }),
  patch: (path, body, options = {}) => apiRequest(path, { ...options, method: 'PATCH', body }),
  put: (path, body, options = {}) => apiRequest(path, { ...options, method: 'PUT', body }),
  delete: (path, options = {}) => apiRequest(path, { ...options, method: 'DELETE' }),
};
```

```javascript
// api/auth.js - Auth-specific methods
import { api } from './client';

export const register = (payload) => api.post('/auth/register', payload, { auth: false });
export const login = (credentials) => api.post('/auth/login', credentials, { auth: false });
export const getCurrentUser = () => api.get('/auth/me');
export const updateProfile = (updates) => api.put('/auth/profile', updates);
export const logout = () => api.post('/auth/logout');
export const getUserCompanies = () => api.get('/auth/companies');
export const switchCompany = (companyId) => api.post('/auth/switch-company', { companyId });
```

### Option 2: Class-Based Approach (Alternative)

```typescript
// api/client.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadFromStorage();
  }

  private loadFromStorage() {
    this.token = localStorage.getItem('zyndrx_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('zyndrx_token', token);
  }

  clearAuth() {
    this.token = null;
    localStorage.removeItem('zyndrx_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      if (response.status === 401) {
        this.clearAuth();
        window.location.href = '/login';
      }
      throw new ApiError(data.error || 'Request failed', response.status, data);
    }

    return data;
  }

  // Auth methods
  async register(data: RegisterData) {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request<User>('/auth/me');
  }

  async switchCompany(companyId: string) {
    const response = await this.request<SwitchCompanyResponse>('/auth/switch-company', {
      method: 'POST',
      body: JSON.stringify({ companyId }),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

**Recommendation:** Use the modular approach for React applications as it's simpler, easier to tree-shake, and works well with React Context. Use the class-based approach if you prefer OOP or need more centralized state management.

---

## Multi-Company/Workspace Context

### Understanding Company Context

- Users can belong to **multiple companies/workspaces**
- Each company has **isolated data** (projects, tasks, documents)
- The JWT token includes the **current active company ID**
- Users can **switch between companies**
- Backend automatically filters all queries by the `companyId` from the JWT token

### LocalStorage Keys

Store company context using these keys:
- `zyndrx_token` - JWT token (contains companyId)
- `zyndrx_user` - User object (optional)
- `zyndrx_company` - Current company ID (optional, for quick access)

### Company Switching Flow

```javascript
// 1. Get user's companies
const response = await api.get('/auth/companies');
const companies = response.data || response;

// 2. Switch company
const switchResponse = await api.post('/auth/switch-company', { companyId: selectedCompanyId });

// 3. Update token and reload data
if (switchResponse.success) {
  // Token is automatically updated in response
  const newToken = switchResponse.data.token;
  localStorage.setItem('zyndrx_token', newToken);
  
  // Reload all company-specific data
  await loadProjects();
  await loadTasks();
  await loadNotifications();
}
```

**Important:** Use `companyId` (camelCase) in the request body, not `company_id` (snake_case).

### React Context Usage (Recommended for React Apps)

```javascript
// context/CompanyContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserCompanies, switchCompany as apiSwitchCompany } from '../api/auth';

const CompanyContext = createContext(null);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await getUserCompanies();
      const companiesList = response.data || response;
      setCompanies(Array.isArray(companiesList) ? companiesList : []);
      
      // Load saved company or default to first
      const savedCompanyId = localStorage.getItem('zyndrx_company');
      const company = companiesList.find(c => c.id === savedCompanyId) || companiesList[0];
      setCurrentCompany(company);
    } catch (error) {
      console.error('Failed to load companies', error);
    } finally {
      setLoading(false);
    }
  };

  const switchCompany = async (companyId) => {
    try {
      const response = await apiSwitchCompany(companyId);
      if (response.success) {
        // Update token
        if (response.data.token) {
          localStorage.setItem('zyndrx_token', response.data.token);
        }
        
        // Update current company
        const company = response.data.company || companies.find(c => c.id === companyId);
        setCurrentCompany(company);
        localStorage.setItem('zyndrx_company', company.id);
        
        // Reload all data for new company
        window.location.reload(); // Or use state management to reload
      }
    } catch (error) {
      console.error('Failed to switch company', error);
      throw error;
    }
  };

  return (
    <CompanyContext.Provider value={{ currentCompany, companies, loading, switchCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};
```

### Company Switcher Component Example

```javascript
// components/CompanySwitcher.jsx
import { useCompany } from '../context/CompanyContext';

export const CompanySwitcher = () => {
  const { companies, currentCompany, switchCompany, loading } = useCompany();

  if (loading || companies.length <= 1) return null;

  return (
    <select
      value={currentCompany?.id || ''}
      onChange={(e) => switchCompany(e.target.value)}
    >
      {companies.map(company => (
        <option key={company.id} value={company.id}>
          {company.name}
        </option>
      ))}
    </select>
  );
};
```

---

## Subscription & Plan Limits

### Understanding Plan Limits

The backend enforces plan limits before allowing resource creation:

- **Free Plan (30-day trial):** 3 projects, 50 tasks, 5 team members, 20 documents, 1 GB storage
- **Pro Plan ($29/month):** Unlimited projects/tasks/documents, 25 team members, 50 GB storage
- **Enterprise Plan ($99/month):** Unlimited everything

### Getting Subscription Information

```javascript
// Get current subscription
const response = await api.get('/subscription');
const { plan, limits, usage } = response.data;

// plan: { type, name, status, trialEndDate, ... }
// limits: { maxProjects, maxTasks, maxTeamMembers, ... }
// usage: { projectsCount, tasksCount, teamMembersCount, ... }
```

### Checking Limits Before Creation

```javascript
// Before creating a project
const limitsResponse = await api.get('/subscription/limits?resource=project');
const { limits, usage, canCreate } = limitsResponse.data;

if (!canCreate.project) {
  // Show upgrade prompt
  showUpgradeModal('projects');
  return;
}

// Create project
await api.post('/projects', projectData);
```

### Handling Limit Errors

```javascript
try {
  await api.post('/projects', projectData);
} catch (error) {
  if (error.status === 403) {
    // Plan limit reached
    const message = error.data?.error || 'Plan limit reached';
    showUpgradePrompt(message);
  } else {
    // Other error
    showError(error.message);
  }
}
```

### Subscription Status Component Example

```javascript
// components/SubscriptionStatus.jsx
import { useState, useEffect } from 'react';
import { api } from '../api/client';

export const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await api.get('/subscription');
      if (response.success) {
        setSubscription(response.data);
      }
    } catch (error) {
      console.error('Failed to load subscription', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!subscription) return null;

  const { plan, limits, usage } = subscription;

  return (
    <div>
      <h3>Current Plan: {plan.name}</h3>
      <p>Status: {plan.status}</p>
      
      {plan.status === 'trial' && plan.trialEndDate && (
        <p>
          Trial ends: {new Date(plan.trialEndDate).toLocaleDateString()}
        </p>
      )}

      <div>
        <h4>Usage</h4>
        <p>Projects: {usage.projectsCount} / {limits.maxProjects === -1 ? '∞' : limits.maxProjects}</p>
        <p>Tasks: {usage.tasksCount} / {limits.maxTasks === -1 ? '∞' : limits.maxTasks}</p>
        <p>Team Members: {usage.teamMembersCount} / {limits.maxTeamMembers === -1 ? '∞' : limits.maxTeamMembers}</p>
      </div>

      {plan.status === 'trial' && (
        <button onClick={() => showUpgradeModal()}>
          Upgrade Now
        </button>
      )}
    </div>
  );
};
```

---

## API Endpoints Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login user |
| GET | `/auth/me` | Yes | Get current user |
| PUT | `/auth/profile` | Yes | Update profile |
| POST | `/auth/logout` | Yes | Logout |
| POST | `/auth/google` | No | Google OAuth |
| POST | `/auth/github` | No | GitHub OAuth |
| GET | `/auth/companies` | Yes | Get user's companies |
| POST | `/auth/switch-company` | Yes | Switch active company |

### Companies

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/companies` | Yes | Get user's companies (alias for `/auth/companies`) |
| POST | `/companies` | Yes | Create company |
| GET | `/companies/:id` | Yes | Get company details |
| POST | `/companies/:id/invite` | Yes | Invite user to company |
| POST | `/companies/accept-invite` | No | Accept invitation |
| PATCH | `/companies/:id/members/:userId` | Yes | Update member role |
| DELETE | `/companies/:id/members/:userId` | Yes | Remove member |

### Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/projects` | Yes | Get all projects |
| GET | `/projects/:id` | Yes | Get project details |
| POST | `/projects` | Yes | Create project |
| PATCH | `/projects/:id` | Yes | Update project |
| DELETE | `/projects/:id` | Yes | Delete project |

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tasks?project_id=:id` | Yes | Get tasks by project |
| POST | `/tasks` | Yes | Create task |
| PATCH | `/tasks/:id` | Yes | Update task |
| DELETE | `/tasks/:id` | Yes | Delete task |

**Note:** Task status values - Backend uses: `todo`, `in_progress`, `in_review`, `completed`. Frontend can normalize between `in-progress` ↔ `in_progress` and `in-review` ↔ `in_review`.

### Documents

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/documents?project_id=:id` | Yes | Get documents |
| POST | `/documents` | Yes | Create document |
| DELETE | `/documents/:id` | Yes | Delete document |

### Subscriptions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/subscription` | Yes | Get current subscription |
| GET | `/subscription/limits` | Yes | Check limits and usage |
| POST | `/subscription/upgrade` | Yes | Upgrade subscription |
| POST | `/subscription/cancel` | Yes | Cancel subscription |
| GET | `/plans` | No | Get available plans |

**Response Format:**
```json
{
  "success": true,
  "data": {
    "plan": { "type", "name", "status", "trialEndDate", ... },
    "limits": { "maxProjects", "maxTasks", "maxTeamMembers", ... },
    "usage": { "projectsCount", "tasksCount", "teamMembersCount", ... }
  }
}
```

### Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | Yes | Get notifications |
| PATCH | `/notifications/:id/read` | Yes | Mark as read |
| PATCH | `/notifications/mark-all-read` | Yes | Mark all as read |

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Error with Additional Data

```json
{
  "success": false,
  "error": "Plan limit reached",
  "limitType": "projects",
  "currentUsage": 3,
  "maxLimit": 3
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid/missing token) - Redirect to login
- `403` - Forbidden (plan limit, permission denied) - Show upgrade prompt
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

### Error Handling Example

```javascript
async function handleApiCall(apiCall) {
  try {
    const data = await apiCall();
    return { data, error: null };
  } catch (error) {
    // Handle specific error types
    if (error.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('zyndrx_token');
      window.location.href = '/login';
      return { data: null, error: 'Session expired. Please login again.' };
    } else if (error.status === 403) {
      // Plan limit or permission denied
      return { data: null, error: error.message };
    } else if (error.status === 404) {
      return { data: null, error: 'Resource not found' };
    }
    
    return { data: null, error: error.message || 'An unexpected error occurred' };
  }
}
```

---

## Common Integration Patterns

### 1. Protected Route Wrapper

```javascript
// components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/auth';

export const ProtectedRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getCurrentUser();
      if (response.success || response.id) {
        setAuthenticated(true);
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return null;

  return children;
};
```

### 2. Data Fetching Hook

```javascript
// hooks/useProjects.js
import { useState, useEffect } from 'react';
import { api } from '../api/client';

export const useProjects = (filters = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProjects();
  }, [filters.status, filters.team_name]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.team_name) params.append('team_name', filters.team_name);
      
      const query = params.toString();
      const response = await api.get(`/projects${query ? `?${query}` : ''}`);
      
      setProjects(response.data || response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { projects, loading, error, refetch: loadProjects };
};
```

### 3. Form Submission with Error Handling

```javascript
// components/CreateProjectForm.jsx
import { useState } from 'react';
import { api } from '../api/client';

export const CreateProjectForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    team_name: 'Engineering',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check limits first
      const limitsResponse = await api.get('/subscription/limits?resource=project');
      if (!limitsResponse.data.canCreate.project) {
        setError('Plan limit reached. Please upgrade to create more projects.');
        setLoading(false);
        return;
      }

      const response = await api.post('/projects', formData);
      if (response.success) {
        onSuccess(response.data);
        // Reset form
        setFormData({
          name: '',
          description: '',
          start_date: '',
          end_date: '',
          team_name: 'Engineering',
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
};
```

---

## Code Examples

### Complete Registration Flow

```javascript
// pages/Register.jsx
import { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await register(formData);
      if (response.success) {
        // Store token
        if (response.data.token) {
          localStorage.setItem('zyndrx_token', response.data.token);
        }
        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Company/Workspace Name"
        value={formData.companyName}
        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};
```

### Task Management Example

```javascript
// components/TaskList.jsx
import { useState, useEffect } from 'react';
import { api } from '../api/client';

export const TaskList = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const loadTasks = async () => {
    try {
      const response = await api.get(`/tasks?project_id=${projectId}`);
      setTasks(response.data || response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, { status: newStatus });
      // Update local state
      setTasks(tasks.map(t => t.id === taskId ? response.data : t));
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>Status: {task.status}</p>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(task.id, e.target.value)}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      ))}
    </div>
  );
};
```

---

## Important Notes

### 1. Company Context is Critical

- **Always** ensure company context is set before making data requests
- The JWT token includes `companyId` - backend automatically filters by company
- When switching companies, **reload all data** to reflect the new company's data
- Use `companyId` (camelCase) in request bodies, not `company_id` (snake_case)

### 2. Plan Limits

- Backend **enforces limits** before resource creation
- Always check limits before showing create buttons/forms
- Show upgrade prompts when limits are reached
- Trial period: 30 days for new users on Free plan
- Use `GET /subscription/limits` to check limits before creation

### 3. Task Status Values

- Backend uses: `todo`, `in_progress`, `in_review`, `completed`
- Frontend can normalize: `in-progress` ↔ `in_progress`, `in-review` ↔ `in_review`
- API accepts both formats, but backend stores as `in_progress` and `in_review`

### 4. Date Formats

- All dates should be in **ISO 8601 format**: `2024-01-01T00:00:00Z`
- Use `new Date().toISOString()` for current timestamp

### 5. Error Handling

- Always handle 401 errors (unauthorized) - redirect to login
- Handle 403 errors (forbidden) - show appropriate message (plan limit, permission)
- Handle 404 errors (not found) - show not found message
- Always show user-friendly error messages
- Check `data.success === false` even for 200 status codes

### 6. Token Management

- Store token in `localStorage` or `sessionStorage`
- Include token in `Authorization` header for all protected requests
- Clear token on logout
- Handle token expiration (401 response)
- JWT token includes `companyId` - no need for additional headers

### 7. Response Format

- All successful responses: `{ success: true, data: {...}, message?: "..." }`
- All error responses: `{ success: false, error: "message" }`
- Some endpoints may return data directly (for backward compatibility)
- Always check for `response.success` or `response.data` depending on endpoint

---

## Support

For questions or issues:
- Check the API documentation (`API_REQUIREMENTS.md`)
- Review error messages carefully
- Ensure company context is set correctly
- Verify plan limits before resource creation
- Check that JWT token includes `companyId`

---

**Last Updated:** 2024-01-XX  
**API Version:** v1






