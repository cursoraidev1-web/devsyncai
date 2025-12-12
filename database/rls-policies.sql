-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- For Production Security
-- ==========================================

-- ⚠️ WARNING: Only enable RLS in production!
-- RLS adds security but requires proper authentication setup
-- Make sure Supabase Auth is properly configured first

-- ==========================================
-- ENABLE RLS ON TABLES
-- ==========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE prds ENABLE ROW LEVEL SECURITY;
ALTER TABLE prd_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prd_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- HELPER FUNCTION - Get Current User ID
-- ==========================================

CREATE OR REPLACE FUNCTION auth.user_id()
RETURNS UUID AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    current_setting('request.jwt.claims', true)::json->>'user_id'
  )::uuid;
$$ LANGUAGE SQL STABLE;

-- ==========================================
-- HELPER FUNCTION - Check if user is admin
-- ==========================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.user_id()
    AND role = 'admin'
  );
$$ LANGUAGE SQL STABLE;

-- ==========================================
-- HELPER FUNCTION - Check project membership
-- ==========================================

CREATE OR REPLACE FUNCTION is_project_member(project_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = project_uuid
    AND user_id = auth.user_id()
  );
$$ LANGUAGE SQL STABLE;

-- ==========================================
-- USERS TABLE POLICIES
-- ==========================================

-- Users can view all users (for mentions, assignments, etc.)
CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.user_id());

-- Only admins can insert new users (or use Supabase Auth)
CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can delete users
CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  USING (is_admin());

-- ==========================================
-- PROJECTS TABLE POLICIES
-- ==========================================

-- Users can view projects they're members of
CREATE POLICY "Users can view their projects"
  ON projects FOR SELECT
  USING (
    is_admin() OR 
    owner_id = auth.user_id() OR 
    is_project_member(id)
  );

-- Product Managers and Owners can create projects
CREATE POLICY "PMs and POs can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.user_id()
      AND role IN ('product_manager', 'product_owner', 'admin')
    )
  );

-- Project owners can update their projects
CREATE POLICY "Project owners can update projects"
  ON projects FOR UPDATE
  USING (
    is_admin() OR 
    owner_id = auth.user_id()
  );

-- Only admins and owners can delete projects
CREATE POLICY "Owners can delete projects"
  ON projects FOR DELETE
  USING (
    is_admin() OR 
    owner_id = auth.user_id()
  );

-- ==========================================
-- PROJECT MEMBERS TABLE POLICIES
-- ==========================================

-- Users can view members of projects they're in
CREATE POLICY "Users can view project members"
  ON project_members FOR SELECT
  USING (
    is_admin() OR 
    is_project_member(project_id)
  );

-- Project owners can add members
CREATE POLICY "Project owners can add members"
  ON project_members FOR INSERT
  WITH CHECK (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_id
      AND owner_id = auth.user_id()
    )
  );

-- Project owners can remove members
CREATE POLICY "Project owners can remove members"
  ON project_members FOR DELETE
  USING (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_id
      AND owner_id = auth.user_id()
    )
  );

-- ==========================================
-- PRDS TABLE POLICIES
-- ==========================================

-- Users can view PRDs of their projects
CREATE POLICY "Users can view project PRDs"
  ON prds FOR SELECT
  USING (
    is_admin() OR 
    is_project_member(project_id)
  );

-- Project members can create PRDs
CREATE POLICY "Project members can create PRDs"
  ON prds FOR INSERT
  WITH CHECK (
    is_admin() OR 
    is_project_member(project_id)
  );

-- PRD creators and PMs can update
CREATE POLICY "PRD creators can update PRDs"
  ON prds FOR UPDATE
  USING (
    is_admin() OR 
    created_by = auth.user_id() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.user_id()
      AND role IN ('product_manager', 'product_owner')
    )
  );

-- ==========================================
-- TASKS TABLE POLICIES
-- ==========================================

-- Users can view tasks in their projects
CREATE POLICY "Users can view project tasks"
  ON tasks FOR SELECT
  USING (
    is_admin() OR 
    is_project_member(project_id)
  );

-- Project members can create tasks
CREATE POLICY "Project members can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    is_admin() OR 
    is_project_member(project_id)
  );

-- Task creators and assignees can update
CREATE POLICY "Users can update their tasks"
  ON tasks FOR UPDATE
  USING (
    is_admin() OR 
    created_by = auth.user_id() OR
    assigned_to = auth.user_id() OR
    is_project_member(project_id)
  );

-- ==========================================
-- TASK COMMENTS TABLE POLICIES
-- ==========================================

-- Users can view comments on tasks in their projects
CREATE POLICY "Users can view task comments"
  ON task_comments FOR SELECT
  USING (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id
      AND is_project_member(t.project_id)
    )
  );

-- Project members can comment on tasks
CREATE POLICY "Project members can comment"
  ON task_comments FOR INSERT
  WITH CHECK (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id
      AND is_project_member(t.project_id)
    )
  );

-- Users can update/delete their own comments
CREATE POLICY "Users can update own comments"
  ON task_comments FOR UPDATE
  USING (user_id = auth.user_id());

CREATE POLICY "Users can delete own comments"
  ON task_comments FOR DELETE
  USING (user_id = auth.user_id());

-- ==========================================
-- NOTIFICATIONS TABLE POLICIES
-- ==========================================

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.user_id());

-- System can insert notifications for any user
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.user_id());

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.user_id());

-- ==========================================
-- DOCUMENTS TABLE POLICIES
-- ==========================================

-- Users can view documents in their projects
CREATE POLICY "Users can view project documents"
  ON documents FOR SELECT
  USING (
    is_admin() OR 
    is_project_member(project_id)
  );

-- Project members can upload documents
CREATE POLICY "Project members can upload documents"
  ON documents FOR INSERT
  WITH CHECK (
    is_admin() OR 
    is_project_member(project_id)
  );

-- Document uploaders can delete their documents
CREATE POLICY "Uploaders can delete documents"
  ON documents FOR DELETE
  USING (
    is_admin() OR 
    uploaded_by = auth.user_id()
  );

-- ==========================================
-- INTEGRATIONS TABLE POLICIES
-- ==========================================

-- Project members can view integrations
CREATE POLICY "Users can view project integrations"
  ON integrations FOR SELECT
  USING (
    is_admin() OR 
    is_project_member(project_id)
  );

-- Only admins and DevOps can manage integrations
CREATE POLICY "Admins and DevOps can manage integrations"
  ON integrations FOR ALL
  USING (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.user_id()
      AND role IN ('admin', 'devops')
    )
  );

-- ==========================================
-- AUDIT LOGS TABLE POLICIES
-- ==========================================

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (is_admin());

-- System can insert audit logs
CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- ==========================================
-- ANALYTICS EVENTS TABLE POLICIES
-- ==========================================

-- Project members can view analytics
CREATE POLICY "Users can view project analytics"
  ON analytics_events FOR SELECT
  USING (
    is_admin() OR
    project_id IS NULL OR
    is_project_member(project_id)
  );

-- System can insert analytics events
CREATE POLICY "System can create analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- ==========================================
-- VERIFICATION
-- ==========================================

-- After enabling RLS, test with:
-- SET request.jwt.claims = '{"sub": "user-uuid-here"}';
-- SELECT * FROM projects; -- Should only show user's projects

-- To disable RLS for testing:
-- ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
