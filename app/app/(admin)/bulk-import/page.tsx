'use client';

import { useState } from 'react';

export default function BulkImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // TODO: Implement bulk import logic
    console.log('Uploading file:', selectedFile);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Bulk Import 📤</h1>
        <p className="text-red-200 text-lg">Import cases or users from CSV files</p>
      </div>

      {/* Import Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-8">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-white mb-2">Import Cases</h3>
          <p className="text-red-200 mb-4">
            Upload a CSV file with case data, scenes, clues, and puzzles
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold">
            Download Template
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-8">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-white mb-2">Import Users</h3>
          <p className="text-red-200 mb-4">
            Upload a CSV file with student or teacher accounts
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold">
            Download Template
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Upload CSV File</h2>

        <div className="border-2 border-dashed border-red-500/30 rounded-xl p-12 text-center hover:border-red-500/50 transition-colors">
          <div className="text-6xl mb-4">📁</div>
          <p className="text-white font-semibold mb-2">Drag and drop your CSV file here</p>
          <p className="text-red-200 text-sm mb-4">or click to browse</p>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold cursor-pointer"
          >
            Choose File
          </label>

          {selectedFile && (
            <div className="mt-4 text-green-400">
              Selected: {selectedFile.name}
            </div>
          )}
        </div>

        {selectedFile && (
          <button
            onClick={handleUpload}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Upload and Import
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          💡 CSV Format Guidelines
        </h3>
        <ul className="text-blue-200 text-sm space-y-2">
          <li>• First row must contain column headers</li>
          <li>• Use UTF-8 encoding</li>
          <li>• Required fields cannot be empty</li>
          <li>• Download the template for correct format</li>
          <li>• Maximum file size: 10MB</li>
        </ul>
      </div>
    </div>
  );
}
