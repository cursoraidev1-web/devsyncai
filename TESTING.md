# Testing Guide

This project uses **Jest** and **React Testing Library** for testing.

## Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are organized alongside the code they test:

```
components/
  ui/
    Button.jsx
    __tests__/
      Button.test.jsx

utils/
  passwordValidation.js
  __tests__/
    passwordValidation.test.js
```

## Writing Tests

### Component Tests

Use React Testing Library to test components:

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button Component', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Utility Function Tests

Test pure functions directly:

```js
import { validatePassword } from '../passwordValidation';

describe('validatePassword', () => {
  it('should return valid: false for empty password', () => {
    const result = validatePassword('');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password is required');
  });
});
```

## Test Coverage

The project aims for 70% coverage across:
- Components
- Utilities
- Hooks
- Context providers

View coverage report:
```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory.

## Best Practices

1. **Test user behavior, not implementation details**
   - Focus on what users see and interact with
   - Avoid testing internal state or methods

2. **Use semantic queries**
   - Prefer `getByRole`, `getByLabelText`, `getByText`
   - Avoid `getByTestId` unless necessary

3. **Keep tests isolated**
   - Each test should be independent
   - Use `beforeEach` for common setup

4. **Test edge cases**
   - Empty states
   - Error states
   - Loading states
   - Disabled states

5. **Mock external dependencies**
   - API calls
   - Next.js router
   - Browser APIs (localStorage, etc.)

## Mocking

### Next.js Router

The router is automatically mocked in `jest.setup.js`:

```js
// Already configured - no need to mock manually
import { useRouter } from 'next/navigation';
```

### API Calls

Mock API functions:

```js
jest.mock('../../api/client', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'test' })),
}));
```

### Context Providers

Wrap components with providers in tests:

```jsx
import { AuthProvider } from '../../context/AuthContext';

render(
  <AuthProvider>
    <YourComponent />
  </AuthProvider>
);
```

## Running Specific Tests

```bash
# Run tests matching a pattern
npm test -- Button

# Run tests in a specific file
npm test -- Button.test.jsx

# Run tests in watch mode for a specific file
npm run test:watch -- Button.test.jsx
```

## Configuration

- **Jest Config**: `jest.config.js`
- **Test Setup**: `jest.setup.js`
- **Coverage Threshold**: 70% (configured in `jest.config.js`)

## Troubleshooting

### Tests failing with "Cannot find module"

Make sure all dependencies are installed:
```bash
npm install
```

### CSS imports causing issues

CSS modules are mocked using `identity-obj-proxy`. If you see issues, check `jest.config.js`.

### Next.js router errors

The router is mocked in `jest.setup.js`. If you need custom router behavior, override the mock in your test file.

## Example Test Files

- `utils/__tests__/passwordValidation.test.js` - Utility function tests
- `components/ui/__tests__/Button.test.jsx` - Component tests
- `components/ui/__tests__/Input.test.jsx` - Form component tests

## Continuous Integration

Tests should run automatically in CI/CD pipelines. Make sure to:

1. Install dependencies: `npm ci`
2. Run tests: `npm test`
3. Check coverage: `npm run test:coverage`

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

