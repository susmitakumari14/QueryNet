# QueryNet Development Setup Guide

## 🚀 Quick Start Guide

Follow these steps to get QueryNet running locally on your machine.

### Prerequisites Installation

#### 1. Install Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS with Homebrew
brew install node

# Windows
# Download from https://nodejs.org/
```

#### 2. Install MongoDB
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community
```

### Project Setup

#### 1. Navigate to Project Directory
```bash
cd QueryNet
```

#### 2. Setup Frontend
```bash
# Install frontend dependencies
npm install

# Start frontend development server
npm run dev
```
The frontend will be available at `http://localhost:8080`

#### 3. Setup Backend
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env file with your configuration
# Make sure MONGODB_URI and JWT_SECRET are set

# Build the project
npm run build

# Start development server
npm run dev
```
The backend will be available at `http://localhost:3001`

### Environment Configuration

#### Frontend (.env in root directory)
```env
VITE_API_URL=http://localhost:3001/api
```

#### Backend (backend/.env)
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/querynet
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=http://localhost:8080
```

### Database Setup

#### 1. Start MongoDB
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

#### 2. Verify MongoDB Connection
```bash
# Connect to MongoDB shell
mongosh

# Check connection
> db.runCommand({ hello: 1 })
```

### Testing the Setup

#### 1. Frontend Health Check
Open `http://localhost:8080` in your browser. You should see the QueryNet homepage.

#### 2. Backend Health Check
Open `http://localhost:3001/health` in your browser. You should see:
```json
{
  "status": "OK",
  "timestamp": "2025-01-XX...",
  "uptime": 123,
  "environment": "development"
}
```

#### 3. API Test
Test the API endpoints:
```bash
# Test user registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "password123"
  }'
```

### Common Issues & Solutions

#### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

#### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

#### Frontend Build Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

### Development Workflow

#### 1. Making Changes
- Frontend changes: Files auto-reload at `http://localhost:8080`
- Backend changes: Server auto-restarts with nodemon

#### 2. API Testing
Use tools like:
- **Postman**: GUI for API testing
- **Thunder Client**: VS Code extension
- **curl**: Command line tool

#### 3. Database Management
```bash
# MongoDB Compass (GUI)
# Download from https://www.mongodb.com/products/compass

# Command line access
mongosh querynet
```

### Production Deployment

#### 1. Build for Production
```bash
# Frontend
npm run build

# Backend
cd backend
npm run build
```

#### 2. Environment Variables
Update production environment variables:
- `NODE_ENV=production`
- `MONGODB_URI=<production-mongodb-uri>`
- `JWT_SECRET=<secure-random-secret>`
- `FRONTEND_URL=<production-frontend-url>`

#### 3. Process Management
```bash
# Using PM2
npm install -g pm2
pm2 start dist/index.js --name "querynet-backend"
pm2 startup
pm2 save
```

### Features Ready to Use

#### ✅ Completed Features
- User authentication (register, login, logout)
- Question creation and viewing
- Mobile-responsive design
- Real-time notifications
- User profiles and settings
- Dark/light theme support
- Question voting system
- Answer system
- Tag-based categorization

#### 🔄 Backend API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create question
- `GET /api/questions/:id` - Get single question
- And many more...

### Next Steps

1. **Create your first user account** through the frontend
2. **Ask your first question** to test the system
3. **Explore the API** using the documentation
4. **Customize the styling** to match your preferences
5. **Add additional features** as needed

### Support

If you encounter any issues:
1. Check the console logs (frontend and backend)
2. Verify environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check the GitHub issues for known problems
5. Create a new issue if the problem persists

Happy coding! 🚀
