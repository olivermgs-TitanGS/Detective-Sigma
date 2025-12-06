# Detective Sigma - MVP Feature Tracker

**Document Version:** 1.0
**Created:** December 4, 2025
**Last Updated:** December 4, 2025
**Status:** Active Development

---

## Overview

This document tracks the implementation status of MVP features for Detective Sigma, comparing the Functional Specification Document (FSD) requirements against the current codebase.

### Status Legend

| Symbol | Meaning |
|--------|---------|
| [ ] | Not Started |
| [~] | In Progress |
| [P] | Partial Implementation |
| [x] | Complete |
| [—] | Deferred (Phase 2+) |

---

## 1. Authentication & User Management

### 1.1 Core Authentication
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 1.1.1 | Email/Password Login | HIGH | [x] | NextAuth credentials provider |
| 1.1.2 | Student Registration | HIGH | [x] | Form + API complete |
| 1.1.3 | Teacher Registration | HIGH | [x] | Form + API complete |
| 1.1.4 | Role-Based Redirects | HIGH | [x] | Redirects to role dashboards |
| 1.1.5 | Session Management | HIGH | [x] | JWT sessions, 2hr expiry |
| 1.1.6 | Auth Middleware | HIGH | [x] | Protects /student, /teacher, /admin |

### 1.2 Email & Verification
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 1.2.1 | Email Verification Flow | HIGH | [ ] | Token generation + verification page |
| 1.2.2 | Send Verification Email | HIGH | [ ] | Resend integration needed |
| 1.2.3 | Resend Verification | MEDIUM | [ ] | Allow resending verification |
| 1.2.4 | Parent Consent Email | HIGH | [ ] | Required for PDPA compliance |
| 1.2.5 | Password Reset Flow | MEDIUM | [ ] | Forgot password + reset token |

### 1.3 OAuth & Security
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 1.3.1 | Google OAuth | MEDIUM | [ ] | School domain restriction |
| 1.3.2 | Two-Factor Auth (2FA) | LOW | [—] | Phase 2 - for teachers/admins |
| 1.3.3 | Account Lockout | LOW | [ ] | After failed attempts |
| 1.3.4 | Data Retention Auto-Delete | LOW | [—] | Phase 2 |

---

## 2. Student Features

### 2.1 Dashboard
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 2.1.1 | Dashboard Statistics | HIGH | [x] | Cases, scores, clues, rank |
| 2.1.2 | Active Investigations | HIGH | [x] | In-progress cases list |
| 2.1.3 | Investigation History | HIGH | [x] | Completed cases with filters |
| 2.1.4 | Join Class via Code | HIGH | [ ] | Enter class code to join |

### 2.2 Case Library
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 2.2.1 | Case List View | HIGH | [x] | Manila folder UI |
| 2.2.2 | Filter by Subject | HIGH | [x] | Math, Science, Integrated |
| 2.2.3 | Filter by Difficulty | HIGH | [x] | Rookie to Chief |
| 2.2.4 | Case Status Badges | HIGH | [x] | Open, In Progress, Closed |
| 2.2.5 | Assigned Cases Section | MEDIUM | [ ] | Show teacher-assigned cases |

### 2.3 Gameplay
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 2.3.1 | Scene Viewer | HIGH | [x] | Background + hotspots |
| 2.3.2 | Clue Collection | HIGH | [x] | Click to collect clues |
| 2.3.3 | Clue Modal | HIGH | [x] | Details + animations |
| 2.3.4 | Puzzle System | HIGH | [x] | 4 puzzle types |
| 2.3.5 | Evidence Board | HIGH | [P] | View-only; needs drag-drop |
| 2.3.6 | Suspect Interrogation | HIGH | [P] | Basic dialog; needs branching |
| 2.3.7 | Scene Navigation | HIGH | [x] | Previous/Next buttons |
| 2.3.8 | Auto-Save (30s) | HIGH | [x] | Saves progress automatically |
| 2.3.9 | Save on Exit | HIGH | [x] | Manual save + exit |
| 2.3.10 | Timeline Builder | MEDIUM | [ ] | Drag-drop evidence sequencing |
| 2.3.11 | AI Hints | LOW | [—] | Phase 2 - Gemini integration |

### 2.4 Quiz System
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 2.4.1 | Quiz Page | HIGH | [x] | Questions from case puzzles |
| 2.4.2 | Multiple Choice Questions | HIGH | [x] | Standard MCQ support |
| 2.4.3 | Quiz Navigation | HIGH | [x] | Prev/Next, progress indicator |
| 2.4.4 | Quiz Submission | HIGH | [x] | Submit + scoring |
| 2.4.5 | Prevent Duplicate Submit | HIGH | [x] | One submission per case |
| 2.4.6 | Open-Ended Questions | MEDIUM | [ ] | Text input + keyword grading |
| 2.4.7 | Vocabulary Questions | MEDIUM | [ ] | Definition matching |
| 2.4.8 | Progress Dots Component | MEDIUM | [ ] | Visual quiz progress |

### 2.5 Results & Feedback
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 2.5.1 | Results Page | HIGH | [P] | Basic score display |
| 2.5.2 | Score Breakdown | HIGH | [ ] | Points per question |
| 2.5.3 | Skill Score Display | HIGH | [ ] | Performance by skill |
| 2.5.4 | Question Explanations | HIGH | [ ] | Show correct answers + why |
| 2.5.5 | Case Completion Badge | MEDIUM | [ ] | Visual achievement |
| 2.5.6 | Next Case Recommendation | LOW | [ ] | Based on performance |

### 2.6 Leaderboard
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 2.6.1 | Global Leaderboard | HIGH | [x] | Top 50 students |
| 2.6.2 | Medal Display | HIGH | [x] | Gold, silver, bronze |
| 2.6.3 | Class Leaderboard | MEDIUM | [ ] | Per-class ranking |

---

## 3. Teacher Features

### 3.1 Dashboard
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 3.1.1 | Dashboard Page | HIGH | [x] | Terminal theme UI |
| 3.1.2 | Statistics Overview | HIGH | [x] | Classes, students, completion |
| 3.1.3 | Quick Actions | HIGH | [x] | Create class, manage |
| 3.1.4 | Recent Activity Feed | MEDIUM | [ ] | Latest student activity |

### 3.2 Class Management
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 3.2.1 | Create Class | HIGH | [x] | Auto-generate join code |
| 3.2.2 | View Classes List | HIGH | [x] | All teacher's classes |
| 3.2.3 | Class Detail Page | HIGH | [P] | Basic view; needs enhancement |
| 3.2.4 | View Enrolled Students | HIGH | [P] | List exists; needs table |
| 3.2.5 | Remove Student from Class | MEDIUM | [ ] | Unenroll functionality |
| 3.2.6 | Edit Class Details | MEDIUM | [ ] | Rename, update settings |
| 3.2.7 | Delete Class | LOW | [ ] | With confirmation |

### 3.3 Case Assignment
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 3.3.1 | Assign Case to Class | HIGH | [ ] | Select case → assign to class |
| 3.3.2 | Assign Case to Student | MEDIUM | [ ] | Individual assignment |
| 3.3.3 | Set Due Date | MEDIUM | [ ] | Optional deadline |
| 3.3.4 | View Assigned Cases | HIGH | [ ] | List of assignments |
| 3.3.5 | Unassign Case | MEDIUM | [ ] | Remove assignment |

### 3.4 Student Progress Tracking
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 3.4.1 | Class Progress Overview | HIGH | [ ] | Aggregate class stats |
| 3.4.2 | Student Table Component | HIGH | [ ] | Sortable, filterable |
| 3.4.3 | Individual Student View | HIGH | [ ] | Detailed progress page |
| 3.4.4 | Skill Heatmap | MEDIUM | [ ] | Visual skill proficiency |
| 3.4.5 | Struggling Student Alerts | MEDIUM | [ ] | Flag below threshold |
| 3.4.6 | Skill Radar Chart | MEDIUM | [ ] | Per-student skill visual |

### 3.5 Reports & Export
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 3.5.1 | Reports Page | HIGH | [P] | Basic page exists |
| 3.5.2 | Export to Excel | HIGH | [ ] | ExcelJS integration |
| 3.5.3 | Export to CSV | MEDIUM | [ ] | Simple CSV download |
| 3.5.4 | Date Range Filter | MEDIUM | [ ] | Filter by time period |
| 3.5.5 | Print Report | LOW | [ ] | Print-friendly view |

---

## 4. Admin Features

### 4.1 Dashboard
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 4.1.1 | Dashboard Page | HIGH | [x] | Red security theme |
| 4.1.2 | System Statistics | HIGH | [x] | Cases, users, completions |
| 4.1.3 | Quick Actions | HIGH | [x] | Create case, manage |

### 4.2 Case Management
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 4.2.1 | Create Case | HIGH | [x] | Form-based creation |
| 4.2.2 | Edit Case Metadata | HIGH | [x] | Title, description, etc. |
| 4.2.3 | Scene Management | HIGH | [x] | Add/edit scenes |
| 4.2.4 | Clue Positioning | HIGH | [x] | Place clues on scenes |
| 4.2.5 | Puzzle Management | HIGH | [x] | Create/edit puzzles |
| 4.2.6 | Suspect Management | HIGH | [x] | Create suspects, set culprit |
| 4.2.7 | Publish Case | HIGH | [x] | Draft → Published |
| 4.2.8 | Quiz Question Management | HIGH | [ ] | Create/edit quiz questions |
| 4.2.9 | Delete Case | MEDIUM | [ ] | With confirmation |
| 4.2.10 | Duplicate Case | LOW | [ ] | Clone existing case |
| 4.2.11 | Content Versioning | LOW | [—] | Phase 2 |

### 4.3 AI Case Generation
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 4.3.1 | Generate Case Page | HIGH | [x] | Parameter selection |
| 4.3.2 | Generated Content Preview | HIGH | [x] | Review before save |
| 4.3.3 | Save Generated Case | HIGH | [x] | Save as draft |
| 4.3.4 | Curriculum Alignment | MEDIUM | [x] | Syllabus-based generation |

### 4.4 User Management
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 4.4.1 | User List Page | HIGH | [x] | View all users |
| 4.4.2 | Filter by Role | HIGH | [x] | Student/Teacher/Admin |
| 4.4.3 | User Detail View | MEDIUM | [ ] | Individual user page |
| 4.4.4 | Edit User | MEDIUM | [ ] | Update user details |
| 4.4.5 | Deactivate User | MEDIUM | [ ] | Soft delete |
| 4.4.6 | Promote to Teacher/Admin | LOW | [ ] | Role upgrade |

### 4.5 Bulk Operations
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 4.5.1 | Bulk Import Page | MEDIUM | [P] | Page exists, not functional |
| 4.5.2 | Import Users CSV | MEDIUM | [ ] | Bulk user creation |
| 4.5.3 | Import Cases CSV | LOW | [ ] | Bulk case creation |
| 4.5.4 | Export Users | LOW | [ ] | Download user list |

### 4.6 System Administration
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 4.6.1 | Audit Log Viewer | MEDIUM | [ ] | View system audit logs |
| 4.6.2 | System Settings Page | LOW | [ ] | Global configuration |
| 4.6.3 | Database Cleanup | LOW | [x] | Cleanup utilities exist |

---

## 5. API Endpoints

### 5.1 Authentication APIs
| # | Endpoint | Method | Priority | Status |
|---|----------|--------|----------|--------|
| 5.1.1 | `/api/auth/[...nextauth]` | GET/POST | HIGH | [x] |
| 5.1.2 | `/api/auth/register/student` | POST | HIGH | [x] |
| 5.1.3 | `/api/auth/register/teacher` | POST | HIGH | [x] |
| 5.1.4 | `/api/auth/verify-email` | POST | HIGH | [ ] |
| 5.1.5 | `/api/auth/send-parent-consent` | POST | HIGH | [ ] |
| 5.1.6 | `/api/auth/reset-password` | POST | MEDIUM | [ ] |
| 5.1.7 | `/api/auth/resend-verification` | POST | MEDIUM | [ ] |

### 5.2 Case & Game APIs
| # | Endpoint | Method | Priority | Status |
|---|----------|--------|----------|--------|
| 5.2.1 | `/api/cases` | GET | HIGH | [x] |
| 5.2.2 | `/api/cases` | POST | HIGH | [x] |
| 5.2.3 | `/api/cases/[caseId]` | GET | HIGH | [x] |
| 5.2.4 | `/api/cases/[caseId]/quiz` | GET | HIGH | [ ] |
| 5.2.5 | `/api/progress` | GET/POST | HIGH | [x] |
| 5.2.6 | `/api/quiz` | GET/POST | HIGH | [x] |
| 5.2.7 | `/api/hints` | POST | LOW | [—] |

### 5.3 Dashboard & Reports APIs
| # | Endpoint | Method | Priority | Status |
|---|----------|--------|----------|--------|
| 5.3.1 | `/api/dashboard` | GET | HIGH | [x] |
| 5.3.2 | `/api/leaderboard` | GET | HIGH | [x] |
| 5.3.3 | `/api/students/[id]/progress` | GET | HIGH | [ ] |
| 5.3.4 | `/api/classes/[id]/export` | GET | HIGH | [ ] |

### 5.4 Teacher APIs
| # | Endpoint | Method | Priority | Status |
|---|----------|--------|----------|--------|
| 5.4.1 | `/api/classes` | GET/POST | HIGH | [P] |
| 5.4.2 | `/api/classes/[id]` | GET/PUT/DELETE | HIGH | [ ] |
| 5.4.3 | `/api/classes/[id]/students` | GET | HIGH | [ ] |
| 5.4.4 | `/api/classes/join` | POST | HIGH | [ ] |
| 5.4.5 | `/api/assignments` | GET/POST | HIGH | [ ] |
| 5.4.6 | `/api/assignments/[id]` | DELETE | MEDIUM | [ ] |

### 5.5 Admin APIs
| # | Endpoint | Method | Priority | Status |
|---|----------|--------|----------|--------|
| 5.5.1 | `/api/admin/generate` | POST | HIGH | [x] |
| 5.5.2 | `/api/admin/generate/save` | POST | HIGH | [x] |
| 5.5.3 | `/api/admin/cases/[id]/publish` | POST | HIGH | [x] |
| 5.5.4 | `/api/admin/scenes` | POST | HIGH | [x] |
| 5.5.5 | `/api/admin/clues` | POST | HIGH | [x] |
| 5.5.6 | `/api/admin/puzzles` | POST | HIGH | [x] |
| 5.5.7 | `/api/admin/suspects` | POST | HIGH | [x] |
| 5.5.8 | `/api/admin/quiz-questions` | POST | HIGH | [ ] |
| 5.5.9 | `/api/admin/users` | GET | MEDIUM | [ ] |
| 5.5.10 | `/api/admin/users/[id]` | GET/PUT | MEDIUM | [ ] |
| 5.5.11 | `/api/admin/audit-logs` | GET | MEDIUM | [ ] |

---

## 6. UI Components

| # | Component | Location | Priority | Status |
|---|-----------|----------|----------|--------|
| 6.1 | ProgressDots | `/components/ui/` | MEDIUM | [ ] |
| 6.2 | StudentTable | `/components/dashboard/` | HIGH | [ ] |
| 6.3 | ClassStats | `/components/dashboard/` | HIGH | [ ] |
| 6.4 | SkillHeatmap | `/components/dashboard/` | MEDIUM | [ ] |
| 6.5 | SkillRadarChart | `/components/dashboard/` | MEDIUM | [ ] |
| 6.6 | TimelineBuilder | `/components/game/` | MEDIUM | [ ] |
| 6.7 | AssignCaseForm | `/components/forms/` | HIGH | [ ] |
| 6.8 | JoinClassForm | `/components/forms/` | HIGH | [ ] |
| 6.9 | QuizResultsCard | `/components/game/` | HIGH | [ ] |

---

## 7. Security & Infrastructure

| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 7.1 | Row-Level Security (RLS) | MEDIUM | [—] | Phase 2 - DB policies |
| 7.2 | Rate Limiting | MEDIUM | [ ] | API rate limits |
| 7.3 | Input Sanitization | HIGH | [P] | Zod validation exists |
| 7.4 | CSRF Protection | MEDIUM | [P] | NextAuth handles some |
| 7.5 | Audit Logging | HIGH | [x] | AuditLog model + writes |
| 7.6 | Error Tracking (Sentry) | LOW | [ ] | Production monitoring |

---

## Summary Statistics

### By Priority
| Priority | Total | Complete | Partial | Not Started | Deferred |
|----------|-------|----------|---------|-------------|----------|
| HIGH | 78 | 42 | 8 | 28 | 0 |
| MEDIUM | 45 | 3 | 2 | 36 | 4 |
| LOW | 18 | 1 | 0 | 12 | 5 |

### By Category
| Category | Total | Complete | Partial | Not Started |
|----------|-------|----------|---------|-------------|
| Authentication | 14 | 6 | 0 | 6 |
| Student Features | 32 | 20 | 4 | 8 |
| Teacher Features | 24 | 5 | 3 | 16 |
| Admin Features | 22 | 14 | 1 | 7 |
| APIs | 30 | 16 | 1 | 13 |
| UI Components | 9 | 0 | 0 | 9 |
| Security | 6 | 1 | 2 | 2 |

---

## Next Sprint Recommendations

### Sprint 1: Core MVP Completion
1. [ ] Email verification flow (1.2.1, 1.2.2)
2. [ ] Student join class via code (2.1.4, 5.4.4)
3. [ ] Results page with explanations (2.5.2, 2.5.3, 2.5.4)
4. [ ] Quiz question management (4.2.8)
5. [ ] Case assignment UI (3.3.1, 3.3.4)

### Sprint 2: Teacher Features
6. [ ] Student table component (6.2)
7. [ ] Class detail page enhancement (3.2.3)
8. [ ] Individual student view (3.4.3)
9. [ ] Export to Excel (3.5.2)
10. [ ] Class progress overview (3.4.1)

### Sprint 3: Polish & Security
11. [ ] Parent consent email (1.2.4)
12. [ ] Password reset flow (1.2.5)
13. [ ] Rate limiting (7.2)
14. [ ] Audit log viewer (4.6.1)
15. [ ] Google OAuth (1.3.1)

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-12-04 | 1.0 | Initial document creation | Claude |

---

*This document should be updated as features are implemented. Mark items as [~] when work begins, and [x] when complete.*
