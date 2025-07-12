# QueryNet Backend Documentation

## Overview

The QueryNet backend is a RESTful API built with Node.js, Express, and TypeScript. It provides a comprehensive set of endpoints for managing users, questions, answers, comments, notifications, and more in a Stack Overflow-like Q&A platform.

## Technology Stack

### Core Technologies
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21+
- **Language**: TypeScript 5.8+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

### Key Dependencies
```json
{
  "express": "^4.21.2",
  "mongoose": "^8.16.3",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "helmet": "^7.2.0",
  "express-rate-limit": "^7.5.1",
  "socket.io": "^4.7.4"
}
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Application entry point
│   ├── controllers/          # Route handlers and business logic
│   │   ├── auth.ts          # Authentication endpoints
│   │   ├── users.ts         # User management
│   │   ├── questions.ts     # Question operations
│   │   ├── answers.ts       # Answer operations
│   │   ├── comments.ts      # Comment system
│   │   ├── tags.ts          # Tag management
│   │   ├── notifications.ts # Notification system
│   │   ├── search.ts        # Search functionality
│   │   └── stats.ts         # Analytics and statistics
│   ├── models/              # Database schemas
│   │   ├── User.ts          # User model
│   │   ├── Question.ts      # Question model
│   │   ├── Answer.ts        # Answer model
│   │   └── Notification.ts  # Notification model
│   ├── routes/              # API route definitions
│   │   ├── auth.ts          # Authentication routes
│   │   ├── users.ts         # User routes
│   │   ├── questions.ts     # Question routes
│   │   ├── answers.ts       # Answer routes
│   │   ├── comments.ts      # Comment routes
│   │   ├── tags.ts          # Tag routes
│   │   ├── notifications.ts # Notification routes
│   │   ├── search.ts        # Search routes
│   │   └── stats.ts         # Statistics routes
│   ├── middleware/          # Custom middleware
│   │   ├── auth.ts          # Authentication middleware
│   │   ├── errorHandler.ts  # Global error handling
│   │   └── notFound.ts      # 404 handler
│   ├── utils/               # Utility functions
│   │   └── database.ts      # Database connection
│   └── types/               # TypeScript type definitions
├── package.json
├── tsconfig.json
├── nodemon.json
└── .env.example
```

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | User registration | ❌ |
| POST | `/login` | User login | ❌ |
| POST | `/logout` | User logout | ✅ |
| GET | `/me` | Get current user | ✅ |
| POST | `/refresh` | Refresh JWT token | ✅ |
| POST | `/forgot-password` | Password reset request | ❌ |
| POST | `/reset-password` | Password reset | ❌ |

### Users (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all users (paginated) | ❌ |
| GET | `/:id` | Get user by ID | ❌ |
| PUT | `/:id` | Update user profile | ✅ |
| DELETE | `/:id` | Delete user account | ✅ |
| GET | `/:id/questions` | Get user's questions | ❌ |
| GET | `/:id/answers` | Get user's answers | ❌ |
| POST | `/:id/follow` | Follow/unfollow user | ✅ |

### Questions (`/api/questions`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all questions (paginated) | ❌ |
| POST | `/` | Create new question | ✅ |
| GET | `/:id` | Get question by ID | ❌ |
| PUT | `/:id` | Update question | ✅ |
| DELETE | `/:id` | Delete question | ✅ |
| POST | `/:id/vote` | Vote on question | ✅ |
| GET | `/:id/answers` | Get question answers | ❌ |

### Answers (`/api/answers`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new answer | ✅ |
| GET | `/:id` | Get answer by ID | ❌ |
| PUT | `/:id` | Update answer | ✅ |
| DELETE | `/:id` | Delete answer | ✅ |
| POST | `/:id/vote` | Vote on answer | ✅ |
| POST | `/:id/accept` | Accept answer | ✅ |

### Comments (`/api/comments`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new comment | ✅ |
| GET | `/:id` | Get comment by ID | ❌ |
| PUT | `/:id` | Update comment | ✅ |
| DELETE | `/:id` | Delete comment | ✅ |
| POST | `/:id/vote` | Vote on comment | ✅ |

### Tags (`/api/tags`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all tags | ❌ |
| POST | `/` | Create new tag | ✅ |
| GET | `/:id` | Get tag by ID | ❌ |
| PUT | `/:id` | Update tag | ✅ |
| GET | `/:id/questions` | Get questions by tag | ❌ |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user notifications | ✅ |
| GET | `/count` | Get unread count | ✅ |
| PUT | `/:id/read` | Mark as read | ✅ |
| PUT | `/read-all` | Mark all as read | ✅ |
| DELETE | `/:id` | Delete notification | ✅ |

### Search (`/api/search`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/questions` | Search questions | ❌ |
| GET | `/users` | Search users | ❌ |
| GET | `/tags` | Search tags | ❌ |
| GET | `/global` | Global search | ❌ |

### Statistics (`/api/stats`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/overview` | Platform statistics | ❌ |
| GET | `/user/:id` | User statistics | ❌ |
| GET | `/trending` | Trending content | ❌ |

## Data Models

### User Model
```typescript
interface User {
  _id: ObjectId;
  username: string;
  email: string;
  password: string; // hashed
  avatar?: string;
  bio?: string;
  reputation: number;
  badges: string[];
  location?: string;
  website?: string;
  joinDate: Date;
  lastActivity: Date;
  isVerified: boolean;
  role: 'user' | 'moderator' | 'admin';
  preferences: {
    emailNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  followers: ObjectId[];
  following: ObjectId[];
}
```

### Question Model
```typescript
interface Question {
  _id: ObjectId;
  title: string;
  content: string;
  author: ObjectId; // ref: User
  tags: ObjectId[]; // ref: Tag
  votes: {
    upvotes: ObjectId[]; // user IDs
    downvotes: ObjectId[];
    score: number;
  };
  answers: ObjectId[]; // ref: Answer
  acceptedAnswer?: ObjectId; // ref: Answer
  views: number;
  status: 'open' | 'closed' | 'protected';
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
  bounty?: {
    amount: number;
    deadline: Date;
    awarded: boolean;
  };
}
```

### Answer Model
```typescript
interface Answer {
  _id: ObjectId;
  content: string;
  author: ObjectId; // ref: User
  question: ObjectId; // ref: Question
  votes: {
    upvotes: ObjectId[];
    downvotes: ObjectId[];
    score: number;
  };
  comments: ObjectId[]; // ref: Comment
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Notification Model
```typescript
interface Notification {
  _id: ObjectId;
  recipient: ObjectId; // ref: User
  type: 'answer' | 'comment' | 'vote' | 'mention' | 'follow' | 'badge';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  metadata?: {
    questionId?: ObjectId;
    answerId?: ObjectId;
    userId?: ObjectId;
  };
}
```

## Authentication & Authorization

### JWT Token Structure
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number; // issued at
  exp: number; // expires at
}
```

### Authentication Flow
1. **Registration/Login**: User provides credentials
2. **Password Hashing**: bcrypt with salt rounds (12)
3. **Token Generation**: JWT signed with secret
4. **Token Validation**: Middleware verifies token on protected routes
5. **Token Refresh**: Automatic token renewal

### Authorization Levels
- **Public**: No authentication required
- **User**: Valid JWT token required
- **Moderator**: User role + moderator permissions
- **Admin**: Full access to all resources

## Security Features

### Input Validation
```typescript
// Example validation middleware
import { body, validationResult } from 'express-validator';

export const validateQuestion = [
  body('title')
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  body('content')
    .isLength({ min: 30 })
    .withMessage('Content must be at least 30 characters'),
  body('tags')
    .isArray({ min: 1, max: 5 })
    .withMessage('Must have 1-5 tags'),
];
```

### Security Middleware
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Sanitization**: XSS protection
- **Password Hashing**: bcrypt encryption

### Rate Limiting Configuration
```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});
```

## Database Configuration

### MongoDB Connection
```typescript
// utils/database.ts
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/querynet';
    
    await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
```

### Database Indexes
```typescript
// Optimized indexes for performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
QuestionSchema.index({ tags: 1, createdAt: -1 });
QuestionSchema.index({ author: 1, createdAt: -1 });
QuestionSchema.index({ title: 'text', content: 'text' });
```

## Environment Variables

### Required Environment Variables
```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/querynet

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Frontend Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379
```

## Error Handling

### Global Error Handler
```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { ...error, message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { ...error, message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { ...error, message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### Custom Error Classes
```typescript
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Not authenticated') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized') {
    super(message, 403);
  }
}
```

## Testing

### Test Structure
```
backend/
├── __tests__/
│   ├── unit/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth.test.ts
│   │   ├── questions.test.ts
│   │   └── users.test.ts
│   └── setup/
│       ├── testDb.ts
│       └── helpers.ts
```

### Test Configuration
```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/testDb.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Example Test
```typescript
// __tests__/integration/auth.test.ts
import request from 'supertest';
import app from '../../src/index';
import { User } from '../../src/models/User';

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
```

## Performance Optimization

### Database Optimization
- **Indexing**: Strategic indexes for common queries
- **Aggregation**: MongoDB aggregation pipelines for complex queries
- **Connection Pooling**: Optimized connection pool settings
- **Query Optimization**: Efficient query patterns

### Caching Strategy
```typescript
// Redis caching implementation
import redis from 'redis';

const client = redis.createClient({
  url: process.env.REDIS_URL
});

export const cache = {
  get: async (key: string) => {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  },
  
  set: async (key: string, value: any, ttl: number = 3600) => {
    await client.setEx(key, ttl, JSON.stringify(value));
  },
  
  del: async (key: string) => {
    await client.del(key);
  }
};

// Cache middleware
export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await cache.get(key);
    
    if (cached) {
      return res.json(cached);
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      cache.set(key, body, ttl);
      res.sendResponse(body);
    };
    
    next();
  };
};
```

## Deployment

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

USER backend

EXPOSE 3001

CMD ["npm", "start"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/querynet
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database connection secured
- [ ] HTTPS/SSL certificates
- [ ] Rate limiting configured
- [ ] Logging and monitoring setup
- [ ] Health checks implemented
- [ ] Backup strategy in place
- [ ] CI/CD pipeline configured

## Monitoring and Logging

### Health Check Endpoint
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
    memory: process.memoryUsage(),
  });
});
```

### Request Logging
```typescript
// Custom Morgan format
const morganFormat = process.env.NODE_ENV === 'production' 
  ? 'combined' 
  : ':method :url :status :res[content-length] - :response-time ms';

app.use(morgan(morganFormat));
```

## API Documentation

### Swagger/OpenAPI Integration
```typescript
// swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QueryNet API',
      version: '1.0.0',
      description: 'RESTful API for QueryNet Q&A Platform',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001/api',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
```

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run linting and tests
5. Submit pull request

### Code Style
- **ESLint**: TypeScript ESLint configuration
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **Conventional Commits**: Commit message format

### Pull Request Guidelines
- [ ] Code follows TypeScript best practices
- [ ] Tests written and passing
- [ ] API documentation updated
- [ ] Error handling implemented
- [ ] Security considerations addressed
