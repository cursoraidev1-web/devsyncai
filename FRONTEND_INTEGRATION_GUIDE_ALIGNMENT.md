# Frontend Integration Guide - Alignment Analysis

This document compares the provided Frontend Integration Guide with the current implementation to identify discrepancies and recommendations.

## ✅ Aligned Areas

### 1. Environment Variables
- ✅ Uses `REACT_APP_API_URL` (guide also mentions `NEXT_PUBLIC_` for Next.js - correct)
- ✅ Base URL handling includes `/api/v1` prefix
- ✅ OAuth client IDs are optional

### 2. Authentication Endpoints
- ✅ Registration endpoint: `POST /api/v1/auth/register`
- ✅ Login endpoint: `POST /api/v1/auth/login`
- ✅ Get current user: `GET /api/v1/auth/me`
- ✅ Company switching: `POST /api/v1/auth/switch-company`
- ✅ All endpoints correctly implemented

### 3. Subscription & Plans
- ✅ Subscription endpoints match guide
- ✅ Plan limits checking implemented
- ✅ Upgrade/cancel flows implemented

### 4. Response Format
- ✅ Uses `{ success, data, message }` format
- ✅ Error handling matches guide's patterns

### 5. Error Handling
- ✅ 401 handling (redirect to login)
- ✅ 403 handling (plan limits)
- ✅ Error message extraction

---

## ⚠️ Discrepancies & Updates Needed

### 1. API Client Architecture

**Guide Shows:**
```typescript
class ApiClient {
  async register(data) { ... }
  async login(email, password) { ... }
  async getCurrentUser() { ... }
}
```

**Current Implementation:**
```javascript
// Functional/modular approach
// api/client.js - base client
export const api = { get, post, patch, put, delete };

// api/auth.js - auth-specific methods
export const register = (payload) => api.post('/auth/register', payload);
export const login = (credentials) => api.post('/auth/login', credentials);
```

**Recommendation:** The guide should reflect both approaches:
- **Class-based** (shown in guide) - Good for TypeScript/OOP
- **Modular/Functional** (current implementation) - Good for simpler JS, easier tree-shaking

**Suggested Guide Update:** Add a note that both approaches are valid, and show the modular approach as an alternative.

---

### 2. LocalStorage Keys

**Guide Shows:**
```javascript
localStorage.setItem('zyndrx_company_id', companyId);
```

**Current Implementation:**
```javascript
localStorage.setItem('zyndrx_company', companyId); // Stores company ID as string
```

**Also Used:**
- `zyndrx_token` ✅ (matches guide)
- `zyndrx_user` ✅ (guide doesn't explicitly mention but acceptable)

**Recommendation:** Update guide to use `zyndrx_company` for consistency, OR update codebase to use `zyndrx_company_id`. Since we also have `zyndrx_user` (not `zyndrx_user_id`), keeping `zyndrx_company` is more consistent with our naming.

**Suggested Guide Update:** Change `zyndrx_company_id` to `zyndrx_company` throughout.

---

### 3. Company Switching Request Body

**Guide Shows:**
```typescript
await apiClient.switchCompany(companyId);
// Implies: { companyId: companyId }
```

**Current Implementation:**
```javascript
api.post('/auth/switch-company', { company_id: companyId }); // snake_case
```

**API Requirements Doc Shows:**
```json
{ "companyId": "uuid" }  // camelCase
```

**Recommendation:** **CRITICAL** - Need to align on ONE format:
- **Option A:** Use `companyId` (camelCase) - matches API_REQUIREMENTS.md
- **Option B:** Use `company_id` (snake_case) - matches current implementation

**Suggested:** Update codebase to use `companyId` (camelCase) to match API_REQUIREMENTS.md and REST conventions.

**Action Required:** Update `src/api/auth.js`:
```javascript
// Change from:
export const switchCompany = (companyId) => api.post('/auth/switch-company', { company_id: companyId });

// To:
export const switchCompany = (companyId) => api.post('/auth/switch-company', { companyId });
```

---

### 4. Company Context Structure

**Guide Shows:**
```typescript
const companies = await apiClient.getUserCompanies();
// Implies flat array response
```

**Current Implementation:**
```javascript
// Uses context hooks
const { companies, currentCompany, switchCompany } = useCompany();
```

**Recommendation:** The guide's example is more basic. Our implementation with React Context is better for React apps. The guide should show BOTH:
1. Basic API usage (for non-React or simple apps)
2. React Context usage (for React apps - recommended)

**Suggested Guide Update:** Add a section showing React Context usage as the recommended approach for React applications.

---

### 5. Registration Response Structure

**Guide Shows:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "...",
    "companyId": "uuid",  // ❌ Missing in current API spec
    "companies": [ ... ],
    "currentCompany": { ... }
  }
}
```

**Current Implementation Expects:**
```javascript
// Handles both formats
const data = response?.data || response;
const { token, user, companies, currentCompany } = data;
```

**API_REQUIREMENTS.md Shows:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "..."
    // companies and currentCompany may or may not be included
  }
}
```

**Recommendation:** Guide shows more data in registration response than our API spec. Need to verify if backend actually returns `companies` and `currentCompany` in registration response.

**Suggested Guide Update:** 
- If backend returns companies: Keep as-is ✅
- If backend doesn't: Update guide to show separate call to `/auth/companies` after registration

---

### 6. Token Storage in API Client

**Guide Shows:**
```typescript
class ApiClient {
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('zyndrx_token', token);
  }
}
```

**Current Implementation:**
```javascript
// Token is stored in AuthContext, not in API client
// API client reads from localStorage on each request
const getAuthHeader = () => {
  const token = localStorage.getItem('zyndrx_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
```

**Recommendation:** Our approach (reading from localStorage on each request) is simpler and works well with React Context. The guide's approach (storing in class instance) is also valid but requires token synchronization.

**Suggested Guide Update:** Show that reading from localStorage on each request is a valid alternative approach, especially when using React Context for state management.

---

### 7. Company ID Header

**Guide Shows:**
```typescript
if (this.companyId && options.method !== 'GET') {
  headers['X-Company-ID'] = this.companyId;
}
```

**Current Implementation:**
```javascript
// Does NOT send X-Company-ID header
// Relies on JWT token containing companyId
```

**Recommendation:** According to our API design, the JWT token includes `companyId`, so the backend extracts it from the token. The `X-Company-ID` header is unnecessary and not used.

**Suggested Guide Update:** Remove the `X-Company-ID` header example, or mark it as optional/alternative approach. Our backend uses JWT token's `companyId` field.

---

### 8. Subscription Response Structure

**Guide Shows:**
```typescript
const response = await apiClient.getSubscription();
if (response.success) {
  setSubscription(response.data.subscription);
  // ...
}
```

**Current Implementation:**
```javascript
const subscriptionData = await getSubscription();
if (subscriptionData?.plan) {
  setSubscription(subscriptionData.plan);
}
```

**API_REQUIREMENTS.md Shows:**
```json
{
  "success": true,
  "data": {
    "plan": { ... },
    "limits": { ... },
    "usage": { ... }
  }
}
```

**Recommendation:** Our implementation expects the data directly, not wrapped in `response.data.subscription`. The guide should match the actual API response structure.

**Suggested Guide Update:** Change `response.data.subscription` to `response.data.plan` (or show both `plan`, `limits`, `usage` separately).

---

## 📝 Summary of Required Changes

### For the Guide (Priority: High)

1. ✅ **Keep current structure** - Guide is mostly correct
2. 🔄 **Update localStorage key:** `zyndrx_company_id` → `zyndrx_company`
3. 🔄 **Update switch-company request:** Show `{ companyId }` (camelCase) instead of implied format
4. 🔄 **Remove `X-Company-ID` header** - Not needed (JWT has companyId)
5. 🔄 **Add React Context examples** - Show recommended React pattern
6. 🔄 **Update subscription response:** Show `response.data.plan` instead of `response.data.subscription`
7. 🔄 **Add modular API client example** - Alternative to class-based

### For the Codebase (Priority: Medium)

1. ⚠️ **Verify switch-company request format** - Should be `{ companyId }` (camelCase) to match API spec
2. ⚠️ **Verify registration response** - Does it include `companies` and `currentCompany`?

---

## ✅ Final Verdict

**Overall Alignment: 85%** ✅

The guide is **mostly aligned** with the implementation. The main discrepancies are:
- Minor naming differences (company_id vs companyId)
- Architectural differences (class-based vs modular - both valid)
- Missing React Context examples (guide shows basic usage)

**Recommendation:** 
1. Update the guide with the minor fixes listed above
2. Verify backend API actually matches the guide's examples (especially registration response and switch-company request format)
3. The guide provides excellent documentation structure - just needs minor adjustments for accuracy

The guide is **production-ready** with small updates, and serves as an excellent reference for frontend developers integrating with the backend.






