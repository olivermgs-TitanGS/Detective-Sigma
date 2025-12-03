import Link from 'next/link';

// Demo data - will be fetched from database
const cases = [
  {
    id: '1',
    title: 'The Missing Canteen Money',
    subjectFocus: 'MATH',
    difficulty: 'ROOKIE',
    status: 'PUBLISHED',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '2',
    title: 'The Mysterious Measurement Mix-Up',
    subjectFocus: 'MATH',
    difficulty: 'INSPECTOR',
    status: 'PUBLISHED',
    createdAt: new Date('2025-01-02'),
  },
  {
    id: '3',
    title: 'The Fraction Fraud',
    subjectFocus: 'MATH',
    difficulty: 'DETECTIVE',
    status: 'DRAFT',
    createdAt: new Date('2025-01-03'),
  },
];

const difficultyColors = {
  ROOKIE: 'bg-green-600',
  INSPECTOR: 'bg-yellow-600',
  DETECTIVE: 'bg-orange-600',
  CHIEF: 'bg-red-600',
};

const statusColors = {
  PUBLISHED: 'bg-green-600',
  DRAFT: 'bg-gray-600',
};

export default function CasesListPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Case Management 📚</h1>
          <p className="text-red-200 text-lg">Create, edit, and manage detective cases</p>
        </div>
        <Link
          href="/admin/cases/create"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3  transition-colors font-semibold flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>Create New Case</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/60 backdrop-blur-sm border border-red-500/20  p-6">
          <div className="text-3xl font-bold text-white mb-1">{cases.length}</div>
          <div className="text-red-200">Total Cases</div>
        </div>
        <div className="bg-black/60 backdrop-blur-sm border border-red-500/20  p-6">
          <div className="text-3xl font-bold text-white mb-1">
            {cases.filter((c) => c.status === 'PUBLISHED').length}
          </div>
          <div className="text-red-200">Published</div>
        </div>
        <div className="bg-black/60 backdrop-blur-sm border border-red-500/20  p-6">
          <div className="text-3xl font-bold text-white mb-1">
            {cases.filter((c) => c.status === 'DRAFT').length}
          </div>
          <div className="text-red-200">Drafts</div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-black/60 backdrop-blur-sm border border-red-500/20  overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/70 border-b border-red-500/20">
            <tr className="text-left text-red-200 text-sm">
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Subject</th>
              <th className="p-4 font-semibold">Difficulty</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Created</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem) => (
              <tr
                key={caseItem.id}
                className="border-b border-red-500/10 hover:bg-black/80/30 transition-colors"
              >
                <td className="p-4">
                  <div className="text-white font-semibold">{caseItem.title}</div>
                </td>
                <td className="p-4">
                  <span className="bg-red-600 text-white text-xs px-3 py-1  font-semibold">
                    {caseItem.subjectFocus}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`${
                      difficultyColors[caseItem.difficulty as keyof typeof difficultyColors]
                    } text-white text-xs px-3 py-1  font-semibold`}
                  >
                    {caseItem.difficulty}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`${
                      statusColors[caseItem.status as keyof typeof statusColors]
                    } text-white text-xs px-3 py-1  font-semibold`}
                  >
                    {caseItem.status}
                  </span>
                </td>
                <td className="p-4 text-red-200 text-sm">
                  {caseItem.createdAt.toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/cases/${caseItem.id}/edit`}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/cases/${caseItem.id}/scenes`}
                      className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Scenes
                    </Link>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
