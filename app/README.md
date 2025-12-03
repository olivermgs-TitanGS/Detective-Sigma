# Detective Sigma - MVP Development

🔍 **Educational detective mystery platform for Singapore Primary School students (P4-P6)**

---

## 🎯 Project Status: MVP Foundation Complete

### ✅ Completed (Phase 1A)

1. **Next.js 14 Setup**
   - TypeScript strict mode
   - Tailwind CSS configured
   - ESLint + Prettier
   - App Router structure

2. **Database Schema (Prisma)**
   - ✅ User Management (Student/Teacher/Admin roles)
   - ✅ StudentProfile & TeacherProfile
   - ✅ Class Management
   - ✅ Content Models (Case, Scene, Clue, Suspect, Puzzle)
   - ✅ Progress Tracking
   - ✅ All relationships and indexes configured

3. **Landing Page**
   - Modern detective-themed UI
   - Portal navigation (Student/Teacher/Admin)
   - Feature showcase cards

---

## 🚀 Next Steps (Phase 1B)

### 1. Authentication (NextAuth.js)
- [ ] Install next-auth and bcryptjs
- [ ] Configure CredentialsProvider
- [ ] Create `/api/auth/[...nextauth]/route.ts`
- [ ] Build login/register pages
- [ ] Add middleware for route protection

### 2. Route Structure
- [ ] `/app/(student)/` - Student portal
- [ ] `/app/(teacher)/` - Teacher dashboard
- [ ] `/app/(admin)/` - Admin console
- [ ] Layout components for each portal

### 3. Admin Case Creation
- [ ] Case list page (`/admin/cases`)
- [ ] Case creation form (multi-step)
- [ ] Scene management
- [ ] Suspect & Clue forms
- [ ] Puzzle builder

### 4. Deploy to Vercel
- [ ] Connect GitHub repository
- [ ] Set up Vercel Postgres
- [ ] Configure environment variables
- [ ] Deploy MVP

---

## 📂 Project Structure

```
app/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles
│   ├── (auth)/             # Login/Register (TODO)
│   ├── (student)/          # Student portal (TODO)
│   ├── (teacher)/          # Teacher dashboard (TODO)
│   └── (admin)/            # Admin console (TODO)
│
├── lib/
│   └── prisma.ts           # Prisma client instance
│
├── prisma/
│   └── schema.prisma       # Database schema (10 models, 3 enums)
│
├── components/             # Reusable components (TODO)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🗄️ Database Models

### User Management
- `User` - Email, username, password hash, role
- `StudentProfile` - Grade level, parent consent
- `TeacherProfile` - School name
- `Class` - Class code, teacher assignment
- `ClassMembership` - Student enrollments

### Content
- `Case` - Detective mysteries (title, difficulty, subject)
- `Scene` - Interactive locations with clues
- `Clue` - Evidence items (with optional puzzle requirements)
- `Suspect` - NPCs with dialogue trees
- `Puzzle` - Math/Science challenges

### Progress
- `Progress` - User progress per case (score, clues, completion)

---

## 🛠️ Tech Stack

**Framework:** Next.js 14 (App Router, React Server Components)
**Language:** TypeScript 5
**Styling:** Tailwind CSS 3
**Database:** PostgreSQL (Vercel Postgres)
**ORM:** Prisma 7
**Auth:** NextAuth.js 5 (planned)
**Deployment:** Vercel (zero-cost Hobby tier)

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Prisma commands
npx prisma generate       # Generate Prisma Client
npx prisma migrate dev    # Create migration
npx prisma studio         # Open database GUI
npx prisma db push        # Push schema changes (no migration)
```

---

## 🌐 Environment Variables

Create `.env` file:

```env
# Database (Vercel Postgres)
DATABASE_URL="postgresql://user:password@host:5432/detective_sigma"

# NextAuth (TODO)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Node Environment
NODE_ENV="development"
```

---

## 📝 MVP Scope

**Phase 1 (MVP - 3 Months)**
- 3 Math cases (P4, P5, P6 difficulty)
- Admin case creation interface
- Student gameplay (browse, solve, collect clues)
- Teacher dashboard (assign cases, view progress)
- Basic auth (email/password)

**Out of Scope (Phase 2+)**
- Science cases
- AI hints (Gemini API)
- Achievement badges
- Multilingual support
- MOE SSO integration

---

## 🎨 Design Philosophy

- **Simple over complex** - Start with forms, not visual builders
- **Database-driven** - Add cases without code changes
- **Mobile-responsive** - Works on tablets and phones
- **MOE-aligned** - PSLE syllabus coverage
- **Zero-cost** - Vercel free tier + AI-generated content

---

## 📊 Success Metrics (MVP)

- [ ] Admin can create 1 complete case in <30 minutes
- [ ] Student can complete case in 20-40 minutes
- [ ] Progress auto-saves every action
- [ ] Teacher can view student scores
- [ ] 3 demo cases playable end-to-end
- [ ] Deploy on Vercel with zero costs

---

## 🚦 MVP Deployment Checklist

**Pre-Deployment:**
- [x] Next.js project initialized
- [x] Prisma schema defined
- [x] Landing page created
- [ ] Authentication configured
- [ ] At least 1 admin form completed
- [ ] Database migrations ready

**Deployment:**
- [ ] Push to GitHub
- [ ] Connect to Vercel
- [ ] Create Vercel Postgres database
- [ ] Run `npx prisma migrate deploy`
- [ ] Seed demo data
- [ ] Test live deployment

---

## 📚 Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [NextAuth.js](https://next-auth.js.org)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

---

## 🔗 Quick Links

- **Docs:** `/Documents` folder (BRD, FSD, Business Proposition)
- **Plan:** `C:\Users\oto45\.claude\plans\keen-baking-otter.md`
- **Old Implementation:** `/Detective_Sigma` (React + Express - deprecated)
- **New MVP:** `/app` (Next.js 14 - current)

---

Built with ❤️ for Singapore students | Detective Sigma © 2025
