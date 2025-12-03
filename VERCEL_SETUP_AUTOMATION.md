# 🚀 Vercel Setup Automation - Detective Sigma

## ✅ What I've Done For You

All configuration files are ready! Here's what's been automated:

### 1. **Project Configuration** ✅
- ✅ `/vercel.json` - Minimal config pointing to Next.js app
- ✅ `/app/package.json` - Project name set to `detective_sigma`
- ✅ `/app/.env.example` - Template for all environment variables
- ✅ All documentation updated with correct naming

### 2. **Repository Files** ✅
- ✅ All domains updated to `detective-sigma.vercel.app`
- ✅ All project references use `detective_sigma`
- ✅ Prisma schema ready (10 models, 6 enums)
- ✅ Next.js 14 app structure complete

---

## 🎯 What You Need To Do (5 Minutes)

### Step 1: Rename Vercel Project (2 minutes)

**Current URL:** `https://detective-learning-academy-*.vercel.app`
**Target URL:** `https://detective-sigma.vercel.app`

1. **Go to:** https://vercel.com/titangsss-projects/detective-learning-academy/settings
2. **Find:** "Project Name" section under General
3. **Change:** `detective-learning-academy` → `detective-sigma`
4. **Click:** Save

---

### Step 2: Update Build Settings (1 minute)

**Still in Settings page**, scroll to **Build & Development Settings**:

```
Framework Preset:    Next.js
Root Directory:      app          👈 CRITICAL! Change from ./ to app
Build Command:       npm run build
Output Directory:    .next
Install Command:     npm install
```

**Click:** Save

---

### Step 3: Create Vercel Postgres Database (1 minute)

1. **Go to:** https://vercel.com/titangsss-projects/detective-sigma/stores
2. **Click:** "Create Database"
3. **Select:** Postgres
4. **Database Name:** `detective_sigma_db`
5. **Region:** US East (or closest to you)
6. **Click:** Create

✅ This automatically adds `DATABASE_URL` to your environment variables!

---

### Step 4: Add NextAuth Environment Variables (1 minute)

**Go to:** https://vercel.com/titangsss-projects/detective-sigma/settings/environment-variables

**Add these two:**

```bash
# 1. NextAuth URL
NEXTAUTH_URL = https://detective-sigma.vercel.app

# 2. NextAuth Secret (generate it first!)
# Run this command in your terminal to generate:
openssl rand -base64 32

# Then paste the output as:
NEXTAUTH_SECRET = <paste-generated-value-here>
```

**Click:** Save for each variable

---

### Step 5: Deploy! (Auto)

**Option A: Push to GitHub** (Recommended)
```bash
cd E:\GitHub\Detective_Sigma
git add .
git commit -m "Deploy: Configure detective-sigma on Vercel"
git push origin main
```

**Option B: Redeploy from Vercel**
1. Go to: https://vercel.com/titangsss-projects/detective-sigma
2. Click: Deployments
3. Click: "..." on latest deployment
4. Click: Redeploy

---

### Step 6: Run Database Migrations (After first deploy)

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Link to your project
cd E:\GitHub\Detective_Sigma\app
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Project renamed to `detective-sigma` in Vercel
- [ ] Root Directory set to `app`
- [ ] Vercel Postgres database created
- [ ] `DATABASE_URL` exists in environment variables (auto-added)
- [ ] `NEXTAUTH_URL` added manually
- [ ] `NEXTAUTH_SECRET` added manually
- [ ] Code pushed to GitHub
- [ ] Deployment succeeded
- [ ] Can access: https://detective-sigma.vercel.app
- [ ] Landing page loads correctly
- [ ] Database migrations ran successfully

---

## 🎯 Expected URLs After Setup

| Service | URL |
|---------|-----|
| **Production** | https://detective-sigma.vercel.app |
| **Dashboard** | https://vercel.com/titangsss-projects/detective-sigma |
| **Settings** | https://vercel.com/titangsss-projects/detective-sigma/settings |
| **Database** | https://vercel.com/titangsss-projects/detective-sigma/stores |
| **Logs** | https://vercel.com/titangsss-projects/detective-sigma/logs |

---

## 🐛 Troubleshooting

### "Module not found: Can't resolve 'next'"
- ✅ **Fixed:** Root Directory is now set to `app`

### "Database connection failed"
- ✅ **Check:** DATABASE_URL exists in environment variables
- ✅ **Check:** Vercel Postgres database is created

### "Build succeeded but 404 on all pages"
- ✅ **Check:** Output Directory is `.next` (not `app/.next`)

### "Cannot find prisma schema"
- ✅ **Fixed:** Schema is at `/app/prisma/schema.prisma`

---

## 📋 Quick Copy-Paste Commands

### Generate NextAuth Secret:
```bash
openssl rand -base64 32
```

### Deploy from local:
```bash
cd E:\GitHub\Detective_Sigma
git add .
git commit -m "Deploy: detective-sigma configuration complete"
git push origin main
```

### Link Vercel project and run migrations:
```bash
cd E:\GitHub\Detective_Sigma\app
vercel link
vercel env pull .env.local
npx prisma migrate deploy
npx prisma generate
```

---

## 🎉 Done!

After these 6 steps, your app will be live at:
**https://detective-sigma.vercel.app**

All configuration is automated - you just need to click a few buttons in Vercel! 🚀

---

**Need help?** Check the deployment logs at:
https://vercel.com/titangsss-projects/detective-sigma/deployments
