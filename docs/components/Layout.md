# Layout Component Documentation

## Overview

The `Layout` component is a comprehensive wrapper component that provides the main application structure including header navigation, search functionality, user authentication UI, and responsive design. It serves as the primary layout container for all pages in the QueryNet application.

## Location
`src/components/Layout.tsx`

## Features

- **Responsive Design**: Adapts seamlessly between desktop and mobile views
- **Authentication Integration**: Shows different UI based on user authentication status
- **Search Functionality**: Global search bar accessible from any page
- **Notification System**: Real-time notification badge and management
- **Theme Support**: Integrated theme toggle functionality
- **Mobile-First Navigation**: Collapsible mobile menu with touch-optimized interactions

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | The main content to be rendered within the layout |

## Dependencies

### External Libraries
- `react-router-dom` - For navigation functionality
- `lucide-react` - For icons (Bell, Search, Plus, User, Menu, LogIn, LogOut, Settings)

### Internal Components
- `Button` - UI button component (`@/components/ui/button`)
- `Input` - UI input component (`@/components/ui/input`)
- `Badge` - UI badge component for notifications (`@/components/ui/badge`)
- `DropdownMenu` components - For user menu dropdown (`@/components/ui/dropdown-menu`)
- `ThemeToggle` - Theme switching component (`@/components/ThemeToggle`)

### Custom Hooks
- `useAuth()` - Authentication state management (`@/hooks/useAuth`)
- `useIsMobile()` - Responsive breakpoint detection (`@/hooks/use-mobile`)

## Component Structure

### Header Section
The header is sticky and contains:
- **Logo**: "StackIt" branding with gradient text effect
- **Search Bar**: Global search functionality (hidden on mobile)
- **Action Buttons**: Notifications, Ask Question, Theme Toggle, User Menu
- **Authentication UI**: Login button or user dropdown based on auth status

### Mobile Adaptations
- **Mobile Search**: Separate search bar below header on mobile devices
- **Mobile Menu**: Collapsible hamburger menu with full navigation options
- **Responsive Buttons**: Button sizes and layouts adapt to screen size

## Key Functionality

### Authentication Flow
```tsx
// Authenticated users see:
- User avatar/dropdown menu
- Notification badge with count
- Settings access
- Logout functionality

// Non-authenticated users see:
- Login button
- Basic notification access
```

### Navigation Features
- **Home Navigation**: Logo click returns to home page
- **Ask Question**: Direct access to question creation (`/ask`)
- **Profile Access**: User profile and settings (`/profile`)
- **Notifications**: Notification center with unread count (`/notifications`)

### Responsive Behavior

#### Desktop (md and above)
- Full horizontal navigation bar
- Inline search bar
- All buttons with text labels
- Settings button visible

#### Mobile (below md)
- Collapsed hamburger menu
- Search bar moves below header
- Icon-only buttons
- Mobile-optimized touch targets

## State Management

### Local State
- `showMobileMenu: boolean` - Controls mobile menu visibility
- `notificationCount: number` - Tracks unread notifications (currently mock data)

### Authentication State
Uses `useAuth()` hook to access:
- `user: User | null` - Current user information
- `isAuthenticated: boolean` - Authentication status
- `logout(): Promise<void>` - Logout function

## Event Handlers

### Navigation Handlers
- `navigate('/')` - Home navigation
- `navigate('/ask')` - Question creation
- `navigate('/login')` - Authentication
- `navigate('/profile')` - User profile
- `navigate('/notifications')` - Notification center

### Interaction Handlers
- `handleLogout()` - Manages logout process and cleanup
- `handleNotificationClick()` - Notification center navigation
- `setShowMobileMenu(boolean)` - Mobile menu toggle

## Styling and Design

### CSS Classes
- Uses Tailwind CSS for styling
- Custom gradient text for branding
- Backdrop blur effects for modern glass morphism
- Responsive spacing and sizing
- Smooth transitions and hover effects

### Design Tokens
- Primary colors: Blue gradient (`from-blue-600 to-purple-600`)
- Background: Dynamic based on theme (`bg-background`)
- Borders: Subtle border styling with opacity (`border-border`)
- Typography: Responsive font sizing (`text-xl sm:text-2xl`)

### Key CSS Classes
```css
/* Main container */
.min-h-screen.bg-background

/* Header */
.sticky.top-0.z-50.bg-background/95.backdrop-blur-sm.border-b.border-border

/* Logo gradient */
.bg-gradient-to-r.from-blue-600.to-purple-600.bg-clip-text.text-transparent

/* Notification badge */
.notification-badge.bg-red-500.text-white.border-2.border-background.animate-pulse

/* Header buttons */
.header-button.hover:bg-muted/50.transition-all.duration-200
```

## Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Touch Targets**: Optimized for mobile touch interaction
- **Focus Management**: Proper focus indicators
- **Semantic HTML**: Proper heading hierarchy and structure

## Usage Example

```tsx
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';

function App() {
  return (
    <Layout>
      <HomePage />
    </Layout>
  );
}
```

## Advanced Usage

### Custom Navigation
```tsx
// The layout handles navigation automatically, but you can trigger navigation programmatically
import { useNavigate } from 'react-router-dom';

function CustomComponent() {
  const navigate = useNavigate();
  
  const handleCustomAction = () => {
    // This will use the same navigation as the Layout component
    navigate('/ask');
  };
}
```

### Notification Management
```tsx
// Currently uses local state, but can be extended for real-time updates
const [notificationCount, setNotificationCount] = useState(3);

// Future implementation might look like:
// const { notificationCount } = useNotifications();
```

## Performance Considerations

- **Sticky Header**: Uses `position: sticky` for optimal scroll performance
- **Backdrop Blur**: Hardware-accelerated backdrop filters
- **Conditional Rendering**: Only renders necessary elements based on state
- **Optimized Re-renders**: State changes isolated to prevent unnecessary re-renders
- **Lazy Loading**: Mobile menu content only renders when needed

## Future Enhancements

1. **Search Functionality**: Currently placeholder - needs API integration
2. **Real-time Notifications**: WebSocket integration for live updates
3. **User Avatar**: Profile picture support in user dropdown
4. **Breadcrumb Navigation**: Page hierarchy indication
5. **Keyboard Shortcuts**: Quick navigation shortcuts
6. **Progressive Web App**: Add PWA features to header
7. **Internationalization**: Multi-language support

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Mobile browsers with touch event support
- Requires JavaScript enabled for full functionality
- Supports all browsers that support React 18+

## Testing Considerations

### Unit Tests
- Test responsive breakpoints
- Verify authentication state changes
- Test mobile menu functionality
- Validate keyboard navigation
- Check theme switching behavior
- Test notification badge updates

### Integration Tests
- Test navigation flow between pages
- Verify authentication integration
- Test mobile responsiveness
- Validate accessibility compliance

### E2E Tests
- Complete user workflows
- Cross-browser compatibility
- Mobile device testing
- Performance testing

## API Integration Points

### Current Placeholders
- Search functionality (search bar is UI-only)
- Notification count (hardcoded to 3)

### Future API Endpoints
```typescript
// Search API
GET /api/search?q={query}

// Notifications API
GET /api/notifications/count
GET /api/notifications
POST /api/notifications/{id}/read

// User Profile API
GET /api/user/profile
PUT /api/user/profile
```

## Maintenance Notes

- Monitor performance on mobile devices
- Keep notification logic in sync with backend
- Update responsive breakpoints as needed
- Maintain accessibility standards compliance
- Regular testing across different screen sizes
- Update dependencies regularly for security patches

## Common Issues and Solutions

### Mobile Menu Not Displaying
**Problem**: Mobile menu doesn't show when hamburger button is clicked
**Solution**: Check `showMobileMenu` state and ensure `md:hidden` classes are applied correctly

### Authentication State Issues
**Problem**: User dropdown not showing when logged in
**Solution**: Verify `useAuth()` hook is properly configured and returns correct `isAuthenticated` state

### Responsive Layout Problems
**Problem**: Layout breaks at certain screen sizes
**Solution**: Test with browser dev tools at different breakpoints, adjust Tailwind classes as needed

### Search Bar Styling Issues
**Problem**: Search input styling inconsistent across browsers
**Solution**: Ensure Tailwind reset styles are applied, check for browser-specific CSS overrides

## Version History

| Version | Changes | Date |
|---------|---------|------|
| 1.0.0 | Initial implementation with basic layout | - |
| 1.1.0 | Added mobile responsiveness | - |
| 1.2.0 | Integrated authentication UI | - |
| 1.3.0 | Added notification system | - |
| Current | Theme support and accessibility improvements | - |

## Related Components

- [`ThemeToggle`](./ThemeToggle.md) - Theme switching functionality
- [`Button`](./ui/Button.md) - UI button component
- [`Input`](./ui/Input.md) - Search input component
- [`Badge`](./ui/Badge.md) - Notification badge component
- [`DropdownMenu`](./ui/DropdownMenu.md) - User menu dropdown

## Contributing

When modifying the Layout component:
1. Maintain responsive design principles
2. Ensure accessibility standards are met
3. Test on multiple devices and browsers
4. Update documentation for any API changes
5. Add appropriate tests for new functionality
6. Consider performance impact of changes
