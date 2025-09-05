# Deployment Guide

This guide covers deploying the Bolna AI Dashboard to production environments.

## 🚀 Quick Deploy

### Frontend (Vercel)

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set build command: `cd frontend && npm run build`
   - Set output directory: `frontend/.next`
   - Add environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
     ```

### Backend (Render)

1. **Create Render Service**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`

2. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://user:pass@host:5432/db
   JWT_SECRET=your-production-jwt-secret
   FRONTEND_URL=https://your-frontend-url.vercel.app
   
   # API Keys
   TWILIO_ACCOUNT_SID=your-twilio-sid
   TWILIO_AUTH_TOKEN=your-twilio-token
   OPENAI_API_KEY=your-openai-key
   DEEPGRAM_API_KEY=your-deepgram-key
   ELEVENLABS_API_KEY=your-elevenlabs-key
   ```

### Database (Supabase)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy connection string

2. **Run Migrations**
   ```bash
   cd database
   DATABASE_URL="your-supabase-connection-string" npx prisma db push
   ```

## 🔧 Alternative Deployments

### Backend (Heroku)

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=your-database-url
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git subtree push --prefix backend heroku main
```

### Backend (Railway)

1. Connect GitHub repository
2. Set root directory to `backend`
3. Add environment variables
4. Deploy automatically

### Database (Neon)

1. Create account at [neon.tech](https://neon.tech)
2. Create database
3. Copy connection string
4. Update `DATABASE_URL` in environment variables

### Database (PlanetScale)

1. Create account at [planetscale.com](https://planetscale.com)
2. Create database
3. Create branch and connection string
4. Update `DATABASE_URL` in environment variables

## 🔒 Security Checklist

### Environment Variables
- [ ] All API keys are set in production
- [ ] JWT_SECRET is strong and unique
- [ ] DATABASE_URL is secure
- [ ] CORS origins are restricted

### Database
- [ ] Connection is SSL encrypted
- [ ] Backup strategy is in place
- [ ] Access is restricted to application only

### API Security
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented
- [ ] Authentication is required for protected routes
- [ ] API keys are not exposed in frontend

## 📊 Monitoring

### Application Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Track database performance
- Set up uptime monitoring

### Logging
```javascript
// Add to production server
const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})
```

## 🚀 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        # Add Render deployment action
```

## 🔄 Database Migrations

### Production Migration Strategy

1. **Backup Database**
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

2. **Run Migration**
   ```bash
   npx prisma migrate deploy
   ```

3. **Verify Migration**
   ```bash
   npx prisma db pull
   npx prisma generate
   ```

## 📈 Scaling

### Horizontal Scaling
- Use load balancer (Cloudflare, AWS ALB)
- Deploy multiple backend instances
- Implement Redis for session storage

### Database Scaling
- Read replicas for analytics queries
- Connection pooling (PgBouncer)
- Database indexing optimization

### CDN Setup
- Serve static assets via CDN
- Cache API responses where appropriate
- Optimize images and assets

## 🔍 Health Checks

Add health check endpoints:

```javascript
// backend/routes/health.js
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  })
})

router.get('/health/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ database: 'OK' })
  } catch (error) {
    res.status(500).json({ database: 'ERROR', error: error.message })
  }
})
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection**
   - Verify connection string format
   - Check firewall settings
   - Ensure SSL is configured

3. **API Errors**
   - Check environment variables
   - Verify API key permissions
   - Monitor rate limits

### Logs and Debugging

```bash
# View Vercel logs
vercel logs

# View Render logs
# Check Render dashboard

# Database logs
# Check provider dashboard
```

## 📋 Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] API endpoints respond
- [ ] Database connections work
- [ ] Authentication flows work
- [ ] File uploads function
- [ ] External API integrations work
- [ ] Error tracking is active
- [ ] Monitoring is set up
- [ ] Backups are configured
- [ ] SSL certificates are valid

## 🔄 Updates and Maintenance

### Rolling Updates
1. Test changes in staging environment
2. Deploy backend first (backward compatible)
3. Deploy frontend
4. Monitor for issues
5. Rollback if necessary

### Backup Strategy
- Daily database backups
- Weekly full system backups
- Test restore procedures monthly
- Store backups in multiple locations