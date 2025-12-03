import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import SceneViewer from '@/components/game/SceneViewer';
import DialogueInterface from '@/components/game/DialogueInterface';
import PuzzleModal from '@/components/game/PuzzleModal';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Briefcase, Users, CheckCircle, Map, ChevronRight, ArrowLeft, MessageSquare, FileText, Stamp } from 'lucide-react';
import { toast } from "sonner";
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function Game() {
    const queryClient = useQueryClient();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const caseId = queryParams.get('caseId');

    // --- STATE ---
    const [currentSceneId, setCurrentSceneId] = useState(null);
    const [activeDialogueSuspect, setActiveDialogueSuspect] = useState(null);
    const [activePuzzle, setActivePuzzle] = useState(null);
    const [collectedClues, setCollectedClues] = useState([]);
    const [solvedPuzzles, setSolvedPuzzles] = useState([]);

    // --- QUERIES ---
    const { data: caseData } = useQuery({
        queryKey: ['case', caseId],
        queryFn: async () => (await base44.entities.Case.list({id: caseId}))[0],
        enabled: !!caseId
    });

    const { data: scenes } = useQuery({
        queryKey: ['scenes', caseId],
        queryFn: () => base44.entities.Scene.list({case_id: caseId}),
        enabled: !!caseId
    });

    const { data: suspects } = useQuery({
        queryKey: ['suspects', caseId],
        queryFn: () => base44.entities.Suspect.list({case_id: caseId}),
        enabled: !!caseId
    });

    const { data: clues } = useQuery({
        queryKey: ['clues', caseId],
        queryFn: () => base44.entities.Clue.list({case_id: caseId}),
        enabled: !!caseId
    });

    const { data: puzzles } = useQuery({
        queryKey: ['puzzles', caseId],
        queryFn: () => base44.entities.Puzzle.list({case_id: caseId}),
        enabled: !!caseId
    });

    // --- INITIALIZATION ---
    useEffect(() => {
        if (scenes && scenes.length > 0 && !currentSceneId) {
            const startScene = scenes.find(s => s.is_initial_scene) || scenes[0];
            setCurrentSceneId(startScene.id);
        }
    }, [scenes]);

    // --- HELPERS ---
    const currentScene = scenes?.find(s => s.id === currentSceneId);
    const cluesInCurrentScene = clues?.filter(c => c.scene_id === currentSceneId && !collectedClues.includes(c.id)) || [];
    // For demo, suspects are just "available" in the UI list, or we could place them in scenes. 
    // Let's put them in a "Suspects" sidebar for simplicity, or assume they are in specific scenes (would need scene_id in suspect entity).
    // For now, we'll access them via the 'Investigation' menu.

    // --- HANDLERS ---
    const handleInteractClue = (clue) => {
        if (clue.required_puzzle_id && !solvedPuzzles.includes(clue.required_puzzle_id)) {
            const puzzle = puzzles.find(p => p.id === clue.required_puzzle_id);
            setActivePuzzle(puzzle);
            return;
        }
        
        // Collect Clue
        collectClue(clue);
    };

    const collectClue = (clue) => {
        if (!collectedClues.includes(clue.id)) {
            setCollectedClues([...collectedClues, clue.id]);
            toast.success("CLUE FOUND", { description: `${clue.name} added to case file.` });
        }
    };

    const handlePuzzleSolve = (puzzleId) => {
        setSolvedPuzzles([...solvedPuzzles, puzzleId]);
        setActivePuzzle(null);
        
        // Auto-collect the related clue if any
        const relatedClue = clues.find(c => c.required_puzzle_id === puzzleId);
        if (relatedClue) {
            collectClue(relatedClue);
        }
    };

    const handleNavigate = (sceneId) => {
        setCurrentSceneId(sceneId);
    };

    const handleAccuse = (suspect) => {
        if (suspect.is_culprit) {
            // Case Solved!
            toast.success("CASE CLOSED", { 
                description: `Excellent work, Detective! ${suspect.name} has been apprehended. Next chapter unlocked.`,
                duration: 5000,
                style: { background: '#10B981', color: 'white', border: 'none' }
            });
            
            // Mark as Solved in Progress (Mocked)
            // In real implementation, call mutation here.
            
             setTimeout(() => {
                 window.location.href = createPageUrl('Dashboard');
             }, 3000);
        } else {
            toast.error("WRONG SUSPECT", { 
                description: "The evidence does not support this accusation. The real culprit got away.",
                duration: 5000,
                style: { background: '#EF4444', color: 'white', border: 'none' }
            });
        }
    };

    if (!caseData) return (
        <div className="bg-slate-950 min-h-screen flex flex-col items-center justify-center text-slate-400 font-mono gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p>ACCESSING ARCHIVES...</p>
        </div>
    );

    if (!currentScene) return (
        <div className="bg-slate-950 min-h-screen flex flex-col items-center justify-center text-red-500 font-mono gap-4">
            <p className="text-xl">ERROR: SCENE DATA CORRUPTED OR MISSING</p>
            <p className="text-sm text-slate-500">Please report this to the Administrator.</p>
            <Link to={createPageUrl('Dashboard')}>
                <Button variant="outline">Return to Dashboard</Button>
            </Link>
        </div>
    );

    return (
        <div className="bg-slate-950 min-h-screen text-slate-200 font-sans overflow-hidden flex flex-col">
            {/* Top HUD */}
            <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-40 relative shadow-md">
                <div className="flex items-center gap-4">
                    <Link to={createPageUrl('Dashboard')}>
                         <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                             <ArrowLeft className="w-4 h-4 mr-2" /> Exit Case
                         </Button>
                    </Link>
                    <div className="h-6 w-px bg-slate-700"></div>
                    <h1 className="font-bold text-amber-500 tracking-wider uppercase text-sm hidden md:block">
                        CASE: {caseData.title}
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-amber-950 hover:text-amber-500">
                                <Briefcase className="w-4 h-4 mr-2" /> Evidence ({collectedClues.length})
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="wood-texture border-l-4 border-amber-900/50 w-[450px] sm:w-[600px] overflow-hidden">
                            <SheetHeader className="relative">
                                <div className="absolute -top-2 -right-2 transform rotate-12">
                                    <div className="confidential-stamp text-xs">CLASSIFIED</div>
                                </div>
                                <SheetTitle className="newspaper-headline text-amber-900 text-2xl tracking-widest border-b-2 border-amber-800/30 pb-4 flex items-center gap-3">
                                    <Briefcase className="w-6 h-6" />
                                    EVIDENCE LOG
                                </SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="h-[80vh] mt-6 pr-4">
                                <div className="relative space-y-6 p-2">
                                    {collectedClues.length === 0 && (
                                        <div className="case-paper p-8 text-center rounded transform rotate-1">
                                            <FileText className="w-12 h-12 text-amber-800/30 mx-auto mb-3" />
                                            <p className="typewriter-text text-amber-900/60 italic">No evidence collected yet...</p>
                                            <p className="typewriter-text text-amber-900/40 text-xs mt-2">Search the scene for clues.</p>
                                        </div>
                                    )}

                                    {clues?.filter(c => collectedClues.includes(c.id)).map((clue, index) => {
                                        const rotations = [-2, 1, -1, 2, 0];
                                        const rotation = rotations[index % rotations.length];

                                        return (
                                            <motion.div
                                                key={clue.id}
                                                initial={{ opacity: 0, scale: 0.8, rotate: rotation * 2 }}
                                                animate={{ opacity: 1, scale: 1, rotate: rotation }}
                                                className="case-paper p-4 rounded scattered-doc relative"
                                                style={{ transform: `rotate(${rotation}deg)` }}
                                            >
                                                {/* Paper clip decoration */}
                                                <div className="paper-clip"></div>

                                                {/* Evidence number tag */}
                                                <div className="evidence-tag absolute -top-2 -left-2">
                                                    EVIDENCE #{String(index + 1).padStart(3, '0')}
                                                </div>

                                                <div className="flex gap-4 mt-4">
                                                    <div className="suspect-photo w-20 shrink-0" style={{ transform: `rotate(${-rotation}deg)` }}>
                                                        <img
                                                            src={clue.image_url}
                                                            alt={clue.name}
                                                            className="w-full aspect-square object-cover sepia-photo"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="typewriter-text font-bold text-lg text-amber-900">{clue.name}</h4>
                                                        <p className="text-xs text-amber-800/70 mt-1 font-serif leading-relaxed">{clue.description}</p>
                                                        {clue.content_revealed && (
                                                            <div className="mt-3 p-2 bg-amber-100/50 border-l-4 border-red-800 text-xs text-red-900 typewriter-text">
                                                                <span className="font-bold">ANALYSIS:</span> {clue.content_revealed}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Coffee stain on some papers */}
                                                {index % 3 === 0 && (
                                                    <div className="absolute bottom-2 right-4 w-12 h-12 rounded-full opacity-20"
                                                         style={{
                                                             background: 'radial-gradient(ellipse at center, transparent 30%, rgba(101, 67, 33, 0.4) 40%, rgba(101, 67, 33, 0.2) 60%, transparent 70%)'
                                                         }}
                                                    />
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-amber-950 hover:text-amber-500">
                                <Users className="w-4 h-4 mr-2" /> Suspects
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-slate-900 border-slate-800 text-slate-200">
                             <SheetHeader>
                                <SheetTitle className="text-red-500 font-mono uppercase tracking-widest border-b border-slate-800 pb-4">Suspect List</SheetTitle>
                            </SheetHeader>
                            <div className="grid gap-4 mt-4">
                                {suspects?.map(s => (
                                    <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-950 rounded border border-slate-800 hover:border-red-900 cursor-pointer transition-all" onClick={() => setActiveDialogueSuspect(s)}>
                                        <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-700">
                                            <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{s.name}</p>
                                            <p className="text-xs text-slate-500">{s.role}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <MessageSquare className="w-4 h-4 text-slate-600" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                    
                    <Button 
                        className="bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-700 animate-pulse ml-4"
                        onClick={() => document.getElementById('accusation-trigger').click()}
                    >
                        SOLVE CASE
                    </Button>

                    {/* Hidden Trigger for Accusation Modal reuse or separate component */}
                    <Sheet>
                        <SheetTrigger id="accusation-trigger" className="hidden" />
                        <SheetContent side="bottom" className="h-[80vh] bg-slate-950 border-t border-amber-900">
                            <SheetHeader className="text-center">
                                <SheetTitle className="text-3xl font-mono text-red-500 tracking-widest uppercase">Identify The Culprit</SheetTitle>
                                <p className="text-slate-400">Review your evidence. Select the suspect who committed the crime.</p>
                            </SheetHeader>
                            <div className="flex flex-wrap justify-center gap-8 mt-10">
                                {suspects?.map(s => (
                                    <motion.div 
                                        key={s.id}
                                        whileHover={{ scale: 1.05 }}
                                        className="group relative w-48 cursor-pointer"
                                        onClick={() => handleAccuse(s)}
                                    >
                                        <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-slate-700 group-hover:border-red-600 transition-colors relative">
                                            <img src={s.image_url} alt={s.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                            <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/20 transition-colors" />
                                        </div>
                                        <div className="mt-4 text-center">
                                            <h3 className="text-xl font-bold text-slate-200 group-hover:text-red-400">{s.name}</h3>
                                            <p className="text-sm text-slate-500">{s.role}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            {/* Main Game View */}
            <div className="flex-1 relative flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]">
                
                <div className="w-full max-w-6xl relative z-10">
                    {/* Scene */}
                    <SceneViewer 
                        scene={currentScene} 
                        cluesInScene={cluesInCurrentScene}
                        onInteractClue={handleInteractClue}
                    />
                </div>

                {/* Scene Navigation (Quick Travel for Demo) */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 pointer-events-none z-20">
                    <div className="bg-black/50 backdrop-blur-md p-2 rounded-full border border-slate-700 pointer-events-auto flex gap-2">
                        {scenes?.map(s => (
                             <Button 
                                key={s.id}
                                variant={currentSceneId === s.id ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => handleNavigate(s.id)}
                                className={`rounded-full text-xs ${currentSceneId === s.id ? 'bg-amber-700 text-white' : 'text-slate-400 hover:text-white'}`}
                             >
                                {s.name}
                             </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overlays */}
            <AnimatePresence>
                {activeDialogueSuspect && (
                    <DialogueInterface 
                        suspect={activeDialogueSuspect} 
                        onClose={() => setActiveDialogueSuspect(null)} 
                    />
                )}
                {activePuzzle && (
                    <PuzzleModal 
                        puzzle={activePuzzle} 
                        onSolve={handlePuzzleSolve}
                        onClose={() => setActivePuzzle(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}