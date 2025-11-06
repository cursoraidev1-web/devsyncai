# Testing DevSync AI Frontend

## 🧪 Manual Testing Guide

Since this is an MVP scaffold without backend integration, you can test the Product Owner Dashboard using browser console commands or Redux DevTools.

## Quick Start Testing

### 1. Install Dependencies & Run

```bash
npm install
npm run dev
```

The app will open at `http://localhost:3000`

### 2. Initial State

On first load, you'll see:
- Empty Product Owner Dashboard
- "No compliance data available" message
- Role switcher between "Product Owner" and "Developer"

## Testing Compliance Data States

Open your browser's **Developer Console** (F12) and paste any of these commands:

### ✅ Test Excellent Compliance (Score: 95)

```javascript
window.dispatchEvent(new CustomEvent('redux-dispatch', { 
  detail: {
    type: 'compliance/setComplianceData',
    payload: {
      score: 95,
      latestCommitId: 'f8e3a21',
      recommendations: [],
      timestamp: new Date().toISOString(),
      deviations: []
    }
  }
}));
```

**Expected Result:**
- Green compliance score (95/100)
- Green progress bar
- "All Clear! No recommendations" message

### 👍 Test Good Compliance (Score: 78)

```javascript
window.dispatchEvent(new CustomEvent('redux-dispatch', { 
  detail: {
    type: 'compliance/setComplianceData',
    payload: {
      score: 78,
      latestCommitId: 'b4c2d91',
      recommendations: [
        {
          section: 'User Dashboard - Analytics Widget',
          fix: 'Add missing real-time metrics display as specified in PRD Section 4.2'
        },
        {
          section: 'API Integration',
          fix: 'Update REST endpoint naming convention to match PRD standards'
        }
      ],
      timestamp: new Date().toISOString()
    }
  }
}));
```

**Expected Result:**
- Yellow compliance score (78/100)
- Yellow progress bar
- 2 recommendations displayed in detail panel

### ⚠️ Test Needs Work (Score: 62)

```javascript
window.dispatchEvent(new CustomEvent('redux-dispatch', { 
  detail: {
    type: 'compliance/setComplianceData',
    payload: {
      score: 62,
      latestCommitId: 'c7d9e45',
      recommendations: [
        {
          section: 'Authentication Module',
          fix: 'Implement OAuth2 flow as per PRD Section 3.2 - currently using basic auth only'
        },
        {
          section: 'User Dashboard',
          fix: 'Add missing role-based access controls defined in PRD Section 5.1'
        },
        {
          section: 'Data Export Feature',
          fix: 'CSV export functionality missing - required by PRD Section 6.3'
        },
        {
          section: 'Error Handling',
          fix: 'Global error boundary not implemented per PRD Section 7.4'
        }
      ],
      timestamp: new Date().toISOString()
    }
  }
}));
```

**Expected Result:**
- Yellow compliance score (62/100)
- Yellow progress bar  
- 4 recommendations in scrollable panel

### 🚨 Test Critical Issues (Score: 38)

```javascript
window.dispatchEvent(new CustomEvent('redux-dispatch', { 
  detail: {
    type: 'compliance/setComplianceData',
    payload: {
      score: 38,
      latestCommitId: 'a1b2c3d',
      recommendations: [
        {
          section: 'Authentication Module',
          fix: 'Critical: Implement OAuth2 + JWT as per PRD Section 3.2'
        },
        {
          section: 'User Dashboard',
          fix: 'Critical: Add all 8 required widgets from PRD Section 4'
        },
        {
          section: 'Database Schema',
          fix: 'Urgent: Align with PRD-specified schema - missing 4 core tables'
        },
        {
          section: 'API Endpoints',
          fix: 'Major: Implement RESTful standards per PRD Section 8'
        },
        {
          section: 'Security',
          fix: 'Critical: Add encryption for sensitive data (PRD Section 9.1)'
        }
      ],
      timestamp: new Date().toISOString()
    }
  }
}));
```

**Expected Result:**
- Red compliance score (38/100)
- Red progress bar
- 5+ critical recommendations
- Red "Pending Recommendations" count

## Using Redux DevTools Extension

If you have [Redux DevTools](https://github.com/reduxjs/redux-devtools) installed:

1. Open DevTools → Redux tab
2. Click "Dispatch" button
3. Enter action:

```json
{
  "type": "compliance/setComplianceData",
  "payload": {
    "score": 85,
    "latestCommitId": "abc123",
    "recommendations": [
      {
        "section": "Test Section",
        "fix": "Test fix description"
      }
    ]
  }
}
```

4. Click "Dispatch"
5. Watch state update in real-time

## Component Testing Checklist

### Product Owner Dashboard

- [ ] Dashboard loads without errors
- [ ] Empty state displays correctly
- [ ] Compliance score displays with correct color:
  - Green for ≥80
  - Yellow for 60-79
  - Red for <60
- [ ] Progress bar matches score percentage
- [ ] Latest commit ID displays correctly
- [ ] Recommendations count updates dynamically
- [ ] Recommendations panel scrolls when >3 items
- [ ] Future metrics show "Coming Soon" placeholders

### Role Switcher

- [ ] "Product Owner" button highlights when active
- [ ] "Developer" button switches to Developer Dashboard
- [ ] Developer Dashboard shows placeholder message

## Accessibility Testing

### Keyboard Navigation
- Tab through all interactive elements
- Verify focus indicators are visible
- Test button interactions with Enter/Space

### Screen Reader Testing
- Use NVDA/JAWS to test dashboard
- Verify compliance score is announced
- Check recommendation list is navigable

## Performance Testing

### Lighthouse Audit
```bash
# Build production version
npm run build
npm run preview

# Run Lighthouse in Chrome DevTools
# Target scores:
# - Performance: >90
# - Accessibility: >95
# - Best Practices: >90
```

## Integration Testing (Future)

When backend API is available:

```typescript
// Example integration test setup
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ProductOwnerDashboard from './components/dashboards/ProductOwnerDashboard';

test('fetches and displays compliance data', async () => {
  render(
    <Provider store={store}>
      <ProductOwnerDashboard />
    </Provider>
  );
  
  await waitFor(() => {
    expect(screen.getByText(/95/)).toBeInTheDocument();
  });
});
```

## Common Issues & Solutions

### Issue: Compliance data not updating
**Solution:** Check Redux DevTools to verify action was dispatched and state updated

### Issue: Colors not applying correctly
**Solution:** Ensure Tailwind CSS is processing correctly - check `npm run dev` output

### Issue: TypeScript errors in console
**Solution:** Run `npm run build` to see compilation errors

### Issue: Hot reload not working
**Solution:** Restart dev server with `npm run dev`

## Next Steps for Full Testing

1. **Unit Tests**: Add Jest + React Testing Library
2. **E2E Tests**: Implement Playwright/Cypress
3. **API Mocking**: Use MSW (Mock Service Worker)
4. **Visual Regression**: Implement Chromatic/Percy
5. **Load Testing**: Test with large recommendation lists

---

**Last Updated**: 2025-11-06  
**Test Coverage**: Manual Testing (MVP Phase)
