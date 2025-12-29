# Task Fetching Improvements

## Problems Fixed

### 1. **Single Global Tasks Array**
**Problem**: All tasks were stored in one array, but tasks are project-specific. When switching projects, tasks from different projects would mix or get replaced.

**Solution**: 
- Added `tasksByProject` Map to cache tasks by project ID
- `tasks` array now contains all tasks (for dashboards)
- Project-specific views use cached tasks when available

### 2. **No Caching**
**Problem**: Every time you switched projects or components, tasks were refetched, even if you just loaded them.

**Solution**:
- Implemented per-project caching in `tasksByProject` Map
- `loadTasks(projectId, forceRefresh)` now checks cache first
- Cache is updated when tasks are created/updated/deleted

### 3. **Tasks Replaced on Project Switch**
**Problem**: When loading tasks for Project B, it would replace Project A's tasks, breaking views showing different projects.

**Solution**:
- Tasks are now cached per project
- `loadAllTasks()` fetches all tasks for dashboards
- Project-specific views use cached data when available

### 4. **Inefficient API Calls**
**Problem**: Only `fetchTasksByProject(projectId)` existed, requiring separate calls for each project.

**Solution**:
- Added `fetchTasks(projectId?)` that can fetch all tasks or filter by project
- `fetchTasksByProject()` now calls `fetchTasks()` for backward compatibility
- Dashboards use `loadAllTasks()` to fetch all tasks once

### 5. **Wrong Filtering in Dashboards**
**Problem**: Dashboards filtered tasks by role strings (`assignee === 'developer'`) but backend uses user IDs.

**Solution**:
- Updated dashboards to filter by `assigned_to === user.id` or `assignee_id === user.id`
- Added fallback for unassigned tasks based on user role
- Properly imports and uses `useAuth()` to get current user

## Implementation Details

### API Changes (`src/api/tasks.js`)
```javascript
// New: Fetch all tasks or filter by project
export const fetchTasks = (projectId = null) => {
  const query = projectId ? `?project_id=${projectId}` : '';
  return api.get(`/tasks${query}`).then(/* ... */);
};

// Updated: Now uses fetchTasks internally
export const fetchTasksByProject = (projectId) => {
  return fetchTasks(projectId);
};
```

### AppContext Changes (`src/context/AppContext.js`)
```javascript
// Added caching
const [tasksByProject, setTasksByProject] = useState(new Map());

// New: Load all tasks for dashboards
const loadAllTasks = useCallback(async () => {
  const data = await fetchTasks(); // No project filter
  setTasks(data);
}, [token]);

// Updated: Cached project-specific loading
const loadTasks = useCallback(async (projectId, forceRefresh = false) => {
  // Check cache first
  if (!forceRefresh && tasksByProject.has(projectId)) {
    setTasks(tasksByProject.get(projectId));
    return;
  }
  // Fetch and cache
  const data = await fetchTasksByProject(projectId);
  setTasksByProject(prev => new Map(prev).set(projectId, data));
  setTasks(data);
}, [token, projects, tasksByProject]);
```

### Dashboard Updates

**DeveloperDashboard** (`src/pages/dashboards/DeveloperDashboard.js`):
```javascript
// Before: tasks.filter(t => t.assignee === 'developer')
// After:
const myTasks = tasks.filter(t => 
  t.assigned_to === user?.id || 
  t.assignee_id === user?.id ||
  (user?.role === 'developer' && !t.assigned_to && !t.assignee_id)
);
```

**QADashboard** (`src/pages/dashboards/QADashboard.js`):
```javascript
// Before: tasks.filter(t => t.assignee === 'qa' || t.tags.includes('testing'))
// After:
const qaTasks = tasks.filter(t => 
  t.assigned_to === user?.id || 
  t.assignee_id === user?.id ||
  t.tags?.includes('testing') ||
  (user?.role === 'qa' && !t.assigned_to && !t.assignee_id)
);
```

## Benefits

1. **Performance**: Tasks are cached per project, reducing API calls
2. **Correctness**: Dashboards now filter by user ID, not role strings
3. **Efficiency**: All tasks loaded once for dashboards instead of per-project
4. **Reliability**: Project-specific views don't interfere with each other
5. **Scalability**: Cache can be extended to support more complex scenarios

## Usage

### For Project-Specific Views
```javascript
const { loadTasks, tasks } = useApp();

// Load tasks for a project (uses cache if available)
useEffect(() => {
  loadTasks(projectId, false); // false = use cache
}, [projectId]);
```

### For Dashboards (All Tasks)
```javascript
const { tasks, loadAllTasks } = useApp();

// Tasks are automatically loaded on mount
// Or manually refresh:
loadAllTasks();
```

### Force Refresh
```javascript
// Force refresh even if cached
loadTasks(projectId, true);
```

## Future Improvements

1. **Cache Invalidation**: Add TTL or smart invalidation
2. **Optimistic Updates**: Better handling of failed updates
3. **Pagination**: For large task lists
4. **Real-time Updates**: WebSocket support for live task updates
5. **Task Filtering**: Backend-side filtering for better performance

