# 🗄️ Zyndrx Database - Complete Setup Guide

## ✅ What's Ready

Your database schema is **100% complete** and ready to deploy!

### 📊 Database Files Created

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| **schema.sql** | Main database schema | 348 | ✅ Ready |
| **seed.sql** | Development test data | 187 | ✅ Optional |
| **rls-policies.sql** | Row Level Security | 410 | ✅ Production |
| **README.md** | Database documentation | 380 | ✅ Complete |
| **DIAGRAM.md** | Visual ERD | 550 | ✅ Complete |
| **verify.js** | Setup verification | 280 | ✅ Executable |

**Total**: 2,155 lines of database code and documentation

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in / Sign up
3. Click **"New Project"**
4. Fill in:
   - **Name**: `zyndrx`
   - **Database Password**: [Choose strong password]
   - **Region**: [Closest to you]
5. Click **"Create new project"**
6. ⏱️ Wait ~2 minutes for project creation

### Step 2: Get Your API Keys

1. Once ready, go to **Settings** → **API**
2. Copy these three values:

```bash
Project URL:     https://xxxxxxxxxxxxx.supabase.co
anon public:     eyJhbGc... (long token)
service_role:    eyJhbGc... (long token - KEEP SECRET!)
```

### Step 3: Update .env File

1. Open `/workspace/.env`
2. Replace these lines:

```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (your service_role key)
SUPABASE_ANON_KEY=eyJhbG... (your anon key)
```

3. Save the file

### Step 4: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open `database/schema.sql` in your editor
4. Copy **all contents** (Ctrl+A, Ctrl+C)
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or Ctrl+Enter)
7. ✅ Should see: "Success. No rows returned"

### Step 5: Verify Setup

```bash
# Run verification script
node database/verify.js
```

**Expected output:**
```
✓ Environment variables configured
✓ Successfully connected to database
✓ All tables exist (15/15)
✓ Database verification successful!
```

### Step 6: (Optional) Add Test Data

Only for development/testing:

1. Open **SQL Editor** in Supabase
2. **New query**
3. Copy contents of `database/seed.sql`
4. Paste and **Run**
5. ✅ Should create 7 test users, 2 projects, etc.

---

## 📊 What Was Created

### 15 Database Tables

1. **users** - User accounts (8 role types)
2. **projects** - Project management (5 statuses)
3. **project_members** - Team membership
4. **prds** - Product requirements docs
5. **prd_versions** - PRD change history
6. **prd_sections** - PRD organization
7. **documents** - File metadata
8. **tasks** - Task tracking (6 statuses, 4 priorities)
9. **task_comments** - Comments with mentions
10. **notifications** - Notification system
11. **integrations** - External tools (GitHub, Slack, etc.)
12. **github_repos** - Repository tracking
13. **commits** - Code commit history
14. **deployments** - Deployment logs
15. **audit_logs** - Security audit trail
16. **analytics_events** - Analytics tracking

### Key Features

✅ **UUID Primary Keys** - All tables  
✅ **16 Performance Indexes** - Fast queries  
✅ **Auto-updating Timestamps** - 7 tables with triggers  
✅ **Foreign Key Relationships** - 28 relationships  
✅ **Cascade Deletions** - Proper cleanup  
✅ **Data Validation** - 9 CHECK constraints  
✅ **Array Fields** - Tags, mentions support  
✅ **JSONB Fields** - Flexible metadata  
✅ **Unique Constraints** - Prevent duplicates  

---

## 🔐 Security Setup (Production Only)

**⚠️ Only run this in production, not during development!**

When you're ready to deploy:

1. Open **SQL Editor** in Supabase
2. Copy contents of `database/rls-policies.sql`
3. Run in SQL Editor
4. Verify policies work correctly

**What RLS Does:**
- Users only see projects they're members of
- Users only see their own notifications
- Only project members can create tasks
- Only admins can view audit logs
- Document uploaders can delete their files

---

## 📁 File Overview

### schema.sql (348 lines)
- 15 table definitions
- 16 performance indexes
- 4 auto-update triggers
- Foreign key relationships
- Data validation constraints

### seed.sql (187 lines)
- 7 test users (all roles)
- 2 sample projects
- Project team members
- 1 PRD document
- 4 sample tasks
- Notifications
- GitHub integration

### rls-policies.sql (410 lines)
- Enable RLS on all tables
- 3 helper functions
- 40+ security policies
- Role-based access control
- Project membership checks

### README.md (380 lines)
- Setup instructions
- Table descriptions
- Relationship diagrams
- Common queries
- Security guidelines
- Troubleshooting

### DIAGRAM.md (550 lines)
- Complete visual ERD
- All relationships
- Cascade behaviors
- Index information
- Query patterns

### verify.js (280 lines)
- Environment check
- Connection test
- Table verification
- Seed data check
- Color-coded output

---

## 🧪 Verification Checklist

After setup, verify these:

```bash
# 1. Run verification script
node database/verify.js

# 2. Check in Supabase dashboard
# Go to Table Editor → Should see all 15 tables

# 3. Test a query
# In SQL Editor, run:
SELECT COUNT(*) FROM users;
# Should return a number (0 if no seed data)

# 4. Check foreign keys
# Try this (should fail):
INSERT INTO projects (name, owner_id) 
VALUES ('Test', '00000000-0000-0000-0000-000000000000');
# Should error: "violates foreign key constraint"

# 5. Check auto-update trigger
INSERT INTO users (email, full_name, role) 
VALUES ('test@test.com', 'Test User', 'viewer');

UPDATE users SET full_name = 'Updated' WHERE email = 'test@test.com';

SELECT updated_at > created_at as trigger_works FROM users WHERE email = 'test@test.com';
# Should return: true
```

---

## 🎯 Common Queries

### Get all projects for a user
```sql
SELECT p.* 
FROM projects p
JOIN project_members pm ON p.id = pm.project_id
WHERE pm.user_id = 'user-uuid-here';
```

### Get active tasks assigned to user
```sql
SELECT t.*, p.name as project_name
FROM tasks t
JOIN projects p ON t.project_id = p.id
WHERE t.assigned_to = 'user-uuid-here'
  AND t.status NOT IN ('done', 'blocked')
ORDER BY t.priority DESC, t.due_date ASC;
```

### Get unread notifications
```sql
SELECT * FROM notifications
WHERE user_id = 'user-uuid-here'
  AND read = false
ORDER BY created_at DESC;
```

### Project completion rate
```sql
SELECT 
  p.name,
  COUNT(*) as total_tasks,
  SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as completed,
  ROUND(100.0 * SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) / COUNT(*), 2) as completion_rate
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id, p.name;
```

---

## 🐛 Troubleshooting

### Issue: "Connection failed"
**Solutions:**
1. Check `SUPABASE_URL` in `.env` (no trailing slash)
2. Verify project is active in Supabase dashboard
3. Check internet connection

### Issue: "Tables not found"
**Solutions:**
1. Run `database/schema.sql` in SQL Editor
2. Check for SQL errors in Supabase logs
3. Verify database exists in project

### Issue: "Foreign key violation"
**Solutions:**
1. Ensure parent records exist first
2. Check UUID format (must be valid UUID)
3. Review table relationships

### Issue: "Duplicate key error"
**Solutions:**
1. Check unique constraints (email, etc.)
2. Use `ON CONFLICT` in INSERT statements
3. Query existing records first

### Issue: "RLS blocking queries"
**Solutions:**
1. Don't enable RLS during development
2. Check JWT claims are set correctly
3. Verify policy conditions
4. Use service_role key for admin operations

---

## 📚 Next Steps

Now that your database is set up:

### 1. Start the Backend Server
```bash
npm run dev
```

### 2. Test Health Endpoint
```bash
curl http://localhost:5000/health
```

### 3. Build Your First Module
Start with the Auth module:
```
src/modules/auth/
├── auth.routes.ts
├── auth.controller.ts
├── auth.service.ts
└── auth.validation.ts
```

See `ARCHITECTURE.md` for code patterns.

---

## 📖 Additional Resources

- **Database Documentation**: `database/README.md`
- **Visual ERD**: `database/DIAGRAM.md`
- **Architecture Guide**: `ARCHITECTURE.md`
- **Supabase Docs**: https://supabase.com/docs/guides/database

---

## 🎉 Database Setup Complete!

Your Zyndrx database is now:

✅ Fully structured with 15 tables  
✅ Optimized with 16 indexes  
✅ Secure with proper relationships  
✅ Ready for development  
✅ Production-ready architecture  

**Total Database Code**: 2,155 lines across 6 files

**Next**: Run `npm run dev` and start building features!

---

**Questions?** Check `database/README.md` or the main project documentation.
