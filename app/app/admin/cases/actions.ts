'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function togglePublishCase(caseId: string) {
  const currentCase = await prisma.case.findUnique({
    where: { id: caseId },
    select: { status: true },
  });

  if (!currentCase) {
    throw new Error('Case not found');
  }

  const newStatus = currentCase.status === 'DRAFT' ? 'PUBLISHED' : 'DRAFT';

  await prisma.case.update({
    where: { id: caseId },
    data: { status: newStatus },
  });

  revalidatePath('/admin/cases');
  revalidatePath('/student/cases');

  return { status: newStatus };
}

export async function deleteCase(caseId: string) {
  await prisma.case.delete({
    where: { id: caseId },
  });

  revalidatePath('/admin/cases');
  revalidatePath('/student/cases');
}
