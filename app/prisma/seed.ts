import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo users
  const studentPassword = await bcrypt.hash('student123', 12);
  const teacherPassword = await bcrypt.hash('teacher123', 12);
  const adminPassword = await bcrypt.hash('admin123', 12);

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      username: 'demo_student',
      hashedPassword: studentPassword,
      role: 'STUDENT',
      studentProfile: {
        create: {
          gradeLevel: 'P5',
          parentConsent: true,
        },
      },
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      username: 'demo_teacher',
      hashedPassword: teacherPassword,
      role: 'TEACHER',
      teacherProfile: {
        create: {
          schoolName: 'Sunrise Primary School',
        },
      },
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      hashedPassword: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Created demo users');

  // Create demo cases
  const case1 = await prisma.case.create({
    data: {
      title: 'The Missing Canteen Money',
      description: `$50 missing from the school canteen register. Can you solve this mystery?

It's a typical Monday morning at Sunrise Primary School. Mrs. Tan, the canteen manager, arrives to find something shocking: $50 is missing from yesterday's register!

The canteen had a busy day on Friday, with lunch and recess sales. The money should have been locked in the cash box, but when Mrs. Tan counted it this morning, she found $50 less than expected.

Three people had access to the canteen after school hours: the cleaner (Mr. Lim), the science teacher (Miss Chen), and a student helper (Alex). Each has an alibi, but the numbers don't add up.

Your mission: Investigate the canteen, collect clues, solve puzzles, and figure out what really happened to the missing money!`,
      subject: 'Mathematics',
      difficulty: 'ROOKIE',
      subjectFocus: 'MATH',
      estimatedMinutes: 30,
      coverImage: '💰',
      learningObjectives: {
        primary: 'Apply addition and subtraction with money',
        secondary: [
          'Understand time calculations',
          'Analyze data from receipts',
          'Practice problem-solving with real-world scenarios',
        ],
      },
      skillsAssessed: {
        problem_solving: 40,
        computation: 30,
        data_analysis: 30,
      },
      status: 'PUBLISHED',
      scenes: {
        create: [
          {
            name: 'School Canteen',
            description: 'The bustling canteen where the money went missing',
            imageUrl: '/scenes/canteen.jpg',
            orderIndex: 1,
            isInitialScene: true,
            clues: {
              create: [
                {
                  name: 'Cash Register Receipt',
                  description: 'A receipt from Friday showing total sales',
                  positionX: 30,
                  positionY: 40,
                  contentRevealed: 'The receipt shows Friday\'s total sales were $450. Mrs. Tan counted $400 in the cash box.',
                },
                {
                  name: 'Time Log Book',
                  description: 'Sign-in times for staff and helpers',
                  positionX: 50,
                  positionY: 60,
                  contentRevealed: 'Mr. Lim signed in at 6:00 PM. Alex left at 5:45 PM. Miss Chen came at 6:30 PM.',
                },
              ],
            },
          },
          {
            name: 'Kitchen Storage',
            description: 'The staff kitchen where supplies are kept',
            imageUrl: '/scenes/kitchen.jpg',
            orderIndex: 2,
            clues: {
              create: [
                {
                  name: 'Staff Schedule',
                  description: 'Weekly schedule showing who worked Friday',
                  positionX: 25,
                  positionY: 35,
                  contentRevealed: 'Only Alex was scheduled to close the canteen on Friday.',
                },
              ],
            },
          },
          {
            name: 'School Office',
            description: 'The administrative office',
            imageUrl: '/scenes/office.jpg',
            orderIndex: 3,
            clues: {
              create: [
                {
                  name: 'Alex\'s Locker',
                  description: 'Student helper lockers',
                  positionX: 40,
                  positionY: 50,
                  contentRevealed: 'Alex\'s locker contains $50 in cash!',
                },
                {
                  name: 'Confession Letter',
                  description: 'A handwritten note',
                  positionX: 60,
                  positionY: 30,
                  contentRevealed: 'Alex wrote: "I needed money for my mother\'s medicine. I\'m sorry."',
                },
              ],
            },
          },
        ],
      },
      puzzles: {
        create: [
          {
            title: 'Calculate the Missing Money',
            type: 'MATH_WORD',
            questionText: 'If total sales were $450 and Mrs. Tan counted $400, how much money is missing?',
            correctAnswer: '50',
            hint: 'Subtract: $450 - $400 = ?',
            points: 10,
          },
          {
            title: 'Time Problem',
            type: 'MATH_WORD',
            questionText: 'If Alex left at 5:45 PM and Mr. Lim arrived at 6:00 PM, how many minutes was the canteen unsupervised?',
            correctAnswer: '15',
            hint: 'Calculate the time difference between 5:45 PM and 6:00 PM.',
            points: 10,
          },
        ],
      },
      suspects: {
        create: [
          {
            name: 'Mr. Lim',
            role: 'School Cleaner',
            bio: 'Has worked at the school for 10 years. Very reliable.',
            isCulprit: false,
            imageUrl: '🧹',
          },
          {
            name: 'Miss Chen',
            role: 'Science Teacher',
            bio: 'New teacher, started 6 months ago.',
            isCulprit: false,
            imageUrl: '👩‍🔬',
          },
          {
            name: 'Alex',
            role: 'Student Helper',
            bio: 'P6 student, helps in canteen 3 times a week.',
            isCulprit: true,
            imageUrl: '👨‍🎓',
          },
        ],
      },
    },
  });

  console.log('✅ Created case: The Missing Canteen Money');

  console.log('🎉 Seeding completed!');
  console.log('\n📧 Demo Accounts:');
  console.log('Student: student@example.com / student123');
  console.log('Teacher: teacher@example.com / teacher123');
  console.log('Admin: admin@example.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
