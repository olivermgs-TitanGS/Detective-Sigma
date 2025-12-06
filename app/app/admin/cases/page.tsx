import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { togglePublishCase } from './actions';
import { DeleteCaseButton } from './DeleteCaseButton';

// Force dynamic rendering - this page requires database access
export const dynamic = 'force-dynamic';

const difficultyColors: Record<string, string> = {
  ROOKIE: 'bg-green-600',
  INSPECTOR: 'bg-yellow-600',
  DETECTIVE: 'bg-orange-600',
  CHIEF: 'bg-red-600',
};

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-green-600',
  DRAFT: 'bg-gray-600',
};

async function getCases() {
  const cases = await prisma.case.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      subjectFocus: true,
      difficulty: true,
      status: true,
      createdAt: true,
      estimatedMinutes: true,
      _count: {
        select: {
          scenes: true,
          puzzles: true,
          suspects: true,
        },
      },
    },
  });
  return cases;
}

export default async function CasesListPage() {
  const cases = await getCases();

  const publishedCount = cases.filter((c) => c.status === 'PUBLISHED').length;
  const draftCount = cases.filter((c) => c.status === 'DRAFT').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Case Management</h1>
          <p className="text-red-200 text-lg">Create, edit, and manage detective cases</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/generate"
            className="bg-amber-600 hover:bg-amber-500 text-black px-6 py-3 transition-colors font-semibold flex items-center gap-2"
          >
            <span>Generate Case</span>
          </Link>
          <Link
            href="/admin/cases/create"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 transition-colors font-semibold flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>Create Manual</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/60 backdrop-blur-sm border border-red-500/20 p-6">
          <div className="text-3xl font-bold text-white mb-1">{cases.length}</div>
          <div className="text-red-200">Total Cases</div>
        </div>
        <div className="bg-black/60 backdrop-blur-sm border border-red-500/20 p-6">
          <div className="text-3xl font-bold text-green-400 mb-1">{publishedCount}</div>
          <div className="text-red-200">Published</div>
        </div>
        <div className="bg-black/60 backdrop-blur-sm border border-red-500/20 p-6">
          <div className="text-3xl font-bold text-gray-400 mb-1">{draftCount}</div>
          <div className="text-red-200">Drafts</div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-black/60 backdrop-blur-sm border border-red-500/20 overflow-hidden">
        {cases.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-xl font-bold text-white mb-2">No cases yet</h3>
            <p className="text-slate-400 mb-6">Create your first case using the generator or manual creation.</p>
            <Link
              href="/admin/generate"
              className="inline-block bg-amber-600 hover:bg-amber-500 text-black px-6 py-3 font-semibold transition-colors"
            >
              Generate Your First Case
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-black/70 border-b border-red-500/20">
              <tr className="text-left text-red-200 text-sm">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Subject</th>
                <th className="p-4 font-semibold">Difficulty</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Content</th>
                <th className="p-4 font-semibold">Created</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem) => (
                <tr
                  key={caseItem.id}
                  className="border-b border-red-500/10 hover:bg-black/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="text-white font-semibold">{caseItem.title}</div>
                    <div className="text-slate-400 text-sm">{caseItem.estimatedMinutes} min</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-red-600 text-white text-xs px-3 py-1 font-semibold">
                      {caseItem.subjectFocus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`${
                        difficultyColors[caseItem.difficulty] || 'bg-gray-600'
                      } text-white text-xs px-3 py-1 font-semibold`}
                    >
                      {caseItem.difficulty}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`${
                        statusColors[caseItem.status] || 'bg-gray-600'
                      } text-white text-xs px-3 py-1 font-semibold`}
                    >
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-300 text-sm space-y-1">
                      <div>{caseItem._count.scenes} scenes</div>
                      <div>{caseItem._count.puzzles} puzzles</div>
                      <div>{caseItem._count.suspects} suspects</div>
                    </div>
                  </td>
                  <td className="p-4 text-red-200 text-sm">
                    {new Date(caseItem.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/cases/${caseItem.id}/edit`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/cases/${caseItem.id}/edit#scenes`}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Scenes
                      </Link>
                      <form action={togglePublishCase.bind(null, caseItem.id)} className="inline">
                        <button
                          type="submit"
                          className={`${
                            caseItem.status === 'DRAFT'
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-gray-600 hover:bg-gray-700'
                          } text-white px-3 py-1 rounded text-sm transition-colors`}
                        >
                          {caseItem.status === 'DRAFT' ? 'Publish' : 'Unpublish'}
                        </button>
                      </form>
                      <DeleteCaseButton caseId={caseItem.id} caseTitle={caseItem.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
