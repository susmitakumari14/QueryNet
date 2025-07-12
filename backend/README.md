# QueryNet Backend API

A complete backend API for QueryNet Q&A platform built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Questions Management**: CRUD operations for questions with voting, tagging, and search
- **Answers System**: Answer creation, voting, and acceptance functionality
- **User Profiles**: User management with reputation system and badges
- **Real-time Features**: Socket.io integration for live updates
- **Security**: Rate limiting, CORS, helmet for security headers
- **Validation**: Input validation with express-validator
- **Database**: MongoDB with Mongoose ODM
- **TypeScript**: Full TypeScript support for type safety

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18.x or higher)
- **MongoDB** (version 5.x or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd QueryNet/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/querynet
DB_NAME=querynet

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=http://localhost:8080

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Ubuntu/Debian
sudo systemctl start mongodb

# macOS with Homebrew
brew services start mongodb-community

# Windows
net start MongoDB
```

### 5. Build and Run

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3001`

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/        # Route controllers
│   │   ├── auth.ts
│   │   ├── questions.ts
│   │   ├── answers.ts
│   │   └── users.ts
│   ├── middleware/         # Custom middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── notFound.ts
│   ├── models/            # Database models
│   │   ├── User.ts
│   │   ├── Question.ts
│   │   ├── Answer.ts
│   │   └── Comment.ts
│   ├── routes/            # API routes
│   │   ├── auth.ts
│   │   ├── questions.ts
│   │   ├── answers.ts
│   │   └── users.ts
│   ├── utils/             # Utility functions
│   │   └── database.ts
│   └── index.ts           # Main application file
├── .env                   # Environment variables
├── .env.example           # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| POST | `/logout` | User logout | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/change-password` | Change password | Private |

### Questions Routes (`/api/questions`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all questions | Public |
| GET | `/:id` | Get single question | Public |
| POST | `/` | Create new question | Private |
| PUT | `/:id` | Update question | Private |
| DELETE | `/:id` | Delete question | Private |
| POST | `/:id/vote` | Vote on question | Private |
| GET | `/tag/:tag` | Get questions by tag | Public |
| GET | `/user/:userId` | Get user's questions | Public |

### Answers Routes (`/api/answers`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/question/:questionId` | Get answers for question | Public |
| POST | `/` | Create new answer | Private |
| PUT | `/:id` | Update answer | Private |
| DELETE | `/:id` | Delete answer | Private |
| POST | `/:id/vote` | Vote on answer | Private |
| POST | `/:id/accept` | Accept answer | Private |

## 🗄️ Database Models

### User Model
```typescript
interface IUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  reputation: number;
  role: 'user' | 'moderator' | 'admin';
  isVerified: boolean;
  badges: Badge[];
  preferences: UserPreferences;
  stats: UserStats;
}
```

### Question Model
```typescript
interface IQuestion {
  title: string;
  body: string;
  author: ObjectId;
  tags: string[];
  votes: Vote[];
  views: number;
  status: 'open' | 'closed' | 'duplicate';
  acceptedAnswer?: ObjectId;
}
```

### Answer Model
```typescript
interface IAnswer {
  body: string;
  author: ObjectId;
  question: ObjectId;
  votes: Vote[];
  isAccepted: boolean;
}
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **User**: Can create questions, answers, vote, and comment
- **Moderator**: Additional moderation capabilities
- **Admin**: Full system access

## 🛡️ Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS**: Cross-origin resource sharing protection
- **Helmet**: Security headers for protection against common attacks
- **Input Validation**: Request validation using express-validator
- **Password Hashing**: Bcrypt for secure password storage
- **JWT Tokens**: Secure authentication tokens

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [
    // Validation errors (if any)
  ]
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📈 Performance & Scaling

### Database Indexes
- Questions: `title`, `tags`, `author`, `createdAt`
- Users: `username`, `email`
- Answers: `question`, `author`, `isAccepted`

### Caching Strategy
- Implement Redis for caching frequently accessed data
- Cache user sessions and question metadata

### Optimization Tips
1. Use MongoDB aggregation pipeline for complex queries
2. Implement database connection pooling
3. Use compression middleware for response compression
4. Implement pagination for large datasets

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://your-production-mongo-uri
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

### Production Checklist
- [ ] Environment variables configured
- [ ] MongoDB connection secured
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Logging implemented
- [ ] Error monitoring setup
- [ ] Database backups configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Frontend Integration

The backend is designed to work with the QueryNet React frontend. Make sure to:

1. Set the correct `FRONTEND_URL` in your environment variables
2. Update frontend API endpoints to point to `http://localhost:3001/api`
3. Include JWT tokens in frontend requests

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:3001/api
```

## 📅 Roadmap

- [ ] Email notifications
- [ ] Advanced search with Elasticsearch
- [ ] Real-time chat system
- [ ] Comment system enhancement
- [ ] Badge system implementation
- [ ] Analytics dashboard
- [ ] Mobile app API support
