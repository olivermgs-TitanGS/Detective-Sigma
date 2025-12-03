'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCasePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectFocus: 'MATH',
    difficulty: 'ROOKIE',
    estimatedMinutes: 30,
    status: 'DRAFT',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    console.log('Creating case:', formData);
    // router.push('/admin/cases');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="text-red-300 hover:text-white transition-colors mb-4"
        >
          ← Back to Cases
        </button>
        <h1 className="text-4xl font-bold text-white mb-2">Create New Case 📝</h1>
        <p className="text-red-200 text-lg">Fill in the details to create a new detective case</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-red-200 mb-2 font-medium">
                Case Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., The Missing Canteen Money"
                className="w-full bg-slate-900 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-red-200 mb-2 font-medium">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Brief description of the case..."
                className="w-full bg-slate-900 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Subject and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-red-200 mb-2 font-medium">
                  Subject Focus <span className="text-red-400">*</span>
                </label>
                <select
                  name="subjectFocus"
                  value={formData.subjectFocus}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="MATH">Math</option>
                  <option value="SCIENCE">Science</option>
                  <option value="INTEGRATED">Integrated</option>
                </select>
              </div>

              <div>
                <label className="block text-red-200 mb-2 font-medium">
                  Difficulty <span className="text-red-400">*</span>
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="ROOKIE">Rookie (P4)</option>
                  <option value="INSPECTOR">Inspector (P5)</option>
                  <option value="DETECTIVE">Detective (P6)</option>
                  <option value="CHIEF">Chief (Advanced)</option>
                </select>
              </div>
            </div>

            {/* Estimated Time */}
            <div>
              <label className="block text-red-200 mb-2 font-medium">
                Estimated Time (minutes) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="estimatedMinutes"
                value={formData.estimatedMinutes}
                onChange={handleChange}
                required
                min="10"
                max="120"
                className="w-full bg-slate-900 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-red-200 mb-2 font-medium">
                Status <span className="text-red-400">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="DRAFT">Draft (not visible to students)</option>
                <option value="PUBLISHED">Published (visible to students)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Next Steps Info */}
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            💡 Next Steps
          </h3>
          <p className="text-blue-200 text-sm mb-3">
            After creating this case, you'll be able to add:
          </p>
          <ul className="text-blue-200 text-sm space-y-1 ml-4">
            <li>• Scenes (investigation locations)</li>
            <li>• Clues (evidence to collect)</li>
            <li>• Puzzles (challenges to unlock clues)</li>
            <li>• Suspects (characters to interview)</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-colors"
          >
            Create Case
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
