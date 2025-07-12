# QueryNet Frontend Documentation

## Overview

The QueryNet frontend is a modern, responsive React application built with TypeScript and Vite. It provides an intuitive user interface for the Q&A platform, featuring real-time interactions, responsive design, and accessibility-first approach.

## Technology Stack

### Core Technologies
- **Framework**: React 19.1+
- **Language**: TypeScript 5.8+
- **Build Tool**: Vite 7.0+
- **Styling**: Tailwind CSS 3.4+
- **Routing**: React Router DOM 7.6+

### UI & Design
- **Component Library**: Radix UI primitives
- **Icons**: Lucide React
- **Rich Text**: TipTap editor
- **Themes**: next-themes
- **Notifications**: Sonner (toast notifications)

### Key Dependencies
```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router-dom": "^7.6.3",
  "@tiptap/react": "^2.26.1",
  "lucide-react": "^0.525.0",
  "next-themes": "^0.4.6",
  "tailwindcss": "^3.4.17"
}
```

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Layout.tsx          # Main layout wrapper
│   ├── AskQuestionForm.tsx # Question creation form
│   ├── QuestionCard.tsx    # Question display component
│   ├── RichTextEditor.tsx  # Rich text editing
│   ├── NotificationBar.tsx # Notification system
│   ├── ThemeProvider.tsx   # Theme management
│   ├── ThemeToggle.tsx     # Theme toggle button
│   └── ui/                 # Base UI components
│       ├── button.tsx      # Button component
│       ├── input.tsx       # Input component
│       ├── card.tsx        # Card component
│       ├── badge.tsx       # Badge component
│       ├── dropdown-menu.tsx # Dropdown menu
│       ├── toast.tsx       # Toast notifications
│       ├── tooltip.tsx     # Tooltip component
│       └── ...
├── pages/                  # Page-level components
│   ├── Index.tsx          # Home page
│   ├── Login.tsx          # Authentication page
│   ├── AskQuestion.tsx    # Question creation page
│   ├── QuestionDetail.tsx # Question details page
│   ├── Profile.tsx        # User profile page
│   ├── Notifications.tsx  # Notifications page
│   └── NotFound.tsx       # 404 page
├── contexts/              # React contexts
│   ├── AuthContext.tsx   # Authentication context
│   └── auth.tsx          # Auth context provider
├── hooks/                 # Custom React hooks
│   ├── useAuth.tsx       # Authentication hook
│   ├── use-mobile.tsx    # Mobile detection hook
│   └── use-toast.ts      # Toast notifications hook
├── lib/                  # Utility functions
│   ├── api.ts           # API client configuration
│   └── utils.ts         # General utilities
├── assets/              # Static assets
│   └── react.svg       # React logo
├── App.tsx              # Main app component
├── main.tsx             # Application entry point
├── index.css            # Global styles
└── vite-env.d.ts        # Vite type definitions
```

## Component Architecture

### Design System

#### Color Palette
```css
/* Tailwind CSS Custom Colors */
:root {
  /* Light theme */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
  --destructive: 0 84.2% 60.2%;
  --success: 142.1 76.2% 36.3%;
}

/* Dark theme */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 84% 4.9%;
  /* ... additional dark theme colors */
}
```

#### Typography Scale
```css
/* Font sizes and line heights */
.text-xs    { font-size: 0.75rem; line-height: 1rem; }
.text-sm    { font-size: 0.875rem; line-height: 1.25rem; }
.text-base  { font-size: 1rem; line-height: 1.5rem; }
.text-lg    { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl    { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl   { font-size: 1.5rem; line-height: 2rem; }
.text-3xl   { font-size: 1.875rem; line-height: 2.25rem; }
```

#### Spacing System
```css
/* Consistent spacing scale */
.space-1  { margin: 0.25rem; }  /* 4px */
.space-2  { margin: 0.5rem; }   /* 8px */
.space-3  { margin: 0.75rem; }  /* 12px */
.space-4  { margin: 1rem; }     /* 16px */
.space-6  { margin: 1.5rem; }   /* 24px */
.space-8  { margin: 2rem; }     /* 32px */
.space-12 { margin: 3rem; }     /* 48px */
```

### Component Composition

#### Layout Component
The main layout wrapper that provides consistent structure:

```tsx
import { Layout } from '@/components/Layout';

function App() {
  return (
    <Layout>
      <HomePage />
    </Layout>
  );
}
```

**Features:**
- Responsive navigation header
- Mobile-first hamburger menu
- Theme toggle integration
- Authentication state management
- Global search functionality
- Notification system

#### UI Components Library

##### Button Component
```tsx
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

// Usage
<Button variant="default" size="lg">
  Ask Question
</Button>
```

##### Input Component
```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

// Usage
<Input 
  placeholder="Search questions..." 
  className="pl-10 bg-muted/50" 
/>
```

##### Card Component
```tsx
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

// Usage
<Card>
  <CardHeader>
    <CardTitle>Question Title</CardTitle>
  </CardHeader>
  <CardContent>
    Question content here...
  </CardContent>
</Card>
```

## State Management

### Authentication Context
```tsx
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Theme Management
```tsx
// ThemeProvider integration
import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Layout />
    </ThemeProvider>
  );
}
```

### Local State Patterns
```tsx
// Custom hooks for local state management
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};
```

## Routing Configuration

### Route Structure
```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/ask" element={<AskQuestion />} />
              <Route path="/questions/:id" element={<QuestionDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### Protected Routes
```tsx
// ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, requireAuth, navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

// Usage
<Route path="/ask" element={
  <ProtectedRoute>
    <AskQuestion />
  </ProtectedRoute>
} />
```

## API Integration

### HTTP Client Configuration
```tsx
// lib/api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Service Functions
```tsx
// API service functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const questionsAPI = {
  getQuestions: async (params?: QuestionParams) => {
    const response = await api.get('/questions', { params });
    return response.data;
  },

  getQuestion: async (id: string) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  createQuestion: async (questionData: CreateQuestionData) => {
    const response = await api.post('/questions', questionData);
    return response.data;
  },

  updateQuestion: async (id: string, questionData: UpdateQuestionData) => {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
  },

  deleteQuestion: async (id: string) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },

  voteQuestion: async (id: string, voteType: 'up' | 'down') => {
    const response = await api.post(`/questions/${id}/vote`, { voteType });
    return response.data;
  },
};
```

### Data Fetching Patterns
```tsx
// Custom hook for data fetching
export const useQuestions = (params?: QuestionParams) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const data = await questionsAPI.getQuestions(params);
        setQuestions(data.questions);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [params]);

  return { questions, isLoading, error };
};

// Usage in component
function HomePage() {
  const { questions, isLoading, error } = useQuestions({ page: 1, limit: 20 });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-4">
      {questions.map(question => (
        <QuestionCard key={question._id} question={question} />
      ))}
    </div>
  );
}
```

## Form Management

### Question Creation Form
```tsx
// AskQuestionForm.tsx
interface QuestionFormData {
  title: string;
  content: string;
  tags: string[];
}

export const AskQuestionForm: React.FC = () => {
  const [formData, setFormData] = useState<QuestionFormData>({
    title: '',
    content: '',
    tags: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<QuestionFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<QuestionFormData> = {};

    if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (formData.content.length < 30) {
      newErrors.content = 'Content must be at least 30 characters';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await questionsAPI.createQuestion(formData);
      // Redirect or show success message
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Question Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What's your programming question?"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <Label htmlFor="content">Question Details</Label>
        <RichTextEditor
          content={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
          placeholder="Provide more details about your question..."
        />
        {errors.content && (
          <p className="text-sm text-red-500 mt-1">{errors.content}</p>
        )}
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <TagInput
          tags={formData.tags}
          onChange={(tags) => setFormData({ ...formData, tags })}
          placeholder="Add tags (e.g., javascript, react, nodejs)"
        />
        {errors.tags && (
          <p className="text-sm text-red-500 mt-1">{errors.tags}</p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Publishing...' : 'Publish Question'}
      </Button>
    </form>
  );
};
```

### Rich Text Editor
```tsx
// RichTextEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing...',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  return (
    <div className="border border-border rounded-md">
      <EditorToolbar editor={editor} />
      <EditorContent 
        editor={editor} 
        placeholder={placeholder}
      />
    </div>
  );
};

// Toolbar component
const EditorToolbar: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="border-b border-border p-2 flex flex-wrap gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-muted' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-muted' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'bg-muted' : ''}
      >
        <Code className="h-4 w-4" />
      </Button>
      
      {/* Additional toolbar buttons */}
    </div>
  );
};
```

## Responsive Design

### Breakpoint System
```tsx
// Tailwind CSS breakpoints
const breakpoints = {
  sm: '640px',   // Small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px' // Large desktops
};

// Custom hook for responsive design
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};
```

### Mobile-First CSS Classes
```css
/* Mobile-first responsive classes */
.responsive-grid {
  @apply grid grid-cols-1 gap-4;
  @apply sm:grid-cols-2;
  @apply md:grid-cols-3;
  @apply lg:grid-cols-4;
}

.responsive-text {
  @apply text-sm;
  @apply sm:text-base;
  @apply md:text-lg;
  @apply lg:text-xl;
}

.responsive-padding {
  @apply px-4 py-2;
  @apply sm:px-6 sm:py-3;
  @apply md:px-8 md:py-4;
}
```

## Accessibility (a11y)

### WCAG 2.1 AA Compliance
```tsx
// Accessible button component
interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  return (
    <button
      {...props}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={cn(
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        props.className
      )}
    >
      {children}
    </button>
  );
};
```

### Keyboard Navigation
```tsx
// Keyboard navigation hook
export const useKeyboardNavigation = (
  items: string[],
  onSelect: (item: string) => void
) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          onSelect(items[activeIndex]);
        }
        break;
      case 'Escape':
        setActiveIndex(-1);
        break;
    }
  }, [items, activeIndex, onSelect]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { activeIndex, setActiveIndex };
};
```

### Screen Reader Support
```tsx
// Screen reader announcements
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Usage in components
const QuestionCard: React.FC<{ question: Question }> = ({ question }) => {
  const handleVote = (type: 'up' | 'down') => {
    // Vote logic...
    announceToScreenReader(`Question ${type}voted`);
  };

  return (
    <Card role="article" aria-labelledby={`question-title-${question._id}`}>
      <CardHeader>
        <CardTitle id={`question-title-${question._id}`}>
          {question.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: question.content }} />
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('up')}
            aria-label={`Upvote question: ${question.title}`}
          >
            <ChevronUp className="h-4 w-4" />
            {question.votes.upvotes.length}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('down')}
            aria-label={`Downvote question: ${question.title}`}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

## Performance Optimization

### Code Splitting
```tsx
// Route-based code splitting
import { lazy, Suspense } from 'react';

const AskQuestion = lazy(() => import('./pages/AskQuestion'));
const QuestionDetail = lazy(() => import('./pages/QuestionDetail'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/ask" element={<AskQuestion />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}
```

### Component Memoization
```tsx
// Memoized components for performance
import { memo, useMemo, useCallback } from 'react';

interface QuestionCardProps {
  question: Question;
  onVote: (questionId: string, voteType: 'up' | 'down') => void;
}

export const QuestionCard = memo<QuestionCardProps>(({ question, onVote }) => {
  const formattedDate = useMemo(() => 
    new Date(question.createdAt).toLocaleDateString()
  , [question.createdAt]);

  const handleUpvote = useCallback(() => 
    onVote(question._id, 'up')
  , [onVote, question._id]);

  const handleDownvote = useCallback(() => 
    onVote(question._id, 'down')
  , [onVote, question._id]);

  return (
    <Card>
      {/* Component content */}
    </Card>
  );
});

QuestionCard.displayName = 'QuestionCard';
```

### Virtual Scrolling (for large lists)
```tsx
// Virtual scrolling implementation
import { FixedSizeList as List } from 'react-window';

interface VirtualQuestionListProps {
  questions: Question[];
  onQuestionClick: (question: Question) => void;
}

export const VirtualQuestionList: React.FC<VirtualQuestionListProps> = ({
  questions,
  onQuestionClick,
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <QuestionCard
        question={questions[index]}
        onClick={() => onQuestionClick(questions[index])}
      />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={questions.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

## Testing

### Testing Setup
```typescript
// vite.config.ts - Test configuration
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

### Component Testing
```tsx
// __tests__/components/QuestionCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';

const mockQuestion = {
  _id: '1',
  title: 'Test Question',
  content: 'Test content',
  author: { username: 'testuser' },
  tags: ['javascript', 'react'],
  votes: { upvotes: [], downvotes: [], score: 0 },
  createdAt: new Date().toISOString(),
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('QuestionCard', () => {
  it('renders question title and content', () => {
    renderWithRouter(
      <QuestionCard question={mockQuestion} onVote={jest.fn()} />
    );

    expect(screen.getByText('Test Question')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('calls onVote when upvote button is clicked', () => {
    const mockOnVote = jest.fn();
    renderWithRouter(
      <QuestionCard question={mockQuestion} onVote={mockOnVote} />
    );

    const upvoteButton = screen.getByLabelText(/upvote/i);
    fireEvent.click(upvoteButton);

    expect(mockOnVote).toHaveBeenCalledWith('1', 'up');
  });

  it('displays tags correctly', () => {
    renderWithRouter(
      <QuestionCard question={mockQuestion} onVote={jest.fn()} />
    );

    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
  });
});
```

### Integration Testing
```tsx
// __tests__/integration/auth.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { Login } from '../pages/Login';

// Mock API
jest.mock('../lib/api', () => ({
  authAPI: {
    login: jest.fn(),
  },
}));

describe('Authentication Integration', () => {
  it('logs in user successfully', async () => {
    const mockLogin = jest.fn().mockResolvedValue({
      user: { id: '1', email: 'test@example.com' },
      token: 'mock-token',
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
```

### Accessibility Testing
```tsx
// __tests__/accessibility/Layout.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Layout } from '../components/Layout';

expect.extend(toHaveNoViolations);

describe('Layout Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper heading hierarchy', () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );

    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveAttribute('aria-level', '1');
  });
});
```

## Build and Deployment

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          editor: ['@tiptap/react', '@tiptap/starter-kit'],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

### Environment Variables
```bash
# .env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=QueryNet
VITE_VERSION=1.0.0

# .env.production
VITE_API_URL=https://api.querynet.com/api
VITE_APP_NAME=QueryNet
VITE_VERSION=1.0.0
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### GitHub Actions CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Run linting
        run: npm run lint
      
      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for production
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy to production
        run: |
          # Add your deployment commands here
          echo "Deploying to production..."
```

## Performance Monitoring

### Web Vitals
```tsx
// lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  console.log('Web Vital:', metric);
}

export const initPerformanceMonitoring = () => {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
};

// Initialize in main.tsx
initPerformanceMonitoring();
```

### Bundle Analysis
```json
// package.json scripts
{
  "scripts": {
    "build": "vite build",
    "analyze": "vite build && npx vite-bundle-analyzer dist"
  }
}
```

## Contributing Guidelines

### Development Workflow
1. **Setup**: Clone repo and install dependencies
2. **Branch**: Create feature branch from main
3. **Develop**: Make changes with proper TypeScript typing
4. **Test**: Write and run tests
5. **Document**: Update relevant documentation
6. **Submit**: Create pull request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: React and accessibility rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Structured commit messages

### Pull Request Checklist
- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] Tests written and passing
- [ ] Accessibility requirements met
- [ ] Responsive design implemented
- [ ] Documentation updated
- [ ] Performance impact assessed
