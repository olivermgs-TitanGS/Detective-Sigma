# Vercel Project Setup - Detective Sigma

## 🚨 Important: Update Existing Project Name

Your current Vercel project is named `detective-learning-academy` but should be `detective_sigma` (or `detective-sigma` for URL).

### Option 1: Rename Existing Project (Recommended)

1. Go to your Vercel project: https://vercel.com/titangss-projects/detective-learning-academy
2. Click **Settings**
3. Scroll to **Project Name**
4. Change to: `detective_sigma` or `detective-sigma`
5. Click **Save**

Your new URL will be: `https://detective-sigma.vercel.app`

### Option 2: Create New Project

1. Delete the old project in Vercel dashboard
2. Go to https://vercel.com/new
3. Import from GitHub: `Detective_Sigma` repository
4. **Important Settings:**
   - Project Name: `detective_sigma`
   - Framework Preset: **Next.js**
   - Root Directory: `app` (Important!)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

---

## 📦 Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

### Required for Prisma + NextAuth

```env
# Database (from Vercel Postgres)
DATABASE_URL="postgresql://user:password@host.postgres.vercel-storage.com/detective_sigma"
DIRECT_URL="postgresql://user:password@host.postgres.vercel-storage.com/detective_sigma"

# NextAuth
NEXTAUTH_URL="https://detective-sigma.vercel.app"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Node Environment
NODE_ENV="production"
```

---

## 🗄️ Set Up Vercel Postgres

1. Go to your project in Vercel
2. Click **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Name it: `detective_sigma_db`
6. Click **Create**
7. **Copy the connection strings** → they auto-populate `DATABASE_URL` and `DIRECT_URL`

---

## 🚀 Deploy Steps

### First Time Setup

```bash
# 1. Push to GitHub (if not already done)
git add .
git commit -m "Setup Next.js 14 MVP with Prisma"
git push origin main

# 2. Vercel will auto-deploy from GitHub
# (Make sure you've connected the repo in Vercel dashboard)

# 3. After deployment, run migrations
npx vercel env pull .env.local  # Download env vars
cd app
npx prisma migrate deploy       # Apply migrations to Vercel Postgres
```

### Every Subsequent Deploy

```bash
git add .
git commit -m "Your changes"
git push origin main

# Vercel auto-deploys in 60 seconds!
```

---

## 🔗 URLs After Setup

- **Production:** https://detective-sigma.vercel.app
- **API Health:** https://detective-sigma.vercel.app/api/health (TODO: create)
- **Admin:** https://detective-sigma.vercel.app/admin (TODO: create)
- **Student:** https://detective-sigma.vercel.app/student (TODO: create)
- **Teacher:** https://detective-sigma.vercel.app/teacher (TODO: create)

---

## ✅ Vercel Project Checklist

- [ ] Rename project to `detective_sigma` or `detective-sigma`
- [ ] Set Root Directory to `app`
- [ ] Framework set to **Next.js**
- [ ] Create Vercel Postgres database (`detective_sigma_db`)
- [ ] Add environment variables (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET)
- [ ] Deploy from main branch
- [ ] Run `npx prisma migrate deploy` after first deployment
- [ ] Test: Visit https://detective-sigma.vercel.app

---

## 🐛 Troubleshooting

**Build fails with "Cannot find module 'next'":**
- Make sure Root Directory is set to `app`
- Build Command: `npm run build`
- Install Command: `npm install`

**Database connection fails:**
- Verify DATABASE_URL and DIRECT_URL are set correctly
- Make sure Vercel Postgres database is created
- Check that database is in the same region

**404 on all routes:**
- Verify Output Directory is `.next` (not `app/.next`)
- Check that Root Directory is `app`

---

## 📚 Key Files

- **Root `vercel.json`:** Points to `/app` directory
- **`/app/vercel.json`:** Next.js-specific config
- **`/app/prisma/schema.prisma`:** Database schema
- **`/app/prisma.config.ts`:** Prisma 7 config for Vercel

---

## 💡 Tips

1. **Use Vercel CLI for faster deploys:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Preview deployments for testing:**
   - Create a branch
   - Push to GitHub
   - Vercel creates preview URL automatically

3. **Monitor in Vercel Dashboard:**
   - Deployment logs
   - Function invocations
   - Real-time errors
   - Analytics

---

Built for Detective Sigma © 2025 | Zero-Cost Deployment
