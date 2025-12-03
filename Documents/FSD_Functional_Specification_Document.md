# Functional Specification Document (FSD)
## Detective Learning Game for Singapore Primary Schools

**Document Version:** 1.0  
**Date:** December 1, 2025  
**Project Name:** Detective Learning Academy  
**Document Owner:** olivermgs-TitanGS  
**Status:** Draft  
**Related Documents:** BRD_Business_Requirements_Document.md

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Technical Architecture](#3-technical-architecture)
4. [Database Design](#4-database-design)
5. [User Interface Specifications](#5-user-interface-specifications)
6. [Functional Features](#6-functional-features)
7. [API Specifications](#7-api-specifications)
8. [Security Specifications](#8-security-specifications)
9. [Integration Specifications](#9-integration-specifications)
10. [Testing Requirements](#10-testing-requirements)
11. [Deployment & Operations](#11-deployment--operations)
12. [Appendices](#12-appendices)

---

## 1. Introduction

### 1.1 Document Purpose

This Functional Specification Document (FSD) provides detailed technical specifications for implementing the Detective Learning Academy platform - a Math and Science learning system starting with Mathematics (Phase 1), expanding to Science (Phase 2). English comprehension is naturally embedded in all cases through reading narratives, clues, and witness dialogues. It serves as the primary reference for developers, designers, QA engineers, and technical stakeholders.

**Intended Audience:**
- Full-stack developers
- Frontend/backend specialists
- UI/UX designers
- QA/test engineers
- DevOps engineers
- Technical project managers

### 1.2 Document Scope

**Covered:**
- Complete technical architecture
- Database schema and relationships
- API endpoint specifications
- UI/UX wireframes and specifications
- Security implementation details
- Integration requirements
- Testing strategies

**Not Covered:**
- Business justification (see BRD)
- Marketing strategies
- Financial projections
- Detailed case content (see Content Development Guide)

### 1.3 Definitions & Acronyms

| Term | Definition |
|------|------------|
| **MVP** | Minimum Viable Product (Phase 1: Months 1-3) - Maths cases |
| **Case** | A complete detective mystery (storyline + gameplay + assessment) for a specific subject |
| **Subject** | Primary academic discipline (Mathematics, Science). English comprehension embedded naturally. |
| **Scene** | A location within a case (e.g., classroom, library) |
| **Clue** | Evidence item with subject-specific content that helps solve the mystery |
| **Witness** | NPC (non-player character) who provides information |
| **Quiz** | Assessment questions at the end of each case (subject-specific PSLE format) |
| **Session** | Single continuous gameplay period |
| **Progress** | Student's advancement through cases and skill development across subjects |
| **RLS** | Row-Level Security (database access control) |
| **RBAC** | Role-Based Access Control |
| **SSO** | Single Sign-On |
| **SAML** | Security Assertion Markup Language (SSO protocol) |

### 1.4 Reference Documents

- Business Requirements Document (BRD)
- MOE English Syllabus (Primary 4-6)
- PDPA Guidelines (Personal Data Protection Commission)
- WCAG 2.1 Accessibility Guidelines
- Next.js 14 Documentation
- Supabase Documentation
- AWS Well-Architected Framework

---

## 2. System Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                    │
├─────────────────────────────────────────────────────────────┤
│  Next.js 14 App Router (React Server Components + Client)   │
│  - Student Portal                                            │
│  - Teacher Dashboard                                         │
│  - Admin Console                                             │
└────────────┬────────────────────────────────────────────────┘
             │ HTTPS/TLS 1.3
             ▼
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Next.js API Routes + Server Actions                         │
│  - Authentication (NextAuth.js)                              │
│  - Business Logic                                            │
│  - Data Validation (Zod)                                     │
└────────────┬────────────────────────────────────────────────┘
             │ Prisma ORM
             ▼
┌─────────────────────────────────────────────────────────────┐
│                         DATA LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (Supabase/Neon - MVP | AWS RDS - Production)    │
│  - Student data                                              │
│  - Case content                                              │
│  - Progress tracking                                         │
│  - Audit logs                                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
├─────────────────────────────────────────────────────────────┤
│  - Cloudflare R2 / AWS S3 (Asset Storage)                   │
│  - Google Gemini API (AI Hints - Phase 2)                   │
│  - Resend (Email Notifications)                              │
│  - Sentry (Error Tracking)                                   │
│  - Vercel Analytics (Usage Metrics)                          │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

#### 2.2.1 Frontend

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Next.js** | 14+ | Full-stack React framework | Server Components, built-in routing, excellent DX |
| **React** | 18+ | UI library | Industry standard, component-based |
| **TypeScript** | 5+ | Type safety | Catch errors at compile time, better IDE support |
| **Tailwind CSS** | 3+ | Styling | Utility-first, rapid development, mobile-first |
| **shadcn/ui** | Latest | UI components | Accessible, customizable, Tailwind-based |
| **Framer Motion** | 11+ | Animations | Smooth transitions, enhance engagement |
| **React Hook Form** | 7+ | Form management | Performance, validation, UX |
| **Zod** | 3+ | Schema validation | Type-safe validation for forms and API |

#### 2.2.2 Backend

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Next.js API Routes** | 14+ | Backend API | Same codebase as frontend, serverless |
| **Prisma** | 5+ | ORM | Type-safe database queries, migrations |
| **PostgreSQL** | 15+ | Database | Relational, robust, JSON support |
| **NextAuth.js** | 5+ | Authentication | OAuth support, session management |
| **bcrypt** | 5+ | Password hashing | Industry standard, secure |

#### 2.2.3 Infrastructure (MVP)

| Service | Tier | Purpose |
|---------|------|---------|
| **Vercel** | Free | Hosting, CI/CD, serverless functions |
| **Supabase** | Free (512MB) | PostgreSQL database, auth, storage |
| **Cloudflare R2** | Free (10GB) | Asset storage (images, audio) |
| **GitHub** | Free | Version control, CI/CD |

#### 2.2.4 Infrastructure (Production - Phase 2+)

| Service | Tier | Purpose |
|---------|------|---------|
| **AWS EC2/Fargate** | t3.small → Auto-scale | Application hosting (Singapore region) |
| **AWS RDS** | PostgreSQL Multi-AZ | Database (high availability) |
| **AWS S3 + CloudFront** | Standard | Asset storage + CDN |
| **AWS CloudWatch** | Standard | Monitoring, logs, alerts |
| **Sentry** | Business | Error tracking, performance monitoring |

#### 2.2.5 Third-Party APIs

| Service | Purpose | Tier | Usage |
|---------|---------|------|-------|
| **Google Gemini** | AI hint generation | Free (1M tokens/month) | Phase 2 feature |
| **Resend** | Transactional emails | Free (3K/month) | Notifications, parent consent |
| **Vercel Analytics** | Usage tracking | Free | Page views, performance |

### 2.3 Development Environment

#### 2.3.1 Required Tools

```bash
# Prerequisites
Node.js: 20.x LTS
npm: 10.x or pnpm: 8.x
Git: Latest
VS Code: Latest (recommended)

# VS Code Extensions (Recommended)
- Prisma (Prisma.prisma)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- GitLens (eamodio.gitlens)
```

#### 2.3.2 Project Setup

```bash
# Clone repository
git clone https://github.com/olivermgs-TitanGS/detective-learning-academy.git
cd detective-learning-academy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Initialize database
npx prisma migrate dev
npx prisma db seed

# Run development server
npm run dev
# Open http://localhost:3000
```

### 2.4 Deployment Strategy

#### 2.4.1 Environments

| Environment | Purpose | URL | Deployment Trigger |
|-------------|---------|-----|-------------------|
| **Development** | Local development | localhost:3000 | Manual (`npm run dev`) |
| **Preview** | Feature testing | preview-*.vercel.app | Pull request opened |
| **Staging** | Pre-production testing | staging.detectivelearning.sg | Merge to `develop` branch |
| **Production** | Live platform | detectivelearning.sg | Merge to `main` branch |

#### 2.4.2 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  deploy-preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 3. Technical Architecture

### 3.1 Application Structure

```
detective-learning-academy/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── verify-email/
│   │       └── page.tsx
│   │
│   ├── (student)/                # Student portal (protected)
│   │   ├── layout.tsx            # Student layout with nav
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Student homepage
│   │   ├── cases/
│   │   │   ├── page.tsx          # Case library
│   │   │   └── [caseId]/
│   │   │       ├── page.tsx      # Case intro
│   │   │       ├── play/
│   │   │       │   └── page.tsx  # Gameplay
│   │   │       └── results/
│   │   │           └── page.tsx  # Score and feedback
│   │   ├── progress/
│   │   │   └── page.tsx          # Progress tracking
│   │   └── achievements/
│   │       └── page.tsx          # Badges and rewards
│   │
│   ├── (teacher)/                # Teacher dashboard (protected)
│   │   ├── layout.tsx            # Teacher layout
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Teacher homepage
│   │   ├── classes/
│   │   │   ├── page.tsx          # Class management
│   │   │   └── [classId]/
│   │   │       ├── page.tsx      # Class details
│   │   │       └── students/
│   │   │           └── [studentId]/
│   │   │               └── page.tsx  # Individual student view
│   │   ├── assign/
│   │   │   └── page.tsx          # Assign cases
│   │   └── reports/
│   │       └── page.tsx          # Analytics and exports
│   │
│   ├── (admin)/                  # Admin console (protected)
│   │   ├── dashboard/
│   │   ├── cases/                # Case management
│   │   ├── users/                # User management
│   │   └── settings/             # System settings
│   │
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # NextAuth.js handler
│   │   ├── cases/
│   │   │   ├── route.ts          # GET /api/cases (list)
│   │   │   └── [caseId]/
│   │   │       ├── route.ts      # GET /api/cases/:id
│   │   │       └── progress/
│   │   │           └── route.ts  # POST save progress
│   │   ├── students/
│   │   │   └── [studentId]/
│   │   │       └── progress/
│   │   │           └── route.ts  # GET student progress
│   │   ├── classes/
│   │   │   └── route.ts          # Class CRUD operations
│   │   ├── quiz/
│   │   │   └── submit/
│   │   │       └── route.ts      # POST quiz answers
│   │   └── hints/
│   │       └── route.ts          # POST get AI hint (Phase 2)
│   │
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── about/
│   ├── contact/
│   └── privacy/
│       └── page.tsx              # Privacy policy
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── game/                     # Game-specific components
│   │   ├── SceneViewer.tsx       # Interactive scene
│   │   ├── ClueCard.tsx          # Clue display
│   │   ├── WitnessDialog.tsx     # Witness interview
│   │   ├── EvidenceBoard.tsx     # Drag-and-drop evidence
│   │   ├── TimelineBuilder.tsx   # Sequence events
│   │   └── QuizQuestion.tsx      # Question display
│   │
│   ├── dashboard/                # Dashboard components
│   │   ├── StatCard.tsx
│   │   ├── ProgressChart.tsx
│   │   ├── StudentTable.tsx
│   │   └── ClassCard.tsx
│   │
│   ├── forms/                    # Form components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── AssignCaseForm.tsx
│   │   └── CreateClassForm.tsx
│   │
│   └── layout/                   # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Sidebar.tsx
│       └── StudentNav.tsx
│
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Prisma client
│   ├── validations.ts            # Zod schemas
│   ├── utils.ts                  # Utility functions
│   ├── constants.ts              # App constants
│   ├── hooks/                    # Custom React hooks
│   │   ├── useSession.ts
│   │   ├── useProgress.ts
│   │   └── useSound.ts
│   ├── game/                     # Game logic
│   │   ├── scoring.ts            # Score calculation
│   │   ├── progression.ts        # Unlock logic
│   │   └── analytics.ts          # Track gameplay events
│   └── api/                      # API client functions
│       ├── cases.ts
│       ├── progress.ts
│       └── students.ts
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed data
│
├── public/
│   ├── images/
│   │   ├── characters/           # Character avatars
│   │   ├── scenes/               # Scene backgrounds
│   │   ├── clues/                # Clue images
│   │   └── ui/                   # UI assets
│   ├── sounds/
│   │   ├── sfx/                  # Sound effects
│   │   └── music/                # Background music
│   └── fonts/                    # Custom fonts
│
├── tests/
│   ├── unit/                     # Unit tests (Jest)
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests (Playwright)
│
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment (gitignored)
├── .eslintrc.json                # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Setup instructions
```

### 3.2 Data Flow Diagrams

#### 3.2.1 Student Plays Case (Happy Path)

```
┌─────────┐
│ Student │
└────┬────┘
     │
     ▼
┌─────────────────────────┐
│ 1. Navigate to Case List│
└────────┬────────────────┘
         │
         ▼
    ┌────────────────────┐
    │ GET /api/cases     │
    │ (with user role)   │
    └────┬───────────────┘
         │
         ▼
    ┌────────────────────────────┐
    │ Server checks permissions  │
    │ Returns assigned cases only│
    └────┬───────────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 2. Click "Play Case 1"  │
└────┬────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ GET /api/cases/:id           │
│ Returns: scenes, clues,      │
│          witnesses (no quiz) │
└────┬─────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ 3. Interact with game           │
│ - Click objects (client-side)   │
│ - Read dialogues                │
│ - Collect clues                 │
└────┬────────────────────────────┘
     │ (Auto-save every 30s)
     ▼
┌────────────────────────────────┐
│ POST /api/cases/:id/progress  │
│ Body: {                        │
│   cluesFound: [1,2,3],         │
│   sceneIndex: 2,               │
│   timeSpent: 600               │
│ }                              │
└────┬───────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ 4. Complete discovery        │
│ Navigate to Quiz             │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ GET /api/cases/:id/quiz      │
│ Returns: questions only      │
│ (NO correct answers)         │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ 5. Submit answers            │
│ POST /api/quiz/submit        │
│ Body: {                      │
│   caseId: "case-01",         │
│   answers: {                 │
│     q1: "B",                 │
│     q2: "The butler...",     │
│     q3: "motive"             │
│   }                          │
│ }                            │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ Server validates answers             │
│ - Compare to correct answers (DB)    │
│ - Calculate score                    │
│ - Update student progress            │
│ - Record skill assessments           │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Returns: {                   │
│   totalScore: 85,            │
│   breakdown: {...},          │
│   skillScores: {...},        │
│   feedback: "..."            │
│ }                            │
└────┬─────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│ 6. Display results page     │
│ - Score                     │
│ - Correct/incorrect answers │
│ - Explanations              │
│ - Unlock next case?         │
└─────────────────────────────┘
```

#### 3.2.2 Teacher Views Student Progress

```
┌─────────┐
│ Teacher │
└────┬────┘
     │
     ▼
┌──────────────────────────────┐
│ 1. Navigate to class view    │
│ /teacher/classes/:classId    │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ GET /api/classes/:classId/students   │
└────┬─────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│ Server checks:                         │
│ - Is user a teacher?                   │
│ - Does teacher own this class?         │
│ - RLS policy enforces access control   │
└────┬───────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│ Query students with:                   │
│ - casesCompleted count                 │
│ - averageScore                         │
│ - lastActivity                         │
│ - skillBreakdown (inference, vocab...) │
└────┬───────────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│ 2. Display student table    │
│ - Name, progress, scores    │
│ - Flag struggling students  │
└────┬────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ 3. Teacher clicks student    │
│ /teacher/classes/:classId/   │
│   students/:studentId        │
└────┬─────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│ GET /api/students/:studentId/progress  │
└────┬───────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│ Returns:                               │
│ - All completed cases (with scores)    │
│ - Time spent per case                  │
│ - Skill trajectory (improvement)       │
│ - Weak areas highlighted               │
└────┬───────────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│ 4. Display individual       │
│    student dashboard        │
│ - Case history              │
│ - Skill radar chart         │
│ - Recommendations           │
└─────────────────────────────┘
```

### 3.3 Security Architecture

#### 3.3.1 Authentication Flow (NextAuth.js)

```
┌──────────────────────────────────────────┐
│ User navigates to /login                 │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│ LoginForm displays:                      │
│ - Email input                            │
│ - Password input                         │
│ - "Sign in with Google" button (OAuth)   │
└────┬─────────────────────────────────────┘
     │
     ├─── Option 1: Email/Password ─────┐
     │                                   │
     ▼                                   ▼
┌────────────────────────────┐    ┌──────────────────────────┐
│ POST /api/auth/signin      │    │ POST /api/auth/signin    │
│ { email, password }        │    │ { provider: "google" }   │
└────┬───────────────────────┘    └────┬─────────────────────┘
     │                                  │
     ▼                                  ▼
┌────────────────────────────┐    ┌───────────────────────────┐
│ Credentials Provider       │    │ Google OAuth Provider      │
│ 1. Find user by email      │    │ 1. Redirect to Google      │
│ 2. Compare password hash   │    │ 2. User approves           │
│ 3. If valid → session      │    │ 3. Google returns token    │
│ 4. If invalid → error      │    │ 4. Create/update user      │
└────┬───────────────────────┘    └────┬──────────────────────┘
     │                                  │
     └──────────┬───────────────────────┘
                │
                ▼
┌──────────────────────────────────────────┐
│ JWT Token created:                       │
│ {                                        │
│   userId: "...",                         │
│   email: "...",                          │
│   role: "student|teacher|admin",         │
│   schoolCode: "...",                     │
│   exp: 2 hours                           │
│ }                                        │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│ Set httpOnly cookie:                     │
│ next-auth.session-token=<JWT>            │
│ Secure, SameSite=Lax                     │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│ Redirect to:                             │
│ - Student → /student/dashboard           │
│ - Teacher → /teacher/dashboard           │
│ - Admin → /admin/dashboard               │
└──────────────────────────────────────────┘
```

#### 3.3.2 Authorization Middleware

```typescript
// middleware.ts (Next.js Edge Middleware)

import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Role-based access control
    if (path.startsWith("/teacher") && token?.role !== "teacher") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    // School-level isolation (teachers can only see their school's students)
    if (path.includes("/classes/") && token?.role === "teacher") {
      // RLS in database will enforce, but double-check here
      const requestedSchool = req.nextUrl.searchParams.get("schoolCode")
      if (requestedSchool && requestedSchool !== token.schoolCode) {
        return NextResponse.redirect(new URL("/forbidden", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Must be logged in
    },
  }
)

// Apply middleware to protected routes only
export const config = {
  matcher: ["/student/:path*", "/teacher/:path*", "/admin/:path*"],
}
```

#### 3.3.3 Row-Level Security (Database)

```sql
-- Supabase RLS Policies (PostgreSQL)

-- Students can only see their own data
CREATE POLICY "Students can view own data"
ON students
FOR SELECT
USING (auth.uid() = id);

-- Teachers can see students in their classes
CREATE POLICY "Teachers can view class students"
ON students
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM class_memberships cm
    INNER JOIN classes c ON cm.class_id = c.id
    WHERE cm.student_id = students.id
      AND c.teacher_id = auth.uid()
  )
);

-- Students can only see assigned cases
CREATE POLICY "Students can view assigned cases"
ON case_assignments
FOR SELECT
USING (student_id = auth.uid() OR class_id IN (
  SELECT class_id FROM class_memberships WHERE student_id = auth.uid()
));

-- Teachers can only modify their own classes
CREATE POLICY "Teachers can modify own classes"
ON classes
FOR ALL
USING (teacher_id = auth.uid());

-- Admins bypass all policies
CREATE POLICY "Admins have full access"
ON students
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 4. Database Design

### 4.1 Entity Relationship Diagram

```
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)             │
│ email (unique)      │
│ hashed_password     │
│ role (enum)         │───┐
│ school_code         │   │
│ created_at          │   │
│ updated_at          │   │
└──────┬──────────────┘   │
       │                  │
       │ 1:1              │ 1:N
       ▼                  ▼
┌──────────────────┐  ┌────────────────────┐
│  student_profiles│  │  teacher_profiles  │
├──────────────────┤  ├────────────────────┤
│ id (PK, FK)      │  │ id (PK, FK)        │
│ display_name     │  │ display_name       │
│ education_level  │  │ department         │
│ parent_email     │  │ school_name        │
│ parent_consent   │  │ phone              │
│ data_retention   │  └────┬───────────────┘
└─────┬────────────┘       │
      │                    │ 1:N
      │                    ▼
      │              ┌─────────────────┐
      │              │    classes      │
      │              ├─────────────────┤
      │              │ id (PK)         │
      │              │ teacher_id (FK) │
      │              │ name            │
      │              │ school_code     │
      │              │ class_code      │
      │              │ created_at      │
      │              └────┬────────────┘
      │                   │
      │                   │ N:M (via class_memberships)
      │                   │
      └───────────────────┘
              │
              ▼
      ┌──────────────────────┐
      │  class_memberships   │
      ├──────────────────────┤
      │ id (PK)              │
      │ class_id (FK)        │
      │ student_id (FK)      │
      │ joined_at            │
      └──────────────────────┘


┌──────────────────────┐
│       cases          │
├──────────────────────┤
│ id (PK)              │
│ title                │
│ difficulty           │
│ education_level      │
│ estimated_time       │
│ story_intro          │
│ learning_objectives  │───┐
│ published            │   │
│ created_at           │   │
└──────┬───────────────┘   │
       │                   │
       │ 1:N               │ 1:N
       ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│     scenes       │  │   quiz_questions │
├──────────────────┤  ├──────────────────┤
│ id (PK)          │  │ id (PK)          │
│ case_id (FK)     │  │ case_id (FK)     │
│ scene_order      │  │ question_order   │
│ name             │  │ question_text    │
│ description      │  │ question_type    │
│ image_url        │  │ options (JSON)   │
└──────┬───────────┘  │ correct_answer   │
       │              │ skill_tested     │
       │ 1:N          │ explanation      │
       ▼              └──────────────────┘
┌──────────────────┐
│      clues       │
├──────────────────┤
│ id (PK)          │
│ scene_id (FK)    │
│ clue_type        │
│ title            │
│ content          │
│ image_url        │
│ relevance_score  │
└──────────────────┘

       │ 1:N
       ▼
┌──────────────────┐
│    witnesses     │
├──────────────────┤
│ id (PK)          │
│ case_id (FK)     │
│ name             │
│ avatar_url       │
│ dialogues (JSON) │
└──────────────────┘


┌────────────────────────┐
│   case_assignments     │
├────────────────────────┤
│ id (PK)                │
│ case_id (FK)           │
│ class_id (FK)          │  OR  student_id (FK) (one must be null)
│ student_id (FK)        │
│ assigned_by (FK)       │
│ assigned_at            │
│ due_date               │
└────────────────────────┘


┌────────────────────────┐
│   student_progress     │
├────────────────────────┤
│ id (PK)                │
│ student_id (FK)        │
│ case_id (FK)           │
│ status (enum)          │  (not_started, in_progress, completed)
│ current_scene_index    │
│ clues_found (JSON)     │
│ time_spent_seconds     │
│ started_at             │
│ completed_at           │
│ last_saved_at          │
└────────┬───────────────┘
         │
         │ 1:1 (after completion)
         ▼
┌────────────────────────┐
│   quiz_submissions     │
├────────────────────────┤
│ id (PK)                │
│ student_id (FK)        │
│ case_id (FK)           │
│ answers (JSON)         │
│ total_score            │
│ skill_scores (JSON)    │
│ submitted_at           │
└────────────────────────┘


┌────────────────────────┐
│   skill_assessments    │
├────────────────────────┤
│ id (PK)                │
│ student_id (FK)        │
│ skill_name             │  (inference, vocabulary, main_idea, etc.)
│ proficiency_level      │  (0-100)
│ cases_assessed         │  (count)
│ last_updated           │
└────────────────────────┘


┌────────────────────────┐
│      audit_logs        │
├────────────────────────┤
│ id (PK)                │
│ user_id (FK)           │
│ action                 │  (login, view_case, submit_quiz, etc.)
│ resource_type          │  (case, student, class, etc.)
│ resource_id            │
│ ip_address             │
│ user_agent             │
│ metadata (JSON)        │
│ timestamp              │
└────────────────────────┘
```

### 4.2 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

enum UserRole {
  STUDENT
  TEACHER
  ADMIN
}

model User {
  id              String    @id @default(uuid())
  email           String    @unique
  hashedPassword  String?   // Null if OAuth only
  role            UserRole
  schoolCode      String?   // MOE school code
  emailVerified   DateTime?
  
  // Timestamps
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  lastLoginAt     DateTime?
  
  // Security
  twoFactorEnabled Boolean  @default(false)
  twoFactorSecret  String?
  
  // Relationships
  studentProfile  StudentProfile?
  teacherProfile  TeacherProfile?
  auditLogs       AuditLog[]
  
  @@index([email])
  @@index([schoolCode])
  @@map("users")
}

model StudentProfile {
  id              String    @id @default(uuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Basic info
  displayName     String
  educationLevel  String    // P4, P5, P6
  
  // Parent consent (PDPA)
  parentEmail     String?
  parentConsent   Boolean   @default(false)
  consentDate     DateTime?
  
  // Data retention (PDPA)
  dataRetentionUntil DateTime?
  isDeleted       Boolean   @default(false)
  deletedAt       DateTime?
  
  // Relationships
  classMemberships  ClassMembership[]
  progress          StudentProgress[]
  quizSubmissions   QuizSubmission[]
  skillAssessments  SkillAssessment[]
  assignments       CaseAssignment[]
  
  @@map("student_profiles")
}

model TeacherProfile {
  id              String    @id @default(uuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Basic info
  displayName     String
  department      String?   // English, Math, etc.
  schoolName      String?
  phone           String?
  
  // Relationships
  classes         Class[]
  caseAssignments CaseAssignment[]
  
  @@map("teacher_profiles")
}

// ============================================================================
// CLASS MANAGEMENT
// ============================================================================

model Class {
  id          String    @id @default(uuid())
  teacherId   String
  teacher     TeacherProfile @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  
  // Basic info
  name        String    // e.g., "Class 4A - English"
  schoolCode  String    // MOE school code
  classCode   String    @unique // Join code for students (e.g., "ABC123")
  
  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relationships
  memberships ClassMembership[]
  assignments CaseAssignment[]
  
  @@index([teacherId])
  @@index([classCode])
  @@map("classes")
}

model ClassMembership {
  id        String   @id @default(uuid())
  classId   String
  class     Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  studentId String
  student   StudentProfile @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  joinedAt  DateTime @default(now())
  
  @@unique([classId, studentId])
  @@map("class_memberships")
}

// ============================================================================
// CASE CONTENT
// ============================================================================

model Case {
  id                  String    @id @default(uuid())
  
  // Basic info
  title               String
  slug                String    @unique
  subject             String    // "Mathematics", "Science" (English embedded in all cases)
  difficulty          String    // Primary 4, Primary 5, Primary 6
  educationLevel      String[]  // ["P4", "P5", "P6"]
  estimatedTime       Int       // minutes
  
  // Content
  storyIntro          String    @db.Text
  coverImageUrl       String?
  themeMusic          String?
  
  // Learning objectives (subject-specific)
  learningObjectives  Json      // Math: {primary: "problem-solving", secondary: ["fractions"]}, Science: {primary: "process_skills", secondary: ["observation"]}
  skillsAssessed      Json      // Subject-specific skills, e.g., Math: {problem_solving: 40, computation: 30, word_problems: 30}, Science: {observation: 30, inference: 40, data_analysis: 30}
  vocabularyWords     Json      // Subject-specific vocabulary: Math [{word: "perimeter", meaning: "..."}], Science: [{word: "evaporation", meaning: "..."}]
  
  // Status
  published           Boolean   @default(false)
  publishedAt         DateTime?
  
  // Timestamps
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  // Relationships
  scenes              Scene[]
  witnesses           Witness[]
  quizQuestions       QuizQuestion[]
  assignments         CaseAssignment[]
  progress            StudentProgress[]
  submissions         QuizSubmission[]
  
  @@index([published])
  @@index([difficulty])
  @@index([subject])
  @@map("cases")
}

model Scene {
  id          String   @id @default(uuid())
  caseId      String
  case        Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  // Scene info
  sceneOrder  Int      // 1, 2, 3...
  name        String   // "Costume Room", "Canteen"
  description String   @db.Text
  imageUrl    String   // Background image
  
  // Interactive objects
  interactiveObjects Json // [{id: "locker", name: "Locker", clickable: true, reveals: "clue-01"}]
  
  // Relationships
  clues       Clue[]
  
  @@unique([caseId, sceneOrder])
  @@map("scenes")
}

model Clue {
  id              String   @id @default(uuid())
  sceneId         String
  scene           Scene    @relation(fields: [sceneId], references: [id], onDelete: Cascade)
  
  // Clue info
  clueType        String   // "document", "physical_evidence", "photo", "audio", "numerical_data", "chart", "diagram"
  title           String
  content         String   @db.Text  // For Maths: may contain numbers, calculations, word problems
  imageUrl        String?
  audioUrl        String?
  
  // Metadata
  relevanceScore  Int      // 1-10 (how important to solution)
  hiddenQuestions Json     // Subject-specific: Math [{q: "Calculate total", a: "42", skill: "addition"}], Science [{q: "What state is water at 100°C?", a: "gas", skill: "states_of_matter"}]
  
  @@map("clues")
}

model Witness {
  id          String   @id @default(uuid())
  caseId      String
  case        Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  // Witness info
  name        String
  role        String   // "Student", "Teacher", "Janitor"
  personality String   // "Helpful", "Nervous", "Secretive"
  avatarUrl   String
  voiceUrl    String?  // Optional voice acting
  
  // Dialogues
  dialogues   Json     // [{question: "...", answer: "...", hints: ["..."]}]
  
  @@map("witnesses")
}

model QuizQuestion {
  id            String   @id @default(uuid())
  caseId        String
  case          Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  // Question info
  questionOrder Int
  questionText  String   @db.Text
  questionType  String   // "multiple_choice", "open_ended", "word_problem" (Math), "show_working" (Math), "process_skills" (Science), "data_interpretation" (Science)
  
  // For MCQ
  options       Json?    // ["Option A", "Option B", "Option C", "Option D"]
  correctAnswer String   // "B" or expected text/number
  
  // For open-ended / Maths working
  rubric        Json?    // {points: 3, criteria: ["...", "...", "..."]} - adapted per subject
  sampleAnswer  String?  @db.Text  // For Maths: sample working + answer
  
  // Metadata
  skillTested   String   // Subject-specific: Math: "problem_solving", "fractions", "measurement"; Science: "observation", "process_skills", "data_analysis"
  explanation   String   @db.Text
  evidenceLocation String // "Scene 1, Clue 3"
  
  @@unique([caseId, questionOrder])
  @@map("quiz_questions")
}

// ============================================================================
// ASSIGNMENTS & PROGRESS
// ============================================================================

model CaseAssignment {
  id          String   @id @default(uuid())
  caseId      String
  case        Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  // Assignment target (one must be null)
  classId     String?
  class       Class?   @relation(fields: [classId], references: [id], onDelete: Cascade)
  studentId   String?
  student     StudentProfile? @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  // Assignment info
  assignedBy  String   // Teacher ID
  teacher     TeacherProfile @relation(fields: [assignedBy], references: [id])
  assignedAt  DateTime @default(now())
  dueDate     DateTime?
  
  @@index([classId])
  @@index([studentId])
  @@map("case_assignments")
}

enum ProgressStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

model StudentProgress {
  id              String         @id @default(uuid())
  studentId       String
  student         StudentProfile @relation(fields: [studentId], references: [id], onDelete: Cascade)
  caseId          String
  case            Case           @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  // Progress tracking
  status          ProgressStatus @default(NOT_STARTED)
  currentSceneIndex Int          @default(0)
  cluesFound      Json           @default("[]") // [1, 2, 3, ...]
  timeSpentSeconds Int           @default(0)
  
  // Timestamps
  startedAt       DateTime?
  completedAt     DateTime?
  lastSavedAt     DateTime       @default(now())
  
  @@unique([studentId, caseId])
  @@index([studentId])
  @@map("student_progress")
}

model QuizSubmission {
  id          String         @id @default(uuid())
  studentId   String
  student     StudentProfile @relation(fields: [studentId], references: [id], onDelete: Cascade)
  caseId      String
  case        Case           @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  // Submission data
  answers     Json           // {q1: "B", q2: "The butler did it because...", q3: "motive"}
  totalScore  Int            // Out of 100
  skillScores Json           // {inference: 80, comprehension: 90, vocabulary: 70}
  
  // Timestamps
  submittedAt DateTime       @default(now())
  
  @@unique([studentId, caseId]) // One submission per case
  @@index([studentId])
  @@map("quiz_submissions")
}

model SkillAssessment {
  id                String         @id @default(uuid())
  studentId         String
  student           StudentProfile @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  // Skill tracking
  skillName         String         // "inference", "vocabulary", "main_idea", etc.
  proficiencyLevel  Int            // 0-100
  casesAssessed     Int            @default(1)
  
  // Timestamps
  lastUpdated       DateTime       @default(now())
  
  @@unique([studentId, skillName])
  @@index([studentId])
  @@map("skill_assessments")
}

// ============================================================================
// AUDIT & COMPLIANCE
// ============================================================================

model AuditLog {
  id           String   @id @default(uuid())
  userId       String?
  user         User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  // Action info
  action       String   // "login", "view_case", "submit_quiz", etc.
  resourceType String?  // "case", "student", "class", etc.
  resourceId   String?
  
  // Request info
  ipAddress    String
  userAgent    String
  metadata     Json?    // Additional context
  
  timestamp    DateTime @default(now())
  
  @@index([userId])
  @@index([timestamp])
  @@map("audit_logs")
}

model ParentConsent {
  id          String   @id @default(uuid())
  studentId   String
  
  // Consent details
  parentEmail String
  consentType String   // "data_collection", "communications"
  consentedAt DateTime @default(now())
  ipAddress   String
  
  // Withdrawal
  withdrawnAt DateTime?
  
  @@index([studentId])
  @@map("parent_consents")
}
```

### 4.3 Database Migrations

```bash
# Create initial migration
npx prisma migrate dev --name init

# Apply migrations to production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

### 4.4 Seed Data

```typescript
// prisma/seed.ts

import { PrismaClient, UserRole } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const adminPassword = await hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@detectivelearning.sg" },
    update: {},
    create: {
      email: "admin@detectivelearning.sg",
      hashedPassword: adminPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  })

  console.log("✅ Admin user created:", admin.email)

  // Create sample teacher
  const teacherPassword = await hash("teacher123", 12)
  const teacher = await prisma.user.create({
    data: {
      email: "teacher@moe.edu.sg",
      hashedPassword: teacherPassword,
      role: UserRole.TEACHER,
      schoolCode: "TEST001",
      emailVerified: new Date(),
      teacherProfile: {
        create: {
          displayName: "Ms. Tan",
          department: "English",
          schoolName: "Test Primary School",
        },
      },
    },
    include: {
      teacherProfile: true,
    },
  })

  console.log("✅ Teacher created:", teacher.email)

  // Create sample class
  const sampleClass = await prisma.class.create({
    data: {
      teacherId: teacher.teacherProfile!.id,
      name: "Class 4A - English",
      schoolCode: "TEST001",
      classCode: "TEST4A",
    },
  })

  console.log("✅ Class created:", sampleClass.name)

  // Create sample students
  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: "student1@students.edu.sg",
        hashedPassword: await hash("student123", 12),
        role: UserRole.STUDENT,
        schoolCode: "TEST001",
        emailVerified: new Date(),
        studentProfile: {
          create: {
            displayName: "Ahmad",
            educationLevel: "P4",
            parentEmail: "parent1@gmail.com",
            parentConsent: true,
            consentDate: new Date(),
            dataRetentionUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            classMemberships: {
              create: {
                classId: sampleClass.id,
              },
            },
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "student2@students.edu.sg",
        hashedPassword: await hash("student123", 12),
        role: UserRole.STUDENT,
        schoolCode: "TEST001",
        emailVerified: new Date(),
        studentProfile: {
          create: {
            displayName: "Wei Ling",
            educationLevel: "P4",
            parentEmail: "parent2@gmail.com",
            parentConsent: true,
            consentDate: new Date(),
            dataRetentionUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            classMemberships: {
              create: {
                classId: sampleClass.id,
              },
            },
          },
        },
      },
    }),
  ])

  console.log("✅ Students created:", students.length)

  // Create Case 1: Missing School Mascot
  const case1 = await prisma.case.create({
    data: {
      title: "The Case of the Missing School Mascot",
      slug: "missing-school-mascot",
      difficulty: "Primary 4",
      educationLevel: ["P4"],
      estimatedTime: 25,
      storyIntro: `The school mascot costume (a friendly lion named Sunny) has disappeared before Sports Day! The costume was last seen in the costume room on Thursday afternoon. Your mission: interview students, check the room, and find clues to solve the mystery before the big event tomorrow.`,
      coverImageUrl: "/images/cases/case-01-cover.jpg",
      learningObjectives: {
        primary: "Making inferences from context",
        secondary: ["Vocabulary in context", "Sequencing events"],
      },
      skillsAssessed: {
        inference: 40,
        comprehension: 30,
        vocabulary: 20,
        sequencing: 10,
      },
      vocabularyWords: [
        { word: "ajar", meaning: "slightly open", context: "The door was ajar" },
        { word: "suspicious", meaning: "seems guilty or wrong", context: "Something suspicious" },
        { word: "motive", meaning: "reason for doing something", context: "What was the motive?" },
      ],
      published: true,
      publishedAt: new Date(),
      scenes: {
        create: [
          {
            sceneOrder: 1,
            name: "Costume Room",
            description: "The costume room is usually locked, but today the door is ajar. You see empty hangers and a note on the floor.",
            imageUrl: "/images/scenes/costume-room.jpg",
            interactiveObjects: [
              { id: "locker", name: "Locker", clickable: true, reveals: "clue-01-note" },
              { id: "schedule", name: "Schedule Board", clickable: true, reveals: "clue-02-schedule" },
              { id: "window", name: "Window", clickable: true, reveals: "clue-03-view" },
            ],
            clues: {
              create: [
                {
                  clueType: "document",
                  title: "Mysterious Note",
                  content: "Meet me at the canteen during recess. Don't tell anyone. - M",
                  relevanceScore: 8,
                  hiddenQuestions: [
                    {
                      q: "Where should they meet?",
                      a: "The canteen",
                      skill: "Literal comprehension",
                    },
                    {
                      q: "What does 'Don't tell anyone' suggest?",
                      a: "It's a secret / They're hiding something",
                      skill: "Inference",
                    },
                  ],
                },
                {
                  clueType: "document",
                  title: "Room Usage Schedule",
                  content: "Monday - Drama Club (3pm-4pm)\nTuesday - Arts & Crafts (2pm-3pm)\nWednesday - Free\nThursday - Sports Day Prep Committee (3pm-5pm)",
                  relevanceScore: 9,
                  hiddenQuestions: [
                    {
                      q: "Which day was the costume room in use for Sports Day?",
                      a: "Thursday",
                      skill: "Locating information",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      witnesses: {
        create: [
          {
            name: "Ahmad",
            role: "Student",
            personality: "Helpful",
            avatarUrl: "/images/characters/ahmad.png",
            dialogues: [
              {
                question: "Did you see anything unusual on Thursday?",
                answer: "Yes! I saw someone carrying a big bag near the costume room after school. They were in a hurry.",
                hints: ["Who has access after school?", "Why carry a big bag?"],
              },
            ],
          },
        ],
      },
      quizQuestions: {
        create: [
          {
            questionOrder: 1,
            questionText: "Who most likely took the mascot costume?",
            questionType: "multiple_choice",
            options: ["The janitor", "A Drama Club member", "A Sports Day Prep Committee member", "The principal"],
            correctAnswer: "C",
            skillTested: "inference",
            explanation: "The schedule shows the costume room was used by Sports Day Prep on Thursday. Ahmad saw someone with a big bag after school, which matches when the committee meets.",
            evidenceLocation: "Scene 1: Clue 2 (Schedule) + Witness Ahmad",
          },
          {
            questionOrder: 2,
            questionText: "What does the word 'ajar' mean in the sentence 'The door was ajar'?",
            questionType: "multiple_choice",
            options: ["Completely closed", "Slightly open", "Broken", "Locked"],
            correctAnswer: "B",
            skillTested: "vocabulary",
            explanation: "'Ajar' means slightly open. You can tell from the context that the door was not completely closed.",
            evidenceLocation: "Scene 1: Description",
          },
          {
            questionOrder: 3,
            questionText: "Why do you think they took the costume? Use clues from the case to support your answer.",
            questionType: "open_ended",
            correctAnswer: "They took it to clean or repair it before Sports Day. The note suggests they were planning something for the event. They probably wanted to surprise everyone with a clean costume.",
            rubric: {
              points: 3,
              criteria: [
                "States a logical reason (1 point)",
                "References specific clues (1 point)",
                "Explains thinking clearly (1 point)",
              ],
            },
            sampleAnswer: "They took it to clean or repair it before Sports Day. The note said 'Meet me at the canteen', which sounds like they were planning something for the event. They probably wanted to surprise everyone with a clean costume.",
            skillTested: "inference",
            explanation: "A good answer shows logical reasoning and cites evidence from the case.",
            evidenceLocation: "Multiple clues",
          },
        ],
      },
    },
  })

  console.log("✅ Case created:", case1.title)

  // Assign case to class
  await prisma.caseAssignment.create({
    data: {
      caseId: case1.id,
      classId: sampleClass.id,
      assignedBy: teacher.teacherProfile!.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
    },
  })

  console.log("✅ Case assigned to class")

  console.log("🎉 Seeding complete!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 4.5 Database Indexing Strategy

```sql
-- Performance-critical indexes

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_school_code ON users(school_code);
CREATE INDEX idx_users_role ON users(role);

-- Student Progress (frequently queried)
CREATE INDEX idx_student_progress_student_case ON student_progress(student_id, case_id);
CREATE INDEX idx_student_progress_status ON student_progress(status);

-- Quiz Submissions (analytics)
CREATE INDEX idx_quiz_submissions_student ON quiz_submissions(student_id);
CREATE INDEX idx_quiz_submissions_case ON quiz_submissions(case_id);
CREATE INDEX idx_quiz_submissions_submitted_at ON quiz_submissions(submitted_at);

-- Audit Logs (compliance, large table)
CREATE INDEX idx_audit_logs_user_timestamp ON audit_logs(user_id, timestamp);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Class Memberships (teacher dashboard)
CREATE INDEX idx_class_memberships_class ON class_memberships(class_id);
CREATE INDEX idx_class_memberships_student ON class_memberships(student_id);

-- Case Assignments
CREATE INDEX idx_case_assignments_class ON case_assignments(class_id);
CREATE INDEX idx_case_assignments_student ON case_assignments(student_id);
CREATE INDEX idx_case_assignments_due_date ON case_assignments(due_date);
```

---

## 5. User Interface Specifications

### 5.1 Design System

#### 5.1.1 Color Palette

```typescript
// tailwind.config.ts

export default {
  theme: {
    extend: {
      colors: {
        // Primary (Detective theme - Blue & Gold)
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // Main primary
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        // Accent (Gold for achievements)
        accent: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // Main accent
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Semantic colors
        success: {
          500: "#10b981",
          600: "#059669",
        },
        error: {
          500: "#ef4444",
          600: "#dc2626",
        },
        warning: {
          500: "#f59e0b",
          600: "#d97706",
        },
        info: {
          500: "#3b82f6",
          600: "#2563eb",
        },
      },
      // Kid-friendly rounded corners
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
}
```

#### 5.1.2 Typography

```typescript
// Font stack
const fonts = {
  sans: ["Inter", "system-ui", "sans-serif"],
  display: ["Poppins", "Inter", "sans-serif"], // Headings
  kid: ["Comic Sans MS", "Comic Neue", "cursive"], // Optional kid-friendly mode
  dyslexic: ["OpenDyslexic", "Arial", "sans-serif"], // Accessibility
}

// Font sizes (larger for kids)
const fontSize = {
  xs: ["0.75rem", { lineHeight: "1.5" }],
  sm: ["0.875rem", { lineHeight: "1.5" }],
  base: ["1rem", { lineHeight: "1.75" }], // 16px, generous line height
  lg: ["1.125rem", { lineHeight: "1.75" }],
  xl: ["1.25rem", { lineHeight: "1.75" }],
  "2xl": ["1.5rem", { lineHeight: "1.6" }],
  "3xl": ["1.875rem", { lineHeight: "1.5" }],
  "4xl": ["2.25rem", { lineHeight: "1.4" }],
}
```

#### 5.1.3 Component Library (shadcn/ui)

```bash
# Install shadcn/ui components
npx shadcn-ui@latest init

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add badge
```

### 5.2 Wireframes & Mockups

#### 5.2.1 Student Dashboard

```
┌───────────────────────────────────────────────────────────────┐
│  [Logo] Detective Learning Academy     [Profile ▼] [Logout]  │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│   Welcome back, Ahmad! 👋                                     │
│                                                               │
│   ┌──────────────────────┐  ┌──────────────────────┐         │
│   │   📊 Your Progress   │  │   🎯 Achievements    │         │
│   │                      │  │                      │         │
│   │   Cases: 2/3 ✓       │  │   🥇 First Case      │         │
│   │   Score: 85% avg     │  │   📚 Bookworm        │         │
│   │   Level: Detective   │  │   🔍 Detail Expert   │         │
│   └──────────────────────┘  └──────────────────────┘         │
│                                                               │
│   📚 Your Cases                              [View All →]    │
│   ┌──────────────────────────────────────────────────────┐  │
│   │                                                      │  │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│   │  │ CASE 1   │  │ CASE 2   │  │ CASE 3   │          │  │
│   │  │ 🎭       │  │ 📚       │  │ 🔬       │          │  │
│   │  │          │  │          │  │          │          │  │
│   │  │ Missing  │  │ Library  │  │ Science  │          │  │
│   │  │ Mascot   │  │ Mystery  │  │ Fair     │          │  │
│   │  │          │  │          │  │          │          │  │
│   │  │ ✅ 85%   │  │ 🔄 50%   │  │ 🔒 Locked│          │  │
│   │  │          │  │          │  │          │          │  │
│   │  │ [Review] │  │[Continue]│  │ [Unlock] │          │  │
│   │  └──────────┘  └──────────┘  └──────────┘          │  │
│   │                                                      │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                               │
│   📈 Skills Progress                                          │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  Inference          ████████░░  80%                  │  │
│   │  Comprehension      ███████████  95%                 │  │
│   │  Vocabulary         ██████░░░░  60%                  │  │
│   │  Sequencing         ████████░░  75%                  │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

#### 5.2.2 Case Gameplay (Interactive Scene)

```
┌───────────────────────────────────────────────────────────────┐
│  [← Back to Dashboard]   Case 1: Missing School Mascot       │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Scene 1: Costume Room                    ⏱️ 5:30   🔍 3/5  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │     [Background Image: Costume Room]                 │   │
│  │                                                       │   │
│  │          🚪 [clickable]                               │   │
│  │                                                       │   │
│  │     📋 [clickable]         🔒 [clickable]            │   │
│  │                                                       │   │
│  │                                                       │   │
│  │                  🪟 [clickable]                       │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  💬 Detective Ah Seng says:                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ "Look around for clues. Click on anything suspicious│   │
│  │  to investigate. You've found 3 clues so far!"      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  📋 Clues Found:                                              │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                   │
│  │ 📝  │ │ 📅  │ │ 👀  │ │  ?  │ │  ?  │                   │
│  │Note │ │Sched│ │View │ │     │ │     │                   │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                   │
│                                                               │
│  [💡 Need a Hint?]  [💾 Save & Exit]  [▶️ Next Scene]       │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

#### 5.2.3 Quiz Question (MCQ)

```
┌───────────────────────────────────────────────────────────────┐
│  Question 3 of 10                                   ⏱️ 2:45   │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Who most likely took the mascot costume?                     │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ⭕ A. The janitor                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ⭕ B. A Drama Club member                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🔵 C. A Sports Day Prep Committee member  ✓         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ⭕ D. The principal                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  💡 Hint: Check the schedule and Ahmad's testimony           │
│                                                               │
│  [← Previous]                          [Next →] [Submit All] │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

#### 5.2.4 Teacher Dashboard

```
┌───────────────────────────────────────────────────────────────┐
│  [Logo]  Teacher Dashboard          [Ms. Tan ▼] [Logout]     │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Class 4A - English                          [+ New Class]   │
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │   👥 Students: 30    │  │   📚 Cases: 2        │         │
│  │   📊 Avg Score: 78%  │  │   ⏱️ Avg Time: 22min │         │
│  └──────────────────────┘  └──────────────────────┘         │
│                                                               │
│  [📊 Analytics] [📝 Assign Case] [📥 Export Report]          │
│                                                               │
│  Student Progress                     [🔍 Search] [🔽 Filter] │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Name     │ Cases │ Avg Score │ Last Active │ Status │   │
│  ├──────────┼───────┼───────────┼─────────────┼────────┤   │
│  │ Ahmad    │ 2/2   │ 85%  ✅   │ 2 hrs ago   │ ✓ Good │   │
│  │ Wei Ling │ 1/2   │ 72%  ⚠️  │ 1 day ago   │ ⚠ Ok   │   │
│  │ Raj      │ 2/2   │ 90%  🌟  │ 1 hr ago    │ ⭐ Exc │   │
│  │ Fatimah  │ 0/2   │ --   ❌   │ 5 days ago  │ ❗ Low │   │
│  │ ...      │       │           │             │        │   │
│  └──────────────────────────────────────────────────────┘   │
│  Showing 1-10 of 30                        [< 1 2 3 4 >]    │
│                                                               │
│  💡 Insights:                                                 │
│  • 4 students need follow-up (inactive >3 days)              │
│  • Class struggling with "Inference" skill (avg 68%)         │
│  • Case 2 completion rate: 80% (good!)                       │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 5.3 Responsive Design

#### 5.3.1 Breakpoints

```typescript
// tailwind.config.ts
const breakpoints = {
  sm: "640px", // Mobile landscape
  md: "768px", // Tablet portrait
  lg: "1024px", // Tablet landscape / Small laptop
  xl: "1280px", // Desktop
  "2xl": "1536px", // Large desktop
}

// Usage
// Mobile-first approach
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Full width on mobile, half on tablet, third on desktop */}
</div>
```

#### 5.3.2 Mobile Optimizations

```typescript
// components/game/SceneViewer.tsx

"use client"

import { useState, useEffect } from "react"

export function SceneViewer({ scene }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  return (
    <div className={isMobile ? "mobile-scene" : "desktop-scene"}>
      {/* Mobile: Stack clues vertically */}
      {/* Desktop: Grid layout */}
      {isMobile ? (
        <div className="flex flex-col gap-4">{/* Clues */}</div>
      ) : (
        <div className="grid grid-cols-3 gap-6">{/* Clues */}</div>
      )}
    </div>
  )
}
```

### 5.4 Accessibility Features

#### 5.4.1 Keyboard Navigation

```typescript
// Ensure all interactive elements are keyboard accessible
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === "Enter" && handleClick()}
  aria-label="Play Case 1"
  className="focus:ring-4 focus:ring-primary-500"
>
  Play Case
</button>

// Skip navigation for screen readers
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

#### 5.4.2 Screen Reader Support

```typescript
// components/game/ClueCard.tsx

<div
  role="article"
  aria-labelledby="clue-title"
  aria-describedby="clue-description"
>
  <h3 id="clue-title">Mysterious Note</h3>
  <p id="clue-description">
    A handwritten note found in the locker. It says...
  </p>
</div>

// Dynamic announcements
import { useAnnouncer } from "@/lib/hooks/useAnnouncer"

const { announce } = useAnnouncer()

// When clue is found
announce("New clue found: Mysterious Note", "polite")

// When quiz submitted
announce("Quiz submitted. Your score is 85%", "assertive")
```

#### 5.4.3 Color Contrast

```typescript
// Ensure WCAG AA compliance (4.5:1 ratio)
const accessibleColors = {
  text: {
    onLight: "#1e293b", // Slate 800 on white: 12.4:1
    onDark: "#f8fafc", // Slate 50 on slate 900: 15.5:1
  },
  links: {
    default: "#2563eb", // Blue 600 on white: 4.9:1 ✓
    visited: "#7c3aed", // Purple 600 on white: 5.1:1 ✓
  },
}
```

---

## 6. Functional Features

### 6.1 Authentication & User Management

#### 6.1.1 Registration Flow

**Student Registration:**

```typescript
// app/(auth)/register/page.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RegisterForm } from "@/components/forms/RegisterForm"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<"details" | "consent" | "verification">("details")

  async function handleRegister(data: RegisterFormData) {
    // Step 1: Create account
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Registration failed")
    }

    const { userId } = await response.json()

    // Step 2: Parent consent (if under 18)
    if (data.age < 18) {
      setStep("consent")
      // Send consent email to parent
      await fetch("/api/auth/send-parent-consent", {
        method: "POST",
        body: JSON.stringify({ userId, parentEmail: data.parentEmail }),
      })
    } else {
      // Step 3: Email verification
      setStep("verification")
      router.push("/verify-email")
    }
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      {step === "details" && <RegisterForm onSubmit={handleRegister} />}
      {step === "consent" && <ParentConsentWaiting />}
      {step === "verification" && <EmailVerificationWaiting />}
    </div>
  )
}
```

**API Implementation:**

```typescript
// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcrypt"
import { prisma } from "@/lib/db"
import { registerSchema } from "@/lib/validations/auth"
import { z } from "zod"

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate input
    const body = await req.json()
    const data = registerSchema.parse(body)

    // 2. Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // 3. Hash password
    const hashedPassword = await hash(data.password, 12)

    // 4. Create user and profile
    const user = await prisma.user.create({
      data: {
        email: data.email,
        hashedPassword,
        role: "STUDENT",
        schoolCode: data.schoolCode,
        studentProfile: {
          create: {
            displayName: data.displayName,
            educationLevel: data.educationLevel,
            parentEmail: data.parentEmail,
            parentConsent: data.age >= 18, // Auto-consent if 18+
            consentDate: data.age >= 18 ? new Date() : null,
            dataRetentionUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          },
        },
      },
    })

    // 5. Send verification email
    await sendVerificationEmail(user.email)

    // 6. Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "REGISTER",
        resourceType: "user",
        resourceId: user.id,
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
      },
    })

    return NextResponse.json({ userId: user.id, message: "Registration successful" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

#### 6.1.2 Login Flow (NextAuth.js)

```typescript
// lib/auth.ts

import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcrypt"
import { prisma } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          hd: "students.edu.sg", // Restrict to school domain
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            studentProfile: true,
            teacherProfile: true,
          },
        })

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials")
        }

        // Verify password
        const isValid = await compare(credentials.password, user.hashedPassword)

        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        // Check if email verified
        if (!user.emailVerified) {
          throw new Error("Please verify your email first")
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        // Audit log
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            ipAddress: "...", // Get from request
            userAgent: "...",
          },
        })

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          schoolCode: user.schoolCode,
          displayName:
            user.studentProfile?.displayName || user.teacherProfile?.displayName,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.schoolCode = user.schoolCode
        token.displayName = user.displayName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.schoolCode = token.schoolCode as string
        session.user.displayName = token.displayName as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect based on role
      if (url.includes("/login")) {
        const role = "student" // Get from session
        if (role === "teacher") return `${baseUrl}/teacher/dashboard`
        if (role === "admin") return `${baseUrl}/admin/dashboard`
        return `${baseUrl}/student/dashboard`
      }
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
```

### 6.2 Case Gameplay

#### 6.2.1 Load Case Data

```typescript
// app/(student)/cases/[caseId]/play/page.tsx

import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { GameEngine } from "@/components/game/GameEngine"

export default async function PlayCasePage({
  params,
}: {
  params: { caseId: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch case data (without quiz answers!)
  const caseData = await prisma.case.findUnique({
    where: {
      id: params.caseId,
      published: true,
    },
    include: {
      scenes: {
        include: {
          clues: true,
        },
        orderBy: {
          sceneOrder: "asc",
        },
      },
      witnesses: true,
    },
  })

  if (!caseData) {
    notFound()
  }

  // Check if student has access (assigned or public)
  const hasAccess = await checkCaseAccess(session.user.id, params.caseId)

  if (!hasAccess) {
    return <div>You don't have access to this case. Ask your teacher to assign it.</div>
  }

  // Load existing progress
  const progress = await prisma.studentProgress.findUnique({
    where: {
      studentId_caseId: {
        studentId: session.user.id,
        caseId: params.caseId,
      },
    },
  })

  return (
    <GameEngine
      caseData={caseData}
      initialProgress={progress}
      studentId={session.user.id}
    />
  )
}
```

#### 6.2.2 Game Engine Component

```typescript
// components/game/GameEngine.tsx

"use client"

import { useState, useEffect } from "react"
import { SceneViewer } from "./SceneViewer"
import { CluePanel } from "./CluePanel"
import { WitnessDialog } from "./WitnessDialog"
import { ProgressTracker } from "./ProgressTracker"
import { useAutoSave } from "@/lib/hooks/useAutoSave"

export function GameEngine({ caseData, initialProgress, studentId }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(
    initialProgress?.currentSceneIndex || 0
  )
  const [cluesFound, setCluesFound] = useState<string[]>(
    initialProgress?.cluesFound || []
  )
  const [timeSpent, setTimeSpent] = useState(initialProgress?.timeSpentSeconds || 0)
  const [witnessDialogOpen, setWitnessDialogOpen] = useState(false)
  const [selectedWitness, setSelectedWitness] = useState(null)

  // Auto-save progress every 30 seconds
  useAutoSave(
    {
      studentId,
      caseId: caseData.id,
      currentSceneIndex,
      cluesFound,
      timeSpent,
    },
    30000 // 30 seconds
  )

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const currentScene = caseData.scenes[currentSceneIndex]
  const totalScenes = caseData.scenes.length
  const totalClues = caseData.scenes.reduce(
    (sum, scene) => sum + scene.clues.length,
    0
  )

  function handleClueFound(clueId: string) {
    if (!cluesFound.includes(clueId)) {
      setCluesFound((prev) => [...prev, clueId])
      // Play sound effect
      playSound("/sounds/clue-found.mp3")
      // Show toast notification
      toast.success("New clue found!")
    }
  }

  function handleNextScene() {
    if (currentSceneIndex < totalScenes - 1) {
      setCurrentSceneIndex((prev) => prev + 1)
    } else {
      // All scenes complete, go to quiz
      router.push(`/cases/${caseData.id}/quiz`)
    }
  }

  function handleWitnessClick(witness) {
    setSelectedWitness(witness)
    setWitnessDialogOpen(true)
  }

  return (
    <div className="game-container">
      {/* Progress bar */}
      <ProgressTracker
        currentScene={currentSceneIndex + 1}
        totalScenes={totalScenes}
        cluesFound={cluesFound.length}
        totalClues={totalClues}
        timeSpent={timeSpent}
      />

      {/* Main game area */}
      <div className="game-main grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Scene viewer (left side, 3/4 width on desktop) */}
        <div className="lg:col-span-3">
          <SceneViewer
            scene={currentScene}
            onClueFound={handleClueFound}
            onWitnessClick={handleWitnessClick}
          />
        </div>

        {/* Clue panel (right sidebar) */}
        <div className="lg:col-span-1">
          <CluePanel clues={cluesFound} caseData={caseData} />
        </div>
      </div>

      {/* Navigation */}
      <div className="game-nav flex justify-between mt-6">
        <button
          onClick={() => setCurrentSceneIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentSceneIndex === 0}
          className="btn-secondary"
        >
          ← Previous Scene
        </button>

        <button onClick={handleSaveAndExit} className="btn-outline">
          💾 Save & Exit
        </button>

        <button onClick={handleNextScene} className="btn-primary">
          {currentSceneIndex === totalScenes - 1
            ? "Go to Quiz →"
            : "Next Scene →"}
        </button>
      </div>

      {/* Witness dialog */}
      {selectedWitness && (
        <WitnessDialog
          witness={selectedWitness}
          open={witnessDialogOpen}
          onClose={() => setWitnessDialogOpen(false)}
        />
      )}
    </div>
  )
}
```

#### 6.2.3 Auto-Save Hook

```typescript
// lib/hooks/useAutoSave.ts

import { useEffect, useRef } from "react"
import { debounce } from "lodash"

export function useAutoSave(data: any, interval: number = 30000) {
  const savedData = useRef(data)

  useEffect(() => {
    const saveProgress = debounce(async () => {
      // Only save if data changed
      if (JSON.stringify(savedData.current) === JSON.stringify(data)) {
        return
      }

      try {
        const response = await fetch(
          `/api/cases/${data.caseId}/progress`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        )

        if (response.ok) {
          savedData.current = data
          console.log("✅ Progress saved")
        }
      } catch (error) {
        console.error("Failed to save progress:", error)
        // Show toast notification
        toast.error("Failed to save progress. Check your connection.")
      }
    }, 1000) // Debounce 1 second

    const intervalId = setInterval(saveProgress, interval)

    // Save on unmount
    return () => {
      clearInterval(intervalId)
      saveProgress.flush() // Execute immediately
    }
  }, [data, interval])
}
```

### 6.3 Quiz System

#### 6.3.1 Quiz Page

```typescript
// app/(student)/cases/[caseId]/quiz/page.tsx

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { QuizComponent } from "@/components/game/QuizComponent"

export default async function QuizPage({ params }: { params: { caseId: string } }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch case to get subject
  const caseData = await prisma.case.findUnique({
    where: { id: params.caseId },
    select: { subject: true, title: true },
  })

  // Fetch quiz questions (NO correct answers sent to client!)
  const questions = await prisma.quizQuestion.findMany({
    where: { caseId: params.caseId },
    orderBy: { questionOrder: "asc" },
    select: {
      id: true,
      questionText: true,
      questionType: true,
      options: true,
      // Do NOT select: correctAnswer, explanation
    },
  })

  // Check if already submitted
  const existingSubmission = await prisma.quizSubmission.findUnique({
    where: {
      studentId_caseId: {
        studentId: session.user.id,
        caseId: params.caseId,
      },
    },
  })

  if (existingSubmission) {
    // Show results instead
    redirect(`/cases/${params.caseId}/results`)
  }

  // Subject-specific instructions
  const instructions = {
    Mathematics: "Solve the problems based on the clues you collected. Show your working where required!",
    Science: "Answer the questions based on your observations and evidence. Think scientifically!",
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{caseData.subject} Quiz Time!</h1>
      <p className="text-gray-600 mb-8">
        {instructions[caseData.subject] || "Answer the questions based on the clues you found."}
      </p>

      <QuizComponent questions={questions} caseId={params.caseId} subject={caseData.subject} />
    </div>
  )
}
```

#### 6.3.2 Quiz Component

```typescript
// components/game/QuizComponent.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { QuizQuestion } from "@/components/game/QuizQuestion"
import { ProgressDots } from "@/components/ui/ProgressDots"

export function QuizComponent({ questions, caseId }) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length

  function handleAnswerChange(questionId: string, answer: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  function handleNext() {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  async function handleSubmit() {
    // Validate all questions answered
    const unanswered = questions.filter((q) => !answers[q.id])
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions. ${unanswered.length} remaining.`)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          answers,
        }),
      })

      if (!response.ok) {
        throw new Error("Submission failed")
      }

      const result = await response.json()

      // Navigate to results page
      router.push(`/cases/${caseId}/results`)
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("Failed to submit quiz. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="quiz-container">
      {/* Progress dots */}
      <ProgressDots current={currentIndex} total={totalQuestions} />

      {/* Question */}
      <div className="question-card bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="question-header mb-4">
          <span className="text-sm text-gray-500">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        <QuizQuestion
          question={currentQuestion}
          value={answers[currentQuestion.id] || ""}
          onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
        />
      </div>

      {/* Navigation */}
      <div className="quiz-nav flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="btn-secondary"
        >
          ← Previous
        </button>

        <div className="text-sm text-gray-600">
          {Object.keys(answers).length} / {totalQuestions} answered
        </div>

        {currentIndex < totalQuestions - 1 ? (
          <button onClick={handleNext} className="btn-primary">
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-success"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz ✓"}
          </button>
        )}
      </div>
    </div>
  )
}
```

#### 6.3.3 Server-Side Grading

```typescript
// app/api/quiz/submit/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const submitSchema = z.object({
  caseId: z.string().uuid(),
  answers: z.record(z.string()), // { questionId: answer }
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse input
    const body = await req.json()
    const { caseId, answers } = submitSchema.parse(body)

    // Prevent duplicate submissions
    const existing = await prisma.quizSubmission.findUnique({
      where: {
        studentId_caseId: {
          studentId: session.user.id,
          caseId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Quiz already submitted" },
        { status: 400 }
      )
    }

    // Fetch correct answers and rubrics
    const questions = await prisma.quizQuestion.findMany({
      where: { caseId },
      select: {
        id: true,
        questionType: true,
        correctAnswer: true,
        rubric: true,
        skillTested: true,
      },
    })

    // Grade each question
    let totalScore = 0
    let totalPoints = 0
    const skillScores: Record<string, { correct: number; total: number }> = {}

    for (const question of questions) {
      const studentAnswer = answers[question.id]

      let points = 0
      let maxPoints = 0

      if (question.questionType === "multiple_choice") {
        maxPoints = 10
        if (studentAnswer === question.correctAnswer) {
          points = 10
        }
      } else if (question.questionType === "open_ended") {
        // Use simple keyword matching for MVP (Phase 2: AI grading)
        maxPoints = question.rubric?.points || 10
        points = gradeOpenEnded(studentAnswer, question.correctAnswer, maxPoints)
      } else if (question.questionType === "vocabulary") {
        maxPoints = 5
        if (
          studentAnswer.toLowerCase() === question.correctAnswer.toLowerCase()
        ) {
          points = 5
        }
      }

      totalScore += points
      totalPoints += maxPoints

      // Track by skill
      const skill = question.skillTested
      if (!skillScores[skill]) {
        skillScores[skill] = { correct: 0, total: 0 }
      }
      skillScores[skill].correct += points
      skillScores[skill].total += maxPoints
    }

    // Calculate percentage
    const percentageScore = Math.round((totalScore / totalPoints) * 100)

    // Convert skill scores to percentages
    const skillPercentages: Record<string, number> = {}
    for (const [skill, scores] of Object.entries(skillScores)) {
      skillPercentages[skill] = Math.round((scores.correct / scores.total) * 100)
    }

    // Save submission
    const submission = await prisma.quizSubmission.create({
      data: {
        studentId: session.user.id,
        caseId,
        answers,
        totalScore: percentageScore,
        skillScores: skillPercentages,
      },
    })

    // Update student progress to "completed"
    await prisma.studentProgress.update({
      where: {
        studentId_caseId: {
          studentId: session.user.id,
          caseId,
        },
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    })

    // Update skill assessments
    for (const [skill, percentage] of Object.entries(skillPercentages)) {
      await prisma.skillAssessment.upsert({
        where: {
          studentId_skillName: {
            studentId: session.user.id,
            skillName: skill,
          },
        },
        update: {
          proficiencyLevel: percentage,
          casesAssessed: {
            increment: 1,
          },
          lastUpdated: new Date(),
        },
        create: {
          studentId: session.user.id,
          skillName: skill,
          proficiencyLevel: percentage,
          casesAssessed: 1,
        },
      })
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "SUBMIT_QUIZ",
        resourceType: "quiz_submission",
        resourceId: submission.id,
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
        metadata: {
          caseId,
          score: percentageScore,
        },
      },
    })

    return NextResponse.json({
      submissionId: submission.id,
      totalScore: percentageScore,
      skillScores: skillPercentages,
      message: "Quiz submitted successfully!",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Quiz submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Simple open-ended grading (MVP)
function gradeOpenEnded(
  studentAnswer: string,
  correctAnswer: string,
  maxPoints: number
): number {
  if (!studentAnswer || studentAnswer.trim().length < 10) {
    return 0 // Too short
  }

  // Extract keywords from correct answer
  const keywords = correctAnswer
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 4) // Only words > 4 chars

  const studentLower = studentAnswer.toLowerCase()

  // Count keyword matches
  const matches = keywords.filter((keyword) => studentLower.includes(keyword)).length

  // Award points proportionally
  const proportion = matches / keywords.length
  return Math.round(proportion * maxPoints)
}
```

### 6.4 Teacher Dashboard

#### 6.4.1 Class Overview

```typescript
// app/(teacher)/classes/[classId]/page.tsx

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { StudentTable } from "@/components/dashboard/StudentTable"
import { ClassStats } from "@/components/dashboard/ClassStats"
import { SkillHeatmap } from "@/components/dashboard/SkillHeatmap"

export default async function ClassPage({ params }: { params: { classId: string } }) {
  const session = await auth()

  if (!session?.user || session.user.role !== "teacher") {
    redirect("/unauthorized")
  }

  // Fetch class data
  const classData = await prisma.class.findUnique({
    where: {
      id: params.classId,
      teacherId: session.user.id, // Ensure teacher owns this class
    },
    include: {
      memberships: {
        include: {
          student: {
            include: {
              progress: {
                include: {
                  case: {
                    select: {
                      title: true,
                      estimatedTime: true,
                    },
                  },
                },
              },
              quizSubmissions: {
                include: {
                  case: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
              skillAssessments: true,
            },
          },
        },
      },
    },
  })

  if (!classData) {
    notFound()
  }

  // Calculate class statistics
  const students = classData.memberships.map((m) => m.student)
  const stats = calculateClassStats(students)

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{classData.name}</h1>
          <p className="text-gray-600">
            {students.length} students • Class Code: {classData.classCode}
          </p>
        </div>

        <div className="flex gap-4">
          <button className="btn-primary">📝 Assign Case</button>
          <button className="btn-outline">📥 Export Report</button>
        </div>
      </div>

      {/* Class statistics */}
      <ClassStats stats={stats} />

      {/* Skill heatmap */}
      <SkillHeatmap students={students} className="mb-8" />

      {/* Student table */}
      <StudentTable students={students} classId={params.classId} />
    </div>
  )
}

function calculateClassStats(students) {
  const totalCasesCompleted = students.reduce(
    (sum, s) => sum + s.quizSubmissions.length,
    0
  )

  const avgScore =
    students.reduce(
      (sum, s) =>
        sum +
        (s.quizSubmissions.reduce((s2, sub) => s2 + sub.totalScore, 0) /
          s.quizSubmissions.length || 0),
      0
    ) / students.length || 0

  const avgTimeSpent =
    students.reduce(
      (sum, s) =>
        sum +
        (s.progress.reduce((s2, p) => s2 + p.timeSpentSeconds, 0) /
          s.progress.length || 0),
      0
    ) / students.length || 0

  const activeStudents = students.filter(
    (s) =>
      s.progress.some(
        (p) =>
          p.lastSavedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ) // Active in last 7 days
  ).length

  return {
    totalStudents: students.length,
    totalCasesCompleted,
    avgScore: Math.round(avgScore),
    avgTimeSpent: Math.round(avgTimeSpent / 60), // Convert to minutes
    activeStudents,
    activePercentage: Math.round((activeStudents / students.length) * 100),
  }
}
```

#### 6.4.2 Export Reports

```typescript
// app/api/classes/[classId]/export/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import ExcelJS from "exceljs"

export async function GET(
  req: NextRequest,
  { params }: { params: { classId: string } }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Fetch class data
  const classData = await prisma.class.findUnique({
    where: {
      id: params.classId,
      teacherId: session.user.id,
    },
    include: {
      memberships: {
        include: {
          student: {
            include: {
              user: {
                select: {
                  email: true,
                  lastLoginAt: true,
                },
              },
              quizSubmissions: {
                include: {
                  case: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
              skillAssessments: true,
            },
          },
        },
      },
    },
  })

  if (!classData) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 })
  }

  // Create Excel workbook
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Class Report")

  // Add headers
  worksheet.columns = [
    { header: "Student Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Cases Completed", key: "casesCompleted", width: 15 },
    { header: "Average Score", key: "avgScore", width: 15 },
    { header: "Inference", key: "inference", width: 12 },
    { header: "Comprehension", key: "comprehension", width: 15 },
    { header: "Vocabulary", key: "vocabulary", width: 12 },
    { header: "Sequencing", key: "sequencing", width: 12 },
    { header: "Last Active", key: "lastActive", width: 20 },
  ]

  // Style headers
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF3B82F6" },
  }

  // Add data
  for (const membership of classData.memberships) {
    const student = membership.student

    const avgScore =
      student.quizSubmissions.reduce((sum, sub) => sum + sub.totalScore, 0) /
        student.quizSubmissions.length || 0

    const skills = {
      inference:
        student.skillAssessments.find((s) => s.skillName === "inference")
          ?.proficiencyLevel || 0,
      comprehension:
        student.skillAssessments.find((s) => s.skillName === "comprehension")
          ?.proficiencyLevel || 0,
      vocabulary:
        student.skillAssessments.find((s) => s.skillName === "vocabulary")
          ?.proficiencyLevel || 0,
      sequencing:
        student.skillAssessments.find((s) => s.skillName === "sequencing")
          ?.proficiencyLevel || 0,
    }

    worksheet.addRow({
      name: student.displayName,
      email: student.user.email,
      casesCompleted: student.quizSubmissions.length,
      avgScore: Math.round(avgScore),
      inference: skills.inference,
      comprehension: skills.comprehension,
      vocabulary: skills.vocabulary,
      sequencing: skills.sequencing,
      lastActive: student.user.lastLoginAt
        ? new Date(student.user.lastLoginAt).toLocaleDateString()
        : "Never",
    })
  }

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer()

  // Return as download
  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="Class_Report_${classData.name}_${new Date().toISOString().split("T")[0]}.xlsx"`,
    },
  })
}
```

---

## 7. API Specifications

### 7.1 API Endpoint Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | No | Register new user |
| `/api/auth/login` | POST | No | Login (handled by NextAuth) |
| `/api/auth/verify-email` | GET | No | Verify email token |
| `/api/auth/send-parent-consent` | POST | No | Send consent email |
| `/api/cases` | GET | Yes | List available cases |
| `/api/cases/:id` | GET | Yes | Get case details |
| `/api/cases/:id/progress` | GET | Yes | Get student's progress |
| `/api/cases/:id/progress` | POST | Yes | Save progress |
| `/api/cases/:id/quiz` | GET | Yes | Get quiz questions |
| `/api/quiz/submit` | POST | Yes | Submit quiz answers |
| `/api/students/:id/progress` | GET | Yes (Teacher) | Get student progress |
| `/api/classes` | GET | Yes (Teacher) | List teacher's classes |
| `/api/classes` | POST | Yes (Teacher) | Create new class |
| `/api/classes/:id` | GET | Yes (Teacher) | Get class details |
| `/api/classes/:id/students` | GET | Yes (Teacher) | List class students |
| `/api/classes/:id/assign` | POST | Yes (Teacher) | Assign case to class |
| `/api/classes/:id/export` | GET | Yes (Teacher) | Export class report |
| `/api/hints` | POST | Yes | Get AI hint (Phase 2) |

### 7.2 API Response Formats

```typescript
// Success response
{
  success: true,
  data: { ... },
  message?: string
}

// Error response
{
  success: false,
  error: {
    code: "VALIDATION_ERROR" | "UNAUTHORIZED" | "NOT_FOUND" | "INTERNAL_ERROR",
    message: string,
    details?: any
  }
}

// Paginated response
{
  success: true,
  data: [...],
  pagination: {
    page: number,
    perPage: number,
    total: number,
    totalPages: number
  }
}
```

### 7.3 Rate Limiting

```typescript
// lib/rate-limit.ts (using Upstash Redis)

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

// Different limits for different endpoints
export const rateLimiters = {
  // General API: 100 requests per 10 seconds per user
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit/api",
  }),

  // Login: 5 attempts per 15 minutes per IP
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "@upstash/ratelimit/login",
  }),

  // Quiz submission: 3 per minute (prevent spam)
  quiz: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"),
    prefix: "@upstash/ratelimit/quiz",
  }),
}

// Middleware to apply rate limiting
export async function applyRateLimit(
  identifier: string,
  limiter: keyof typeof rateLimiters
) {
  const { success, limit, reset, remaining } = await rateLimiters[limiter].limit(
    identifier
  )

  if (!success) {
    throw new Error(
      `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`
    )
  }

  return { limit, reset, remaining }
}
```

---

## 8. Security Specifications

### 8.1 Authentication Security

```typescript
// Password requirements
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must contain lowercase letter")
  .regex(/[A-Z]/, "Password must contain uppercase letter")
  .regex(/[0-9]/, "Password must contain number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain special character")

// Session configuration
const sessionConfig = {
  strategy: "jwt" as const,
  maxAge: 2 * 60 * 60, // 2 hours
  updateAge: 30 * 60, // Refresh every 30 minutes
}

// JWT secret (must be 32+ characters)
const JWT_SECRET = process.env.NEXTAUTH_SECRET! // From env
```

### 8.2 CSRF Protection

```typescript
// middleware.ts - CSRF token verification

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // State-changing requests require CSRF token
  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const csrfToken = request.headers.get("x-csrf-token")
    const sessionToken = request.cookies.get("next-auth.session-token")?.value

    if (!csrfToken || !sessionToken) {
      return NextResponse.json({ error: "CSRF token missing" }, { status: 403 })
    }

    // Verify CSRF token (simple implementation)
    const expectedToken = generateCSRFToken(sessionToken)
    if (csrfToken !== expectedToken) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
    }
  }

  return NextResponse.next()
}

function generateCSRFToken(sessionToken: string): string {
  // Use HMAC with secret
  const crypto = require("crypto")
  return crypto
    .createHmac("sha256", process.env.CSRF_SECRET!)
    .update(sessionToken)
    .digest("hex")
}
```

### 8.3 Input Validation

```typescript
// lib/validations/auth.ts

import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email("Invalid email").endsWith("@students.edu.sg", "Must use school email"),
  password: z
    .string()
    .min(8)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
  displayName: z.string().min(2).max(50),
  educationLevel: z.enum(["P4", "P5", "P6"]),
  schoolCode: z.string().length(6),
  parentEmail: z.string().email().optional(),
  age: z.number().min(9).max(15),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
})

export const quizSubmissionSchema = z.object({
  caseId: z.string().uuid(),
  answers: z.record(z.string().min(1, "Answer required")),
})
```

### 8.4 SQL Injection Prevention

```typescript
// Prisma automatically prevents SQL injection via parameterized queries
// GOOD (Safe):
const user = await prisma.user.findUnique({
  where: { email: userInput }, // ✓ Parameterized
})

// BAD (Vulnerable):
// const user = await prisma.$queryRaw`SELECT * FROM users WHERE email = '${userInput}'`
// ✗ Never use string interpolation in raw queries!

// If raw SQL needed, use parameterized version:
const user = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userInput}
` // ✓ Prisma sanitizes parameters
```

### 8.5 XSS Prevention

```typescript
// React automatically escapes content
<div>{userInput}</div> // ✓ Safe

// Dangerous patterns to avoid:
// <div dangerouslySetInnerHTML={{ __html: userInput }} /> // ✗ Vulnerable!

// If HTML rendering needed, use sanitizer:
import DOMPurify from "isomorphic-dompurify"

<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} /> // ✓ Safe
```

### 8.6 Content Security Policy

```typescript
// next.config.js

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://api.detectivelearning.sg;
      media-src 'self' https:;
      object-src 'none';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `
      .replace(/\s{2,}/g, " ")
      .trim(),
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
]

module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },
}
```

---

## 9. Integration Specifications

### 9.1 MOE SSO Integration (Phase 2)

```typescript
// lib/auth/moe-sso.ts

import { Strategy as SAMLStrategy } from "passport-saml"

export const moeSSO = new SAMLStrategy(
  {
    callbackUrl: "https://detectivelearning.sg/auth/moe/callback",
    entryPoint: "https://vle.learning.moe.edu.sg/saml/sso",
    issuer: "detective-learning-sg",
    cert: process.env.MOE_SAML_CERT!, // Provided by MOE
  },
  async (profile, done) => {
    try {
      // MOE SAML profile contains:
      // - email (school email)
      // - schoolCode
      // - educationLevel
      // - firstName (no full name for privacy)

      const user = await prisma.user.upsert({
        where: { email: profile.email },
        update: {
          lastLoginAt: new Date(),
        },
        create: {
          email: profile.email,
          role: "STUDENT",
          schoolCode: profile.schoolCode,
          emailVerified: new Date(), // MOE accounts are pre-verified
          studentProfile: {
            create: {
              displayName: profile.firstName,
              educationLevel: profile.educationLevel,
              parentConsent: true, // MOE has consent
              consentDate: new Date(),
              dataRetentionUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            },
          },
        },
      })

      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }
)
```

### 9.2 Google Gemini AI Integration (Hint System - Phase 2)

```typescript
// lib/ai/gemini.ts

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateHint(
  clues: string[],
  question: string,
  difficulty: string
) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const prompt = `
You are Detective Ah Seng, a friendly detective helping a Primary ${difficulty} student solve a mystery.

The student has found these clues:
${clues.map((c, i) => `${i + 1}. ${c}`).join("\n")}

They are stuck on this question: "${question}"

Give them a SUBTLE hint that guides their thinking WITHOUT revealing the answer directly.
Use simple language appropriate for a 10-12 year old.
Be encouraging and friendly.
Hint should be 2-3 sentences maximum.
  `.trim()

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const hint = response.text()

    return hint
  } catch (error) {
    console.error("Gemini API error:", error)
    // Fallback to generic hint
    return "Look carefully at the clues you've found. One of them has an important detail that answers this question. Read them again slowly!"
  }
}
```

**API Endpoint:**

```typescript
// app/api/hints/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateHint } from "@/lib/ai/gemini"
import { applyRateLimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limit: 3 hints per minute
    await applyRateLimit(session.user.id, "quiz")

    const { caseId, questionId, clues } = await req.json()

    // Fetch question
    const question = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
      include: {
        case: {
          select: {
            difficulty: true,
          },
        },
      },
    })

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    // Generate hint
    const hint = await generateHint(
      clues,
      question.questionText,
      question.case.difficulty
    )

    // Log hint usage (for analytics)
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "REQUEST_HINT",
        resourceType: "question",
        resourceId: questionId,
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
      },
    })

    return NextResponse.json({ hint })
  } catch (error) {
    console.error("Hint generation error:", error)
    return NextResponse.json({ error: "Failed to generate hint" }, { status: 500 })
  }
}
```

### 9.3 Email Service Integration (Resend)

```typescript
// lib/email.ts

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

  try {
    await resend.emails.send({
      from: "Detective Learning Academy <noreply@detectivelearning.sg>",
      to: email,
      subject: "Verify your email address",
      html: `
        <h1>Welcome to Detective Learning Academy! 🔍</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verifyUrl}" style="
          display: inline-block;
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 6px;
        ">Verify Email</a>
        <p>Or copy this link: ${verifyUrl}</p>
        <p>This link expires in 24 hours.</p>
      `,
    })
  } catch (error) {
    console.error("Email send error:", error)
    throw new Error("Failed to send verification email")
  }
}

export async function sendParentConsentEmail(
  parentEmail: string,
  studentName: string,
  consentToken: string
) {
  const consentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/consent?token=${consentToken}`

  await resend.emails.send({
    from: "Detective Learning Academy <noreply@detectivelearning.sg>",
    to: parentEmail,
    subject: "Parent Consent Required - Detective Learning Academy",
    html: `
      <h1>Parent/Guardian Consent Request</h1>
      <p>Dear Parent/Guardian,</p>
      <p>Your child <strong>${studentName}</strong> has registered for Detective Learning Academy, an educational platform to improve English comprehension skills.</p>
      
      <h2>What data we collect:</h2>
      <ul>
        <li>School email address (for login)</li>
        <li>First name or nickname</li>
        <li>Learning progress (cases completed, quiz scores)</li>
        <li>Time spent on platform</li>
      </ul>

      <h2>What we DO NOT collect:</h2>
      <ul>
        <li>Full name or NRIC</li>
        <li>Home address or phone number</li>
        <li>Photos or personal information</li>
        <li>Location data</li>
      </ul>

      <p>Data is stored securely in Singapore and will be deleted 1 year after graduation.</p>

      <p>Please review our full Privacy Policy and provide consent:</p>
      <a href="${consentUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background: #10b981;
        color: white;
        text-decoration: none;
        border-radius: 6px;
      ">Review & Give Consent</a>

      <p>If you have questions, contact us at: <a href="mailto:privacy@detectivelearning.sg">privacy@detectivelearning.sg</a></p>
    `,
  })
}

export async function sendWeeklyProgressEmail(
  parentEmail: string,
  studentName: string,
  stats: any
) {
  await resend.emails.send({
    from: "Detective Learning Academy <progress@detectivelearning.sg>",
    to: parentEmail,
    subject: `Weekly Progress Report - ${studentName}`,
    html: `
      <h1>Weekly Progress Report</h1>
      <p>Dear Parent/Guardian,</p>
      <p>Here's <strong>${studentName}</strong>'s progress this week:</p>

      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd;"><strong>Cases Completed:</strong></td>
          <td style="padding: 12px; border: 1px solid #ddd;">${stats.casesCompleted}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd;"><strong>Average Score:</strong></td>
          <td style="padding: 12px; border: 1px solid #ddd;">${stats.avgScore}%</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd;"><strong>Time Spent:</strong></td>
          <td style="padding: 12px; border: 1px solid #ddd;">${stats.timeSpent} minutes</td>
        </tr>
      </table>

      <h2>Skill Progress:</h2>
      <ul>
        <li>Inference: ${stats.skills.inference}%</li>
        <li>Comprehension: ${stats.skills.comprehension}%</li>
        <li>Vocabulary: ${stats.skills.vocabulary}%</li>
      </ul>

      <p>Keep up the great work! 🎉</p>

      <p>View full report: <a href="${process.env.NEXT_PUBLIC_APP_URL}/parent">Parent Portal</a></p>
    `,
  })
}
```

---

## 10. Testing Requirements

### 10.1 Unit Testing (Jest)

```typescript
// __tests__/lib/scoring.test.ts

import { calculateQuizScore, gradeOpenEnded } from "@/lib/game/scoring"

describe("Quiz Scoring", () => {
  describe("calculateQuizScore", () => {
    it("calculates correct percentage for all correct MCQ answers", () => {
      const questions = [
        { type: "multiple_choice", maxPoints: 10 },
        { type: "multiple_choice", maxPoints: 10 },
        { type: "multiple_choice", maxPoints: 10 },
      ]

      const answers = {
        q1: "B", // correct
        q2: "C", // correct
        q3: "A", // correct
      }

      const correctAnswers = {
        q1: "B",
        q2: "C",
        q3: "A",
      }

      const result = calculateQuizScore(questions, answers, correctAnswers)

      expect(result.totalScore).toBe(100)
      expect(result.correctCount).toBe(3)
    })

    it("calculates correct percentage for mixed answers", () => {
      const questions = [
        { type: "multiple_choice", maxPoints: 10 },
        { type: "multiple_choice", maxPoints: 10 },
      ]

      const answers = {
        q1: "B", // correct
        q2: "A", // incorrect
      }

      const correctAnswers = {
        q1: "B",
        q2: "C",
      }

      const result = calculateQuizScore(questions, answers, correctAnswers)

      expect(result.totalScore).toBe(50)
      expect(result.correctCount).toBe(1)
    })
  })

  describe("gradeOpenEnded", () => {
    it("awards full points for answer with all keywords", () => {
      const studentAnswer =
        "The Sports Day Prep Committee took the costume to clean it before the event."
      const correctAnswer =
        "Sports Day Prep Committee took costume clean event"
      const maxPoints = 10

      const score = gradeOpenEnded(studentAnswer, correctAnswer, maxPoints)

      expect(score).toBeGreaterThanOrEqual(8) // At least 80%
    })

    it("awards zero points for very short answer", () => {
      const studentAnswer = "IDK"
      const correctAnswer = "Sports Day Prep Committee took costume clean"
      const maxPoints = 10

      const score = gradeOpenEnded(studentAnswer, correctAnswer, maxPoints)

      expect(score).toBe(0)
    })
  })
})
```

### 10.2 Integration Testing

```typescript
// __tests__/api/quiz/submit.test.ts

import { POST } from "@/app/api/quiz/submit/route"
import { prisma } from "@/lib/db"
import { NextRequest } from "next/server"

// Mock auth
jest.mock("@/lib/auth", () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: { id: "test-student-id", role: "student" },
    })
  ),
}))

describe("POST /api/quiz/submit", () => {
  beforeEach(async () => {
    // Setup test data
    await prisma.case.create({
      data: {
        id: "test-case-id",
        title: "Test Case",
        slug: "test-case",
        difficulty: "Primary 4",
        educationLevel: ["P4"],
        estimatedTime: 20,
        storyIntro: "Test story",
        published: true,
        quizQuestions: {
          create: [
            {
              questionOrder: 1,
              questionText: "Test question",
              questionType: "multiple_choice",
              options: ["A", "B", "C", "D"],
              correctAnswer: "B",
              skillTested: "inference",
              explanation: "Test explanation",
              evidenceLocation: "Test location",
            },
          ],
        },
      },
    })
  })

  afterEach(async () => {
    await prisma.quizSubmission.deleteMany()
    await prisma.quizQuestion.deleteMany()
    await prisma.case.deleteMany()
  })

  it("successfully submits quiz and calculates score", async () => {
    const req = new NextRequest("http://localhost:3000/api/quiz/submit", {
      method: "POST",
      body: JSON.stringify({
        caseId: "test-case-id",
        answers: {
          "question-id-1": "B", // Correct
        },
      }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.totalScore).toBe(100) // 1/1 correct = 100%
    expect(data.submissionId).toBeDefined()
  })

  it("prevents duplicate submissions", async () => {
    // First submission
    const req1 = new NextRequest("http://localhost:3000/api/quiz/submit", {
      method: "POST",
      body: JSON.stringify({
        caseId: "test-case-id",
        answers: { "question-id-1": "B" },
      }),
    })

    await POST(req1)

    // Second submission (should fail)
    const req2 = new NextRequest("http://localhost:3000/api/quiz/submit", {
      method: "POST",
      body: JSON.stringify({
        caseId: "test-case-id",
        answers: { "question-id-1": "C" },
      }),
    })

    const response = await POST(req2)

    expect(response.status).toBe(400)
    expect((await response.json()).error).toContain("already submitted")
  })
})
```

### 10.3 End-to-End Testing (Playwright)

```typescript
// e2e/student-play-case.spec.ts

import { test, expect } from "@playwright/test"

test.describe("Student plays case", () => {
  test.beforeEach(async ({ page }) => {
    // Login as student
    await page.goto("/login")
    await page.fill('input[name="email"]', "student@students.edu.sg")
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')

    await page.waitForURL("/student/dashboard")
  })

  test("can view assigned case and start playing", async ({ page }) => {
    // Navigate to case list
    await page.goto("/student/cases")

    // Check case card is visible
    await expect(page.locator("text=Case 1: Missing School Mascot")).toBeVisible()

    // Click play button
    await page.click('text=Play Case')

    // Should be on game page
    await expect(page).toHaveURL(/\/cases\/.*\/play/)

    // Scene viewer should be visible
    await expect(page.locator(".scene-viewer")).toBeVisible()

    // Click on an object
    await page.click("#locker") // Interactive object

    // Clue should appear
    await expect(page.locator("text=Mysterious Note")).toBeVisible()
  })

  test("can navigate through scenes and reach quiz", async ({ page }) => {
    await page.goto("/student/cases/case-01/play")

    // Complete scene 1
    await page.click("#locker")
    await page.click("#schedule")
    await page.click("text=Next Scene")

    // Wait for scene 2 to load
    await expect(page.locator("text=Scene 2")).toBeVisible()

    // Complete scene 2
    // ... (interact with objects)

    // Navigate to quiz
    await page.click("text=Go to Quiz")

    // Should be on quiz page
    await expect(page).toHaveURL(/\/quiz/)
    await expect(page.locator("text=Question 1 of")).toBeVisible()
  })

  test("can answer quiz questions and submit", async ({ page }) => {
    await page.goto("/student/cases/case-01/quiz")

    // Answer question 1 (MCQ)
    await page.click('label:has-text("A Sports Day Prep Committee member")')

    // Next question
    await page.click("text=Next")

    // Answer question 2 (vocabulary)
    await page.click('label:has-text("Slightly open")')

    // Next question
    await page.click("text=Next")

    // Answer question 3 (open-ended)
    await page.fill(
      "textarea",
      "They took it to clean before Sports Day. Ahmad saw them with a big bag."
    )

    // Submit quiz
    await page.click("text=Submit Quiz")

    // Should see results page
    await expect(page).toHaveURL(/\/results/)
    await expect(page.locator("text=Your Score:")).toBeVisible()
    await expect(page.locator("text=%")).toBeVisible() // Score percentage
  })
})
```

### 10.4 Performance Testing

```typescript
// __tests__/performance/load-test.ts

import { test } from "@playwright/test"

test.describe("Load Testing", () => {
  test("handles 100 concurrent users on dashboard", async ({ browser }) => {
    const users = []

    // Simulate 100 concurrent users
    for (let i = 0; i < 100; i++) {
      const context = await browser.newContext()
      const page = await context.newPage()

      users.push(
        page.goto("/student/dashboard").then(() => {
          return page.waitForLoadState("networkidle")
        })
      )
    }

    const start = Date.now()
    await Promise.all(users)
    const duration = Date.now() - start

    console.log(`Load time for 100 users: ${duration}ms`)

    // Assert: All pages loaded within 10 seconds
    expect(duration).toBeLessThan(10000)
  })
})
```

### 10.5 Accessibility Testing

```typescript
// __tests__/accessibility/a11y.test.ts

import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.describe("Accessibility", () => {
  test("dashboard page has no accessibility violations", async ({ page }) => {
    await page.goto("/student/dashboard")

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test("case gameplay is keyboard accessible", async ({ page }) => {
    await page.goto("/student/cases/case-01/play")

    // Tab through interactive elements
    await page.keyboard.press("Tab")
    await page.keyboard.press("Tab")
    await page.keyboard.press("Tab")

    // Active element should be a clickable object
    const focusedElement = await page.evaluateHandle(() => document.activeElement)
    const tagName = await focusedElement.evaluate((el) => el.tagName)

    expect(["BUTTON", "A", "DIV"]).toContain(tagName)

    // Press Enter to interact
    await page.keyboard.press("Enter")

    // Clue should appear
    await expect(page.locator(".clue-modal")).toBeVisible()
  })
})
```

---

## 11. Deployment & Operations

### 11.1 Environment Variables

```bash
# .env.example

# App
NEXT_PUBLIC_APP_URL=https://detectivelearning.sg
NODE_ENV=production

# Database
DATABASE_URL="postgresql://user:password@host:5432/detective_learning?sslmode=require"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here-32-chars-min"
NEXTAUTH_URL="https://detectivelearning.sg"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# MOE SSO (Phase 2)
MOE_SAML_CERT="-----BEGIN CERTIFICATE-----..."
MOE_SSO_ENTRY_POINT="https://vle.learning.moe.edu.sg/saml/sso"

# File Storage
CLOUDFLARE_R2_ACCOUNT_ID="your-account-id"
CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-key"
CLOUDFLARE_R2_BUCKET_URL="https://pub-xxxxx.r2.dev"

# AI (Phase 2)
GEMINI_API_KEY="your-gemini-api-key"

# Email
RESEND_API_KEY="re_xxxxx"

# Monitoring
SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"

# Rate Limiting (Phase 2)
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# Security
CSRF_SECRET="your-csrf-secret-32-chars"
ENCRYPTION_KEY="your-encryption-key-64-hex-chars"
```

### 11.2 Deployment Checklist

```markdown
## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm run test`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Type-check passed (`npm run type-check`)
- [ ] Build successful (`npm run build`)

### Security
- [ ] Environment variables set in production
- [ ] HTTPS configured (SSL certificate)
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Database backups configured
- [ ] Audit logging enabled

### Performance
- [ ] Images optimized (WebP format)
- [ ] Code splitting implemented
- [ ] Database indexes created
- [ ] CDN configured for static assets
- [ ] Caching strategy implemented

### Compliance
- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] Parent consent mechanism tested
- [ ] PDPA compliance documented
- [ ] Data retention policy automated

### Monitoring
- [ ] Sentry error tracking configured
- [ ] Vercel Analytics enabled
- [ ] Database monitoring set up
- [ ] Uptime monitoring configured (UptimeRobot)
- [ ] Alert notifications tested (email/Slack)

### Documentation
- [ ] README.md updated with setup instructions
- [ ] API documentation generated
- [ ] User guides published (student, teacher)
- [ ] Architecture diagrams updated
```

### 11.3 Monitoring & Alerting

```typescript
// lib/monitoring.ts

import * as Sentry from "@sentry/nextjs"

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Custom error filtering
  beforeSend(event, hint) {
    const error = hint.originalException

    // Don't report client-side validation errors
    if (error instanceof ValidationError) {
      return null
    }

    // Add custom context
    event.contexts = {
      ...event.contexts,
      user: {
        id: event.user?.id,
        role: event.user?.role,
        schoolCode: event.user?.schoolCode,
      },
    }

    return event
  },
})

// Custom alerts
export async function sendAlert(type: AlertType, message: string, data?: any) {
  if (process.env.NODE_ENV === "production") {
    // Send to Slack webhook
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `🚨 ${type}: ${message}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${type}*: ${message}`,
            },
          },
          ...(data
            ? [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `\`\`\`${JSON.stringify(data, null, 2)}\`\`\``,
                  },
                },
              ]
            : []),
        ],
      }),
    })
  }

  // Also log to Sentry
  Sentry.captureMessage(message, {
    level: type === "ERROR" ? "error" : "warning",
    extra: data,
  })
}

type AlertType = "ERROR" | "WARNING" | "INFO"
```

### 11.4 Backup Strategy

```bash
# backup.sh - Automated daily backups

#!/bin/bash

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backups/$DATE"

# 1. Database backup
pg_dump $DATABASE_URL > "$BACKUP_DIR/database.sql"

# 2. Upload to S3
aws s3 cp "$BACKUP_DIR/database.sql" s3://detective-learning-backups/$DATE/

# 3. Keep last 30 days only
find /backups/* -type d -mtime +30 -exec rm -rf {} \;

# 4. Send success notification
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text":"✅ Daily backup completed: '"$DATE"'"}'
```

---

## 12. Appendices

### Appendix A: Database Schema Diagram (Detailed)

[See Section 4.1]

### Appendix B: API Endpoint Reference

[See Section 7.1]

### Appendix C: Error Codes

```typescript
export enum ErrorCode {
  // Authentication (1000-1999)
  UNAUTHORIZED = "AUTH_1001",
  INVALID_CREDENTIALS = "AUTH_1002",
  EMAIL_NOT_VERIFIED = "AUTH_1003",
  SESSION_EXPIRED = "AUTH_1004",
  INSUFFICIENT_PERMISSIONS = "AUTH_1005",

  // Validation (2000-2999)
  VALIDATION_ERROR = "VAL_2001",
  MISSING_REQUIRED_FIELD = "VAL_2002",
  INVALID_EMAIL = "VAL_2003",
  PASSWORD_TOO_WEAK = "VAL_2004",
  INVALID_UUID = "VAL_2005",

  // Resource (3000-3999)
  NOT_FOUND = "RES_3001",
  ALREADY_EXISTS = "RES_3002",
  CONFLICT = "RES_3003",

  // Business Logic (4000-4999)
  CASE_NOT_ASSIGNED = "BIZ_4001",
  QUIZ_ALREADY_SUBMITTED = "BIZ_4002",
  PARENT_CONSENT_REQUIRED = "BIZ_4003",
  CLASS_FULL = "BIZ_4004",

  // Rate Limiting (5000-5999)
  RATE_LIMIT_EXCEEDED = "RATE_5001",

  // External Services (6000-6999)
  EMAIL_SEND_FAILED = "EXT_6001",
  FILE_UPLOAD_FAILED = "EXT_6002",
  AI_API_ERROR = "EXT_6003",

  // Internal (9000-9999)
  INTERNAL_SERVER_ERROR = "INT_9001",
  DATABASE_ERROR = "INT_9002",
}
```

### Appendix D: Development Scripts

```json
// package.json scripts

{
  "scripts": {
    // Development
    "dev": "next dev",
    "dev:turbo": "next dev --turbo",

    // Building
    "build": "next build",
    "start": "next start",

    // Testing
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",

    // Linting & Formatting
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",

    // Type Checking
    "type-check": "tsc --noEmit",

    // Database
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",

    // Code Generation
    "generate": "prisma generate",

    // Pre-commit
    "pre-commit": "npm run lint && npm run type-check && npm run test",

    // Production
    "analyze": "ANALYZE=true next build"
  }
}
```

### Appendix E: Performance Benchmarks

```markdown
## Target Performance Metrics (MVP)

| Metric | Target | Actual (Pilot) |
|--------|--------|----------------|
| **Time to First Byte (TTFB)** | <200ms | TBD |
| **First Contentful Paint (FCP)** | <1.8s | TBD |
| **Largest Contentful Paint (LCP)** | <2.5s | TBD |
| **Cumulative Layout Shift (CLS)** | <0.1 | TBD |
| **First Input Delay (FID)** | <100ms | TBD |
| **Total Blocking Time (TBT)** | <200ms | TBD |

## Load Testing Results

| Scenario | Concurrent Users | Avg Response Time | 95th Percentile | Error Rate |
|----------|-----------------|-------------------|-----------------|------------|
| Dashboard Load | 100 | TBD | TBD | <1% |
| Case Gameplay | 100 | TBD | TBD | <1% |
| Quiz Submission | 50 | TBD | TBD | <0.5% |
```

### Appendix F: Browser Support Matrix

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | Latest 2 versions | ✅ Full support |
| Firefox | Latest 2 versions | ✅ Full support |
| Safari | Latest 2 versions | ✅ Full support |
| Edge | Latest 2 versions | ✅ Full support |
| Chrome (Android) | Latest | ✅ Full support (mobile) |
| Safari (iOS) | Latest 2 versions | ✅ Full support (mobile) |
| Samsung Internet | Latest | ✅ Full support |
| IE 11 | - | ❌ Not supported |

### Appendix G: Glossary of Technical Terms

| Term | Definition |
|------|------------|
| **Server Component** | React component rendered on server (Next.js 13+), reduces client JS |
| **Client Component** | React component rendered in browser, for interactivity |
| **SSR** | Server-Side Rendering (HTML generated on server per request) |
| **SSG** | Static Site Generation (HTML pre-built at build time) |
| **ISR** | Incremental Static Regeneration (SSG with periodic updates) |
| **Edge Runtime** | JavaScript runtime on CDN edge nodes (faster, closer to users) |
| **Prisma** | Type-safe ORM for database queries |
| **RLS** | Row-Level Security (database access control per row) |
| **JWT** | JSON Web Token (stateless authentication token) |
| **CORS** | Cross-Origin Resource Sharing (API access from different domains) |
| **CSRF** | Cross-Site Request Forgery (attack where malicious site sends requests) |
| **XSS** | Cross-Site Scripting (inject malicious scripts into web pages) |
| **PDPA** | Personal Data Protection Act (Singapore data privacy law) |
| **WCAG** | Web Content Accessibility Guidelines |

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2025-12-01 | olivermgs-TitanGS | Initial draft |
| 1.0 | 2025-12-01 | olivermgs-TitanGS | Complete FSD |

**Approval:**
- [ ] Technical Lead: _______________ Date: ______
- [ ] Product Owner: _______________ Date: ______

**Next Review Date:** 2026-03-01 (Quarterly review)

---

*End of Functional Specification Document*
