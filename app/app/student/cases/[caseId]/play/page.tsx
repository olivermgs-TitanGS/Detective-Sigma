'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import SceneViewer from '@/components/game/SceneViewer';
import EvidenceBoard from '@/components/game/EvidenceBoard';
import ClueModal from '@/components/game/ClueModal';
import PuzzleModal from '@/components/game/PuzzleModal';
import SuspectDialog from '@/components/game/SuspectDialog';
import MusicThemeSetter from '@/components/MusicThemeSetter';

interface Clue {
  id: string;
  name: string;
  description?: string;
  positionX: number;
  positionY: number;
  contentRevealed?: string;
  requiredPuzzleId?: string | null;
  isCollected?: boolean;
  type?: 'physical' | 'document' | 'digital' | 'testimony';
  imageUrl?: string;
}

interface Scene {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  clues: Clue[];
}

interface Puzzle {
  id: string;
  title: string;
  type: string;
  questionText: string;
  questionImage?: string | null;
  correctAnswer: string;
  hint?: string;
  points: number;
  options?: string[] | null;
}

interface Suspect {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  isCulprit: boolean;
  imageUrl?: string;
}

interface GameData {
  id: string;
  title: string;
  scenes: Scene[];
  puzzles: Puzzle[];
  suspects: Suspect[];
}

export default function GameplayPage({ params }: { params: { caseId: string } }) {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [collectedClues, setCollectedClues] = useState<string[]>([]);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [activePuzzle, setActivePuzzle] = useState<Puzzle | null>(null);
  const [showSuspects, setShowSuspects] = useState(false);
  const [showEvidenceBoard, setShowEvidenceBoard] = useState(false);

  // Track time spent
  const startTimeRef = useRef<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  // Fetch case data and existing progress
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch case data
        const caseRes = await fetch(`/api/cases/${params.caseId}`, {
          credentials: 'include',
        });
        if (!caseRes.ok) throw new Error('Failed to fetch case');
        const caseData = await caseRes.json();

        // Fetch existing progress
        const progressRes = await fetch(`/api/progress?caseId=${params.caseId}`, {
          credentials: 'include',
        });
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          if (progressData.progress) {
            setCollectedClues(progressData.progress.cluesCollected || []);
            setSolvedPuzzles(progressData.progress.puzzlesSolved || []);
            setCurrentSceneIndex(progressData.progress.currentSceneIndex || 0);
            setTimeSpent(progressData.progress.timeSpent || 0);
          }
        }

        // Transform case data for game
        const transformedData: GameData = {
          id: caseData.case.id,
          title: caseData.case.title,
          scenes: caseData.case.scenes.map((scene: any) => ({
            id: scene.id,
            name: scene.name,
            description: scene.description,
            imageUrl: scene.imageUrl,
            clues: scene.clues.map((clue: any) => ({
              id: clue.id,
              name: clue.name,
              description: clue.description,
              positionX: Number(clue.positionX) || 50,
              positionY: Number(clue.positionY) || 50,
              contentRevealed: clue.contentRevealed,
              requiredPuzzleId: clue.requiredPuzzleId,
              type: clue.type,
              imageUrl: clue.imageUrl,
            })),
          })),
          puzzles: caseData.case.puzzles.map((puzzle: any) => ({
            id: puzzle.id,
            title: puzzle.title,
            type: puzzle.type,
            questionText: puzzle.questionText,
            questionImage: puzzle.questionImage,
            correctAnswer: puzzle.correctAnswer,
            hint: puzzle.hint,
            points: puzzle.points,
            options: puzzle.options,
          })),
          suspects: caseData.case.suspects.map((suspect: any) => ({
            id: suspect.id,
            name: suspect.name,
            role: suspect.role,
            bio: suspect.bio,
            isCulprit: suspect.isCulprit,
            imageUrl: suspect.imageUrl,
          })),
        };

        setGameData(transformedData);

        // Initialize progress if this is a new start
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            caseId: params.caseId,
            status: 'IN_PROGRESS',
          }),
        });

        setLoading(false);
      } catch (err) {
        console.error('Error loading game:', err);
        setError('Failed to load case data');
        setLoading(false);
      }
    }

    fetchData();
  }, [params.caseId]);

  // Save progress periodically
  const saveProgress = useCallback(async () => {
    if (!gameData) return;

    const currentTime = Math.floor((Date.now() - startTimeRef.current) / 1000) + timeSpent;

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          caseId: params.caseId,
          cluesCollected: collectedClues,
          puzzlesSolved: solvedPuzzles,
          currentSceneIndex: currentSceneIndex,
          timeSpent: currentTime,
        }),
      });
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  }, [gameData, params.caseId, collectedClues, solvedPuzzles, currentSceneIndex, timeSpent]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveProgress, 30000);
    return () => clearInterval(interval);
  }, [saveProgress]);

  // Save on page unload
  useEffect(() => {
    const handleUnload = () => saveProgress();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [saveProgress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🔍</div>
          <p className="text-amber-500 font-mono">Loading case files...</p>
        </div>
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-500 font-mono">{error || 'Case not found'}</p>
          <a href="/student/cases" className="text-amber-500 hover:underline mt-4 inline-block">
            ← Back to Cases
          </a>
        </div>
      </div>
    );
  }

  const currentScene = gameData.scenes[currentSceneIndex];
  const totalScenes = gameData.scenes.length;

  const handleClueClick = async (clue: Clue) => {
    // If clue requires puzzle and puzzle not solved yet
    if (clue.requiredPuzzleId && !solvedPuzzles.includes(clue.requiredPuzzleId)) {
      const puzzle = gameData.puzzles.find((p) => p.id === clue.requiredPuzzleId);
      if (puzzle) setActivePuzzle(puzzle);
      return;
    }

    // Show clue modal
    setSelectedClue(clue);

    // Mark as collected and save
    if (!collectedClues.includes(clue.id)) {
      const newClues = [...collectedClues, clue.id];
      setCollectedClues(newClues);

      // Save progress immediately
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          caseId: params.caseId,
          cluesCollected: newClues,
        }),
      });
    }
  };

  const handlePuzzleSolved = async (puzzleId: string) => {
    const newPuzzles = [...solvedPuzzles, puzzleId];
    setSolvedPuzzles(newPuzzles);
    setActivePuzzle(null);

    // Save progress
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        caseId: params.caseId,
        puzzlesSolved: newPuzzles,
      }),
    });

    // Find and show the clue that was locked
    const unlockedClue = currentScene.clues.find(
      (c) => c.requiredPuzzleId === puzzleId
    );
    if (unlockedClue) {
      setSelectedClue(unlockedClue);
      if (!collectedClues.includes(unlockedClue.id)) {
        const newClues = [...collectedClues, unlockedClue.id];
        setCollectedClues(newClues);

        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            caseId: params.caseId,
            cluesCollected: newClues,
          }),
        });
      }
    }
  };

  const handleNextScene = async () => {
    if (currentSceneIndex < totalScenes - 1) {
      const newIndex = currentSceneIndex + 1;
      setCurrentSceneIndex(newIndex);

      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          caseId: params.caseId,
          currentSceneIndex: newIndex,
        }),
      });
    }
  };

  const handlePreviousScene = async () => {
    if (currentSceneIndex > 0) {
      const newIndex = currentSceneIndex - 1;
      setCurrentSceneIndex(newIndex);

      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          caseId: params.caseId,
          currentSceneIndex: newIndex,
        }),
      });
    }
  };

  // Calculate total clues across all scenes
  const totalClues = gameData.scenes.reduce((sum, scene) => sum + scene.clues.length, 0);
  const progressPercentage = Math.round((collectedClues.length / totalClues) * 100);

  // Get all clues for evidence board
  const allClues = gameData.scenes.flatMap(scene =>
    scene.clues.map(clue => ({
      ...clue,
      isCollected: collectedClues.includes(clue.id),
    }))
  );

  return (
    <div className="min-h-screen bg-black relative">
      <MusicThemeSetter theme="investigation" />
      {/* Top Bar */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{gameData.title}</h1>
              <p className="text-sm text-purple-200">{currentScene.name}</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Progress Bar */}
              <div className="hidden md:block">
                <div className="text-sm text-purple-200 mb-1">
                  Clues: {collectedClues.length}/{totalClues}
                </div>
                <div className="w-48 bg-black/80 h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => setShowEvidenceBoard(!showEvidenceBoard)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 transition-colors font-semibold text-sm"
              >
                Evidence ({collectedClues.length})
              </button>
              <button
                onClick={() => setShowSuspects(!showSuspects)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 transition-colors font-semibold text-sm"
              >
                Suspects ({gameData.suspects.length})
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
              caseNumber={`DS-${gameData.id.slice(-6).toUpperCase()}`}
            />

            {/* Instructions */}
            <div className="mt-6 bg-black/60 backdrop-blur-sm border border-purple-500/20 p-6">
              <h3 className="text-lg font-bold text-white mb-2">How to Play</h3>
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
              clues={allClues.filter((c) => collectedClues.includes(c.id))}
              onClueClick={(clue) => setSelectedClue(clue)}
            />
          </div>
        </div>

        {/* Complete Investigation Button */}
        {progressPercentage === 100 && (
          <div className="mt-8 bg-gradient-to-br from-green-600 to-green-800 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Investigation Complete!</h3>
            <p className="text-green-100 mb-6">
              You've collected all the clues. Ready to solve the case?
            </p>
            <a
              href={`/student/cases/${params.caseId}/quiz`}
              onClick={saveProgress}
              className="inline-block bg-white text-green-900 px-12 py-4 font-bold text-lg hover:bg-green-100 transition-colors"
            >
              Take Final Quiz
            </a>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedClue && (
        <ClueModal
          clue={selectedClue}
          onClose={() => setSelectedClue(null)}
          caseNumber={`DS-${gameData.id.slice(-6).toUpperCase()}`}
          evidenceNumber={allClues.findIndex(c => c.id === selectedClue.id) + 1}
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
                x
              </button>
            </div>
            <EvidenceBoard
              clues={allClues.filter((c) => collectedClues.includes(c.id))}
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
