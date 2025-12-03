# Detective Sigma - Setup & Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- Git

### 1. Install Dependencies
```bash
cd app
npm install
```

### 2. Setup Database
Create a `.env` file in the `app/` directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/detective_sigma"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 3. Run Database Migrations
```bash
npm run db:push
```

### 4. Seed Database with Demo Data
```bash
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

## 👥 Demo Accounts

After seeding, you can login with:

- **Student**: `student@example.com` / `student123`
- **Teacher**: `teacher@example.com` / `teacher123`
- **Admin**: `admin@example.com` / `admin123`

## 📁 Project Structure

```
app/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── cases/        # Case management
│   │   ├── progress/     # User progress tracking
│   │   ├── leaderboard/  # Leaderboard data
│   │   └── dashboard/    # Dashboard stats
│   ├── student/          # Student interface
│   │   ├── dashboard/
│   │   ├── cases/
│   │   ├── leaderboard/
│   │   └── progress/
│   ├── teacher/          # Teacher interface
│   ├── admin/            # Admin panel
│   └── login/            # Authentication pages
├── components/
│   └── game/             # Game components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database client
│   ├── prisma.ts         # Prisma client
│   └── validations/      # Zod schemas
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── middleware.ts         # Route protection

```

## 🎮 Game Features

### For Students
- ✅ Browse detective cases by difficulty and subject
- ✅ Play interactive mystery games
- ✅ Collect clues and solve puzzles
- ✅ Track progress and scores
- ✅ View leaderboard rankings

### For Teachers
- 🚧 Create classes and manage students
- 🚧 Assign cases to students
- 🚧 View student progress reports
- 🚧 Track class performance

### For Admins
- 🚧 Create and manage cases
- 🚧 Manage users (students, teachers)
- 🚧 Bulk import data
- 🚧 View analytics

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:migrate    # Run migrations
npm run db:push       # Push schema changes
npm run db:seed       # Seed database
npm run db:studio     # Open Prisma Studio

# Linting
npm run lint
```

## 🗄️ Database Schema

Key models:
- `User` - User accounts (students, teachers, admins)
- `StudentProfile` / `TeacherProfile` - Role-specific data
- `Case` - Detective mystery cases
- `Scene` - Investigation locations
- `Clue` - Evidence to collect
- `Puzzle` - Math/science challenges
- `Suspect` - Case suspects
- `Progress` - User game progress
- `Class` - Teacher-managed classes

## 🔐 Authentication

Uses NextAuth.js with:
- Credentials provider (email/password)
- JWT session strategy
- Role-based access control (Student, Teacher, Admin)
- Protected routes via middleware

## 📝 API Routes

### Public
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Protected
- `GET /api/cases` - List cases
- `GET /api/cases/[id]` - Get case details
- `GET /api/dashboard` - User dashboard stats
- `GET /api/progress` - User progress
- `POST /api/progress` - Save progress
- `GET /api/leaderboard` - Global rankings

## 🚀 Deployment

### Vercel (Recommended)
Already configured and deployed at: `https://detective-sigma.vercel.app`

1. Connect GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables for Production
```env
DATABASE_URL="your-postgres-connection-string"
NEXTAUTH_URL="https://detective-sigma.vercel.app"
NEXTAUTH_SECRET="generate-secure-random-secret"
```

## 📊 Database Setup (Production)

For Vercel, use:
- **Vercel Postgres** (recommended)
- **Neon** (serverless Postgres)
- **Supabase** (with Postgres)

After setting up database:
1. Update `DATABASE_URL` in Vercel environment variables
2. Run: `npx prisma db push` locally (with prod DATABASE_URL)
3. Run: `npx prisma db seed` to create demo data

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Language**: TypeScript

## 📧 Support

Issues? Create an issue on GitHub: `https://github.com/olivermgs-TitanGS/Detective-Sigma/issues`

---

**Live Demo**: https://detective-sigma.vercel.app
**Repository**: https://github.com/olivermgs-TitanGS/Detective-Sigma
