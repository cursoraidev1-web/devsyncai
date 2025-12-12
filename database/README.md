# 🗄️ Zyndrx Database Documentation

## Overview

The Zyndrx database is built on PostgreSQL (via Supabase) and consists of 15 core tables designed to support a complete project management and development coordination platform.

## 📁 Files in this Directory

| File | Purpose | When to Use |
|------|---------|-------------|
| **schema.sql** | Main database schema | Run first to create all tables |
| **seed.sql** | Development test data | Run for local testing |
| **rls-policies.sql** | Row Level Security | Run in production for security |
| **README.md** | This file | Database documentation |

## 🚀 Setup Instructions

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in details and wait ~2 minutes for project creation

### Step 2: Run Main Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy contents of `schema.sql`
4. Paste and click **"Run"**
5. Verify: Go to **Table Editor** → should see 15 tables

### Step 3: (Optional) Add Seed Data

For development/testing:
1. In **SQL Editor**, create another new query
2. Copy contents of `seed.sql`
3. Paste and click **"Run"**
4. Verify: Check users table → should have 7 test users

### Step 4: (Optional) Enable RLS

For production security:
1. Copy contents of `rls-policies.sql`
2. Run in SQL Editor
3. Test policies work correctly before deploying

## 📊 Database Schema Overview

### Core Tables

#### 1. **users** (Authentication & Profiles)
- User accounts with 8 role types
- Roles: admin, product_manager, product_owner, developer, designer, qa_tester, devops, viewer
- Stores: email, full_name, avatar_url, role

#### 2. **projects** (Project Management)
- Main projects container
- Statuses: planning, in_progress, on_hold, completed, archived
- Links to project owner (user)

#### 3. **project_members** (Team Membership)
- Many-to-many relationship between users and projects
- Tracks which users are on which projects
- Unique constraint: (project_id, user_id)

#### 4. **prds** (Product Requirements Documents)
- Main PRD documents
- Statuses: draft, review, approved, rejected
- Versioning support
- Approval workflow

#### 5. **prd_versions** (PRD History)
- Complete change history for PRDs
- Tracks: version number, content, changes summary
- Unique: (prd_id, version)

#### 6. **prd_sections** (PRD Organization)
- Break PRDs into sections
- Ordering support via order_index
- Allows granular PRD management

#### 7. **documents** (File Storage)
- File metadata (actual files in Supabase Storage)
- Tagging support (PostgreSQL array)
- Links to projects and PRDs

#### 8. **tasks** (Task Tracking)
- Kanban-style task management
- Statuses: todo, in_progress, in_review, in_qa, blocked, done
- Priorities: low, medium, high, urgent
- Assignment and due date tracking

#### 9. **task_comments** (Discussion)
- Comments on tasks
- Mentions support (user UUIDs array)
- Threading support

#### 10. **notifications** (Notification System)
- User notifications queue
- Types: task_assigned, prd_approved, etc.
- Read/unread tracking
- JSONB data field for metadata

#### 11. **integrations** (External Tools)
- GitHub, GitLab, Slack, Figma, Notion
- JSONB config storage
- Active/inactive status

#### 12. **github_repos** (Repository Tracking)
- GitHub repository metadata
- Default branch tracking
- Links to projects

#### 13. **commits** (Code Commits)
- Tracks commits from GitHub/GitLab
- Links to tasks (optional)
- Unique commit hash

#### 14. **deployments** (Deployment History)
- Deployment tracking
- Environments: development, staging, production
- Status: pending, in_progress, success, failed, rolled_back

#### 15. **audit_logs** (Security & Compliance)
- Complete activity audit trail
- Tracks: user actions, entity changes, IP, user agent
- JSONB metadata field

#### 16. **analytics_events** (Metrics)
- Event tracking for analytics
- JSONB event data
- Links to projects

## 🔗 Database Relationships

```
users (1) ────── (many) projects [owner]
  │
  ├── (many) project_members (many) ────── (1) projects
  │
  ├── (many) prds [created_by, approved_by]
  │       │
  │       ├── (many) prd_versions
  │       └── (many) prd_sections
  │
  ├── (many) tasks [assigned_to, created_by]
  │       │
  │       └── (many) task_comments
  │
  ├── (many) documents [uploaded_by]
  │
  ├── (many) notifications [user_id]
  │
  └── (many) audit_logs [user_id]

projects (1) ────── (many) tasks
    │
    ├── (many) prds
    │
    ├── (many) documents
    │
    ├── (many) integrations
    │
    ├── (many) github_repos
    │
    ├── (many) commits
    │
    ├── (many) deployments
    │
    └── (many) analytics_events
```

## 🔍 Key Features

### 1. Auto-updating Timestamps
Tables with `updated_at` automatically update via triggers:
- users
- projects
- prds
- tasks
- task_comments
- prd_sections
- integrations

### 2. Performance Indexes
16 indexes created for fast queries:
- User lookups (email, role)
- Project queries (owner, status)
- Task filtering (project, assignee, status)
- Notification queries (user, read status)
- Audit log searches (user, entity, timestamp)

### 3. Data Validation
CHECK constraints ensure data integrity:
- Valid user roles
- Valid project statuses
- Valid task statuses and priorities
- Valid PRD statuses
- Valid integration types
- Valid deployment environments and statuses

### 4. Cascade Deletions
When parent records are deleted:
- Delete project → deletes all related tasks, PRDs, documents, etc.
- Delete user → keeps audit logs, but removes from projects
- Delete task → deletes all comments

### 5. UUID Primary Keys
All tables use UUIDs for:
- Better security (unpredictable IDs)
- Distributed systems support
- No ID collision issues

## 📝 Common Queries

### Get all projects for a user
```sql
SELECT p.* 
FROM projects p
JOIN project_members pm ON p.id = pm.project_id
WHERE pm.user_id = 'user-uuid-here';
```

### Get tasks assigned to a user
```sql
SELECT t.*, p.name as project_name
FROM tasks t
JOIN projects p ON t.project_id = p.id
WHERE t.assigned_to = 'user-uuid-here'
AND t.status != 'done'
ORDER BY t.priority DESC, t.due_date ASC;
```

### Get PRDs needing approval
```sql
SELECT pr.*, p.name as project_name, u.full_name as created_by_name
FROM prds pr
JOIN projects p ON pr.project_id = p.id
JOIN users u ON pr.created_by = u.id
WHERE pr.status = 'review'
ORDER BY pr.created_at ASC;
```

### Get unread notifications for a user
```sql
SELECT * FROM notifications
WHERE user_id = 'user-uuid-here'
AND read = false
ORDER BY created_at DESC;
```

### Project analytics - task completion rate
```sql
SELECT 
  p.name,
  COUNT(*) as total_tasks,
  SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as completed_tasks,
  ROUND(
    100.0 * SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) / COUNT(*),
    2
  ) as completion_rate
FROM projects p
JOIN tasks t ON p.id = t.project_id
GROUP BY p.id, p.name;
```

## 🔐 Security Considerations

### Development
- Use `schema.sql` only
- RLS disabled for easier development
- Seed data for testing

### Production
1. Run `schema.sql` first
2. Enable RLS with `rls-policies.sql`
3. DO NOT run `seed.sql`
4. Set up Supabase Auth properly
5. Use service role key only on backend
6. Use anon key on frontend

### RLS Policies Summary
When enabled, RLS ensures:
- Users only see projects they're members of
- Users only see their own notifications
- Only project members can create tasks
- Only admins can view audit logs
- Task assignees can update their tasks
- Document uploaders can delete their files

## 🔧 Maintenance

### Backup Strategy
- Supabase automatically backs up database daily
- Keep additional backups for critical data
- Export schema regularly: `pg_dump`

### Performance Monitoring
Monitor these queries:
- Task queries by project (most frequent)
- User authentication (high frequency)
- Notification retrieval (per user)

### Indexes to Add (if needed)
```sql
-- If tasks queries are slow
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE due_date IS NOT NULL;

-- If search is needed
CREATE INDEX idx_tasks_title_search ON tasks USING gin(to_tsvector('english', title));

-- If documents query is slow
CREATE INDEX idx_documents_project_prd ON documents(project_id, prd_id);
```

## 🐛 Troubleshooting

### Issue: Tables not created
**Solution**: Check for SQL syntax errors, run schema line by line

### Issue: Foreign key violations
**Solution**: Ensure parent records exist before inserting child records

### Issue: RLS blocking all queries
**Solution**: Check JWT claims are properly set, verify policies

### Issue: Slow queries
**Solution**: Check if indexes exist, use EXPLAIN ANALYZE

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs/guides/database
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **SQL Best Practices**: Follow ACID principles

## ✅ Verification Checklist

After setup, verify:
- [ ] All 15 tables created
- [ ] All indexes created (16 total)
- [ ] Triggers working (test update on users table)
- [ ] Foreign keys working (try invalid reference)
- [ ] Constraints working (try invalid status)
- [ ] Seed data loaded (if using seed.sql)
- [ ] RLS enabled (if production)

---

**Questions?** Check the main project README.md or SETUP_GUIDE.md
