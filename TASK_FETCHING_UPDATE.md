# Task Fetching Update - Fetch All Tasks by Default

## Changes Made

### 1. **Always Fetch All Tasks**
- `loadAllTasks()` is now called automatically on app initialization
- All tasks are stored in the global `tasks` array
- Tasks are cached by project ID for quick filtering

### 2. **Client-Side Project Filtering**
- Added `getTasksByProject(projectId)` function for filtering tasks by project
- No need to make separate API calls for each project
- Filtering happens instantly on the client side

### 3. **Updated AppContext** (`src/context/AppContext.js`)

```javascript
// Always loads all tasks
const loadAllTasks = useCallback(async () => {
  const data = await fetchTasks(); // Fetch all tasks
  setTasks(data);
  // Cache by project for quick access
  const tasksByProjectMap = new Map();
  data.forEach(task => {
    const projectId = task.project_id;
    if (projectId) {
      if (!tasksByProjectMap.has(projectId)) {
        tasksByProjectMap.set(projectId, []);
      }
      tasksByProjectMap.get(projectId).push(task);
    }
  });
  setTasksByProject(tasksByProjectMap);
}, [token]);

// Client-side filtering
const getTasksByProject = useCallback((projectId) => {
  if (!projectId) return tasks;
  return tasks.filter(task => task.project_id === projectId);
}, [tasks]);
```

### 4. **Updated TaskTracker** (`src/pages/TaskTracker.js`)

**Added Project Filter:**
```javascript
const [filterProject, setFilterProject] = useState('all');

// Filter dropdown in UI
<select value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
  <option value="all">All Projects</option>
  {projects.map(project => (
    <option key={project.id} value={project.id}>
      {project.name}
    </option>
  ))}
</select>
```

**Filtering Logic:**
```javascript
// Get filtered tasks based on project filter
const getFilteredTasks = () => {
  let filtered = tasks;
  if (filterProject !== 'all') {
    filtered = getTasksByProject(filterProject);
  }
  return filtered;
};

// Apply search and priority filters
const filteredTasks = getFilteredTasks().filter(task => {
  // ... search and priority filtering
});
```

### 5. **Updated ProjectDetail** (`src/pages/ProjectDetail.js`)

**Before:** Fetched tasks separately for each project
```javascript
useEffect(() => {
  if (project?.id) {
    loadTasks(project.id).catch(console.error);
  }
}, [project?.id, loadTasks]);
```

**After:** Filters from all tasks client-side
```javascript
const projectTasks = React.useMemo(() => {
  if (!project?.id) return [];
  return tasks.filter(task => task.project_id === project.id);
}, [tasks, project?.id]);
```

## Benefits

1. **Single API Call**: All tasks loaded once on app initialization
2. **Instant Filtering**: Project filtering happens client-side (no API delay)
3. **Better Performance**: No redundant API calls when switching projects
4. **Simpler Code**: No need to manage per-project loading states
5. **Better UX**: Users can quickly switch between projects without loading delays

## Usage

### In Components

**Get all tasks:**
```javascript
const { tasks } = useApp();
```

**Get tasks for a specific project:**
```javascript
const { tasks, getTasksByProject } = useApp();
const projectTasks = getTasksByProject(projectId);
```

**Filter in TaskTracker:**
- Use the "All Projects" dropdown to filter by project
- Combine with priority and search filters

## API Behavior

- **Initial Load**: `GET /api/v1/tasks` (no project filter) - fetches all tasks
- **No Per-Project Calls**: Tasks are filtered client-side
- **Cache Updates**: When tasks are created/updated/deleted, both `tasks` and `tasksByProject` cache are updated

## Migration Notes

- `loadTasks(projectId)` still works but now just filters from all tasks
- Components using `tasks` directly will see all tasks (use `getTasksByProject()` for filtering)
- Dashboards automatically get all tasks without changes needed

