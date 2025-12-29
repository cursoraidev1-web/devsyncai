# Loading States Implementation Guide

This document describes the loading state components and how to use them throughout the application.

## Overview

The application now includes comprehensive loading state components to prevent blank pages and provide better user experience during data fetching operations.

## Components Available

### 1. LoadingSpinner

A spinning loader component with customizable size and message.

**Props:**
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `message`: string (default: 'Loading...')
- `fullScreen`: boolean (default: false)

**Usage:**
```javascript
import LoadingSpinner from '../components/LoadingSpinner';

// Inline spinner
<LoadingSpinner size="small" message="Loading data..." />

// Full screen spinner
<LoadingSpinner fullScreen message="Loading projects..." />
```

### 2. PulsingLoader

A pulsing dots loader, best for full-page loading states.

**Props:**
- `message`: string (default: 'Loading...')
- `fullScreen`: boolean (default: false)
- `color`: string (default: '#6b46c1') - CSS color value

**Usage:**
```javascript
import PulsingLoader from '../components/PulsingLoader';

// Full page loading
<PulsingLoader fullScreen message="Loading tasks..." />

// Inline loading
<PulsingLoader message="Fetching data..." />
```

### 3. SkeletonLoader

Content placeholder loaders that mimic the structure of actual content.

**Components:**
- `SkeletonLoader` - Basic skeleton with customizable size
- `CardSkeleton` - Skeleton for card layouts
- `ListItemSkeleton` - Skeleton for list items
- `TableSkeleton` - Skeleton for table rows

**Usage:**
```javascript
import { CardSkeleton, ListItemSkeleton, TableSkeleton } from '../components/SkeletonLoader';

// Card skeleton
<div className="projects-grid">
  {[1, 2, 3, 4].map((i) => (
    <CardSkeleton key={i} />
  ))}
</div>

// List skeleton
{[1, 2, 3].map((i) => (
  <ListItemSkeleton key={i} />
))}

// Table skeleton
<TableSkeleton rows={5} columns={4} />
```

### 4. useAsyncData Hook

Custom hook for handling async data fetching with built-in loading states.

**Usage:**
```javascript
import { useAsyncData } from '../hooks/useAsyncData';

const fetchProjects = async () => {
  const response = await fetch('/api/v1/projects');
  const data = await response.json();
  return data.data || [];
};

const MyComponent = () => {
  const { data, loading, error, refetch } = useAsyncData(fetchProjects, {
    onSuccess: (data) => console.log('Loaded:', data),
    onError: (error) => console.error('Error:', error)
  });

  if (loading) return <PulsingLoader fullScreen message="Loading..." />;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render data */}</div>;
};
```

## Integration Examples

### Projects Page

```javascript
import PulsingLoader from '../components/PulsingLoader';
import { CardSkeleton } from '../components/SkeletonLoader';

const Projects = () => {
  const { projects, projectsLoading } = useApp();

  return (
    <div>
      {/* Show skeleton loaders while loading */}
      {projectsLoading ? (
        <div className="projects-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};
```

### Task Tracker Page

```javascript
import PulsingLoader from '../components/PulsingLoader';

const TaskTracker = () => {
  const { tasks, tasksLoading } = useApp();

  if (tasksLoading) {
    return <PulsingLoader fullScreen message="Loading tasks..." />;
  }

  return (
    <div>
      {/* Task board or list */}
    </div>
  );
};
```

### Document Store Page

```javascript
import PulsingLoader from '../components/PulsingLoader';
import { CardSkeleton } from '../components/SkeletonLoader';

const DocumentStore = () => {
  const { documents, loadDocuments } = useApp();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await loadDocuments(projectId);
      setLoading(false);
    };
    fetch();
  }, [projectId]);

  if (loading) {
    return (
      <div className="documents-grid">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Document list */}
    </div>
  );
};
```

### Form Submission Loading

```javascript
import LoadingSpinner from '../components/LoadingSpinner';

const CreateTaskForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await createTask(data);
      // Success
    } catch (error) {
      // Error handling
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <LoadingSpinner size="small" />
            Creating...
          </>
        ) : (
          'Create Task'
        )}
      </button>
    </form>
  );
};
```

## Best Practices

### 1. Use Skeleton Loaders for Lists/Grids

Skeleton loaders provide better UX than spinners for lists and grids because they show the structure of content that's coming.

```javascript
// Good: Shows structure
{loading ? (
  <div className="grid">
    {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
  </div>
) : (
  <div className="grid">
    {items.map(item => <ItemCard key={item.id} item={item} />)}
  </div>
)}

// Less ideal: Just a spinner
{loading ? <PulsingLoader /> : <ItemList items={items} />}
```

### 2. Use Full-Screen Loaders for Initial Page Loads

When the entire page content depends on data, use a full-screen loader.

```javascript
const MyPage = () => {
  const { data, loading } = useAsyncData(fetchData);

  if (loading) {
    return <PulsingLoader fullScreen message="Loading page..." />;
  }

  return <div>{/* Page content */}</div>;
};
```

### 3. Use Inline Spinners for Button/Action Loading

For form submissions and button actions, use small inline spinners.

```javascript
<button disabled={submitting}>
  {submitting ? (
    <>
      <LoadingSpinner size="small" />
      Saving...
    </>
  ) : (
    'Save'
  )}
</button>
```

### 4. Show Loading States Immediately

Don't wait for API calls to show loading states - show them immediately when user triggers an action.

```javascript
const handleSubmit = async () => {
  setSubmitting(true); // Show loading immediately
  try {
    await submitData();
  } finally {
    setSubmitting(false);
  }
};
```

### 5. Handle Errors Gracefully

Always provide error states with retry options.

```javascript
const { data, loading, error, refetch } = useAsyncData(fetchData);

if (loading) return <PulsingLoader fullScreen />;
if (error) {
  return (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={refetch}>Retry</button>
    </div>
  );
}
```

## Pages with Loading States

The following pages have been updated with loading states:

- ✅ **Projects** - Uses CardSkeleton for grid view, PulsingLoader for list view
- ✅ **TaskTracker** - Uses PulsingLoader for full-page loading
- ✅ **DocumentStore** - Ready for skeleton loaders (needs integration)

## Pages Needing Loading States

The following pages should have loading states added:

- [ ] **PRD Designer** - When loading PRDs
- [ ] **Analytics** - When loading analytics data
- [ ] **Notifications** - When loading notifications
- [ ] **Teams** - When loading teams/members
- [ ] **HandoffSystem** - When loading handoffs
- [ ] **Integrations** - When loading integration status
- [ ] **CICD Integration** - When loading pipelines/deployments
- [ ] **Activity** - When loading activity feed
- [ ] **Feedback** - When submitting feedback

## Loading State from Context

Many loading states are available from the AppContext:

```javascript
const {
  projectsLoading,    // Projects loading state
  tasksLoading,       // Tasks loading state
  notificationsLoading, // Notifications loading state
  // documentsLoading  // If added to context
} = useApp();
```

## CSS Customization

All loading components support dark mode via CSS media queries. You can customize:

- **Colors**: Edit CSS variables in component CSS files
- **Sizes**: Adjust sizes in CSS or use size props
- **Animations**: Modify keyframes in CSS files
- **Timing**: Adjust animation durations

## Testing Loading States

To test loading states:

1. **Slow Network**: Use Chrome DevTools Network throttling
2. **Delay API**: Add artificial delay in API calls
3. **Toggle Loading**: Manually set loading state to true

```javascript
// Test loading state
const [loading, setLoading] = useState(true);
setTimeout(() => setLoading(false), 2000);
```

## Summary

- ✅ **LoadingSpinner**: For inline loading (buttons, small sections)
- ✅ **PulsingLoader**: For full-page loading (best UX)
- ✅ **SkeletonLoader**: For content placeholders (lists, grids)
- ✅ **useAsyncData**: Hook for async data with loading states
- ✅ All components support dark mode
- ✅ Smooth animations included
- ✅ Accessible and performant

---

**Implementation Status**: Complete ✅
**Components Created**: 4 (LoadingSpinner, PulsingLoader, SkeletonLoader variants, useAsyncData hook)
**Pages Updated**: Projects, TaskTracker (DocumentStore ready)


