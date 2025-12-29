# Backend Developer Quick Start Guide

## 🎯 Goal
Implement the backend API for ZynDrx frontend application with multi-tenant workspace support.

---

## 📚 Required Documents

**Read these in order:**
1. **`BACKEND_PRIORITY_ROADMAP.md`** - This tells you what to build and in what order (START HERE)
2. **`API_REQUIREMENTS.md`** - Complete endpoint specifications with request/response formats
3. **`MULTI_COMPANY_ARCHITECTURE.md`** - Multi-tenancy architecture details

---

## 🚀 Quick Start (TL;DR)

### Week 1-2: Critical Core (MUST DO FIRST)

1. **Database Setup:**
   ```sql
   -- Create these tables first:
   - users
   - companies  
   - user_companies (junction table)
   - projects (with company_id)
   - tasks (with company_id)
   - documents (with company_id)
   - notifications (with company_id)
   ```

2. **Registration Endpoint:**
   - Accept: `{ email, password, fullName, companyName }`
   - Create user
   - Create company with `companyName`
   - Add user to company as "admin"
   - Return: `{ user, token, companies, currentCompany }`

3. **JWT Token:**
   - Include `companyId` in JWT payload
   - Extract `companyId` from token for all queries
   - Filter ALL data by `company_id`

4. **Core Endpoints:**
   - Login, Register, Get Current User
   - Get Projects (filtered by company_id)
   - Get Tasks (filtered by company_id)
   - Create Project, Create Task

### Security (CRITICAL):
- ⚠️ ALWAYS filter by `company_id` from JWT
- ⚠️ NEVER return data from other companies
- ⚠️ Verify user is member of company

---

## ✅ Implementation Checklist

### Phase 4: Critical Core (Week 1-2)
- [ ] Database: users, companies, user_companies tables
- [ ] Database: projects, tasks, documents, notifications (all with company_id)
- [ ] Registration endpoint (creates company)
- [ ] Login endpoint
- [ ] Get current user endpoint
- [ ] JWT includes companyId
- [ ] All queries filter by company_id

### Phase 3: Core Features (Week 3-4)
- [ ] Projects CRUD endpoints
- [ ] Tasks CRUD endpoints  
- [ ] Documents endpoints
- [ ] Notifications endpoints
- [ ] Team invitation endpoints

### Phase 2: Important Features (Week 5-6)
- [ ] Company management endpoints
- [ ] Company switching endpoint
- [ ] Analytics endpoint
- [ ] PRD endpoints

---

## 🔗 Next Steps

1. Read `BACKEND_PRIORITY_ROADMAP.md` for full priorities
2. Read `API_REQUIREMENTS.md` for endpoint details
3. Start with Phase 4 (Critical Core)
4. Test each endpoint as you build
5. Verify company isolation

---

**Questions?** Check the detailed documents listed above.








