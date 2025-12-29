# Frontend API Integration Guide

Complete guide for integrating your frontend with the Zyndrx backend API.

## Table of Contents
1. [Setup & Configuration](#setup--configuration)
2. [Authentication](#authentication)
3. [API Client Setup](#api-client-setup)
4. [Endpoints Reference](#endpoints-reference)
5. [Integration Examples](#integration-examples)
6. [File Uploads](#file-uploads)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

---

## Setup & Configuration

### Base URL
The API client is configured in `src/api/client.js`:
```javascript
const ENV_BASE_URL = process.env.REACT_APP_API_URL || '';
const BASE_URL = ENV_BASE_URL.includes('/api/v1') ? ENV_BASE_URL : `${ENV_BASE_URL}/api/v1`;
```

### Environment Variables
Create a `.env` file in the project root:
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Authentication

All endpoints require authentication. The API client automatically includes the JWT token from `localStorage.getItem('zyndrx_token')` in the Authorization header:

```javascript
// Token is automatically included in all requests
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

### Getting the Token
After login, the token is stored in localStorage:
```javascript
// After successful login (handled by AuthContext)
localStorage.setItem('zyndrx_token', token);
localStorage.setItem('zyndrx_user', JSON.stringify(user));
```

---

## API Client Setup

The API client is already set up in `src/api/client.js`. It handles:
- Automatic token inclusion
- Error handling
- Response normalization
- 401 redirects to login

### Usage
```javascript
import { api } from './api/client';

// GET request
const data = await api.get('/projects');

// POST request
const newProject = await api.post('/projects', { name: 'New Project' });

// PATCH request
const updated = await api.patch('/projects/123', { name: 'Updated' });

// DELETE request
await api.delete('/projects/123');
```

---

## Endpoints Reference

### 1. PRD Endpoints

Located in `src/api/prds.js`:

```javascript
import { fetchPRDs, createPRD, getPRD, updatePRD, deletePRD } from '../api/prds';

// List PRDs (optionally filtered by project)
const prds = await fetchPRDs({ project_id: projectId });
// or all PRDs
const allPrds = await fetchPRDs();

// Get single PRD
const prd = await getPRD(prdId);

// Create PRD
const newPRD = await createPRD({
  project_id: projectId,
  title: 'New Feature PRD',
  content: { /* PRD content */ }
});

// Update PRD
const updated = await updatePRD(prdId, { title: 'Updated Title' });

// Delete PRD
await deletePRD(prdId);
```

### 2. Project Endpoints

Located in `src/api/projects.js`:

```javascript
import { 
  fetchProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../api/projects';

// List projects
const projects = await fetchProjects();

// Get single project
const project = await getProject(projectId);

// Create project
const newProject = await createProject({
  name: 'New Project',
  description: 'Description',
  team_name: 'Engineering',
  start_date: '2024-01-01',
  end_date: '2024-12-31'
});

// Update project
const updated = await updateProject(projectId, { name: 'Updated' });

// Delete project
await deleteProject(projectId);
```

### 3. Task Endpoints

Located in `src/api/tasks.js`:

```javascript
import { 
  fetchTasksByProject, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../api/tasks';

// List tasks by project
const tasks = await fetchTasksByProject(projectId);

// Create task
const newTask = await createTask({
  project_id: projectId,
  title: 'New Task',
  description: 'Description',
  priority: 'high',
  assigned_to: userId, // user UUID
  tags: ['frontend', 'urgent'],
  due_date: '2024-12-31'
});

// Update task
const updated = await updateTask(taskId, { status: 'in_progress' });

// Delete task
await deleteTask(taskId);
```

### 4. Task Comments

Located in `src/api/comments.js`:

```javascript
import { getComments, createComment, updateComment, deleteComment } from '../api/comments';

// Get comments for a task
const comments = await getComments({
  resource_type: 'task',
  resource_id: taskId
});

// Create comment
const comment = await createComment({
  resource_type: 'task',
  resource_id: taskId,
  project_id: projectId,
  content: 'This is a comment',
  parent_id: parentCommentId // optional, for threading
});

// Update comment
const updated = await updateComment(commentId, { content: 'Updated' });

// Delete comment
await deleteComment(commentId);
```

### 5. Task Attachments

Located in `src/api/attachments.js`:

```javascript
import {
  getTaskAttachmentUploadToken,
  saveTaskAttachment,
  getTaskAttachments,
  getAttachmentDownloadUrl,
  deleteAttachment
} from '../api/attachments';

// Get upload token
const tokenData = await getTaskAttachmentUploadToken(taskId, {
  file_name: 'document.pdf',
  file_size: 1024000,
  file_type: 'application/pdf'
});

// After uploading to Supabase, save metadata
const attachment = await saveTaskAttachment(taskId, {
  task_id: taskId,
  project_id: projectId,
  file_name: 'document.pdf',
  file_path: tokenData.upload_path,
  file_url: publicUrl,
  file_type: 'application/pdf',
  file_size: 1024000
});

// List attachments
const attachments = await getTaskAttachments(taskId);

// Get download URL
const downloadData = await getAttachmentDownloadUrl(attachmentId);

// Delete attachment
await deleteAttachment(attachmentId);
```

### 6. Document Endpoints

Located in `src/api/documents.js`:

```javascript
import {
  fetchDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentUploadToken,
  downloadDocument
} from '../api/documents';

// List documents
const documents = await fetchDocuments(projectId);

// Get single document
const document = await getDocument(documentId);

// Get upload token
const tokenData = await getDocumentUploadToken({
  project_id: projectId,
  file_name: 'document.pdf',
  file_size: 1024000,
  file_type: 'application/pdf'
});

// Create document (after uploading to Supabase)
const document = await createDocument({
  project_id: projectId,
  title: 'Document Title',
  file_path: tokenData.upload_path,
  file_type: 'application/pdf',
  file_size: 1024000,
  tags: ['important']
});

// Update document
const updated = await updateDocument(documentId, { title: 'Updated' });

// Download document
const downloadData = await downloadDocument(documentId);

// Delete document
await deleteDocument(documentId);
```

### 7. Handoffs Endpoints

Located in `src/api/handoffs.js`:

```javascript
import {
  fetchHandoffs,
  getHandoff,
  createHandoff,
  updateHandoff,
  deleteHandoff,
  approveHandoff,
  rejectHandoff
} from '../api/handoffs';

// List handoffs
const handoffs = await fetchHandoffs({ project_id: projectId, status: 'pending' });

// Get single handoff
const handoff = await getHandoff(handoffId);

// Create handoff
const handoff = await createHandoff({
  project_id: projectId,
  to_user_id: userId,
  title: 'Handoff Title',
  description: 'Description',
  priority: 'high',
  due_date: '2024-12-31T23:59:59Z'
});

// Update handoff
const updated = await updateHandoff(handoffId, { status: 'in_review' });

// Approve handoff
await approveHandoff(handoffId, 'Approved');

// Reject handoff
await rejectHandoff(handoffId, 'Needs more info');

// Delete handoff
await deleteHandoff(handoffId);
```

### 8. Teams Endpoints

Located in `src/api/teams.js`:

```javascript
import {
  fetchTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamMembers,
  addTeamMember,
  removeTeamMember
} from '../api/teams';

// List teams
const teams = await fetchTeams();

// Get single team
const team = await getTeam(teamId);

// Create team
const team = await createTeam({
  name: 'Engineering Team',
  description: 'Description',
  team_lead_id: leadUserId
});

// Update team
const updated = await updateTeam(teamId, { name: 'Updated Name' });

// Get team members
const members = await getTeamMembers(teamId);

// Add team member
await addTeamMember(teamId, { user_id: userId, role: 'developer' });

// Remove team member
await removeTeamMember(teamId, userId);

// Delete team
await deleteTeam(teamId);
```

### 9. Activity Feed

Located in `src/api/activity.js`:

```javascript
import { fetchActivity, createActivity } from '../api/activity';

// Get activity feed
const activities = await fetchActivity({
  project_id: projectId,
  type: 'task', // optional: 'task', 'prd', 'comment', 'file', 'handoff'
  limit: 50
});
```

### 10. Analytics Endpoints

Located in `src/api/analytics.js`:

```javascript
import { 
  getAnalytics, 
  getKPIs, 
  getProjectProgress, 
  getTeamPerformance, 
  getTaskAnalytics 
} from '../api/analytics';

// Get full analytics
const analytics = await getAnalytics({ project_id: projectId });

// Get KPI cards
const kpis = await getKPIs({ project_id: projectId });

// Get project progress
const progress = await getProjectProgress({ project_id: projectId });

// Get team performance
const performance = await getTeamPerformance({ project_id: projectId });

// Get task analytics
const taskAnalytics = await getTaskAnalytics({ project_id: projectId });
```

---

## Integration Examples

### React Hook for PRDs

Use the `usePRDs` hook from `src/hooks/usePRDs.js`:

```javascript
import { usePRDs } from '../hooks/usePRDs';

function PRDList({ projectId }) {
  const { prds, loading, error, createPRD, updatePRD, deletePRD } = usePRDs(projectId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {prds.map(prd => (
        <div key={prd.id}>{prd.title}</div>
      ))}
    </div>
  );
}
```

### React Hook for Tasks with Comments

Use the `useTasks` hook from `src/hooks/useTasks.js`:

```javascript
import { useTasks } from '../hooks/useTasks';

function TaskList({ projectId }) {
  const { 
    tasks, 
    loading, 
    error, 
    createTask, 
    updateTask, 
    deleteTask,
    getTaskComments,
    addComment 
  } = useTasks(projectId);

  const handleAddComment = async (taskId, content) => {
    await addComment(taskId, projectId, content);
  };

  // ... rest of component
}
```

---

## File Uploads

### Task Attachment Upload

Use the `uploadTaskAttachment` utility from `src/utils/fileUpload.js`:

```javascript
import { uploadTaskAttachment, validateFile } from '../utils/fileUpload';

async function handleFileUpload(taskId, projectId, file) {
  // Validate file
  const validation = validateFile(file, {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'image/png', 'image/jpeg']
  });

  if (!validation.isValid) {
    alert(validation.error);
    return;
  }

  try {
    // Upload with progress tracking
    const attachment = await uploadTaskAttachment(
      taskId,
      projectId,
      file,
      {
        onProgress: (percent) => {
          console.log(`Upload progress: ${percent}%`);
        }
      }
    );
    console.log('Upload complete:', attachment);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

### Document Upload

Use the `uploadDocumentFile` utility:

```javascript
import { uploadDocumentFile } from '../utils/fileUpload';

async function handleDocumentUpload(projectId, file) {
  try {
    const document = await uploadDocumentFile(
      projectId,
      file,
      {
        title: 'My Document',
        tags: ['important', 'reference']
      },
      {
        onProgress: (percent) => console.log(`Progress: ${percent}%`)
      }
    );
    console.log('Document uploaded:', document);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

### Upload Flow

The upload process follows this pattern:

1. **Get Upload Token**: Request an upload token from the backend
   ```javascript
   const tokenData = await getTaskAttachmentUploadToken(taskId, fileInfo);
   ```

2. **Upload to Supabase**: Upload the file to Supabase Storage
   ```javascript
   const uploadResult = await uploadFile(file, 'task-attachments', tokenData.upload_path);
   ```

3. **Save Metadata**: Save the attachment metadata to the backend
   ```javascript
   const attachment = await saveTaskAttachment(taskId, metadata);
   ```

The `uploadTaskAttachment` and `uploadDocumentFile` utilities handle all three steps automatically.

---

## Error Handling

### Standard Error Response Format
```javascript
{
  success: false,
  error: "Error message here"
}
```

### Error Handling in Components

```javascript
import { useState } from 'react';

function MyComponent() {
  const [error, setError] = useState(null);

  const handleAction = async () => {
    try {
      setError(null);
      await someApiCall();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {/* ... */}
    </div>
  );
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token) - automatically redirects to login
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `413` - Payload Too Large (file size limit)
- `500` - Internal Server Error

---

## Best Practices

### 1. Always Handle Loading States

```javascript
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get('/endpoint');
      // handle data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### 2. Use Custom Hooks

Use the provided hooks (`usePRDs`, `useTasks`) for consistent data management:

```javascript
const { prds, loading, error, createPRD } = usePRDs(projectId);
```

### 3. Validate Data Before Sending

```javascript
const createTask = async (data) => {
  // Validate required fields
  if (!data.title || !data.project_id) {
    throw new Error('Title and project ID are required');
  }
  
  // Validate file size if uploading
  if (data.file) {
    const validation = validateFile(data.file, { maxSize: 10 * 1024 * 1024 });
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
  }
  
  return await api.post('/tasks', data);
};
```

### 4. Implement Request Cancellation

```javascript
useEffect(() => {
  const abortController = new AbortController();

  const fetchData = async () => {
    try {
      const response = await fetch(url, {
        signal: abortController.signal
      });
      // handle response
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
      }
    }
  };

  fetchData();

  return () => {
    abortController.abort();
  };
}, [url]);
```

### 5. Use Optimistic Updates

```javascript
const updateTask = async (id, updates) => {
  // Optimistically update UI
  setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  
  try {
    await api.patch(`/tasks/${id}`, updates);
  } catch (error) {
    // Revert on error
    setTasks(originalTasks);
    throw error;
  }
};
```

---

## Troubleshooting

### Issue: 401 Unauthorized
**Solution:** Check if token is stored and included in headers. The API client automatically handles this, but verify:
```javascript
const token = localStorage.getItem('zyndrx_token');
if (!token) {
  // Redirect to login
  window.location.href = '/login';
}
```

### Issue: 403 Forbidden
**Solution:** User doesn't have permission. Check user role and company membership.

### Issue: CORS Errors
**Solution:** Ensure backend CORS is configured to allow your frontend origin.

### Issue: File Upload Fails
**Solution:** 
1. Check file size limits
2. Verify Supabase bucket exists and is configured
3. Ensure upload token is valid (not expired)
4. Check Supabase environment variables are set

### Issue: Response Data Structure
**Solution:** The API client handles both response formats:
- `{ success: true, data: [...] }`
- Direct array/object response

---

## Quick Reference

### Import Statements

```javascript
// API endpoints
import { fetchPRDs, createPRD } from '../api/prds';
import { fetchTasksByProject, createTask } from '../api/tasks';
import { getComments, createComment } from '../api/comments';
import { getTaskAttachments, getTaskAttachmentUploadToken } from '../api/attachments';

// Hooks
import { usePRDs } from '../hooks/usePRDs';
import { useTasks } from '../hooks/useTasks';

// Utilities
import { uploadTaskAttachment, uploadDocumentFile, validateFile } from '../utils/fileUpload';
```

### Common Patterns

```javascript
// Fetch with loading state
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.get('/endpoint');
      setData(result);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

---

**Need Help?** Check the backend logs or contact the backend team for API issues.

