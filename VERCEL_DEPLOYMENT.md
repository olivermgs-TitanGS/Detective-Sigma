# Vercel Deployment Guide - Detective Sigma

## 🚀 Simple Deployment (No Docker/VM Needed!)

Vercel is much simpler - just connect your GitHub repo and deploy. Everything runs in the cloud automatically.

### Option 1: Deploy with Vercel Dashboard (Easiest)

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Import Project**: Click "Add New" → "Project"
4. **Select Repository**: Choose `detective_sigma`
5. **Configure**:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: Leave default
   - Output Directory: Leave default
6. **Add Environment Variables**:
   ```
   DATABASE_URL=your_postgres_connection_string
   REDIS_URL=your_redis_connection_string
   JWT_SECRET=your_secret_key_here
   NODE_ENV=production
   ```
7. **Deploy**: Click "Deploy" button

That's it! Vercel will build and deploy automatically.

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from project directory
cd E:\GitHub\Detective_Murder_Learning
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? detective_sigma
# - Directory? ./
```

### Free Database Options (No VM Needed)

Since Vercel is serverless, you need hosted databases:

#### PostgreSQL - Neon (Free Tier)
1. Go to: https://neon.tech
2. Sign up with GitHub
3. Create new project: "Detective Academy"
4. Copy connection string
5. Add to Vercel environment variables as `DATABASE_URL`

#### Redis - Upstash (Free Tier)
1. Go to: https://upstash.com
2. Sign up with GitHub
3. Create Redis database
4. Copy REST URL
5. Add to Vercel environment variables as `REDIS_URL`

### Simplified Project Structure for Vercel

For Vercel serverless functions, we need to restructure slightly:

```
Detective_Murder_Learning/
├── vercel.json           # Vercel configuration
├── package.json          # Root package.json
├── api/                  # Serverless API functions
│   ├── health.js
│   ├── cases/
│   │   └── index.js
│   ├── scenes/
│   └── ...
├── public/               # Frontend static files
│   └── ...
└── src/                  # Frontend React app
    └── ...
```

### Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```env
# Database (use Neon.tech free tier)
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname

# Redis (use Upstash free tier)
REDIS_URL=https://your-redis.upstash.io

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this

# API
NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api
```

### Automatic Deployments

Once connected:
- **Every git push** to `main` branch automatically deploys to production
- **Pull requests** get preview deployments
- **No manual steps needed**

### Monitoring & Logs

View in Vercel Dashboard:
- Real-time deployment logs
- Function invocation logs
- Performance analytics
- Error tracking

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as shown
4. Automatic HTTPS included

### Cost

**Vercel Free Tier Includes:**
- Unlimited deployments
- Automatic HTTPS
- 100GB bandwidth/month
- Serverless function executions
- Preview deployments

**Neon (Database) Free Tier:**
- 3GB storage
- Unlimited queries
- No credit card required

**Upstash (Redis) Free Tier:**
- 10,000 commands/day
- 256MB storage

**Total Cost: $0/month for your use case**

### Comparison: Docker vs Vercel

| Feature | Docker + VM | Vercel |
|---------|-------------|---------|
| Setup Time | 1-2 hours | 5 minutes |
| Maintenance | Manual updates | Automatic |
| Scaling | Manual | Automatic |
| Cost | $5-20/month | Free |
| SSL/HTTPS | Manual setup | Automatic |
| Monitoring | Set up yourself | Built-in |
| Complexity | High | Low |

### Quick Deploy Commands

```bash
# One-time setup
npm install -g vercel
vercel login

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

### Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Ensure all dependencies in package.json
- Verify Node.js version (18.x recommended)

**API not working?**
- Check environment variables are set
- Verify database connection string
- Check function logs in Vercel

**Frontend not loading?**
- Verify build output directory
- Check for build errors
- Ensure CORS is configured

### Next Steps

1. **Connect Database**: Sign up for Neon.tech
2. **Connect Redis**: Sign up for Upstash
3. **Deploy to Vercel**: Import GitHub repo
4. **Add Environment Variables**: In Vercel settings
5. **Test**: Visit your-project.vercel.app

### Alternative: Railway.app

If you want something similar to Vercel but with Docker support:
- https://railway.app
- Free tier includes PostgreSQL + Redis
- Deploy from GitHub automatically
- No configuration needed

---

**Recommendation: Use Vercel + Neon + Upstash**

This combination is:
- ✅ Free forever
- ✅ Zero maintenance
- ✅ Automatic scaling
- ✅ No Docker knowledge needed
- ✅ No VM management
- ✅ Deploys in 5 minutes

