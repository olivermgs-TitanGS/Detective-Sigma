'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Topic {
  id: string;
  name: string;
  subject: string;
  gradeLevel: string;
  strand: string;
  unit: string;
  usageCount: number;
  lastUsed: string | null;
  puzzleTypes: string[];
  keyVocabulary: string[];
}

interface CoverageReport {
  totalTopics: number;
  coveredTopics: number;
  coveragePercentage: number;
  recommendations: string[];
  byGrade: {
    P4: { total: number; covered: number; percentage: number } | null;
    P5: { total: number; covered: number; percentage: number } | null;
    P6: { total: number; covered: number; percentage: number } | null;
  };
  bySubject: Record<string, { total: number; covered: number; percentage: number }>;
  byStrand: Record<string, { name: string; total: number; covered: number; percentage: number }>;
}

interface SyllabusData {
  stats: {
    totalTopics: number;
    mathTopics: number;
    scienceTopics: number;
    byGrade: Record<string, number>;
    totalLessons: number;
  };
  report: CoverageReport;
  topics: Topic[];
  casesCount: number;
}

export default function SyllabusCoveragePage() {
  const [data, setData] = useState<SyllabusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{ grade: string; subject: string; strand: string }>({
    grade: 'ALL',
    subject: 'ALL',
    strand: 'ALL',
  });

  useEffect(() => {
    fetchSyllabusData();
  }, []);

  const fetchSyllabusData = async () => {
    try {
      const response = await fetch('/api/admin/syllabus');
      if (!response.ok) throw new Error('Failed to fetch syllabus data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load syllabus data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 font-mono animate-pulse">Loading syllabus data...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error || 'Failed to load data'}</p>
      </div>
    );
  }

  const filteredTopics = data.topics.filter(topic => {
    if (filter.grade !== 'ALL' && topic.gradeLevel !== filter.grade) return false;
    if (filter.subject !== 'ALL' && topic.subject !== filter.subject) return false;
    if (filter.strand !== 'ALL' && topic.strand !== filter.strand) return false;
    return true;
  });

  const strands = [...new Set(data.topics.map(t => t.strand))];

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 50) return 'bg-yellow-600';
    if (percentage >= 20) return 'bg-orange-600';
    return 'bg-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-400 font-mono tracking-wider">
            SYLLABUS COVERAGE
          </h1>
          <p className="text-slate-400 mt-2">
            Track coverage of Singapore P4-P6 curriculum topics
          </p>
        </div>
        <Link
          href="/admin/generate"
          className="bg-amber-600 hover:bg-amber-500 text-black px-6 py-3 font-semibold transition-colors"
        >
          Generate Cases
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black/60 border border-amber-600/30 p-6">
          <div className="text-3xl font-bold text-white">{data.stats.totalTopics}</div>
          <div className="text-amber-300 text-sm">Total Topics</div>
        </div>
        <div className="bg-black/60 border border-blue-600/30 p-6">
          <div className="text-3xl font-bold text-blue-400">{data.stats.mathTopics}</div>
          <div className="text-blue-300 text-sm">Math Topics</div>
        </div>
        <div className="bg-black/60 border border-green-600/30 p-6">
          <div className="text-3xl font-bold text-green-400">{data.stats.scienceTopics}</div>
          <div className="text-green-300 text-sm">Science Topics</div>
        </div>
        <div className="bg-black/60 border border-purple-600/30 p-6">
          <div className="text-3xl font-bold text-purple-400">{data.casesCount}</div>
          <div className="text-purple-300 text-sm">Cases Generated</div>
        </div>
      </div>

      {/* Coverage by Grade */}
      <div className="bg-black/60 border border-slate-600 p-6">
        <h2 className="text-xl font-bold text-white mb-4 font-mono">Coverage by Grade Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['P4', 'P5', 'P6'] as const).map(grade => {
            const gradeData = data.report.byGrade[grade];
            if (!gradeData) return null;

            return (
              <div key={grade} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">{grade}</span>
                  <span className="text-amber-400">{gradeData.percentage}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded h-4">
                  <div
                    className={`h-4 rounded ${getCoverageColor(gradeData.percentage)}`}
                    style={{ width: `${gradeData.percentage}%` }}
                  />
                </div>
                <div className="text-slate-400 text-sm">
                  {gradeData.covered} / {gradeData.total} topics covered
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coverage by Strand */}
      <div className="bg-black/60 border border-slate-600 p-6">
        <h2 className="text-xl font-bold text-white mb-4 font-mono">Coverage by Curriculum Strand</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(data.report.byStrand).map(([strand, coverage]) => (
            <div key={strand} className="bg-slate-800/50 p-4 rounded">
              <div className="text-white font-semibold capitalize mb-2">{strand}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-700 rounded h-2">
                  <div
                    className={`h-2 rounded ${getCoverageColor(coverage.percentage)}`}
                    style={{ width: `${coverage.percentage}%` }}
                  />
                </div>
                <span className="text-amber-400 text-sm">{coverage.percentage}%</span>
              </div>
              <div className="text-slate-500 text-xs mt-1">
                {coverage.covered}/{coverage.total}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {data.report.recommendations.length > 0 && (
        <div className="bg-amber-900/30 border border-amber-800/50 p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-4 font-mono">Recommendations</h2>
          <ul className="space-y-2">
            {data.report.recommendations.map((rec, i) => (
              <li key={i} className="text-amber-200 flex items-start gap-2">
                <span className="text-amber-400">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Topic List */}
      <div className="bg-black/60 border border-slate-600 p-6">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <h2 className="text-xl font-bold text-white font-mono">All Topics</h2>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filter.grade}
              onChange={(e) => setFilter({ ...filter, grade: e.target.value })}
              className="bg-slate-800 border border-slate-600 text-white px-3 py-2 text-sm"
            >
              <option value="ALL">All Grades</option>
              <option value="P4">Primary 4</option>
              <option value="P5">Primary 5</option>
              <option value="P6">Primary 6</option>
            </select>

            <select
              value={filter.subject}
              onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
              className="bg-slate-800 border border-slate-600 text-white px-3 py-2 text-sm"
            >
              <option value="ALL">All Subjects</option>
              <option value="MATH">Mathematics</option>
              <option value="SCIENCE">Science</option>
            </select>

            <select
              value={filter.strand}
              onChange={(e) => setFilter({ ...filter, strand: e.target.value })}
              className="bg-slate-800 border border-slate-600 text-white px-3 py-2 text-sm"
            >
              <option value="ALL">All Strands</option>
              {strands.map(strand => (
                <option key={strand} value={strand}>{strand}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800">
              <tr className="text-left text-slate-300">
                <th className="p-3">Topic</th>
                <th className="p-3">Grade</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Strand</th>
                <th className="p-3">Usage</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map(topic => (
                <tr
                  key={topic.id}
                  className="border-b border-slate-700 hover:bg-slate-800/30"
                >
                  <td className="p-3">
                    <div className="text-white font-medium">{topic.name}</div>
                    <div className="text-slate-500 text-xs">{topic.unit}</div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      topic.gradeLevel === 'P4' ? 'bg-green-900/50 text-green-300' :
                      topic.gradeLevel === 'P5' ? 'bg-blue-900/50 text-blue-300' :
                      'bg-purple-900/50 text-purple-300'
                    }`}>
                      {topic.gradeLevel}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      topic.subject === 'MATH' ? 'bg-blue-900/50 text-blue-300' :
                      'bg-green-900/50 text-green-300'
                    }`}>
                      {topic.subject}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 capitalize">{topic.strand}</td>
                  <td className="p-3">
                    <span className="text-amber-400 font-mono">{topic.usageCount}x</span>
                  </td>
                  <td className="p-3">
                    {topic.usageCount === 0 ? (
                      <span className="px-2 py-1 text-xs bg-red-900/50 text-red-300 rounded">
                        NOT COVERED
                      </span>
                    ) : topic.usageCount < 3 ? (
                      <span className="px-2 py-1 text-xs bg-yellow-900/50 text-yellow-300 rounded">
                        LOW
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-900/50 text-green-300 rounded">
                        GOOD
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-slate-400 text-sm">
          Showing {filteredTopics.length} of {data.topics.length} topics
        </div>
      </div>
    </div>
  );
}
