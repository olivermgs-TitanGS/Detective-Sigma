'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import SceneViewer from '@/components/game/SceneViewer';
import EvidenceBoard from '@/components/game/EvidenceBoard';
import ClueModal from '@/components/game/ClueModal';
import PuzzleModal from '@/components/game/PuzzleModal';
import SuspectDialog from '@/components/game/SuspectDialog';
import { CaseFileLoader, LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CaseProgressBar, ProgressBar } from '@/components/ui/ProgressBar';
import { GlowButton, CTAButton } from '@/components/ui/GlowButton';
import { RippleButton } from '@/components/ui/RippleButton';
import { toast } from '@/components/ui/Toast';
import { useConfetti } from '@/components/ui/Confetti';
// New immersive UI components
import InvestigationNotebook from '@/components/game/InvestigationNotebook';
import { CaseTimeline, TimelineEvent, MiniTimeline } from '@/components/game/CaseTimeline';
import SuspectNetwork from '@/components/game/SuspectNetwork';
import { FilmWipeTransition, SceneTitleCard, CaseSolvedTransition } from '@/components/ui/CinematicTransitions';
import { FullPageLoader } from '@/components/ui/DetectiveLoader';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

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

interface PuzzleRevelation {
  type: 'evidence' | 'alibi_check' | 'timeline' | 'motive' | 'confession_clue';
  description: string;
  storyText: string;
  importance: 'minor' | 'moderate' | 'major';
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
  // Narrative revelation system
  narrativeContext?: string | null;
  investigationPhase?: string | null;
  revelation?: PuzzleRevelation | null;
  relatedCharacterName?: string | null;
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

  // New immersive UI states
  const [showNotebook, setShowNotebook] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showSuspectNetwork, setShowSuspectNetwork] = useState(false);
  const [showSceneTransition, setShowSceneTransition] = useState(false);
  const [showSceneTitle, setShowSceneTitle] = useState(false);
  const [showCaseSolved, setShowCaseSolved] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const { playSound } = useSoundEffects();

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
            // Narrative revelation system for storyline
            narrativeContext: puzzle.narrativeContext,
            investigationPhase: puzzle.investigationPhase,
            revelation: puzzle.revelation,
            relatedCharacterName: puzzle.relatedCharacterName,
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

  // Confetti for celebrations
  const { fireClueFound, fireSuccess } = useConfetti();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CaseFileLoader message="ACCESSING CASE FILES" />
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

  // Helper to add timeline events
  const addTimelineEvent = useCallback((event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: `event-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTimelineEvents(prev => [...prev, newEvent]);
  }, []);

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

      // Fire detective celebration
      fireClueFound();
      toast.clueFound(clue.name, clue.type === 'testimony' ? 'major' : 'moderate');

      // Add to timeline
      addTimelineEvent({
        title: `Evidence Found: ${clue.name}`,
        description: clue.description || 'New evidence collected',
        type: 'clue',
        completed: true,
      });

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
    const puzzle = gameData.puzzles.find(p => p.id === puzzleId);
    const newPuzzles = [...solvedPuzzles, puzzleId];
    setSolvedPuzzles(newPuzzles);
    setActivePuzzle(null);

    // Add to timeline
    addTimelineEvent({
      title: `Puzzle Solved: ${puzzle?.title || 'Unknown'}`,
      description: puzzle?.revelation?.description || 'A mystery has been unraveled',
      type: 'puzzle',
      completed: true,
    });

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

      // Play transition sound and show cinematic transition
      playSound('sceneTransition');
      setShowSceneTransition(true);

      // Add scene change to timeline
      addTimelineEvent({
        title: `Moved to: ${gameData.scenes[newIndex].name}`,
        description: gameData.scenes[newIndex].description || 'Investigating new location',
        type: 'scene',
        completed: true,
      });

      // Delay scene change for transition effect
      setTimeout(() => {
        setCurrentSceneIndex(newIndex);
        setShowSceneTransition(false);
        setShowSceneTitle(true);
        setTimeout(() => setShowSceneTitle(false), 2500);
      }, 800);

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

      // Play transition sound and show cinematic transition
      playSound('sceneTransition');
      setShowSceneTransition(true);

      // Delay scene change for transition effect
      setTimeout(() => {
        setCurrentSceneIndex(newIndex);
        setShowSceneTransition(false);
        setShowSceneTitle(true);
        setTimeout(() => setShowSceneTitle(false), 2500);
      }, 800);

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
      {/* Top Bar */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{gameData.title}</h1>
              <p className="text-sm text-purple-200">{currentScene.name}</p>
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-end">
              {/* Mini Timeline */}
              <div className="hidden xl:block">
                <MiniTimeline
                  events={timelineEvents}
                  maxEvents={3}
                  onClick={() => setShowTimeline(true)}
                />
              </div>

              {/* Progress Bar - Detective Styled */}
              <div className="hidden md:block w-40 lg:w-56">
                <ProgressBar
                  value={collectedClues.length}
                  max={totalClues}
                  label="Evidence"
                  variant="evidence"
                  size="sm"
                  color="evidence"
                />
              </div>

              {/* Action Buttons - Detective Styled */}
              <GlowButton
                onClick={() => { playSound('caseFileOpen'); setShowNotebook(!showNotebook); }}
                variant="evidence"
                size="sm"
                glowIntensity="low"
              >
                📓
              </GlowButton>
              <GlowButton
                onClick={() => { playSound('pageTurn'); setShowTimeline(!showTimeline); }}
                variant="evidence"
                size="sm"
                glowIntensity="low"
              >
                📅
              </GlowButton>
              <GlowButton
                onClick={() => setShowEvidenceBoard(!showEvidenceBoard)}
                variant="evidence"
                size="sm"
                glowIntensity="medium"
              >
                🔍 <span className="hidden sm:inline">Evidence</span> ({collectedClues.length})
              </GlowButton>
              <GlowButton
                onClick={() => setShowSuspects(!showSuspects)}
                variant="amber"
                size="sm"
                glowIntensity="medium"
              >
                👤 <span className="hidden sm:inline">Suspects</span> ({gameData.suspects.length})
              </GlowButton>
              <GlowButton
                onClick={() => { playSound('suspectSelect'); setShowSuspectNetwork(!showSuspectNetwork); }}
                variant="amber"
                size="sm"
                glowIntensity="low"
              >
                🕸️
              </GlowButton>
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

        {/* Complete Investigation Button - Detective Styled */}
        {progressPercentage === 100 && (
          <div className="mt-8 bg-gradient-to-br from-green-900/80 to-green-800/80 border-2 border-green-500/50 p-8 text-center">
            <div className="text-5xl mb-4">📁</div>
            <h3 className="text-2xl font-bold text-green-400 font-mono tracking-wider mb-2">
              INVESTIGATION COMPLETE
            </h3>
            <p className="text-green-200 mb-6 font-mono">
              All evidence collected. Ready to close the case?
            </p>
            <a href={`/student/cases/${params.caseId}/quiz`} onClick={saveProgress}>
              <CTAButton
                variant="solve"
                size="lg"
              >
                🎯 TAKE FINAL QUIZ
              </CTAButton>
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

      {/* Investigation Notebook */}
      {showNotebook && (
        <InvestigationNotebook
          caseId={gameData.id}
          isOpen={showNotebook}
          onClose={() => setShowNotebook(false)}
        />
      )}

      {/* Case Timeline */}
      {showTimeline && (
        <CaseTimeline
          events={timelineEvents}
          isOpen={showTimeline}
          onClose={() => setShowTimeline(false)}
          caseTitle={gameData.title}
        />
      )}

      {/* Suspect Network */}
      <SuspectNetwork
        suspects={gameData.suspects.map(s => ({
          id: s.id,
          name: s.name,
          role: s.role || 'Unknown',
          imageUrl: s.imageUrl,
          isCulprit: s.isCulprit,
        }))}
        relationships={[]} // Relationships can be added from case data if available
        isOpen={showSuspectNetwork}
        onClose={() => setShowSuspectNetwork(false)}
      />

      {/* Cinematic Scene Transition */}
      <FilmWipeTransition
        isActive={showSceneTransition}
        direction="left"
        onComplete={() => setShowSceneTransition(false)}
      />

      {/* Scene Title Card */}
      <SceneTitleCard
        isActive={showSceneTitle}
        title={currentScene.name}
        subtitle={currentScene.description || `Location ${currentSceneIndex + 1} of ${totalScenes}`}
        onComplete={() => setShowSceneTitle(false)}
      />

      {/* Case Solved Celebration */}
      <CaseSolvedTransition
        isActive={showCaseSolved}
        caseTitle={gameData.title}
        onComplete={() => setShowCaseSolved(false)}
      />
    </div>
  );
}
