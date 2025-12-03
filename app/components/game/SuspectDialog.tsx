'use client';

import { useState } from 'react';

interface Suspect {
  id: string;
  name: string;
  role: string;
  bio: string;
  isCulprit: boolean;
  imageUrl: string;
}

interface SuspectDialogProps {
  suspects: Suspect[];
  onClose: () => void;
}

export default function SuspectDialog({ suspects, onClose }: SuspectDialogProps) {
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border-2 border-purple-500/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-purple-600 to-blue-600 p-6 border-b border-purple-500/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm text-purple-200 mb-1">👥 Suspect List</div>
              <h2 className="text-2xl font-bold text-white">Interview Suspects</h2>
              <p className="text-purple-100 text-sm mt-1">
                Click on a suspect to learn more about them
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 text-3xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedSuspect ? (
            // Suspect List
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suspects.map((suspect) => (
                <button
                  key={suspect.id}
                  onClick={() => setSelectedSuspect(suspect)}
                  className="bg-slate-700/50 hover:bg-slate-700 border border-purple-500/20 hover:border-purple-500/50 rounded-xl p-6 transition-all group text-center"
                >
                  {/* Suspect Icon */}
                  <div className="text-6xl mb-4">{suspect.imageUrl}</div>

                  {/* Name and Role */}
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-purple-300 transition-colors">
                    {suspect.name}
                  </h3>
                  <p className="text-purple-300 text-sm">{suspect.role}</p>

                  {/* View Details Button */}
                  <div className="mt-4 text-purple-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to interview →
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // Suspect Detail View
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => setSelectedSuspect(null)}
                className="text-purple-300 hover:text-white transition-colors flex items-center gap-2"
              >
                ← Back to all suspects
              </button>

              {/* Suspect Profile */}
              <div className="bg-slate-900/50 rounded-xl p-8 border border-purple-500/20">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="text-8xl flex-shrink-0">{selectedSuspect.imageUrl}</div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {selectedSuspect.name}
                    </h3>
                    <p className="text-purple-300 text-lg mb-4">{selectedSuspect.role}</p>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                      <h4 className="text-white font-semibold mb-2">📋 Background</h4>
                      <p className="text-purple-200">{selectedSuspect.bio}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interview Section (Placeholder for dialogue tree) */}
              <div className="bg-slate-900/50 rounded-xl p-6 border border-purple-500/20">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  💬 Interview Questions
                </h4>

                <div className="space-y-3">
                  <button className="w-full text-left bg-slate-700/50 hover:bg-slate-700 border border-purple-500/20 rounded-lg p-4 transition-colors group">
                    <p className="text-purple-200 group-hover:text-white transition-colors">
                      "Where were you when the money went missing?"
                    </p>
                  </button>

                  <button className="w-full text-left bg-slate-700/50 hover:bg-slate-700 border border-purple-500/20 rounded-lg p-4 transition-colors group">
                    <p className="text-purple-200 group-hover:text-white transition-colors">
                      "Did you see anything suspicious?"
                    </p>
                  </button>

                  <button className="w-full text-left bg-slate-700/50 hover:bg-slate-700 border border-purple-500/20 rounded-lg p-4 transition-colors group">
                    <p className="text-purple-200 group-hover:text-white transition-colors">
                      "Can anyone confirm your story?"
                    </p>
                  </button>
                </div>

                <div className="mt-6 bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                  <p className="text-purple-200 text-sm flex items-start gap-2">
                    <span className="text-lg">💡</span>
                    <span>
                      Interview questions will be available when you collect more clues. Keep
                      investigating!
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900/50 border-t border-purple-500/20">
          <button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Continue Investigation
          </button>
        </div>
      </div>
    </div>
  );
}
