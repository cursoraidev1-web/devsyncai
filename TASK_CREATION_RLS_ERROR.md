# Task Creation RLS Error Fix

## Error
```
{success: false, error: "Failed to create task: new row violates row-level security policy for table \"tasks\""}
```

## Problem
This is a **backend Supabase RLS (Row Level Security) policy issue**. The backend is trying to insert a task into the Supabase `tasks` table, but the RLS policy is blocking the operation.

## Frontend Changes Made
1. **Improved error handling** in `src/api/tasks.js`:
   - Added validation for required fields (title, project_id)
   - Better error messages for RLS errors
   - Ensured all fields are properly formatted before sending

2. **Enhanced TaskTracker.js**:
   - Better error message display to users

## Backend Fix Required

The backend needs to fix the RLS policy. Options:

### Option 1: Use Service Role Key (Recommended for Backend)
The backend should use Supabase's **service role key** (not anon key) for server-side operations. This bypasses RLS policies.

```javascript
// Backend should use service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // NOT anon key
);
```

### Option 2: Update RLS Policies
If using anon key, update Supabase RLS policies to allow authenticated users to create tasks:

```sql
-- Allow authenticated users to create tasks
CREATE POLICY "Users can create tasks"
ON tasks
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Or more restrictive: only for users in the same company
CREATE POLICY "Users can create tasks in their company"
ON tasks
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.company_id = tasks.company_id
  )
);
```

### Option 3: Set User Context
If the backend is using Supabase client, ensure the user context is set:

```javascript
// Backend should set user context from JWT
const supabase = createClient(url, key, {
  global: {
    headers: {
      Authorization: `Bearer ${userJwtToken}`
    }
  }
});
```

## Current Frontend Payload
The frontend sends:
```json
{
  "title": "Task title",
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "project_id": "project-uuid",
  "due_date": "2024-01-01" (if provided),
  "tags": [] (array)
}
```

## Verification
- Frontend validates required fields before sending
- Frontend properly formats all fields
- Error messages are user-friendly
- Backend needs to fix RLS policy or use service role key

