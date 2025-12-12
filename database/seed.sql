-- ==========================================
-- ZYNDRX SEED DATA
-- Development & Testing Data
-- ==========================================

-- Note: This is for development/testing only
-- DO NOT run this in production!

-- ==========================================
-- SEED USERS
-- ==========================================

-- Admin User
INSERT INTO users (id, email, full_name, role, avatar_url) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@zyndrx.com', 
  'Admin User', 
  'admin',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
) ON CONFLICT (email) DO NOTHING;

-- Product Manager
INSERT INTO users (id, email, full_name, role, avatar_url) 
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'pm@zyndrx.com', 
  'Product Manager', 
  'product_manager',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=pm'
) ON CONFLICT (email) DO NOTHING;

-- Product Owner
INSERT INTO users (id, email, full_name, role, avatar_url) 
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'po@zyndrx.com', 
  'Product Owner', 
  'product_owner',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=po'
) ON CONFLICT (email) DO NOTHING;

-- Developer
INSERT INTO users (id, email, full_name, role, avatar_url) 
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'dev@zyndrx.com', 
  'John Developer', 
  'developer',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=dev'
) ON CONFLICT (email) DO NOTHING;

-- Designer
INSERT INTO users (id, email, full_name, role, avatar_url) 
VALUES (
  '00000000-0000-0000-0000-000000000005',
  'designer@zyndrx.com', 
  'Jane Designer', 
  'designer',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=designer'
) ON CONFLICT (email) DO NOTHING;

-- QA Tester
INSERT INTO users (id, email, full_name, role, avatar_url) 
VALUES (
  '00000000-0000-0000-0000-000000000006',
  'qa@zyndrx.com', 
  'QA Tester', 
  'qa_tester',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=qa'
) ON CONFLICT (email) DO NOTHING;

-- DevOps Engineer
INSERT INTO users (id, email, full_name, role, avatar_url) 
VALUES (
  '00000000-0000-0000-0000-000000000007',
  'devops@zyndrx.com', 
  'DevOps Engineer', 
  'devops',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=devops'
) ON CONFLICT (email) DO NOTHING;

-- ==========================================
-- SEED PROJECTS
-- ==========================================

-- Project 1: E-commerce Platform
INSERT INTO projects (id, name, description, status, owner_id) 
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'E-commerce Platform',
  'Building a modern e-commerce platform with React and Node.js',
  'in_progress',
  '00000000-0000-0000-0000-000000000002' -- PM
) ON CONFLICT (id) DO NOTHING;

-- Project 2: Mobile App
INSERT INTO projects (id, name, description, status, owner_id) 
VALUES (
  '10000000-0000-0000-0000-000000000002',
  'Mobile App Redesign',
  'Complete redesign of our mobile application',
  'planning',
  '00000000-0000-0000-0000-000000000003' -- PO
) ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- SEED PROJECT MEMBERS
-- ==========================================

-- E-commerce Platform Team
INSERT INTO project_members (project_id, user_id, role) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'product_manager'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'developer'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'designer'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'qa_tester')
ON CONFLICT (project_id, user_id) DO NOTHING;

-- Mobile App Team
INSERT INTO project_members (project_id, user_id, role) VALUES
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'product_owner'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'developer'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'designer')
ON CONFLICT (project_id, user_id) DO NOTHING;

-- ==========================================
-- SEED PRDs
-- ==========================================

INSERT INTO prds (id, project_id, title, content, status, version, created_by) 
VALUES (
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'E-commerce Platform MVP',
  '# E-commerce Platform MVP

## Overview
Build a modern e-commerce platform that allows users to browse products, add to cart, and checkout.

## Features
1. User Authentication
2. Product Catalog
3. Shopping Cart
4. Payment Integration
5. Order Management

## Technical Requirements
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Payment: Stripe Integration',
  'approved',
  1,
  '00000000-0000-0000-0000-000000000002'
) ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- SEED TASKS
-- ==========================================

-- Tasks for E-commerce Platform
INSERT INTO tasks (project_id, prd_id, title, description, status, priority, assigned_to, created_by) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Set up authentication system',
    'Implement user registration and login with JWT',
    'in_progress',
    'high',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Design product catalog UI',
    'Create mockups for product listing and detail pages',
    'done',
    'high',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Implement shopping cart',
    'Build shopping cart functionality with add/remove items',
    'todo',
    'medium',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Integrate Stripe payment',
    'Set up Stripe integration for checkout',
    'todo',
    'high',
    NULL,
    '00000000-0000-0000-0000-000000000002'
  );

-- ==========================================
-- SEED NOTIFICATIONS
-- ==========================================

INSERT INTO notifications (user_id, type, title, message, data) VALUES
  (
    '00000000-0000-0000-0000-000000000004',
    'task_assigned',
    'New Task Assigned',
    'You have been assigned to: Set up authentication system',
    '{"task_id": "task-id-here", "project_id": "10000000-0000-0000-0000-000000000001"}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'task_assigned',
    'Task Completed',
    'Your task "Design product catalog UI" has been marked as done',
    '{"task_id": "task-id-here", "project_id": "10000000-0000-0000-0000-000000000001"}'::jsonb
  );

-- ==========================================
-- SEED INTEGRATIONS
-- ==========================================

INSERT INTO integrations (project_id, type, config, is_active, connected_by) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'github',
    '{"repo": "zyndrx/ecommerce-platform", "webhook_url": "https://api.zyndrx.com/webhooks/github"}'::jsonb,
    true,
    '00000000-0000-0000-0000-000000000007'
  );

-- ==========================================
-- SEED GITHUB REPOS
-- ==========================================

INSERT INTO github_repos (project_id, repo_name, repo_url, default_branch) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'zyndrx/ecommerce-platform',
    'https://github.com/zyndrx/ecommerce-platform',
    'main'
  );

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- Check if seed data was inserted correctly
-- Run these queries to verify:

-- SELECT COUNT(*) as user_count FROM users;
-- SELECT COUNT(*) as project_count FROM projects;
-- SELECT COUNT(*) as task_count FROM tasks;
-- SELECT COUNT(*) as prd_count FROM prds;

-- View all seeded data:
-- SELECT u.full_name, u.role FROM users u ORDER BY u.created_at;
-- SELECT p.name, p.status, u.full_name as owner FROM projects p JOIN users u ON p.owner_id = u.id;
-- SELECT t.title, t.status, t.priority, u.full_name as assigned_to FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id;
