# Detective Sigma - Vercel Deployment Guide

## 🚀 Step-by-Step Vercel Setup

### 1. **Rename Your Existing Vercel Project**

Your current deployment:
- **Old Name:** `detective-learning-academy`
- **Old URL:** `https://detective-learning-academy-*.vercel.app`

**Change to:**
- **New Name:** `detective-sigma`
- **New URL:** `https://detective-sigma.vercel.app`

**Steps:**
1. Go to: https://vercel.com/titangss-projects/detective-learning-academy/settings
2. Scroll to **Project Name**
3. Change to: `detective-sigma`
4. Click **Save**

---

### 2. **Update Project Settings**

Go to: https://vercel.com/titangss-projects/detective-sigma/settings

**Build & Development Settings:**
- **Framework Preset:** Next.js
- **Root Directory:** `app` ⚠️ **IMPORTANT**
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

---

### 3. **Set Up Vercel Postgres Database**

1. Go to: https://vercel.com/titangss-projects/detective-sigma/stores
2. Click **Create Database**
3. Select **Postgres**
4. Database Name: `detective_sigma_db`
5. Region: **US East** (or your preference)
6. Click **Create**

✅ This automatically adds `DATABASE_URL` and `POSTGRES_URL` to your environment variables.

---

### 4. **Add Environment Variables**

Go to: https://vercel.com/titangss-projects/detective-sigma/settings/environment-variables

Add these:

```env
# Database (auto-added by Vercel Postgres - verify they exist)
DATABASE_URL=<from-vercel-postgres>
POSTGRES_PRISMA_URL=<from-vercel-postgres>
POSTGRES_URL_NON_POOLING=<from-vercel-postgres>

# NextAuth (you need to add these)
NEXTAUTH_URL=https://detective-sigma.vercel.app
NEXTAUTH_SECRET=<generate-with-command-below>

# Node Environment
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### 5. **Deploy**

```bash
# From your project root
cd E:\GitHub\Detective_Sigma

# Commit changes
git add .
git commit -m "Update: Configure for detective-sigma deployment"

# Push to trigger deployment
git push origin main
```

Vercel will automatically deploy from the `app` directory!

---

### 6. **Run Database Migrations**

After first successful deployment:

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Pull environment variables
vercel env pull .env.local

# Go to app directory
cd app

# Run migrations on Vercel Postgres
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

---

## 📍 Your URLs After Setup

| Service | URL |
|---------|-----|
| **Production App** | https://detective-sigma.vercel.app |
| **Vercel Dashboard** | https://vercel.com/titangss-projects/detective-sigma |
| **Vercel Settings** | https://vercel.com/titangss-projects/detective-sigma/settings |
| **Vercel Database** | https://vercel.com/titangss-projects/detective-sigma/stores |
| **Deployment Logs** | https://vercel.com/titangss-projects/detective-sigma/deployments |

---

## 🧪 Test Your Deployment

1. Visit: https://detective-sigma.vercel.app
2. Should see the Detective Sigma landing page
3. Check all links work (Student/Teacher/Admin portals)

---

## 🔧 Troubleshooting

### "Error: Cannot find module 'next'"
- **Fix:** Ensure Root Directory is set to `app` in Vercel settings

### "Database connection failed"
- **Fix:** Verify `DATABASE_URL` is set in environment variables
- **Fix:** Make sure Vercel Postgres database is created

### "Build failed: Command not found"
- **Fix:** Check Build Command is `npm run build` (not `cd app && npm run build`)
- **Fix:** Root Directory must be `app`

### "404 on all pages"
- **Fix:** Verify Output Directory is `.next`
- **Fix:** Check that `app` folder contains the Next.js project

---

## 📧 Email Domains

All system emails will use:
- **From:** `noreply@detective-sigma.vercel.app`
- **Support:** `support@detective-sigma.vercel.app`
- **Admin:** `admin@detective-sigma.vercel.app`

(These are example addresses - configure actual email service separately)

---

## 🎯 Quick Checklist

- [ ] Rename Vercel project to `detective-sigma`
- [ ] Set Root Directory to `app`
- [ ] Create Vercel Postgres database
- [ ] Add NEXTAUTH_URL environment variable
- [ ] Add NEXTAUTH_SECRET environment variable
- [ ] Push code to GitHub
- [ ] Wait for deployment to complete
- [ ] Run `npx prisma migrate deploy`
- [ ] Test: https://detective-sigma.vercel.app

---

**All URLs now use:** `detective-sigma.vercel.app` ✅
