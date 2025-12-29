# Subdomain-Based Multi-Tenancy Architecture

## Overview

Using subdomains for multi-tenancy means each company/workspace gets its own subdomain:
- `acme.zyndrx.com` → Acme Corp workspace
- `tech.zyndrx.com` → Tech Startup workspace
- `app.zyndrx.com` → Main application (or your primary domain)

---

## Advantages

### ✅ Better Data Isolation
- **Clear separation**: Each subdomain is inherently isolated
- **Security**: Harder for users to accidentally access wrong company data
- **Mental model**: Users naturally understand they're "in" a specific company

### ✅ Company Branding
- Each company can have custom branding on their subdomain
- Custom domains: `acme.zyndrx.com` → `workspace.acme.com` (CNAME)
- Custom logos, colors, themes per company

### ✅ Easier Development
- Cookie isolation per subdomain
- No need to manage company context in state/tokens
- Simpler routing logic

### ✅ Better Analytics
- Track usage per company easily
- Separate analytics per subdomain
- Clearer metrics

### ✅ Compliance & Privacy
- Easier to demonstrate data isolation for compliance (SOC2, GDPR)
- Clear audit trails per subdomain
- Better for enterprise clients

---

## Disadvantages

### ❌ More Complex Setup
- DNS configuration required
- SSL certificates (wildcard or multi-domain)
- Environment configuration complexity

### ❌ Harder Company Switching
- Users can't easily switch between companies
- Need to open new tabs or remember URLs
- Less convenient for users with multiple companies

### ❌ Deployment Complexity
- Need to handle dynamic subdomain routing
- Server/load balancer configuration
- More moving parts

### ❌ Cost
- Wildcard SSL certificates (though Let's Encrypt is free)
- DNS management
- Potentially more infrastructure

---

## Implementation Guide

### 1. DNS Configuration

#### Option A: Wildcard Subdomain (Recommended)
```
*.zyndrx.com → Your server IP
```

**Pros:**
- Single DNS record for all companies
- Automatic subdomain resolution
- Easy to add new companies

**Cons:**
- All subdomains point to same server (handle in application)

#### Option B: Individual Records
```
acme.zyndrx.com → Your server IP
tech.zyndrx.com → Your server IP
```

**Pros:**
- More control per subdomain
- Can route to different servers

**Cons:**
- Manual DNS management
- Doesn't scale well

---

### 2. Backend Implementation

#### Extract Company from Subdomain

```javascript
// Express.js example
const getCompanyFromSubdomain = (req) => {
  const host = req.get('host') || req.hostname;
  const subdomain = host.split('.')[0];
  
  // Skip 'www', 'app', 'api' subdomains
  const reserved = ['www', 'app', 'api', 'admin'];
  if (reserved.includes(subdomain)) {
    return null; // Main application
  }
  
  return subdomain; // Company slug
};

// Middleware
const companyMiddleware = async (req, res, next) => {
  const companySlug = getCompanyFromSubdomain(req);
  
  if (!companySlug) {
    return next(); // Main app routes
  }
  
  // Fetch company from database
  const company = await Company.findOne({ slug: companySlug });
  
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }
  
  // Attach company to request
  req.company = company;
  req.companyId = company.id;
  
  next();
};

// Use middleware
app.use(companyMiddleware);

// All routes now have req.company available
app.get('/api/v1/projects', async (req, res) => {
  const projects = await Project.findAll({
    where: { company_id: req.companyId }
  });
  res.json(projects);
});
```

#### Alternative: URL-Based Extraction (For Development)

During development, you might not have subdomain setup. Use query param or header:

```javascript
const getCompanyFromRequest = (req) => {
  // Production: Extract from subdomain
  const host = req.get('host') || req.hostname;
  const subdomain = host.split('.')[0];
  
  if (subdomain && !['www', 'app', 'api'].includes(subdomain)) {
    return subdomain;
  }
  
  // Development/Testing: Use query param or header
  return req.query.company || req.get('X-Company-Slug');
};
```

---

### 3. Frontend Implementation

#### Environment-Based URL Configuration

```javascript
// src/config/company.js
export const getCompanyFromHost = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // In development: localhost:3000
  // In production: company.zyndrx.com
  
  if (hostname === 'localhost' || hostname.includes('localhost')) {
    // Development: Get from localStorage or URL param
    return localStorage.getItem('dev_company_slug') || 
           new URLSearchParams(window.location.search).get('company');
  }
  
  // Production: Extract subdomain
  const subdomain = parts[0];
  const reserved = ['www', 'app', 'api'];
  
  return reserved.includes(subdomain) ? null : subdomain;
};

export const getAPIUrl = () => {
  const companySlug = getCompanyFromHost();
  
  // If company subdomain, API is on same subdomain
  if (companySlug) {
    return `${window.location.protocol}//${window.location.host}/api/v1`;
  }
  
  // Main app or API subdomain
  return process.env.REACT_APP_API_URL || 'https://api.zyndrx.com/api/v1';
};
```

#### Company Context

```javascript
// src/context/CompanyContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { getCompanyFromHost } from '../config/company';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadCompany = async () => {
      const companySlug = getCompanyFromHost();
      
      if (!companySlug) {
        // Main app - no company context
        setCompany(null);
        setLoading(false);
        return;
      }
      
      try {
        // Fetch company details
        const response = await fetch(
          `${getAPIUrl()}/companies/by-slug/${companySlug}`
        );
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error('Failed to load company:', error);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadCompany();
  }, []);
  
  return (
    <CompanyContext.Provider value={{ company, loading }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
};
```

#### API Client Update

```javascript
// src/api/client.js
const getAPIUrl = () => {
  // API is on same subdomain as frontend
  return `${window.location.protocol}//${window.location.host}/api/v1`;
};

// Company is automatically included via subdomain
// No need to add company_id to requests
export const apiRequest = async (path, options = {}) => {
  const url = `${getAPIUrl()}${path}`;
  // ... rest of implementation
};
```

#### Company Switcher (Alternative Approach)

Since users can't easily switch on subdomains, provide:

1. **Company List Page** (on main app)
   - List all companies user belongs to
   - Links to each company subdomain

2. **Quick Switch Dropdown** (if on same domain)
   - Opens company in new tab
   - Or redirects to company subdomain

```javascript
// src/components/CompanySwitcher.js
const CompanySwitcher = () => {
  const { companies } = useAuth();
  const currentCompany = useCompany();
  
  const switchToCompany = (company) => {
    // Redirect to company subdomain
    window.location.href = `https://${company.slug}.zyndrx.com`;
  };
  
  return (
    <Select value={currentCompany?.id} onChange={(e) => {
      const company = companies.find(c => c.id === e.target.value);
      switchToCompany(company);
    }}>
      {companies.map(company => (
        <option key={company.id} value={company.id}>
          {company.name}
        </option>
      ))}
    </Select>
  );
};
```

---

### 4. Database Schema

Same as workspace model, but companies identified by `slug`:

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL, -- Must be unique for subdomain
  domain VARCHAR(255), -- Optional: custom domain (acme.com)
  logo_url TEXT,
  plan VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ensure slug is URL-safe and unique
CREATE UNIQUE INDEX idx_companies_slug ON companies(slug);
```

**Slug Validation Rules:**
- Only lowercase letters, numbers, hyphens
- No spaces or special characters
- Minimum 3 characters
- Maximum 63 characters (DNS limit)
- Reserved words: `www`, `app`, `api`, `admin`, `mail`, `ftp`

---

### 5. Authentication Flow

#### Login on Main Domain

```javascript
// User logs in on app.zyndrx.com or zyndrx.com
POST /api/v1/auth/login

// Response includes companies
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "jwt-token",
    "companies": [
      {
        "id": "uuid",
        "name": "Acme Corp",
        "slug": "acme",
        "role": "admin"
      }
    ]
  }
}

// User selects company → Redirect to acme.zyndrx.com
window.location.href = `https://acme.zyndrx.com?token=${token}`;
```

#### Login on Company Subdomain

```javascript
// User lands on acme.zyndrx.com
// Extract token from URL or check session
// Verify token and load company context
// Set company-specific session

POST /api/v1/auth/verify-company-access
Headers: { Authorization: Bearer <token> }

// Backend verifies:
// 1. Token is valid
// 2. User belongs to company (from subdomain)
// 3. Returns company-specific token or sets session

{
  "success": true,
  "data": {
    "company": { /* company object */ },
    "user": { /* user object */ },
    "token": "company-scoped-token" // Optional
  }
}
```

---

### 6. Routing Configuration

#### React Router Setup

```javascript
// src/App.js
function AppRoutes() {
  const { company } = useCompany();
  
  // If no company (main app), show landing/login
  if (!company) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/companies" element={<CompanyList />} /> {/* List user's companies */}
      </Routes>
    );
  }
  
  // Company subdomain routes
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      {/* ... other routes */}
    </Routes>
  );
}
```

---

### 7. Development Setup

#### Local Development with Subdomains

**Option A: Edit hosts file**
```
127.0.0.1 acme.localhost
127.0.0.1 tech.localhost
127.0.0.1 app.localhost
```

**Option B: Use query parameter**
```
http://localhost:3000?company=acme
```

**Option C: Use localStorage for dev**
```javascript
// In development, set company manually
localStorage.setItem('dev_company_slug', 'acme');
```

#### Webpack Dev Server Configuration

```javascript
// webpack.config.js or package.json scripts
module.exports = {
  devServer: {
    allowedHosts: [
      'acme.localhost',
      'tech.localhost',
      '.localhost' // Allow all subdomains
    ]
  }
};
```

---

### 8. SSL Certificate

#### Wildcard SSL Certificate

```bash
# Let's Encrypt (Free)
certbot certonly --dns-cloudflare \
  -d "*.zyndrx.com" \
  -d "zyndrx.com"
```

#### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name *.zyndrx.com zyndrx.com;
    
    ssl_certificate /etc/letsencrypt/live/zyndrx.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zyndrx.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

### 9. Custom Domains (Optional)

Allow companies to use their own domain:

```sql
-- Add to companies table
ALTER TABLE companies ADD COLUMN custom_domain VARCHAR(255);
ALTER TABLE companies ADD COLUMN custom_domain_verified BOOLEAN DEFAULT FALSE;
```

**Flow:**
1. Company admin adds custom domain: `workspace.acme.com`
2. System generates DNS verification record
3. Admin adds DNS record to verify ownership
4. System checks DNS and marks as verified
5. Nginx/load balancer routes custom domain to same app
6. App extracts company from domain instead of subdomain

---

## Comparison: Subdomain vs Workspace Model

| Feature | Subdomain | Workspace Model |
|---------|-----------|----------------|
| **Data Isolation** | ✅ Excellent | ✅ Good |
| **Company Switching** | ❌ Difficult | ✅ Easy |
| **Setup Complexity** | ❌ High | ✅ Low |
| **Branding** | ✅ Excellent | ⚠️ Moderate |
| **Development** | ❌ Complex | ✅ Simple |
| **Compliance** | ✅ Better | ⚠️ Good |
| **User Experience** | ⚠️ Good | ✅ Excellent |
| **Cost** | ⚠️ Higher | ✅ Lower |
| **Scalability** | ✅ Excellent | ✅ Excellent |

---

## Hybrid Approach (Recommended)

Combine both approaches:

1. **Default**: Use workspace model (easy company switching)
2. **Optional**: Allow companies to use subdomain/custom domain
3. **Enterprise**: Subdomain required for enterprise plans

**Implementation:**
- Companies can choose subdomain or use default workspace
- Enterprise companies get subdomain automatically
- Free/Basic plans use workspace model

```sql
ALTER TABLE companies ADD COLUMN subdomain_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE companies ADD COLUMN subdomain VARCHAR(100);
```

---

## Recommendation

**Use Subdomains If:**
- ✅ Enterprise focus (better for B2B)
- ✅ Strong branding requirements
- ✅ Compliance/security is critical
- ✅ Users typically work for one company
- ✅ You have DevOps resources

**Use Workspace Model If:**
- ✅ Users work for multiple companies
- ✅ Quick MVP needed
- ✅ Simpler is better
- ✅ Consumer-focused
- ✅ Limited infrastructure

**Best Approach: Hybrid**
- Start with workspace model (faster to market)
- Add subdomain option later (enterprise feature)
- Let companies choose based on needs

---

## Migration Path

If starting with workspace model, you can migrate to subdomains:

1. **Phase 1**: Keep workspace model, add subdomain column
2. **Phase 2**: Implement subdomain routing (parallel)
3. **Phase 3**: Allow companies to enable subdomain (opt-in)
4. **Phase 4**: Migrate enterprise customers to subdomains
5. **Phase 5**: Make subdomain default for new companies (optional)

This allows gradual migration without breaking existing functionality.








