'use client';

import { useState } from 'react';
import SceneViewer from '@/components/game/SceneViewer';
import EvidenceBoard from '@/components/game/EvidenceBoard';
import ClueModal from '@/components/game/ClueModal';
import PuzzleModal from '@/components/game/PuzzleModal';
import SuspectDialog from '@/components/game/SuspectDialog';

// Demo game data - will be fetched from database
const gameData = {
  caseId: '1',
  caseTitle: 'The Missing Canteen Money',
  scenes: [
    {
      id: 'scene1',
      name: 'School Canteen',
      description: 'The bustling canteen where the money went missing',
      imageUrl: '/scenes/canteen.jpg',
      clues: [
        {
          id: 'clue1',
          name: 'Cash Register Receipt',
          positionX: 30,
          positionY: 40,
          description: 'A receipt from Friday showing total sales of $450',
          requiredPuzzleId: null,
          contentRevealed: 'The receipt shows that Friday\'s total sales were $450. Mrs. Tan counted $400 in the cash box.',
          isCollected: false,
        },
        {
          id: 'clue2',
          name: 'Security Camera Footage',
          positionX: 70,
          positionY: 20,
          description: 'Footage showing who entered the canteen',
          requiredPuzzleId: 'puzzle1',
          isCollected: false,
        },
        {
          id: 'clue3',
          name: 'Time Log Book',
          positionX: 50,
          positionY: 60,
          description: 'Sign-in times for staff and helpers',
          requiredPuzzleId: null,
          contentRevealed: 'Mr. Lim (cleaner) signed in at 6:00 PM. Alex (student) left at 5:45 PM. Miss Chen (teacher) came at 6:30 PM.',
          isCollected: false,
        },
      ],
    },
    {
      id: 'scene2',
      name: 'Kitchen Storage',
      description: 'The staff kitchen where supplies are kept',
      imageUrl: '/scenes/kitchen.jpg',
      clues: [
        {
          id: 'clue4',
          name: 'Staff Schedule',
          positionX: 25,
          positionY: 35,
          description: 'Weekly schedule showing who worked Friday evening',
          requiredPuzzleId: null,
          contentRevealed: 'Only Alex was scheduled to close the canteen on Friday. He had the keys.',
          isCollected: false,
        },
        {
          id: 'clue5',
          name: 'Fingerprints on Safe',
          positionX: 65,
          positionY: 45,
          description: 'Fingerprints found on the office safe',
          requiredPuzzleId: 'puzzle2',
          isCollected: false,
        },
      ],
    },
    {
      id: 'scene3',
      name: 'School Office',
      description: 'The administrative office',
      imageUrl: '/scenes/office.jpg',
      clues: [
        {
          id: 'clue6',
          name: 'Alex\'s Locker',
          positionX: 40,
          positionY: 50,
          description: 'Student helper lockers',
          requiredPuzzleId: null,
          contentRevealed: 'Alex\'s locker contains $50 in cash - exactly the amount that went missing!',
          isCollected: false,
        },
        {
          id: 'clue7',
          name: 'Confession Letter',
          positionX: 60,
          positionY: 30,
          description: 'A handwritten note',
          requiredPuzzleId: null,
          contentRevealed: 'Alex wrote: "I needed money for my mother\'s medicine. I\'m so sorry."',
          isCollected: false,
        },
      ],
    },
  ],
  puzzles: [
    {
      id: 'puzzle1',
      title: 'Calculate the Missing Money',
      type: 'math_word',
      questionText: 'If total sales were $450 and Mrs. Tan counted $400, how much money is missing?',
      questionImage: null,
      correctAnswer: '50',
      hint: 'Subtract the counted money from the total sales: $450 - $400 = ?',
      points: 10,
      options: null,
    },
    {
      id: 'puzzle2',
      title: 'Time Problem',
      type: 'math_word',
      questionText: 'If Alex left at 5:45 PM and Mr. Lim arrived at 6:00 PM, how many minutes was the canteen unsupervised?',
      questionImage: null,
      correctAnswer: '15',
      hint: 'Calculate the time difference between 5:45 PM and 6:00 PM in minutes.',
      points: 10,
      options: null,
    },
  ],
  suspects: [
    {
      id: 'suspect1',
      name: 'Mr. Lim',
      role: 'School Cleaner',
      bio: 'Has worked at the school for 10 years. Very reliable and trusted.',
      isCulprit: false,
      imageUrl: '🧹',
    },
    {
      id: 'suspect2',
      name: 'Miss Chen',
      role: 'Science Teacher',
      bio: 'New teacher, started 6 months ago. Sometimes stays late for experiments.',
      isCulprit: false,
      imageUrl: '👩‍🔬',
    },
    {
      id: 'suspect3',
      name: 'Alex',
      role: 'Student Helper',
      bio: 'P6 student, helps in the canteen 3 times a week. Good student, responsible.',
      isCulprit: true,
      imageUrl: '👨‍🎓',
    },
  ],
};

export default function GameplayPage({ params }: { params: { caseId: string } }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [collectedClues, setCollectedClues] = useState<string[]>([]);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);
  const [selectedClue, setSelectedClue] = useState<any>(null);
  const [activePuzzle, setActivePuzzle] = useState<any>(null);
  const [showSuspects, setShowSuspects] = useState(false);
  const [showEvidenceBoard, setShowEvidenceBoard] = useState(false);

  const currentScene = gameData.scenes[currentSceneIndex];
  const totalScenes = gameData.scenes.length;

  const handleClueClick = (clue: any) => {
    // If clue requires puzzle and puzzle not solved yet
    if (clue.requiredPuzzleId && !solvedPuzzles.includes(clue.requiredPuzzleId)) {
      const puzzle = gameData.puzzles.find((p) => p.id === clue.requiredPuzzleId);
      setActivePuzzle(puzzle);
      return;
    }

    // Show clue modal
    setSelectedClue(clue);

    // Mark as collected
    if (!collectedClues.includes(clue.id)) {
      setCollectedClues([...collectedClues, clue.id]);
    }
  };

  const handlePuzzleSolved = (puzzleId: string) => {
    setSolvedPuzzles([...solvedPuzzles, puzzleId]);
    setActivePuzzle(null);

    // Find and show the clue that was locked
    const unlockedClue = currentScene.clues.find(
      (c) => c.requiredPuzzleId === puzzleId
    );
    if (unlockedClue) {
      setSelectedClue(unlockedClue);
      if (!collectedClues.includes(unlockedClue.id)) {
        setCollectedClues([...collectedClues, unlockedClue.id]);
      }
    }
  };

  const handleNextScene = () => {
    if (currentSceneIndex < totalScenes - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    }
  };

  const handlePreviousScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    }
  };

  // Calculate total clues across all scenes
  const totalClues = gameData.scenes.reduce((sum, scene) => sum + scene.clues.length, 0);
  const progressPercentage = Math.round((collectedClues.length / totalClues) * 100);

  return (
    <div className="min-h-screen bg-black relative">
      {/* Top Bar */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{gameData.caseTitle}</h1>
              <p className="text-sm text-purple-200">{currentScene.name}</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Progress Bar */}
              <div className="hidden md:block">
                <div className="text-sm text-purple-200 mb-1">
                  Clues: {collectedClues.length}/{totalClues}
                </div>
                <div className="w-48 bg-black/80  h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2  transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => setShowEvidenceBoard(!showEvidenceBoard)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2  transition-colors font-semibold text-sm"
              >
                📋 Evidence ({collectedClues.length})
              </button>
              <button
                onClick={() => setShowSuspects(!showSuspects)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2  transition-colors font-semibold text-sm"
              >
                👥 Suspects ({gameData.suspects.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scene Viewer (Main Area) */}
          <div className="lg:col-span-2">
            <SceneViewer
              scene={currentScene}
              collectedClues={collectedClues}
              onClueClick={handleClueClick}
              currentSceneIndex={currentSceneIndex}
              totalScenes={totalScenes}
              onNextScene={handleNextScene}
              onPreviousScene={handlePreviousScene}
            />

            {/* Instructions */}
            <div className="mt-6 bg-black/60 backdrop-blur-sm border border-purple-500/20  p-6">
              <h3 className="text-lg font-bold text-white mb-2">🔍 How to Play</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Click on glowing hotspots to discover clues</li>
                <li>• Some clues are locked - solve puzzles to unlock them</li>
                <li>• Collect all clues to complete the investigation</li>
                <li>• Interview suspects to gather information</li>
                <li>• When ready, take the final quiz to solve the case!</li>
              </ul>
            </div>
          </div>

          {/* Side Panel - Evidence Board (Desktop) */}
          <div className="hidden lg:block">
            <EvidenceBoard
              clues={gameData.scenes
                .flatMap(scene => scene.clues)
                .filter((c) => collectedClues.includes(c.id))
              }
              onClueClick={(clue) => setSelectedClue(clue)}
            />
          </div>
        </div>

        {/* Complete Investigation Button */}
        {progressPercentage === 100 && (
          <div className="mt-8 bg-gradient-to-br from-green-600 to-green-800  p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">🎉 Investigation Complete!</h3>
            <p className="text-green-100 mb-6">
              You've collected all the clues. Ready to solve the case?
            </p>
            <a
              href={`/student/cases/${params.caseId}/quiz`}
              className="inline-block bg-white text-green-900 px-12 py-4  font-bold text-lg hover:bg-green-100 transition-colors"
            >
              Take Final Quiz →
            </a>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedClue && (
        <ClueModal
          clue={selectedClue}
          onClose={() => setSelectedClue(null)}
        />
      )}

      {activePuzzle && (
        <PuzzleModal
          puzzle={activePuzzle}
          onSolved={() => handlePuzzleSolved(activePuzzle.id)}
          onClose={() => setActivePuzzle(null)}
        />
      )}

      {showSuspects && (
        <SuspectDialog
          suspects={gameData.suspects}
          onClose={() => setShowSuspects(false)}
        />
      )}

      {/* Mobile Evidence Board */}
      {showEvidenceBoard && (
        <div className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Evidence Board</h2>
              <button
                onClick={() => setShowEvidenceBoard(false)}
                className="text-white hover:text-purple-300 text-3xl"
              >
                ×
              </button>
            </div>
            <EvidenceBoard
              clues={gameData.scenes
                .flatMap(scene => scene.clues)
                .filter((c) => collectedClues.includes(c.id))
              }
              onClueClick={(clue) => {
                setSelectedClue(clue);
                setShowEvidenceBoard(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
