-- ===========================================================================
-- Detective Sigma - Row-Level Security (RLS) Policies
-- ===========================================================================
-- These policies should be applied AFTER running Prisma migrations.
-- They enforce data access at the database level for defense in depth.
--
-- Prerequisites:
-- 1. PostgreSQL database
-- 2. Application must set session variables for user context:
--    SET app.current_user_id = '<user_id>';
--    SET app.current_user_role = '<role>';
-- ===========================================================================

-- ===========================================================================
-- HELPER FUNCTIONS
-- ===========================================================================

-- Function to get current user ID from session
CREATE OR REPLACE FUNCTION current_user_id() RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('app.current_user_id', TRUE), '')::TEXT;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to get current user role from session
CREATE OR REPLACE FUNCTION current_user_role() RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('app.current_user_role', TRUE), '')::TEXT;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT current_user_role() = 'ADMIN';
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to check if current user is teacher
CREATE OR REPLACE FUNCTION is_teacher() RETURNS BOOLEAN AS $$
  SELECT current_user_role() IN ('TEACHER', 'ADMIN');
$$ LANGUAGE SQL SECURITY DEFINER;

-- ===========================================================================
-- ENABLE RLS ON TABLES
-- ===========================================================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StudentProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeacherProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Class" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClassMembership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Progress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuizSubmission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CaseAssignment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SkillAssessment" ENABLE ROW LEVEL SECURITY;

-- Cases, Scenes, Clues, Suspects, Puzzles are content - typically read-only for students
-- but managed by teachers/admins, so RLS is simpler
ALTER TABLE "Case" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Scene" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Clue" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Suspect" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Puzzle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Quiz" ENABLE ROW LEVEL SECURITY;

-- Audit logs should only be readable by admins
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- ===========================================================================
-- USER TABLE POLICIES
-- ===========================================================================

-- Users can view their own profile
CREATE POLICY user_select_own ON "User"
  FOR SELECT
  USING (id = current_user_id() OR is_admin());

-- Users can update their own profile (not role or ID)
CREATE POLICY user_update_own ON "User"
  FOR UPDATE
  USING (id = current_user_id() AND NOT is_admin())
  WITH CHECK (id = current_user_id());

-- Admins can view all users
CREATE POLICY user_select_admin ON "User"
  FOR SELECT
  USING (is_admin());

-- Admins can update any user
CREATE POLICY user_update_admin ON "User"
  FOR UPDATE
  USING (is_admin());

-- Only system can insert users (via registration endpoint)
-- This would typically be handled by a service role, not RLS

-- ===========================================================================
-- STUDENT PROFILE POLICIES
-- ===========================================================================

-- Students can view their own profile
CREATE POLICY student_profile_select_own ON "StudentProfile"
  FOR SELECT
  USING ("userId" = current_user_id());

-- Teachers can view profiles of students in their classes
CREATE POLICY student_profile_select_teacher ON "StudentProfile"
  FOR SELECT
  USING (
    is_teacher() AND EXISTS (
      SELECT 1 FROM "ClassMembership" cm
      JOIN "Class" c ON cm."classId" = c.id
      JOIN "TeacherProfile" tp ON c."teacherId" = tp.id
      WHERE cm."studentId" = "StudentProfile"."userId"
      AND tp."userId" = current_user_id()
    )
  );

-- Admins can view all student profiles
CREATE POLICY student_profile_select_admin ON "StudentProfile"
  FOR SELECT
  USING (is_admin());

-- Students can update their own profile
CREATE POLICY student_profile_update_own ON "StudentProfile"
  FOR UPDATE
  USING ("userId" = current_user_id())
  WITH CHECK ("userId" = current_user_id());

-- ===========================================================================
-- TEACHER PROFILE POLICIES
-- ===========================================================================

-- Teachers can view their own profile
CREATE POLICY teacher_profile_select_own ON "TeacherProfile"
  FOR SELECT
  USING ("userId" = current_user_id());

-- Admins can view all teacher profiles
CREATE POLICY teacher_profile_select_admin ON "TeacherProfile"
  FOR SELECT
  USING (is_admin());

-- Teachers can update their own profile
CREATE POLICY teacher_profile_update_own ON "TeacherProfile"
  FOR UPDATE
  USING ("userId" = current_user_id())
  WITH CHECK ("userId" = current_user_id());

-- ===========================================================================
-- CLASS POLICIES
-- ===========================================================================

-- Teachers can view their own classes
CREATE POLICY class_select_teacher ON "Class"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "TeacherProfile" tp
      WHERE tp.id = "Class"."teacherId"
      AND tp."userId" = current_user_id()
    )
  );

-- Students can view classes they're members of
CREATE POLICY class_select_student ON "Class"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "ClassMembership" cm
      WHERE cm."classId" = "Class".id
      AND cm."studentId" = current_user_id()
    )
  );

-- Admins can view all classes
CREATE POLICY class_select_admin ON "Class"
  FOR SELECT
  USING (is_admin());

-- Teachers can create classes (insert handled by checking teacher role)
CREATE POLICY class_insert_teacher ON "Class"
  FOR INSERT
  WITH CHECK (is_teacher());

-- Teachers can update their own classes
CREATE POLICY class_update_teacher ON "Class"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "TeacherProfile" tp
      WHERE tp.id = "Class"."teacherId"
      AND tp."userId" = current_user_id()
    )
  );

-- Teachers can delete their own classes
CREATE POLICY class_delete_teacher ON "Class"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "TeacherProfile" tp
      WHERE tp.id = "Class"."teacherId"
      AND tp."userId" = current_user_id()
    )
  );

-- ===========================================================================
-- CLASS MEMBERSHIP POLICIES
-- ===========================================================================

-- Students can view their own memberships
CREATE POLICY membership_select_student ON "ClassMembership"
  FOR SELECT
  USING ("studentId" = current_user_id());

-- Teachers can view memberships for their classes
CREATE POLICY membership_select_teacher ON "ClassMembership"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Class" c
      JOIN "TeacherProfile" tp ON c."teacherId" = tp.id
      WHERE c.id = "ClassMembership"."classId"
      AND tp."userId" = current_user_id()
    )
  );

-- Admins can view all memberships
CREATE POLICY membership_select_admin ON "ClassMembership"
  FOR SELECT
  USING (is_admin());

-- Students can join classes (insert own membership)
CREATE POLICY membership_insert_student ON "ClassMembership"
  FOR INSERT
  WITH CHECK ("studentId" = current_user_id());

-- Students can leave classes (delete own membership)
CREATE POLICY membership_delete_student ON "ClassMembership"
  FOR DELETE
  USING ("studentId" = current_user_id());

-- Teachers can remove students from their classes
CREATE POLICY membership_delete_teacher ON "ClassMembership"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "Class" c
      JOIN "TeacherProfile" tp ON c."teacherId" = tp.id
      WHERE c.id = "ClassMembership"."classId"
      AND tp."userId" = current_user_id()
    )
  );

-- ===========================================================================
-- PROGRESS POLICIES
-- ===========================================================================

-- Students can view their own progress
CREATE POLICY progress_select_student ON "Progress"
  FOR SELECT
  USING ("userId" = current_user_id());

-- Teachers can view progress of students in their classes
CREATE POLICY progress_select_teacher ON "Progress"
  FOR SELECT
  USING (
    is_teacher() AND EXISTS (
      SELECT 1 FROM "ClassMembership" cm
      JOIN "Class" c ON cm."classId" = c.id
      JOIN "TeacherProfile" tp ON c."teacherId" = tp.id
      WHERE cm."studentId" = "Progress"."userId"
      AND tp."userId" = current_user_id()
    )
  );

-- Admins can view all progress
CREATE POLICY progress_select_admin ON "Progress"
  FOR SELECT
  USING (is_admin());

-- Students can create and update their own progress
CREATE POLICY progress_insert_student ON "Progress"
  FOR INSERT
  WITH CHECK ("userId" = current_user_id());

CREATE POLICY progress_update_student ON "Progress"
  FOR UPDATE
  USING ("userId" = current_user_id())
  WITH CHECK ("userId" = current_user_id());

-- ===========================================================================
-- QUIZ SUBMISSION POLICIES
-- ===========================================================================

-- Students can view their own submissions
CREATE POLICY quiz_submission_select_student ON "QuizSubmission"
  FOR SELECT
  USING ("userId" = current_user_id());

-- Teachers can view submissions from their students
CREATE POLICY quiz_submission_select_teacher ON "QuizSubmission"
  FOR SELECT
  USING (
    is_teacher() AND EXISTS (
      SELECT 1 FROM "ClassMembership" cm
      JOIN "Class" c ON cm."classId" = c.id
      JOIN "TeacherProfile" tp ON c."teacherId" = tp.id
      WHERE cm."studentId" = "QuizSubmission"."userId"
      AND tp."userId" = current_user_id()
    )
  );

-- Admins can view all submissions
CREATE POLICY quiz_submission_select_admin ON "QuizSubmission"
  FOR SELECT
  USING (is_admin());

-- Students can create their own submissions
CREATE POLICY quiz_submission_insert_student ON "QuizSubmission"
  FOR INSERT
  WITH CHECK ("userId" = current_user_id());

-- ===========================================================================
-- CONTENT POLICIES (Case, Scene, Clue, Suspect, Puzzle, Quiz)
-- ===========================================================================

-- Everyone can view published cases
CREATE POLICY case_select_published ON "Case"
  FOR SELECT
  USING (status = 'PUBLISHED' OR is_teacher());

-- Teachers/admins can view all cases (including drafts)
CREATE POLICY case_select_teacher ON "Case"
  FOR SELECT
  USING (is_teacher());

-- Teachers can create cases
CREATE POLICY case_insert_teacher ON "Case"
  FOR INSERT
  WITH CHECK (is_teacher());

-- Teachers can update cases (in production, add ownership check)
CREATE POLICY case_update_teacher ON "Case"
  FOR UPDATE
  USING (is_teacher());

-- Similar policies for related content (Scene, Clue, etc.)
-- These inherit from Case access since they're linked via caseId

CREATE POLICY scene_select ON "Scene"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Case" c
      WHERE c.id = "Scene"."caseId"
      AND (c.status = 'PUBLISHED' OR is_teacher())
    )
  );

CREATE POLICY clue_select ON "Clue"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Scene" s
      JOIN "Case" c ON c.id = s."caseId"
      WHERE s.id = "Clue"."sceneId"
      AND (c.status = 'PUBLISHED' OR is_teacher())
    )
  );

CREATE POLICY suspect_select ON "Suspect"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Case" c
      WHERE c.id = "Suspect"."caseId"
      AND (c.status = 'PUBLISHED' OR is_teacher())
    )
  );

CREATE POLICY puzzle_select ON "Puzzle"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Case" c
      WHERE c.id = "Puzzle"."caseId"
      AND (c.status = 'PUBLISHED' OR is_teacher())
    )
  );

CREATE POLICY quiz_select ON "Quiz"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Case" c
      WHERE c.id = "Quiz"."caseId"
      AND (c.status = 'PUBLISHED' OR is_teacher())
    )
  );

-- ===========================================================================
-- AUDIT LOG POLICIES
-- ===========================================================================

-- Only admins can read audit logs
CREATE POLICY audit_log_select_admin ON "AuditLog"
  FOR SELECT
  USING (is_admin());

-- System inserts audit logs (typically via service role, not user context)
-- In practice, you'd use a privileged connection for audit writes

-- ===========================================================================
-- SKILL ASSESSMENT POLICIES
-- ===========================================================================

-- Students can view their own assessments
CREATE POLICY skill_select_student ON "SkillAssessment"
  FOR SELECT
  USING ("userId" = current_user_id());

-- Teachers can view assessments for their students
CREATE POLICY skill_select_teacher ON "SkillAssessment"
  FOR SELECT
  USING (
    is_teacher() AND EXISTS (
      SELECT 1 FROM "ClassMembership" cm
      JOIN "Class" c ON cm."classId" = c.id
      JOIN "TeacherProfile" tp ON c."teacherId" = tp.id
      WHERE cm."studentId" = "SkillAssessment"."userId"
      AND tp."userId" = current_user_id()
    )
  );

-- Admins can view all assessments
CREATE POLICY skill_select_admin ON "SkillAssessment"
  FOR SELECT
  USING (is_admin());

-- ===========================================================================
-- BYPASS POLICIES FOR SERVICE ROLE
-- ===========================================================================
-- Note: Create a separate database role for service operations
-- that bypasses RLS when needed (e.g., for migrations, batch jobs)

-- CREATE ROLE service_role;
-- ALTER TABLE "User" FORCE ROW LEVEL SECURITY;
-- GRANT BYPASS RLS TO service_role;

-- ===========================================================================
-- IMPLEMENTATION NOTES
-- ===========================================================================
--
-- 1. To use RLS with Prisma, set session variables before queries:
--
--    await prisma.$executeRaw`
--      SET app.current_user_id = ${userId};
--      SET app.current_user_role = ${userRole};
--    `;
--
-- 2. Consider using Prisma middleware to automatically set these:
--
--    prisma.$use(async (params, next) => {
--      if (currentUser) {
--        await prisma.$executeRaw`SET app.current_user_id = ${currentUser.id}`;
--        await prisma.$executeRaw`SET app.current_user_role = ${currentUser.role}`;
--      }
--      return next(params);
--    });
--
-- 3. For better performance, consider using connection pooling with
--    separate pools for different roles.
--
-- 4. Test all policies thoroughly before deploying to production!
--
-- ===========================================================================
