import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { studentRegisterSchema } from '@/lib/validations/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = studentRegisterSchema.parse(body);

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
    const hashedPassword = await hash(validatedData.password, 10);

    // Create user with student profile in a transaction
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        hashedPassword,
        role: 'STUDENT',
        studentProfile: {
          create: {
            gradeLevel: validatedData.gradeLevel,
            parentConsent: validatedData.parentConsent,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    // Log registration in audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: 'STUDENT_REGISTER',
        entityType: 'User',
        entityId: user.id,
        details: {
          gradeLevel: validatedData.gradeLevel,
          registeredAt: new Date().toISOString(),
        },
      },
    });

    // Return success (don't return password)
    return NextResponse.json(
      {
        success: true,
        message: 'Student account created successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Student registration error:', error);

    // Handle validation errors
    if (error.errors) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create student account' },
      { status: 500 }
    );
  }
}
