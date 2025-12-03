import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const studentRegisterSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address').endsWith('@students.edu.sg', 'Must use school email'),
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
  email: z.string().email('Invalid email address').endsWith('@moe.edu.sg', 'Must use MOE email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  schoolName: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;
export type TeacherRegisterInput = z.infer<typeof teacherRegisterSchema>;
