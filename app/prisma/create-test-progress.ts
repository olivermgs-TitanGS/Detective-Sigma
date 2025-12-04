import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🧪 Creating test progress data...');

  // Get demo student
  const student = await prisma.user.findUnique({
    where: { email: 'student@example.com' },
  });

  // Get the case
  const case1 = await prisma.case.findFirst();

  if (!student) {
    console.error('❌ Student not found. Run npm run db:seed first');
    return;
  }

  if (!case1) {
    console.error('❌ Case not found. Run npm run db:seed first');
    return;
  }

  // Check if progress already exists
  const existing = await prisma.progress.findUnique({
    where: {
      userId_caseId: {
        userId: student.id,
        caseId: case1.id,
      },
    },
  });

  if (existing) {
    console.log('⚠️  Progress already exists, updating...');
    await prisma.progress.update({
      where: { id: existing.id },
      data: {
        status: 'IN_PROGRESS',
        score: 75,
        currentSceneIndex: 2,
        cluesCollected: ['clue-1', 'clue-2', 'clue-3'],
        puzzlesSolved: ['puzzle-1'],
        startedAt: existing.startedAt || new Date(),
      },
    });
  } else {
    // Create progress record
    await prisma.progress.create({
      data: {
        userId: student.id,
        caseId: case1.id,
        status: 'IN_PROGRESS',
        score: 75,
        currentSceneIndex: 2,
        cluesCollected: ['clue-1', 'clue-2', 'clue-3'],
        puzzlesSolved: ['puzzle-1'],
        startedAt: new Date(),
      },
    });
  }

  console.log('✅ Test progress created/updated');
  console.log('📊 Student now has:');
  console.log('   - Score: 75 points');
  console.log('   - Clues: 3 collected');
  console.log('   - Status: IN_PROGRESS');
  console.log('');
  console.log('🔐 Login with: student@example.com / student123');
  console.log('🌐 Visit: http://localhost:3007/student/dashboard');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
