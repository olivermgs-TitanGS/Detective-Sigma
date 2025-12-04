import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const studentRegisterSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  gradeLevel: z.enum(['P4', 'P5', 'P6'], {
    errorMap: () => ({ message: 'Grade level must be P4, P5, or P6' }),
  }),
  parentConsent: z.boolean().refine((val) => val === true, {
    message: 'Parent consent is required',
  }),
});

export const teacherRegisterSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  schoolName: z.string().optional(),
});

// Combined register schema for generic registration endpoint
export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'TEACHER']).optional().default('STUDENT'),
  gradeLevel: z.string().optional(),
  parentConsent: z.boolean().optional(),
  schoolName: z.string().optional(),
});

// Password reset request schema
export const requestPasswordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Password reset confirmation schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;
export type TeacherRegisterInput = z.infer<typeof teacherRegisterSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
