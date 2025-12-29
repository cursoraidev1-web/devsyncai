# Multi-Company/Workspace Architecture Recommendations

## Problem Statement

Users need to work for multiple companies/workspaces, and the system must:
1. Allow users to belong to multiple companies
2. Switch between companies/workspaces
3. Isolate data per company
4. Maintain proper access control per company

---

## Recommended Architecture: Workspace-Based Multi-Tenancy

### Option 1: Workspace/Company Model (Recommended)

This approach treats "Company" as a "Workspace" that users can join and switch between.

#### Database Schema

```sql
-- Companies/Workspaces Table
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL, -- URL-friendly identifier
  domain VARCHAR(255), -- Optional: company domain
  logo_url TEXT,
  plan VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User-Company Relationship (Many-to-Many)
CREATE TABLE user_companies (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  company_id UUID REFERENCES companies(id),
  role VARCHAR(50) NOT NULL, -- admin, member, viewer
  status VARCHAR(50) DEFAULT 'active', -- active, pending, inactive
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

-- Add company_id to all tenant-scoped tables
ALTER TABLE projects ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE tasks ADD COLUMN company_id UUID REFERENCES tasks(id);
ALTER TABLE documents ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE notifications ADD COLUMN company_id UUID REFERENCES companies(id);
-- ... etc for all data tables
```

#### API Changes Required

### 1. User Registration - Create Default Company

**Endpoint:** `POST /api/v1/auth/register`

**New Behavior:**
- When user registers, automatically create a company for them
- Add user to that company as "admin"
- Return company info in registration response

**Response:**
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
        "slug": "john-workspace",
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

### 2. Get User Companies

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
    },
    {
      "id": "uuid",
      "name": "Tech Startup",
      "slug": "tech-startup",
      "role": "developer",
      "status": "active"
    }
  ]
}
```

### 3. Switch Company/Workspace

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
      "name": "Acme Corp",
      "slug": "acme-corp"
    },
    "token": "new-jwt-token-with-company-context" // Optional: refresh token
  }
}
```

### 4. Create Company/Workspace

**Endpoint:** `POST /api/v1/companies`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "New Company Name",
  "slug": "new-company" // Optional, auto-generated if not provided
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "New Company Name",
    "slug": "new-company",
    "role": "admin" // Creator is automatically admin
  }
}
```

### 5. Invite User to Company

**Endpoint:** `POST /api/v1/companies/:id/invite`  
**Auth Required:** Yes (must be admin of company)

**Request Body:**
```json
{
  "email": "user@example.com",
  "role": "developer" // admin, member, viewer
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invitation sent"
}
```

### 6. Accept Company Invitation

**Endpoint:** `POST /api/v1/companies/accept-invite`  
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
  "data": {
    "company": {
      "id": "uuid",
      "name": "Acme Corp"
    }
  }
}
```

### 7. Update All Data Endpoints

All existing endpoints should:
- Filter by `company_id` from JWT token or request context
- Require user to be a member of the company
- Return only data for the current company

**Example - Get Projects:**
```javascript
// Backend automatically filters by company_id from JWT
GET /api/v1/projects
// Returns only projects for the company in the user's current context
```

**JWT Token Structure:**
```json
{
  "userId": "uuid",
  "companyId": "uuid", // Current active company
  "email": "user@example.com",
  "role": "developer",
  "exp": 1234567890
}
```

---

## Frontend Implementation

### 1. Company Context

Create a `CompanyContext` to manage:
- Current active company
- List of user's companies
- Company switching

```javascript
// src/context/CompanyContext.js
const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  
  const switchCompany = async (companyId) => {
    // Call API to switch company
    // Update JWT token if needed
    // Reload all data for new company
  };
  
  return (
    <CompanyContext.Provider value={{ currentCompany, companies, switchCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};
```

### 2. Company Switcher Component

Add a company switcher in the header/navigation:

```javascript
// src/components/CompanySwitcher.js
const CompanySwitcher = () => {
  const { currentCompany, companies, switchCompany } = useCompany();
  
  return (
    <Select value={currentCompany?.id} onChange={(e) => switchCompany(e.target.value)}>
      {companies.map(company => (
        <option key={company.id} value={company.id}>
          {company.name}
        </option>
      ))}
    </Select>
  );
};
```

### 3. Update API Client

Modify API client to include company context:

```javascript
// src/api/client.js
const getAuthHeader = () => {
  const token = localStorage.getItem('zyndrx_token');
  const companyId = localStorage.getItem('zyndrx_company_id'); // Optional header
  return {
    Authorization: `Bearer ${token}`,
    ...(companyId && { 'X-Company-ID': companyId })
  };
};
```

### 4. Update All Data Fetching

When company switches, reload all data:

```javascript
// src/context/AppContext.js
useEffect(() => {
  if (token && currentCompany) {
    loadProjects();
    loadNotifications();
    loadTasks();
  }
}, [token, currentCompany]);
```

---

## Alternative Option 2: Subdomain-Based Multi-Tenancy

If you want companies to have their own subdomains:

- `acme.zyndrx.com` → Acme Corp workspace
- `tech.zyndrx.com` → Tech Startup workspace

**See `SUBDOMAIN_MULTI_TENANCY.md` for complete implementation guide.**

**Key Points:**
- Extract company from subdomain in backend middleware
- Each company gets isolated subdomain
- Better for enterprise/branding requirements
- More complex setup but better isolation

**Pros:**
- Better isolation and security
- Easier company branding
- Clear separation
- Better for compliance

**Cons:**
- More complex DNS/domain setup
- Harder for users to switch companies
- Requires subdomain routing
- SSL certificate management

---

## Alternative Option 3: URL Path-Based

Use URL paths to indicate company:

- `/workspace/acme-corp/projects`
- `/workspace/tech-startup/projects`

**Implementation:**
1. Extract company slug from URL
2. Store in React Router state
3. Include in all API calls

**Pros:**
- Simple to implement
- Easy to share company-specific URLs
- No subdomain setup needed

**Cons:**
- URL structure is longer
- Need to update all routes

---

## Recommended Approach: Hybrid

**Use Option 1 (Workspace Model) with URL path support:**

1. **Default:** Company context from JWT token
2. **Optional:** Support `/workspace/:slug` URLs for deep linking
3. **Company Switcher:** In header for easy switching
4. **Auto-create:** Create default company on registration

---

## Migration Strategy

### Phase 1: Add Company Support
1. Add `companies` and `user_companies` tables
2. Add `company_id` to all data tables
3. Create default company for existing users
4. Update registration to create company

### Phase 2: Update APIs
1. Add company filtering to all endpoints
2. Add company management endpoints
3. Update JWT to include company context

### Phase 3: Update Frontend
1. Add CompanyContext
2. Add company switcher UI
3. Update all data fetching to respect company context
4. Add company selection on registration

### Phase 4: Advanced Features
1. Company settings page
2. Company member management
3. Company billing (if applicable)
4. Company branding/customization

---

## Security Considerations

1. **Data Isolation:** Always filter by `company_id` in database queries
2. **Access Control:** Verify user is member of company before any operation
3. **JWT Validation:** Validate company_id in JWT matches request context
4. **Row-Level Security:** Use database policies if supported (PostgreSQL RLS)
5. **API Rate Limiting:** Per company if needed

---

## Example User Flow

1. **Registration:**
   - User registers → Default company created
   - User is admin of their company
   - User can invite others

2. **Invitation:**
   - Admin invites user to company
   - User receives email with invitation link
   - User accepts → Added to company
   - User can now see company's data

3. **Switching:**
   - User clicks company switcher
   - Selects different company
   - All data reloads for new company
   - URL updates (optional)

4. **Multiple Companies:**
   - User can be member of many companies
   - Each company has isolated data
   - User switches context to work in different company

---

## Database Indexes

```sql
-- Performance indexes
CREATE INDEX idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX idx_user_companies_company_id ON user_companies(company_id);
CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_tasks_company_id ON tasks(company_id);
-- ... etc for all company-scoped tables
```

---

## Summary

**Recommended Solution:** Workspace/Company Model (Option 1)

- ✅ Flexible: Users can belong to multiple companies
- ✅ Scalable: Easy to add more companies
- ✅ Secure: Data isolation per company
- ✅ User-friendly: Easy company switching
- ✅ Backward compatible: Can migrate existing data

**Key Changes Needed:**
1. Add `companies` and `user_companies` tables
2. Add `company_id` to all data tables
3. Update registration to create default company
4. Add company management APIs
5. Add company switcher UI
6. Update all data fetching to filter by company

