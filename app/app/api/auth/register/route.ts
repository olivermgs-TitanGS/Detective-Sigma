import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        hashedPassword,
        role: validatedData.role || 'STUDENT',
        studentProfile: validatedData.role === 'STUDENT' ? {
          create: {
            gradeLevel: validatedData.gradeLevel || 'P4',
            parentConsent: validatedData.parentConsent || false,
          },
        } : undefined,
        teacherProfile: validatedData.role === 'TEACHER' ? {
          create: {
            schoolName: validatedData.schoolName,
          },
        } : undefined,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.errors) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
