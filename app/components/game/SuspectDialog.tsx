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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-amber-600 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-red-700 p-6 border-b-2 border-amber-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm text-black font-mono tracking-widest mb-1 font-bold">👥 SUSPECT FILES</div>
              <h2 className="text-2xl font-bold text-black font-mono tracking-wider">INTERROGATION ROOM</h2>
              <p className="text-black text-sm mt-1 font-mono tracking-wide">
                &gt; Select subject for questioning
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-black hover:text-amber-950 text-3xl leading-none transition-colors font-bold"
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
                  className="bg-black/60 hover:bg-black border-2 border-amber-600/30 hover:border-amber-600 p-6 transition-all group text-center"
                >
                  {/* Suspect Icon */}
                  <div className="text-6xl mb-4 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">{suspect.imageUrl}</div>

                  {/* Name and Role */}
                  <h3 className="text-amber-50 font-mono font-bold text-lg mb-1 group-hover:text-amber-400 transition-colors tracking-wide">
                    {suspect.name}
                  </h3>
                  <p className="text-slate-400 text-sm font-mono tracking-wider">{suspect.role}</p>

                  {/* View Details Button */}
                  <div className="mt-4 text-amber-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity font-mono tracking-wider">
                    INTERROGATE →
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
                className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 font-mono tracking-wider"
              >
                ← BACK TO ALL SUSPECTS
              </button>

              {/* Suspect Profile */}
              <div className="bg-black/50 p-8 border-2 border-amber-600/30">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="text-8xl flex-shrink-0 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">{selectedSuspect.imageUrl}</div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-amber-50 mb-2 font-mono tracking-wider">
                      {selectedSuspect.name}
                    </h3>
                    <p className="text-amber-400 text-lg mb-4 font-mono tracking-widest">{selectedSuspect.role}</p>

                    <div className="bg-black/50 p-4 border-2 border-amber-600/30">
                      <h4 className="text-amber-400 font-mono font-bold mb-2 tracking-wider">📋 BACKGROUND</h4>
                      <p className="text-slate-400 font-mono leading-relaxed">{selectedSuspect.bio}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interview Section (Placeholder for dialogue tree) */}
              <div className="bg-black/50 p-6 border-2 border-amber-600/30">
                <h4 className="text-amber-400 font-mono font-bold mb-4 flex items-center gap-2 tracking-widest">
                  💬 INTERROGATION
                </h4>

                <div className="space-y-3">
                  <button className="w-full text-left bg-black/60 hover:bg-black border-2 border-amber-600/30 hover:border-amber-600 p-4 transition-all group">
                    <p className="text-slate-400 group-hover:text-amber-400 transition-colors font-mono tracking-wide">
                      "Where were you when the incident occurred?"
                    </p>
                  </button>

                  <button className="w-full text-left bg-black/60 hover:bg-black border-2 border-amber-600/30 hover:border-amber-600 p-4 transition-all group">
                    <p className="text-slate-400 group-hover:text-amber-400 transition-colors font-mono tracking-wide">
                      "Did you witness anything suspicious?"
                    </p>
                  </button>

                  <button className="w-full text-left bg-black/60 hover:bg-black border-2 border-amber-600/30 hover:border-amber-600 p-4 transition-all group">
                    <p className="text-slate-400 group-hover:text-amber-400 transition-colors font-mono tracking-wide">
                      "Can anyone verify your alibi?"
                    </p>
                  </button>
                </div>

                <div className="mt-6 bg-amber-900/20 p-4 border-2 border-amber-600/30">
                  <p className="text-amber-400 text-sm flex items-start gap-2 font-mono leading-relaxed">
                    <span className="text-lg">💡</span>
                    <span className="tracking-wide">
                      &gt; Additional questions unlock as you collect more evidence. Continue investigating.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-black/50 border-t-2 border-amber-600/30">
          <button
            onClick={onClose}
            className="w-full border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 font-mono font-bold py-3 transition-all tracking-wider"
          >
            CONTINUE INVESTIGATION
          </button>
        </div>
      </div>
    </div>
  );
}
