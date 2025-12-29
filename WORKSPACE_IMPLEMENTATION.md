# Workspace Model Implementation Summary

## What Was Implemented

### 1. CompanyContext (`src/context/CompanyContext.js`)
- Manages current active company/workspace
- Loads user's companies on mount
- Provides `switchCompany()` function to change active workspace
- Stores company preference in localStorage
- Automatically reloads data when company switches

### 2. Company Switcher Component (`src/components/CompanySwitcher.js`)
- Dropdown component to switch between companies
- Shows current company name
- Lists all available companies
- Only shows if user has multiple companies
- Integrated into Header component

### 3. API Functions (`src/api/auth.js`)
Added new endpoints:
- `getUserCompanies()` - Get all companies user belongs to
- `switchCompany(companyId)` - Switch active company
- `createCompany(payload)` - Create new company
- `getCompany(id)` - Get company details

### 4. Updated Components
- **App.js**: Wrapped app with `CompanyProvider`
- **Header.js**: Added CompanySwitcher to header
- **AppContext.js**: Updated to reload data when company changes
- **AuthContext.js**: Updated registration to handle company data

---

## Backend API Requirements

The backend needs to implement these endpoints:

### 1. Get User Companies
**Endpoint:** `GET /api/v1/auth/companies`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "role": "admin",
      "status": "active"
    }
  ]
}
```

### 2. Switch Company
**Endpoint:** `POST /api/v1/auth/switch-company`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "company_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "company": {
      "id": "uuid",
      "name": "Acme Corp"
    },
    "token": "new-jwt-token-with-company-context" // Optional: refresh token with company_id
  }
}
```

### 3. Update Registration Response
**Endpoint:** `POST /api/v1/auth/register`

**Updated Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "jwt-token",
    "companies": [
      {
        "id": "uuid",
        "name": "John's Workspace",
        "role": "admin"
      }
    ],
    "currentCompany": {
      "id": "uuid",
      "name": "John's Workspace"
    }
  }
}
```

### 4. Update JWT Token
JWT token should include `companyId`:
```json
{
  "userId": "uuid",
  "companyId": "uuid", // Current active company
  "email": "user@example.com",
  "role": "developer"
}
```

### 5. Update All Data Endpoints
All existing endpoints should:
- Filter by `company_id` from JWT token
- Verify user is member of the company
- Return only data for current company

**Examples:**
- `GET /api/v1/projects` → Returns only projects for company in JWT
- `GET /api/v1/tasks?project_id=xxx` → Verifies project belongs to company
- `POST /api/v1/projects` → Creates project for company in JWT

---

## Database Schema

### Companies Table
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### User-Companies Junction Table
```sql
CREATE TABLE user_companies (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  company_id UUID REFERENCES companies(id),
  role VARCHAR(50) NOT NULL, -- admin, member, viewer
  status VARCHAR(50) DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);
```

### Add company_id to Data Tables
```sql
ALTER TABLE projects ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE tasks ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE documents ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE notifications ADD COLUMN company_id UUID REFERENCES companies(id);
-- ... etc for all data tables
```

### Indexes
```sql
CREATE INDEX idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX idx_user_companies_company_id ON user_companies(company_id);
CREATE INDEX idx_projects_company_id ON projects(company_id);
-- ... etc for all company_id columns
```

---

## User Flow

### Registration
1. User registers → Backend creates default company
2. User is added to company as "admin"
3. Response includes company info
4. Frontend stores company preference

### Login
1. User logs in → Backend returns user's companies
2. Frontend loads companies
3. Uses saved preference or first company as default
4. All data is scoped to current company

### Switching Companies
1. User clicks company switcher in header
2. Selects different company
3. Frontend calls `switch-company` endpoint
4. Backend validates user is member
5. Backend returns updated token (optional)
6. Frontend reloads page to refresh all data

---

## Frontend Behavior

### Company Context
- Available throughout app via `useCompany()` hook
- Provides `currentCompany`, `companies`, `switchCompany()`
- Automatically reloads when company changes

### Data Fetching
- All data fetching respects `currentCompany`
- When company switches, all data reloads
- Projects, tasks, documents, notifications all scoped to company

### UI Updates
- Company switcher shows in header
- Only visible if user has multiple companies
- Shows current company name
- Dropdown lists all available companies

---

## Migration Steps for Backend

1. **Add Database Tables**
   - Create `companies` table
   - Create `user_companies` table
   - Add `company_id` to all data tables

2. **Update Registration**
   - Create default company for new users
   - Add user to company as admin
   - Return company info in response

3. **Update Authentication**
   - Include `companyId` in JWT token
   - Add `GET /auth/companies` endpoint
   - Add `POST /auth/switch-company` endpoint

4. **Update All Endpoints**
   - Extract `companyId` from JWT
   - Filter all queries by `company_id`
   - Verify user is member of company

5. **Migration Script**
   - Create default company for existing users
   - Add existing users to their default company
   - Assign existing data to default companies

---

## Testing Checklist

- [ ] User can register and get default company
- [ ] User can see company switcher in header
- [ ] User can switch between companies
- [ ] Data reloads when switching companies
- [ ] Projects filtered by company
- [ ] Tasks filtered by company
- [ ] Documents filtered by company
- [ ] Notifications filtered by company
- [ ] User can create new company
- [ ] User can invite others to company
- [ ] User can accept company invitation

---

## Next Steps

1. Backend implements company endpoints
2. Backend updates all data endpoints to filter by company
3. Backend includes `companyId` in JWT tokens
4. Test company switching functionality
5. Add company management UI (create, invite, settings)
6. Add company settings page
7. Add company member management








