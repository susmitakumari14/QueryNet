# QueryNet API Documentation

## Overview

The QueryNet API is a RESTful web service that provides comprehensive endpoints for managing a Q&A platform similar to Stack Overflow. It handles user authentication, question management, answers, comments, notifications, and more.

## Base URL

```
Development: http://localhost:3001/api
Production: https://api.querynet.com/api
```

## Authentication

### JWT Token Authentication
The API uses JSON Web Tokens (JWT) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Token Lifecycle
- **Expiration**: 7 days (configurable)
- **Refresh**: Automatic refresh on valid requests
- **Storage**: Store securely on client side

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "reputation": 0,
      "joinDate": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "reputation": 150,
      "lastActivity": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "reputation": 150,
      "badges": ["verified", "first-question"],
      "preferences": {
        "emailNotifications": true,
        "theme": "dark"
      }
    }
  }
}
```

#### Logout User
```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Question Endpoints

#### Get All Questions
```http
GET /questions?page=1&limit=20&sort=recent&tag=javascript
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `sort` (string): Sort order (`recent`, `votes`, `views`, `unanswered`)
- `tag` (string): Filter by tag
- `search` (string): Search in title and content

**Response (200):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "How to implement React hooks?",
        "content": "<p>I'm trying to understand how to properly implement React hooks...</p>",
        "author": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "johndoe",
          "reputation": 150
        },
        "tags": [
          {
            "_id": "507f1f77bcf86cd799439013",
            "name": "react",
            "color": "#61dafb"
          }
        ],
        "votes": {
          "upvotes": ["507f1f77bcf86cd799439014"],
          "downvotes": [],
          "score": 5
        },
        "answers": 3,
        "views": 125,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "lastActivity": "2024-01-15T14:22:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 95,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Create Question
```http
POST /questions
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "How to implement React hooks effectively?",
  "content": "<p>I'm working on a React project and want to understand the best practices for implementing hooks...</p>",
  "tags": ["react", "javascript", "hooks"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "question": {
      "_id": "507f1f77bcf86cd799439015",
      "title": "How to implement React hooks effectively?",
      "content": "<p>I'm working on a React project...</p>",
      "author": "507f1f77bcf86cd799439011",
      "tags": ["react", "javascript", "hooks"],
      "votes": {
        "upvotes": [],
        "downvotes": [],
        "score": 0
      },
      "createdAt": "2024-01-15T15:30:00.000Z"
    }
  }
}
```

#### Get Question by ID
```http
GET /questions/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "question": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "How to implement React hooks?",
      "content": "<p>I'm trying to understand how to properly implement React hooks...</p>",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "reputation": 150,
        "avatar": "https://example.com/avatar.jpg"
      },
      "tags": [
        {
          "_id": "507f1f77bcf86cd799439013",
          "name": "react",
          "description": "React JavaScript library",
          "color": "#61dafb"
        }
      ],
      "votes": {
        "upvotes": ["507f1f77bcf86cd799439014"],
        "downvotes": [],
        "score": 5
      },
      "answers": [
        {
          "_id": "507f1f77bcf86cd799439016",
          "content": "<p>Here's how you can implement React hooks effectively...</p>",
          "author": {
            "username": "reactexpert",
            "reputation": 2500
          },
          "votes": {
            "score": 8
          },
          "isAccepted": true,
          "createdAt": "2024-01-15T11:45:00.000Z"
        }
      ],
      "views": 125,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### Vote on Question
```http
POST /questions/:id/vote
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "voteType": "up"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "votes": {
      "upvotes": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439014"],
      "downvotes": [],
      "score": 6
    }
  }
}
```

### Answer Endpoints

#### Create Answer
```http
POST /answers
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "questionId": "507f1f77bcf86cd799439012",
  "content": "<p>Here's a comprehensive answer to your React hooks question...</p>"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "answer": {
      "_id": "507f1f77bcf86cd799439017",
      "content": "<p>Here's a comprehensive answer...</p>",
      "author": "507f1f77bcf86cd799439011",
      "question": "507f1f77bcf86cd799439012",
      "votes": {
        "upvotes": [],
        "downvotes": [],
        "score": 0
      },
      "isAccepted": false,
      "createdAt": "2024-01-15T16:30:00.000Z"
    }
  }
}
```

#### Vote on Answer
```http
POST /answers/:id/vote
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "voteType": "up"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "votes": {
      "upvotes": ["507f1f77bcf86cd799439011"],
      "downvotes": [],
      "score": 1
    }
  }
}
```

#### Accept Answer
```http
POST /answers/:id/accept
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "answer": {
      "_id": "507f1f77bcf86cd799439017",
      "isAccepted": true,
      "acceptedAt": "2024-01-15T17:00:00.000Z"
    }
  }
}
```

### User Endpoints

#### Get User Profile
```http
GET /users/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "bio": "Full-stack developer passionate about React and Node.js",
      "reputation": 150,
      "badges": [
        {
          "name": "verified",
          "description": "Verified user",
          "icon": "✓"
        }
      ],
      "location": "San Francisco, CA",
      "website": "https://johndoe.dev",
      "joinDate": "2024-01-01T00:00:00.000Z",
      "lastActivity": "2024-01-15T17:30:00.000Z",
      "stats": {
        "questionsAsked": 12,
        "answersGiven": 25,
        "acceptedAnswers": 18,
        "totalVotes": 143
      }
    }
  }
}
```

#### Update User Profile
```http
PUT /users/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "bio": "Updated bio description",
  "location": "New York, NY",
  "website": "https://newwebsite.com",
  "preferences": {
    "emailNotifications": false,
    "theme": "light"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "bio": "Updated bio description",
      "location": "New York, NY",
      "website": "https://newwebsite.com",
      "preferences": {
        "emailNotifications": false,
        "theme": "light"
      },
      "updatedAt": "2024-01-15T18:00:00.000Z"
    }
  }
}
```

#### Get User's Questions
```http
GET /users/:id/questions?page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "How to implement React hooks?",
        "votes": { "score": 5 },
        "answers": 3,
        "views": 125,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 12
    }
  }
}
```

### Notification Endpoints

#### Get User Notifications
```http
GET /notifications?page=1&limit=20&unread=true
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `unread` (boolean): Filter unread notifications

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "507f1f77bcf86cd799439018",
        "type": "answer",
        "title": "New answer on your question",
        "message": "Someone answered your question about React hooks",
        "link": "/questions/507f1f77bcf86cd799439012",
        "isRead": false,
        "createdAt": "2024-01-15T16:45:00.000Z",
        "metadata": {
          "questionId": "507f1f77bcf86cd799439012",
          "answerId": "507f1f77bcf86cd799439017"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 45
    }
  }
}
```

#### Get Notification Count
```http
GET /notifications/count
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "unread": 8
  }
}
```

#### Mark Notification as Read
```http
PUT /notifications/:id/read
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notification": {
      "_id": "507f1f77bcf86cd799439018",
      "isRead": true,
      "readAt": "2024-01-15T18:30:00.000Z"
    }
  }
}
```

### Search Endpoints

#### Search Questions
```http
GET /search/questions?q=react hooks&page=1&limit=20
```

**Query Parameters:**
- `q` (string): Search query
- `page` (number): Page number
- `limit` (number): Items per page
- `tags` (string): Comma-separated tags
- `sort` (string): Sort order (`relevance`, `recent`, `votes`)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "How to implement React hooks?",
        "excerpt": "I'm trying to understand how to properly implement React hooks...",
        "author": {
          "username": "johndoe",
          "reputation": 150
        },
        "tags": ["react", "javascript", "hooks"],
        "votes": { "score": 5 },
        "answers": 3,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "relevanceScore": 0.95
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 23
    }
  }
}
```

#### Global Search
```http
GET /search/global?q=react&type=all
```

**Query Parameters:**
- `q` (string): Search query
- `type` (string): Search type (`all`, `questions`, `users`, `tags`)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "questions": [...],
    "users": [...],
    "tags": [...]
  }
}
```

### Tag Endpoints

#### Get All Tags
```http
GET /tags?page=1&limit=50&sort=popular
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "name": "react",
        "description": "React JavaScript library for building user interfaces",
        "color": "#61dafb",
        "questionCount": 1250,
        "followerCount": 890,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 234
    }
  }
}
```

### Statistics Endpoints

#### Get Platform Statistics
```http
GET /stats/overview
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalQuestions": 15420,
      "totalAnswers": 28750,
      "totalUsers": 3250,
      "questionsToday": 45,
      "answersToday": 78,
      "newUsersToday": 12,
      "topTags": [
        { "name": "javascript", "count": 2340 },
        { "name": "python", "count": 1890 },
        { "name": "react", "count": 1250 }
      ],
      "lastUpdated": "2024-01-15T18:45:00.000Z"
    }
  }
}
```

## Error Responses

### Error Format
All API errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {...}
  }
}
```

### HTTP Status Codes

| Status | Description | Example |
|--------|-------------|---------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Validation Error | Request validation failed |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Internal server error |

### Common Error Examples

#### Validation Error (422)
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "title": "Title must be at least 10 characters",
      "tags": "At least one tag is required"
    }
  }
}
```

#### Authentication Error (401)
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired token",
    "code": "AUTHENTICATION_ERROR"
  }
}
```

#### Rate Limit Error (429)
```json
{
  "success": false,
  "error": {
    "message": "Too many requests. Please try again later.",
    "code": "RATE_LIMIT_EXCEEDED",
    "details": {
      "retryAfter": 900
    }
  }
}
```

## Rate Limiting

### Default Limits
- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login attempts per 15 minutes per IP
- **Search**: 60 requests per 5 minutes per user

### Headers
Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642267200
```

## Pagination

### Request Parameters
```http
GET /questions?page=2&limit=20
```

### Response Format
```json
{
  "data": {...},
  "pagination": {
    "currentPage": 2,
    "totalPages": 10,
    "totalItems": 195,
    "hasNext": true,
    "hasPrev": true,
    "limit": 20
  }
}
```

## Data Validation

### Question Validation
- **Title**: 10-200 characters, required
- **Content**: 30+ characters, required
- **Tags**: 1-5 tags, each 2-25 characters

### User Registration Validation
- **Username**: 3-20 characters, alphanumeric + underscore
- **Email**: Valid email format, unique
- **Password**: 8+ characters, must include letters and numbers

### Answer Validation
- **Content**: 30+ characters, required
- **Question ID**: Valid MongoDB ObjectId

## File Upload

### Avatar Upload
```http
POST /users/:id/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**
```
Form Data:
avatar: [file]
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://api.querynet.com/uploads/avatars/507f1f77bcf86cd799439011.jpg"
  }
}
```

### Image Upload (for questions/answers)
```http
POST /upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Limitations:**
- Max file size: 10MB
- Allowed formats: JPEG, PNG, GIF, WebP
- Max dimensions: 1920x1080

## WebSocket Events

### Real-time Notifications
```javascript
// Connect to WebSocket
const socket = io('ws://localhost:3001', {
  auth: {
    token: 'your-jwt-token'
  }
});

// Listen for new notifications
socket.on('notification', (data) => {
  console.log('New notification:', data);
});

// Listen for question updates
socket.on('questionUpdate', (data) => {
  console.log('Question updated:', data);
});
```

### Event Types
- `notification`: New notification for user
- `questionUpdate`: Question was edited or answered
- `answerUpdate`: Answer was edited or accepted
- `voteUpdate`: Vote count changed

## API Versioning

### Version Header
```http
Accept: application/vnd.querynet.v1+json
```

### URL Versioning (Alternative)
```
/api/v1/questions
/api/v2/questions
```

### Deprecation Notice
Deprecated endpoints will include a warning header:
```http
Warning: 299 - "Deprecated API version. Please upgrade to v2"
```

## SDKs and Libraries

### JavaScript/TypeScript
```typescript
import { QueryNetAPI } from '@querynet/js-sdk';

const api = new QueryNetAPI({
  baseURL: 'https://api.querynet.com/api',
  apiKey: 'your-api-key'
});

// Usage
const questions = await api.questions.getAll({ page: 1, limit: 20 });
const question = await api.questions.create({
  title: 'How to use the API?',
  content: 'I need help with the QueryNet API...',
  tags: ['api', 'help']
});
```

### Python
```python
from querynet import QueryNetAPI

api = QueryNetAPI(
    base_url='https://api.querynet.com/api',
    api_key='your-api-key'
)

# Usage
questions = api.questions.get_all(page=1, limit=20)
question = api.questions.create(
    title='How to use the API?',
    content='I need help with the QueryNet API...',
    tags=['api', 'help']
)
```

## Testing

### Postman Collection
Download the Postman collection: [QueryNet API.postman_collection.json](./postman/QueryNet-API.postman_collection.json)

### Environment Variables
```json
{
  "baseUrl": "http://localhost:3001/api",
  "authToken": "{{token}}",
  "userId": "{{userId}}"
}
```

### Test Examples
```javascript
// Test authentication
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    pm.expect(pm.response.json().success).to.be.true;
    pm.expect(pm.response.json().data.token).to.exist;
    
    // Set token for subsequent requests
    pm.environment.set("authToken", pm.response.json().data.token);
});

// Test question creation
pm.test("Question created", function () {
    pm.response.to.have.status(201);
    pm.expect(pm.response.json().success).to.be.true;
    pm.expect(pm.response.json().data.question.title).to.exist;
});
```

## Changelog

### v1.2.0 (Latest)
- Added real-time notifications via WebSocket
- Implemented advanced search functionality
- Added file upload capabilities
- Enhanced error handling and validation

### v1.1.0
- Added comment system
- Implemented tag management
- Added user reputation system
- Enhanced pagination

### v1.0.0
- Initial API release
- Basic CRUD operations for questions and answers
- User authentication and authorization
- Basic search functionality

## Support

### Getting Help
- **Documentation**: This comprehensive guide
- **GitHub Issues**: Report bugs and request features
- **Community Forum**: Get help from other developers
- **Email Support**: api-support@querynet.com

### Status Page
Check API status and uptime: https://status.querynet.com

### API Health
Monitor API health: `GET /health`
