import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function SceneViewer({ scene, onNavigate, onInspect, cluesInScene, onInteractClue }) {
    if (!scene) return <div className="w-full h-[60vh] bg-black flex items-center justify-center text-slate-500">Loading Scene...</div>;

    return (
        <div className="relative w-full h-[70vh] bg-slate-950 rounded-lg overflow-hidden border-2 border-slate-800 shadow-2xl shadow-black">
            {/* Scene Image */}
            <div className="absolute inset-0">
                <img 
                    src={scene.image_url} 
                    alt={scene.name} 
                    className="w-full h-full object-cover filter brightness-50 contrast-125 hover:brightness-75 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
            </div>

            {/* Scene Header */}
            <div className="absolute top-0 left-0 p-6 w-full bg-gradient-to-b from-black/90 to-transparent z-10">
                <h2 className="text-3xl font-bold text-slate-100 font-mono tracking-widest flex items-center gap-3">
                    <MapPin className="text-amber-600 w-6 h-6" />
                    {scene.name.toUpperCase()}
                </h2>
                <p className="text-slate-400 mt-1 max-w-2xl font-mono text-sm border-l-2 border-amber-600 pl-3">
                    {scene.description}
                </p>
            </div>

            {/* Interactive Clues Layer */}
            <div className="absolute inset-0 z-20">
                {cluesInScene.map((clue, index) => {
                    // Random positioning for demo purposes since we don't have coords in DB yet
                    // In a real app, you'd store x/y percentages in the Clue entity
                    const positions = [
                        { top: '60%', left: '30%' },
                        { top: '40%', left: '70%' },
                        { top: '80%', left: '50%' }
                    ];
                    const pos = positions[index % positions.length] || { top: '50%', left: '50%' };

                    return (
                        <TooltipProvider key={clue.id}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.button
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                        className="absolute w-12 h-12 bg-amber-500/20 border border-amber-500/50 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm hover:bg-amber-500/40 transition-colors"
                                        style={pos}
                                        onClick={() => onInteractClue(clue)}
                                    >
                                        {clue.is_hidden ? (
                                            <Search className="w-5 h-5 text-amber-200 animate-pulse" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-green-400" />
                                        )}
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-slate-900 border-amber-900 text-amber-100 font-mono">
                                    <p>Inspect {clue.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    );
                })}
            </div>

             {/* Navigation Overlay - Bottom */}
             <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black to-transparent flex justify-between items-end z-30">
                <div className="flex gap-4">
                    {/* Only showing back button logic can be handled by parent */}
                </div>
            </div>
        </div>
    );
}