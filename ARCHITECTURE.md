# DevSync AI - Frontend Architecture

## 🏛️ Architecture Pattern: MVVM/Flux

This application follows the **MVVM (Model-View-ViewModel)** pattern implemented via **Redux Flux** architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERACTIONS                     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   VIEW (React Components)               │
│  - ProductOwnerDashboard.tsx                            │
│  - DeveloperDashboard.tsx                               │
│  - Dashboard.tsx (Router)                               │
│                                                          │
│  Responsibilities:                                       │
│  ✓ Render UI based on state                            │
│  ✓ Dispatch actions on user events                     │
│  ✓ Subscribe to store updates via useSelector          │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ useSelector / useDispatch
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              CONTROLLER (Redux Actions)                 │
│  - setComplianceData()                                  │
│  - setLoading()                                         │
│  - setError()                                           │
│  - clearComplianceData()                                │
│                                                          │
│  Responsibilities:                                       │
│  ✓ Define how state changes                            │
│  ✓ Triggered by View or async operations               │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ Reducers
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  MODEL (Redux Store)                    │
│  - complianceSlice.ts (ComplianceState)                │
│  - alertsSlice.ts (AlertsState)                        │
│                                                          │
│  State Shape:                                            │
│  {                                                       │
│    compliance: {                                         │
│      data: ComplianceData | null,                      │
│      loading: boolean,                                  │
│      error: string | null                              │
│    },                                                    │
│    alerts: {                                             │
│      alerts: Alert[],                                   │
│      unreadCount: number                               │
│    }                                                     │
│  }                                                       │
│                                                          │
│  Responsibilities:                                       │
│  ✓ Single source of truth                              │
│  ✓ Immutable state updates                             │
│  ✓ Accessible via selectors                            │
└─────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

### 1. Reading Data (View ← Store)
```typescript
// In ProductOwnerDashboard.tsx
const complianceData = useSelector(selectComplianceData);
// Component re-renders when compliance data changes
```

### 2. Updating Data (View → Action → Store)
```typescript
// User action or API response
dispatch(setComplianceData({
  score: 85,
  latestCommitId: 'abc123',
  recommendations: [...]
}));
// Store updates → Selectors trigger → View re-renders
```

## 🗂️ Folder Structure Philosophy

```
src/
├── components/          # VIEW LAYER
│   └── dashboards/     # Role-specific dashboard views
│
├── redux/              # MODEL + CONTROLLER LAYER
│   ├── store.ts        # Redux store configuration
│   ├── *Slice.ts       # State slices (Model + Reducers)
│   └── hooks.ts        # Typed Redux hooks
│
├── types/              # MODEL DEFINITIONS
│   └── *.d.ts          # TypeScript interfaces
│
├── pages/              # PAGE-LEVEL VIEWS
│   └── Dashboard.tsx   # Main routing component
│
└── demo/               # DEVELOPMENT UTILITIES
    └── mockData.ts     # Sample data for testing
```

## 🔄 Redux Toolkit Slice Anatomy

Each slice follows this structure:

```typescript
// complianceSlice.ts

// 1. STATE INTERFACE (Model Definition)
interface ComplianceState {
  data: ComplianceData | null;
  loading: boolean;
  error: string | null;
}

// 2. INITIAL STATE
const initialState: ComplianceState = { ... };

// 3. SLICE WITH REDUCERS (Controllers)
const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    setComplianceData: (state, action) => { ... },
    setLoading: (state, action) => { ... },
    setError: (state, action) => { ... },
  },
});

// 4. SELECTORS (View Access Points)
export const selectComplianceData = (state: RootState) => 
  state.compliance.data;

// 5. EXPORTS
export const { setComplianceData, setLoading, setError } = 
  complianceSlice.actions;
export default complianceSlice.reducer;
```

## 🎯 Component Design Philosophy

### 1. Smart vs Presentational Components

**Smart (Container) Components**
- Connected to Redux via `useSelector` / `useDispatch`
- Handle business logic and data fetching
- Example: `ProductOwnerDashboard.tsx`

**Presentational (Dumb) Components** *(Future)*
- Receive data via props
- Focus purely on rendering
- Example: `ComplianceScoreCard.tsx`

### 2. Tailwind CSS Styling Strategy

- **Utility-First**: Use Tailwind classes directly in JSX
- **No Custom CSS**: Avoid separate stylesheet files
- **Responsive Design**: Mobile-first approach with `sm:`, `md:`, `lg:` prefixes
- **Dynamic Classes**: Use template literals for conditional styling

```typescript
// Example: Dynamic color based on score
const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};
```

## 🔐 Type Safety

### TypeScript Integration

1. **Redux Types**
```typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

2. **Typed Hooks**
```typescript
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

3. **Model Interfaces**
```typescript
// types/compliance.d.ts
export interface ComplianceData {
  score: number;
  latestCommitId: string;
  recommendations: ComplianceRecommendation[];
}
```

## 🚀 Future Architecture Enhancements

### 1. Async Thunks (API Integration)
```typescript
// Future: redux/thunks/complianceThunks.ts
export const fetchComplianceData = createAsyncThunk(
  'compliance/fetch',
  async (commitId: string) => {
    const response = await api.getCompliance(commitId);
    return response.data;
  }
);
```

### 2. Middleware (Logging, Analytics)
```typescript
// Future: redux/middleware/analyticsMiddleware.ts
const analyticsMiddleware = store => next => action => {
  // Log actions to analytics service
  analytics.track(action.type, action.payload);
  return next(action);
};
```

### 3. Normalized State (Entity Management)
```typescript
// Future: Use @reduxjs/toolkit's entityAdapter
const complianceAdapter = createEntityAdapter<ComplianceData>();
```

### 4. Code Splitting (Performance)
```typescript
// Future: Lazy load dashboard components
const ProductOwnerDashboard = lazy(() => 
  import('./components/dashboards/ProductOwnerDashboard')
);
```

## 📏 Coding Standards

1. **File Naming**: PascalCase for components, camelCase for utilities
2. **Imports**: Group by external → internal → types
3. **Comments**: JSDoc for public APIs, inline for complex logic
4. **Error Handling**: Try-catch in async operations, error boundaries for components
5. **Testing**: Co-locate tests with source files (`.test.tsx`)

## 🔗 Integration Points

### Current State
- ✅ Redux DevTools support
- ✅ Type-safe state management
- ✅ Modular slice architecture

### Future Integrations
- [ ] REST API client (axios/fetch)
- [ ] WebSocket for real-time updates
- [ ] React Router for multi-page navigation
- [ ] React Query for server state management
- [ ] Zod for runtime validation

---

**Architecture Version**: 1.0.0  
**Last Updated**: 2025-11-06  
**Maintained By**: DevSync AI Team
