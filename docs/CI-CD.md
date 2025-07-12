# CI/CD Pipeline Documentation

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for QueryNet, covering both frontend and backend deployment workflows.

## 🚀 Overview

QueryNet uses GitHub Actions for automated testing, building, and deployment across multiple environments:

- **Frontend**: Deployed to Vercel
- **Backend**: Deployed to Railway/Render
- **Infrastructure**: Docker containers for local development

## 📁 Pipeline Architecture

```
GitHub Repository
├── .github/workflows/
│   ├── frontend.yml      # Frontend CI/CD pipeline
│   ├── backend.yml       # Backend CI/CD pipeline
│   └── security.yml      # Security scanning (future)
├── docker/               # Docker configuration
└── vercel.json          # Vercel deployment config
```

## 🎨 Frontend CI/CD Pipeline

### File: `.github/workflows/frontend.yml`

The frontend pipeline handles React application testing, building, and deployment to Vercel.

#### Pipeline Stages

1. **Code Quality & Testing**
   - ESLint and Prettier checks
   - TypeScript compilation
   - Unit and integration tests with Jest
   - Test coverage reporting

2. **Security Scanning**
   - Dependency vulnerability scanning
   - License compatibility checks
   - Secret scanning

3. **Build & Optimization**
   - Production build with Vite
   - Bundle size analysis
   - Asset optimization

4. **Performance Testing**
   - Lighthouse CI audits
   - Core Web Vitals measurement
   - Performance regression detection

5. **Deployment**
   - Preview deployments for PRs
   - Production deployment on main branch
   - Vercel integration with GitHub

#### Trigger Conditions

```yaml
on:
  push:
    branches: [main, develop]
    paths: ['src/**', 'public/**', 'package.json', 'vite.config.ts']
  pull_request:
    branches: [main]
    paths: ['src/**', 'public/**', 'package.json', 'vite.config.ts']
```

#### Environment Variables

- `VERCEL_TOKEN`: Vercel authentication token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID
- `VITE_API_URL`: Backend API URL for production

## ⚙️ Backend CI/CD Pipeline

### File: `.github/workflows/backend.yml`

The backend pipeline handles Node.js API testing, containerization, and deployment.

#### Pipeline Stages

1. **Code Quality & Testing**
   - ESLint and Prettier checks
   - TypeScript compilation
   - Unit tests with Jest
   - Integration tests with test database
   - API endpoint testing

2. **Security & Compliance**
   - Dependency vulnerability scanning
   - Docker image security scanning
   - Environment variable validation

3. **Database Migration & Seeding**
   - Database schema validation
   - Test data seeding
   - Migration scripts execution

4. **Docker Build & Push**
   - Multi-stage Docker build
   - Image optimization
   - Container registry push
   - Image vulnerability scanning

5. **Deployment**
   - Staging environment deployment
   - Health checks and smoke tests
   - Production deployment (main branch)
   - Rollback capability

#### Trigger Conditions

```yaml
on:
  push:
    branches: [main, develop]
    paths: ['backend/**', 'docker/**']
  pull_request:
    branches: [main]
    paths: ['backend/**', 'docker/**']
```

#### Environment Variables

- `RAILWAY_TOKEN`: Railway deployment token
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password
- `DATABASE_URL`: Production database connection string
- `JWT_SECRET`: JWT signing secret
- `REDIS_URL`: Redis connection string

## 🔒 Security Pipeline

### Security Scanning Components

1. **Dependency Scanning**
   ```yaml
   - name: Run npm audit
     run: npm audit --audit-level=moderate
   
   - name: Run Snyk security scan
     uses: snyk/actions/node@master
   ```

2. **Code Scanning**
   ```yaml
   - name: Run CodeQL Analysis
     uses: github/codeql-action/analyze@v2
   ```

3. **Secret Scanning**
   ```yaml
   - name: Run secret scan
     uses: trufflesecurity/trufflehog@main
   ```

4. **Container Security**
   ```yaml
   - name: Run Trivy vulnerability scanner
     uses: aquasecurity/trivy-action@master
   ```

## 🐳 Docker Integration

### Development Environment

**File: `docker-compose.yml`**

Local development environment with:
- Backend API container
- MongoDB database
- Redis cache
- Nginx reverse proxy
- Admin interfaces (Mongo Express, Redis Commander)

### Production Containers

**File: `docker/Dockerfile.backend`**

Production-optimized backend container with:
- Multi-stage build for smaller image size
- Non-root user for security
- Health checks
- Signal handling

## 📊 Deployment Environments

### Development
- **Trigger**: Every commit to develop branch
- **Frontend**: Vercel preview deployment
- **Backend**: Development Railway service
- **Database**: Development MongoDB instance

### Staging
- **Trigger**: Pull requests to main branch
- **Frontend**: Vercel preview with production API
- **Backend**: Staging Railway service
- **Database**: Staging MongoDB instance
- **Purpose**: Final testing before production

### Production
- **Trigger**: Commits to main branch
- **Frontend**: Vercel production deployment
- **Backend**: Production Railway service
- **Database**: Production MongoDB cluster
- **Monitoring**: Full logging and alerting

## 🔄 Deployment Flow

### Frontend Deployment (Vercel)

1. **PR Preview**
   ```bash
   vercel --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID
   ```

2. **Production Deploy**
   ```bash
   vercel --prod --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID
   ```

### Backend Deployment (Railway)

1. **Build Docker Image**
   ```bash
   docker build -f docker/Dockerfile.backend -t querynet-backend .
   ```

2. **Push to Registry**
   ```bash
   docker push $DOCKER_USERNAME/querynet-backend:$GITHUB_SHA
   ```

3. **Deploy to Railway**
   ```bash
   railway deploy --image $DOCKER_USERNAME/querynet-backend:$GITHUB_SHA
   ```

## 📈 Monitoring & Alerts

### Health Checks

**Frontend Health Check**
```javascript
// In Vercel deployment
export default function handler(req, res) {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
}
```

**Backend Health Check**
```javascript
// In Express app
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});
```

### Performance Monitoring

1. **Lighthouse CI Integration**
   ```yaml
   - name: Run Lighthouse CI
     uses: treosh/lighthouse-ci-action@v9
     with:
       configPath: './lighthouserc.json'
   ```

2. **Bundle Size Monitoring**
   ```yaml
   - name: Bundle size analysis
     uses: andresz1/size-limit-action@v1
   ```

### Error Tracking

- **Frontend**: Integrated with Vercel Analytics
- **Backend**: Custom error logging with Winston
- **Database**: MongoDB Atlas monitoring
- **Infrastructure**: Railway service monitoring

## 🚨 Rollback Procedures

### Frontend Rollback
```bash
# Rollback to previous deployment
vercel rollback <deployment-url> --token=$VERCEL_TOKEN
```

### Backend Rollback
```bash
# Rollback to previous Railway deployment
railway rollback <deployment-id>
```

### Database Rollback
- Automated backups every 6 hours
- Point-in-time recovery available
- Migration rollback scripts in `backend/migrations/`

## 🔧 Pipeline Configuration

### Secrets Management

Required GitHub Secrets:
```
VERCEL_TOKEN            # Vercel authentication
VERCEL_ORG_ID          # Vercel organization
VERCEL_PROJECT_ID      # Vercel project
RAILWAY_TOKEN          # Railway deployment
DOCKER_USERNAME        # Docker Hub username
DOCKER_PASSWORD        # Docker Hub password
DATABASE_URL           # Production database
JWT_SECRET             # JWT signing key
REDIS_URL              # Redis connection
SENTRY_DSN             # Error tracking
```

### Environment Variables

**Development**
```env
NODE_ENV=development
VITE_API_URL=http://localhost:3001/api
DATABASE_URL=mongodb://localhost:27017/querynet_dev
```

**Staging**
```env
NODE_ENV=staging
VITE_API_URL=https://api-staging.querynet.com/api
DATABASE_URL=mongodb://staging-cluster/querynet_staging
```

**Production**
```env
NODE_ENV=production
VITE_API_URL=https://api.querynet.com/api
DATABASE_URL=mongodb://production-cluster/querynet_prod
```

## 📋 Checklist for New Deployments

### Pre-deployment
- [ ] All tests passing
- [ ] Security scans clean
- [ ] Database migrations ready
- [ ] Environment variables configured
- [ ] Monitoring alerts configured

### Deployment
- [ ] Verify health checks
- [ ] Check application logs
- [ ] Validate database connections
- [ ] Test critical user flows
- [ ] Monitor performance metrics

### Post-deployment
- [ ] Verify all features working
- [ ] Check error rates
- [ ] Monitor resource usage
- [ ] Update documentation
- [ ] Notify team of deployment

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify dependency versions
   - Review TypeScript errors

2. **Deployment Failures**
   - Validate environment variables
   - Check service quotas and limits
   - Verify authentication tokens

3. **Database Connection Issues**
   - Check database URL format
   - Verify network access
   - Validate credentials

4. **Performance Issues**
   - Review bundle size reports
   - Check Lighthouse scores
   - Monitor resource usage

### Debug Commands

```bash
# Check pipeline status
gh workflow view frontend.yml

# View deployment logs
vercel logs <deployment-url>
railway logs

# Test local Docker build
docker-compose up --build

# Run security scans locally
npm audit
docker run --rm -v "$PWD":/app trufflesecurity/trufflehog:latest filesystem /app
```

## 📚 Additional Resources

- [Vercel Deployment Documentation](https://vercel.com/docs)
- [Railway Deployment Guide](https://docs.railway.app/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## 🤝 Contributing to CI/CD

When making changes to the CI/CD pipeline:

1. Test changes in a fork first
2. Update documentation
3. Notify team of changes
4. Monitor deployments after changes
5. Have rollback plan ready

---

*Last updated: January 2024*
*Pipeline version: 2.0.0*
