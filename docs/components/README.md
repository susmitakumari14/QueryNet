# QueryNet Components Documentation

## Overview

This directory contains comprehensive documentation for all React components in the QueryNet application. Each component is designed with modularity, accessibility, and responsive design principles in mind.

## Component Index

### 🎨 Layout Components
- **[Layout](./components/Layout.md)** - Main application wrapper with header, navigation, and responsive design
- **NotificationBar** - Global notification display system
- **ThemeProvider** - Theme context provider and management

### 📝 Form Components
- **AskQuestionForm** - Question creation and editing form with rich text support
- **RichTextEditor** - Advanced text editing component for questions and answers

### 🃏 Display Components
- **QuestionCard** - Question preview and summary display
- **ThemeToggle** - Dark/light mode toggle with system preference detection

### 🧩 UI Library (`/ui/`)
Base UI components built on Radix UI primitives and styled with Tailwind CSS:

| Component | Purpose | Status |
|-----------|---------|--------|
| `badge` | Status indicators and notification badges | ✅ Stable |
| `button` | Primary action buttons with variants | ✅ Stable |
| `card` | Content containers and layouts | ✅ Stable |
| `dropdown-menu` | Contextual menu components | ✅ Stable |
| `input` | Form input fields with validation | ✅ Stable |
| `label` | Form field labels | ✅ Stable |
| `sonner` | Toast notification system | ✅ Stable |
| `toast` | Toast notification components | ✅ Stable |
| `toaster` | Toast notification container | ✅ Stable |
| `tooltip` | Contextual help and information | ✅ Stable |

## Architecture Overview

### Design Philosophy
QueryNet components follow these core principles:

1. **Composition over Inheritance**: Build complex UIs by combining simple components
2. **Accessibility First**: WCAG 2.1 AA compliance built-in
3. **Mobile-First Responsive**: Designed for mobile, enhanced for desktop
4. **Type Safety**: Full TypeScript support with comprehensive interfaces
5. **Performance Optimized**: Minimal re-renders and efficient bundling

### Component Patterns

#### 1. Compound Components
```tsx
<Layout>
  <QuestionCard>
    <Badge variant="secondary">JavaScript</Badge>
    <Button variant="outline">View Details</Button>
  </QuestionCard>
</Layout>
```

#### 2. Render Props Pattern
```tsx
<ThemeProvider>
  {({ theme, toggleTheme }) => (
    <Button onClick={toggleTheme}>
      Current theme: {theme}
    </Button>
  )}
</ThemeProvider>
```

#### 3. Hook-based State Management
```tsx
const { user, isAuthenticated, logout } = useAuth();
const isMobile = useIsMobile();
```

## Styling Architecture

### Design System
QueryNet uses a comprehensive design system built on:

- **Tailwind CSS**: Utility-first framework for rapid development
- **CSS Custom Properties**: Dynamic theming and color management
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Consistent icon library

### Color Palette
```css
/* Primary Colors */
--primary: 217 91% 60%;           /* Blue-600 */
--primary-foreground: 0 0% 98%;   /* White */

/* Secondary Colors */
--secondary: 210 40% 96%;         /* Gray-50 */
--secondary-foreground: 222 84% 5%; /* Gray-900 */

/* Accent Colors */
--destructive: 0 84% 60%;         /* Red-500 */
--warning: 38 92% 50%;            /* Orange-500 */
--success: 142 76% 36%;           /* Green-600 */
```

### Typography Scale
```css
/* Headings */
.text-xs    { font-size: 0.75rem; }   /* 12px */
.text-sm    { font-size: 0.875rem; }  /* 14px */
.text-base  { font-size: 1rem; }      /* 16px */
.text-lg    { font-size: 1.125rem; }  /* 18px */
.text-xl    { font-size: 1.25rem; }   /* 20px */
.text-2xl   { font-size: 1.5rem; }    /* 24px */
.text-3xl   { font-size: 1.875rem; }  /* 30px */
```

### Spacing System
```css
/* Consistent spacing scale */
.space-1  { margin: 0.25rem; }   /* 4px */
.space-2  { margin: 0.5rem; }    /* 8px */
.space-3  { margin: 0.75rem; }   /* 12px */
.space-4  { margin: 1rem; }      /* 16px */
.space-6  { margin: 1.5rem; }    /* 24px */
.space-8  { margin: 2rem; }      /* 32px */
```

## State Management

### Context Providers
```tsx
// Authentication context
<AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
  <App />
</AuthContext.Provider>

// Theme context
<ThemeProvider defaultTheme="system" storageKey="querynet-theme">
  <Layout />
</ThemeProvider>
```

### Custom Hooks
```tsx
// Authentication hook
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Responsive hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  // Implementation details...
  return isMobile;
};
```

## Accessibility Standards

### WCAG 2.1 AA Compliance
All components meet or exceed WCAG 2.1 AA standards:

- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators
- **Responsive Design**: Usable at 320px width minimum

### Implementation Checklist
- [ ] Semantic HTML elements used appropriately
- [ ] ARIA labels for interactive elements
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility tested
- [ ] Color contrast verified
- [ ] Focus management implemented
- [ ] Error states communicated clearly

## Performance Optimization

### Code Splitting Strategy
```tsx
// Lazy load heavy components
const AskQuestionForm = lazy(() => import('./AskQuestionForm'));
const RichTextEditor = lazy(() => import('./RichTextEditor'));

// Route-based splitting
const ProfilePage = lazy(() => import('../pages/Profile'));
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze

# Key metrics to monitor:
# - Component bundle sizes
# - Unused dependencies
# - Dynamic import effectiveness
```

### Rendering Optimization
```tsx
// Memoization for expensive computations
const expensiveValue = useMemo(() => 
  heavyComputation(data), [data]
);

// Callback memoization
const handleClick = useCallback(() => {
  onAction(id);
}, [onAction, id]);

// Component memoization
const MemoizedComponent = memo(({ data }) => {
  return <ExpensiveComponent data={data} />;
});
```

## Testing Strategy

### Unit Testing
```tsx
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { Layout } from './Layout';

describe('Layout Component', () => {
  it('renders navigation correctly', () => {
    render(<Layout><div>Content</div></Layout>);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(<Layout><div>Content</div></Layout>);
    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);
    expect(screen.getByRole('menu')).toBeVisible();
  });
});
```

### Integration Testing
```tsx
// Multi-component integration tests
describe('Navigation Flow', () => {
  it('navigates from layout to question form', async () => {
    render(
      <Router>
        <Layout>
          <Routes>
            <Route path="/ask" element={<AskQuestionForm />} />
          </Routes>
        </Layout>
      </Router>
    );
    
    fireEvent.click(screen.getByText('Ask Question'));
    expect(await screen.findByRole('form')).toBeInTheDocument();
  });
});
```

### Accessibility Testing
```tsx
// Automated accessibility testing
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = render(<Layout><div>Content</div></Layout>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Development Workflow

### Component Creation Process
1. **Design Review**: Ensure component fits design system
2. **API Design**: Define props interface and component API
3. **Implementation**: Build component with TypeScript
4. **Testing**: Write comprehensive tests
5. **Documentation**: Create detailed documentation
6. **Review**: Code review focusing on accessibility and performance

### File Structure Convention
```
components/
├── ComponentName/
│   ├── ComponentName.tsx      # Main implementation
│   ├── ComponentName.test.tsx # Unit tests
│   ├── ComponentName.stories.tsx # Storybook stories
│   ├── index.ts               # Export file
│   └── types.ts               # Type definitions
```

### Naming Conventions
- **Components**: PascalCase (`UserProfile`, `QuestionCard`)
- **Files**: PascalCase for components, camelCase for utilities
- **Props**: camelCase with descriptive names
- **CSS Classes**: kebab-case following Tailwind conventions
- **Events**: Handle prefix (`handleSubmit`, `handleClick`)

## API Integration

### HTTP Client Setup
```tsx
// API client configuration
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Error Handling Strategy
```tsx
// Global error boundary
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## Deployment and Build

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
        },
      },
    },
  },
});
```

### Performance Monitoring
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Contributing Guidelines

### Pull Request Checklist
- [ ] Component follows design system principles
- [ ] TypeScript interfaces are properly defined
- [ ] Unit tests written and passing
- [ ] Accessibility requirements met
- [ ] Documentation updated
- [ ] Performance impact assessed
- [ ] Cross-browser compatibility verified

### Code Review Focus Areas
1. **API Design**: Clear, consistent prop interfaces
2. **Accessibility**: WCAG compliance and keyboard navigation
3. **Performance**: Unnecessary re-renders and bundle size
4. **Type Safety**: Comprehensive TypeScript coverage
5. **Testing**: Adequate test coverage and quality
6. **Documentation**: Clear, comprehensive documentation

## Troubleshooting Guide

### Common Issues

#### Hydration Mismatches
**Symptoms**: Console warnings about server/client markup differences
**Solutions**: 
- Check for browser-only APIs in render methods
- Use `useEffect` for client-only code
- Ensure consistent data between SSR and client

#### Style Conflicts
**Symptoms**: Unexpected styling or layout issues
**Solutions**:
- Verify Tailwind class ordering and specificity
- Check for CSS-in-JS conflicts
- Use browser dev tools to inspect computed styles

#### TypeScript Errors
**Symptoms**: Type checking failures
**Solutions**:
- Ensure proper prop interface definitions
- Check for missing dependencies in hook arrays
- Verify component ref forwarding

#### Performance Issues
**Symptoms**: Slow rendering or high bundle sizes
**Solutions**:
- Profile component renders with React DevTools
- Analyze bundle with webpack-bundle-analyzer
- Implement proper memoization strategies

### Debug Tools
- **React Developer Tools**: Component inspection and profiling
- **Tailwind CSS IntelliSense**: Class name suggestions and validation
- **TypeScript Language Server**: Type checking and error reporting
- **axe DevTools**: Accessibility testing and validation
- **Lighthouse**: Performance and accessibility auditing

## Resources

### Documentation Links
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Internal Resources
- [Design System Guidelines](./design-system.md)
- [Accessibility Checklist](./accessibility.md)
- [Performance Best Practices](./performance.md)
- [Testing Guidelines](./testing.md)

### Tools and Libraries
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Storybook](https://storybook.js.org/) - Component development environment
- [Jest](https://jestjs.io/) - JavaScript testing framework
- [ESLint](https://eslint.org/) - Code linting and formatting
- [Prettier](https://prettier.io/) - Code formatting
