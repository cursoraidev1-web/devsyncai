# 📊 Zyndrx Database Entity Relationship Diagram

## Visual Database Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ZYNDRX DATABASE                                │
│                      15 Tables • UUID Primary Keys                       │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│     USERS        │
├──────────────────┤
│ • id (PK)        │
│ • email (UNIQUE) │
│ • full_name      │
│ • avatar_url     │
│ • role           │◄─────────────────────┐
│ • is_active      │                      │
│ • created_at     │                      │
│ • updated_at     │                      │
└────────┬─────────┘                      │
         │                                │
         │ owner_id                       │ user_id
         ▼                                │
┌──────────────────┐              ┌──────┴──────────┐
│    PROJECTS      │              │ PROJECT_MEMBERS │
├──────────────────┤              ├─────────────────┤
│ • id (PK)        │◄─────────────│ • id (PK)       │
│ • name           │ project_id   │ • project_id    │
│ • description    │              │ • user_id       │
│ • status         │              │ • role          │
│ • owner_id (FK)  │              │ • joined_at     │
│ • created_at     │              └─────────────────┘
│ • updated_at     │
└────────┬─────────┘
         │
         │ project_id (FK - CASCADE DELETE)
         │
    ┌────┼────────┬────────────┬──────────────┬─────────────┐
    │    │        │            │              │             │
    ▼    ▼        ▼            ▼              ▼             ▼
┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  PRDS  │  │  TASKS   │  │DOCUMENTS │  │INTEGR.   │  │ANALYTICS │
└────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘

═══════════════════════════════════════════════════════════════════════════
                              PRD SYSTEM
═══════════════════════════════════════════════════════════════════════════

┌──────────────────────┐
│        PRDS          │
├──────────────────────┤
│ • id (PK)            │
│ • project_id (FK)    │──────┐
│ • title              │      │
│ • content            │      │
│ • status             │      │ prd_id
│ • version            │      │
│ • created_by (FK)    │      ▼
│ • approved_by (FK)   │  ┌──────────────────┐     ┌──────────────────┐
│ • approved_at        │  │  PRD_VERSIONS    │     │  PRD_SECTIONS    │
│ • created_at         │  ├──────────────────┤     ├──────────────────┤
│ • updated_at         │  │ • id (PK)        │     │ • id (PK)        │
└──────────────────────┘  │ • prd_id (FK)    │     │ • prd_id (FK)    │
                          │ • version        │     │ • title          │
                          │ • content        │     │ • content        │
                          │ • changes_summary│     │ • order_index    │
                          │ • created_by (FK)│     │ • created_at     │
                          │ • created_at     │     │ • updated_at     │
                          └──────────────────┘     └──────────────────┘

═══════════════════════════════════════════════════════════════════════════
                            TASK SYSTEM
═══════════════════════════════════════════════════════════════════════════

┌──────────────────────┐
│       TASKS          │
├──────────────────────┤
│ • id (PK)            │
│ • project_id (FK)    │
│ • prd_id (FK)        │
│ • title              │
│ • description        │
│ • status             │
│ • priority           │
│ • assigned_to (FK)   │
│ • created_by (FK)    │
│ • due_date           │
│ • completed_at       │
│ • order_index        │
│ • created_at         │
│ • updated_at         │
└───────────┬──────────┘
            │
            │ task_id
            ▼
┌──────────────────────┐
│   TASK_COMMENTS      │
├──────────────────────┤
│ • id (PK)            │
│ • task_id (FK)       │
│ • user_id (FK)       │
│ • content            │
│ • mentions []        │  ← Array of user UUIDs
│ • created_at         │
│ • updated_at         │
└──────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                         DOCUMENT SYSTEM
═══════════════════════════════════════════════════════════════════════════

┌──────────────────────┐
│     DOCUMENTS        │
├──────────────────────┤
│ • id (PK)            │
│ • project_id (FK)    │
│ • prd_id (FK)        │  ← Optional link to PRD
│ • name               │
│ • file_path          │  ← Supabase Storage path
│ • file_size          │
│ • mime_type          │
│ • tags []            │  ← Array of strings
│ • uploaded_by (FK)   │
│ • created_at         │
└──────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                      NOTIFICATION SYSTEM
═══════════════════════════════════════════════════════════════════════════

┌──────────────────────┐
│   NOTIFICATIONS      │
├──────────────────────┤
│ • id (PK)            │
│ • user_id (FK)       │
│ • type               │  ← task_assigned, prd_approved, etc.
│ • title              │
│ • message            │
│ • data {}            │  ← JSONB metadata
│ • read               │
│ • created_at         │
└──────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                      INTEGRATION SYSTEM
═══════════════════════════════════════════════════════════════════════════

┌──────────────────────┐
│   INTEGRATIONS       │
├──────────────────────┤
│ • id (PK)            │
│ • project_id (FK)    │
│ • type               │  ← github, gitlab, slack, figma, notion
│ • config {}          │  ← JSONB configuration
│ • is_active          │
│ • connected_by (FK)  │
│ • created_at         │
│ • updated_at         │
└───────────┬──────────┘
            │
            │ (Related Tables)
            │
    ┌───────┼─────────┬──────────────┐
    │       │         │              │
    ▼       ▼         ▼              ▼
┌─────────┐ ┌───────┐ ┌──────────┐ ┌──────────┐
│ GITHUB  │ │COMMITS│ │DEPLOYMENTS│ │ (Future) │
│  REPOS  │ │       │ │          │ │          │
└─────────┘ └───────┘ └──────────┘ └──────────┘

┌──────────────────────┐
│   GITHUB_REPOS       │
├──────────────────────┤
│ • id (PK)            │
│ • project_id (FK)    │
│ • repo_name          │
│ • repo_url           │
│ • default_branch     │
│ • is_active          │
│ • created_at         │
└──────────────────────┘

┌──────────────────────┐
│      COMMITS         │
├──────────────────────┤
│ • id (PK)            │
│ • project_id (FK)    │
│ • task_id (FK)       │  ← Optional link to task
│ • commit_hash        │  ← UNIQUE
│ • commit_message     │
│ • author_name        │
│ • author_email       │
│ • committed_at       │
│ • created_at         │
└──────────────────────┘

┌──────────────────────┐
│    DEPLOYMENTS       │
├──────────────────────┤
│ • id (PK)            │
│ • project_id (FK)    │
│ • environment        │  ← dev, staging, prod
│ • status             │  ← pending, success, failed
│ • version            │
│ • deployed_by (FK)   │
│ • deployed_at        │
│ • logs               │
└──────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                      AUDIT & ANALYTICS
═══════════════════════════════════════════════════════════════════════════

┌──────────────────────┐           ┌──────────────────────┐
│    AUDIT_LOGS        │           │  ANALYTICS_EVENTS    │
├──────────────────────┤           ├──────────────────────┤
│ • id (PK)            │           │ • id (PK)            │
│ • user_id (FK)       │           │ • project_id (FK)    │
│ • action             │           │ • event_type         │
│ • entity_type        │           │ • event_data {}      │
│ • entity_id          │           │ • created_at         │
│ • metadata {}        │           └──────────────────────┘
│ • ip_address         │
│ • user_agent         │
│ • created_at         │
└──────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                          KEY RELATIONSHIPS
═══════════════════════════════════════════════════════════════════════════

USER ROLES (8 types):
├── admin              → Full system access
├── product_manager    → Create projects, approve PRDs
├── product_owner      → Create projects, manage features
├── developer          → Complete tasks, commit code
├── designer           → Design tasks, upload assets
├── qa_tester          → Test tasks, report bugs
├── devops             → Manage deployments, integrations
└── viewer             → Read-only access

PROJECT STATUSES (5 types):
├── planning           → Initial planning phase
├── in_progress        → Active development
├── on_hold            → Temporarily paused
├── completed          → Finished
└── archived           → Closed/archived

TASK STATUSES (6 types):
├── todo               → Not started
├── in_progress        → Being worked on
├── in_review          → Code review
├── in_qa              → Testing phase
├── blocked            → Cannot proceed
└── done               → Completed

TASK PRIORITIES (4 types):
├── low                → Nice to have
├── medium             → Normal priority
├── high               → Important
└── urgent             → Critical/blocking

PRD STATUSES (4 types):
├── draft              → Being written
├── review             → Waiting for approval
├── approved           → Ready for development
└── rejected           → Needs revision

INTEGRATION TYPES (5 types):
├── github             → GitHub repository
├── gitlab             → GitLab repository
├── slack              → Slack workspace
├── figma              → Figma designs
└── notion             → Notion docs

═══════════════════════════════════════════════════════════════════════════
                          CASCADE BEHAVIORS
═══════════════════════════════════════════════════════════════════════════

DELETE PROJECT →
  ├── DELETE all project_members
  ├── DELETE all prds
  │   ├── DELETE all prd_versions
  │   └── DELETE all prd_sections
  ├── DELETE all tasks
  │   └── DELETE all task_comments
  ├── DELETE all documents
  ├── DELETE all integrations
  ├── DELETE all github_repos
  ├── DELETE all commits
  ├── DELETE all deployments
  └── DELETE all analytics_events

DELETE USER →
  ├── DELETE owned projects (cascade above)
  ├── DELETE project_memberships
  ├── DELETE task_comments
  ├── DELETE notifications
  ├── KEEP audit_logs (set user_id to NULL)
  └── SET NULL on:
      ├── tasks.assigned_to
      ├── tasks.created_by (if last action)
      └── deployments.deployed_by

DELETE TASK →
  └── DELETE all task_comments

DELETE PRD →
  ├── DELETE all prd_versions
  ├── DELETE all prd_sections
  └── SET NULL on:
      ├── documents.prd_id
      └── tasks.prd_id

═══════════════════════════════════════════════════════════════════════════
                       PERFORMANCE INDEXES
═══════════════════════════════════════════════════════════════════════════

USERS:
  • idx_users_email (email)
  • idx_users_role (role)

PROJECTS:
  • idx_projects_owner (owner_id)
  • idx_projects_status (status)

PROJECT_MEMBERS:
  • idx_project_members_project (project_id)
  • idx_project_members_user (user_id)

PRDS:
  • idx_prds_project (project_id)
  • idx_prds_status (status)
  • idx_prds_created_by (created_by)

TASKS:
  • idx_tasks_project (project_id)
  • idx_tasks_assigned (assigned_to)
  • idx_tasks_status (status)
  • idx_tasks_created_by (created_by)

NOTIFICATIONS:
  • idx_notifications_user (user_id)
  • idx_notifications_read (read)

AUDIT_LOGS:
  • idx_audit_logs_user (user_id)
  • idx_audit_logs_entity (entity_type, entity_id)
  • idx_audit_logs_created (created_at)

═══════════════════════════════════════════════════════════════════════════
                        DATABASE STATISTICS
═══════════════════════════════════════════════════════════════════════════

Total Tables:     15
Total Indexes:    16 (plus primary key indexes)
UUID Keys:        All tables
Timestamps:       Auto-updating on 7 tables
Foreign Keys:     28 relationships
Unique Constr.:   5 (email, project member, prd version, commit hash, etc.)
Check Constr.:    9 (roles, statuses, priorities, types)
Array Fields:     3 (tags, mentions, custom fields)
JSONB Fields:     4 (notification data, integration config, audit metadata, analytics)
Text Search:      Ready for implementation
```

## 🔍 Query Patterns

### Most Common Queries

1. **Get User's Projects**
   ```sql
   SELECT p.* FROM projects p
   JOIN project_members pm ON p.id = pm.project_id
   WHERE pm.user_id = ?
   ```

2. **Get Project Tasks**
   ```sql
   SELECT * FROM tasks
   WHERE project_id = ?
   ORDER BY order_index, priority DESC
   ```

3. **Get User Notifications**
   ```sql
   SELECT * FROM notifications
   WHERE user_id = ? AND read = false
   ORDER BY created_at DESC
   ```

## 📈 Scaling Considerations

- UUID keys prevent ID collision in distributed systems
- Indexes on all foreign keys for fast joins
- JSONB for flexible metadata storage
- Array types for tags and mentions
- Timestamp indexes for time-based queries
- Composite indexes for common query patterns

---

**This diagram shows the complete Zyndrx database structure with all relationships and constraints.**
