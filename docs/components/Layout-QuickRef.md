# Layout Component Quick Reference

## 🚀 Quick Start

### Import
```tsx
import { Layout } from '@/components/Layout';
```

### Basic Usage
```tsx
<Layout>
  <YourPageContent />
</Layout>
```

## 📋 Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | ✅ | Page content to render inside layout |

## ⭐ Key Features

### 🎨 Responsive Design
- **Desktop**: Full navigation bar with search
- **Mobile**: Hamburger menu + mobile search  
- **Tablet**: Hybrid layout with optimized spacing

### 🔐 Authentication States
- **Logged In**: User dropdown, notifications badge, settings access
- **Logged Out**: Login button, basic notifications

### 🔍 Search
- **Desktop**: Persistent search bar in header
- **Mobile**: Search bar below header
- **Status**: UI ready, needs API integration

### 🔔 Notifications
- Badge with unread count (currently mock: 3)
- Animated pulse indicator
- Quick access to notification center

## 🧭 Navigation Map

| Element | Destination | Notes |
|---------|-------------|-------|
| Logo ("StackIt") | `/` | Home page |
| Ask Question | `/ask` | Question creation |
| Notifications | `/notifications` | Notification center |
| Profile dropdown | `/profile` | User profile |
| Settings | `/profile?tab=settings` | User settings |
| Login/Logout | `/login` or logout action | Authentication |

## 🎛️ State Variables

```tsx
// Local component state
const [showMobileMenu, setShowMobileMenu] = useState(false);
const [notificationCount, setNotificationCount] = useState(3);

// From useAuth hook
const { user, isAuthenticated, logout } = useAuth();

// From useIsMobile hook  
const isMobile = useIsMobile();
```

## 🔧 Event Handlers

```tsx
handleLogout()            // Logout + cleanup + navigate home
handleNotificationClick() // Navigate to notifications
setShowMobileMenu()       // Toggle mobile menu visibility
```

## 📱 Responsive Breakpoints

| Class | Behavior |
|-------|----------|
| `hidden md:flex` | Show on desktop only (≥768px) |
| `md:hidden` | Show on mobile only (<768px) |
| `sm:hidden` | Hide on small screens (<640px) |
| `sm:flex` | Show on small+ screens (≥640px) |

## 🎨 CSS Classes Cheat Sheet

```css
/* Container */
.min-h-screen.bg-background

/* Header */
.sticky.top-0.z-50.bg-background/95.backdrop-blur-sm.border-b

/* Logo */
.text-xl.sm:text-2xl.font-bold.bg-gradient-to-r.from-blue-600.to-purple-600.bg-clip-text.text-transparent

/* Notification Badge */
.notification-badge.bg-red-500.text-white.border-2.border-background.animate-pulse

/* Header Buttons */
.header-button.hover:bg-muted/50.transition-all.duration-200
```

## ⚡ Quick Customizations

### Change Logo Text
```tsx
<h1 className="...">
  YourAppName  {/* Change from "StackIt" */}
</h1>
```

### Add Navigation Item (Mobile Menu)
```tsx
<Button 
  variant="ghost" 
  className="w-full justify-start"
  onClick={() => navigate('/your-page')}
>
  <YourIcon className="h-4 w-4 mr-2" />
  Your Page
</Button>
```

### Update Primary Colors
```tsx
// Logo gradient
className="bg-gradient-to-r from-your-color-600 to-your-color-600"

// Primary buttons  
className="bg-your-color-600 hover:bg-your-color-700"
```

### Modify Notification Count
```tsx
const [notificationCount, setNotificationCount] = useState(yourCount);
```

## 🔍 Dependencies Quick Check

```bash
# Required external packages
npm list react-router-dom lucide-react

# Internal dependencies
- @/components/ui/* (Button, Input, Badge, DropdownMenu)
- @/components/ThemeToggle
- @/hooks/useAuth
- @/hooks/use-mobile
```

## 🐛 Common Issues & Fixes

### Mobile Menu Not Showing
- **Check**: `showMobileMenu` state
- **Check**: `md:hidden` classes applied
- **Fix**: Verify state toggle function

### Auth UI Not Updating  
- **Check**: `useAuth()` hook configuration
- **Check**: `isAuthenticated` value
- **Fix**: Verify auth context provider

### Responsive Layout Broken
- **Check**: Browser dev tools at breakpoints
- **Check**: Tailwind classes for responsive prefixes
- **Fix**: Adjust `sm:`, `md:`, `lg:` prefixes

### Search Bar Styling Issues
- **Check**: Tailwind reset styles
- **Check**: Browser-specific overrides
- **Fix**: Add browser-specific CSS if needed

### Notification Badge Not Updating
- **Check**: `notificationCount` state updates
- **Fix**: Connect to real-time data source
- **Note**: Currently uses mock data (3)

## 🏃‍♂️ Performance Tips

- ✅ Minimal re-renders (isolated state changes)
- ✅ Sticky header uses CSS positioning
- ✅ Conditional rendering for auth states  
- ✅ Mobile-optimized touch targets
- ✅ Hardware-accelerated backdrop blur

## ♿ Accessibility Quick Check

- ✅ ARIA labels on interactive buttons
- ✅ Keyboard navigation support
- ✅ Screen reader friendly markup
- ✅ High contrast color support
- ✅ Touch-friendly mobile targets (min 44px)

## 📊 Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Requires JavaScript enabled
- ✅ CSS Grid and Flexbox support needed

## 🔮 Future TODOs

- [ ] Connect search to API
- [ ] Real-time notification updates
- [ ] User avatar in dropdown
- [ ] Breadcrumb navigation
- [ ] Keyboard shortcuts
- [ ] PWA features

## 📚 Related Docs

- [Full Layout Documentation](./Layout.md)
- [Theme Toggle Component](./ThemeToggle.md)
- [Authentication Hook](../hooks/useAuth.md)
- [UI Components](./ui/README.md)
