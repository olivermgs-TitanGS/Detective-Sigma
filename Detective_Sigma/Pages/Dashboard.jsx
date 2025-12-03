import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Play, Star, AlertTriangle, Search, FileText, Stamp } from 'lucide-react';

export default function Dashboard() {
    const { data: cases, isLoading } = useQuery({
        queryKey: ['cases'],
        queryFn: () => base44.entities.Case.list(),
        initialData: []
    });

    const { data: progress } = useQuery({
        queryKey: ['progress'],
        queryFn: () => base44.entities.Progress.list(),
        initialData: []
    });

    // Determine the highest chapter completed to manage unlocks (Linear Story)
    const completedChapters = progress
        .filter(p => p.status === 'solved')
        .map(p => {
            const c = cases.find(c => c.id === p.case_id);
            return c ? c.chapter_order : 0;
        });
    const maxCompletedChapter = Math.max(0, ...completedChapters);

    const sortedCases = [...cases].sort((a, b) => (a.chapter_order || 99) - (b.chapter_order || 99));

    const getStatus = (caseId) => {
        const p = progress.find(p => p.case_id === caseId);
        if (p) return p.status;
        return 'new'; // Non-linear: All cases are accessible by default
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // Initial Seed if empty
    const seedData = async () => {
        // Check if cases exist, if not, seed them (handled by an effect or separate button usually, but let's do it if user clicks 'Refresh' or something if empty)
        // For now, assume data will be added by the 'Game' setup step
    };

    return (
        <div className="min-h-screen detective-desk">
            <div className="container mx-auto px-4 py-12">
                {/* Header styled as newspaper masthead */}
                <div className="max-w-4xl mx-auto mb-12 text-center">
                    <div className="case-paper inline-block px-12 py-6 rounded transform -rotate-1">
                        <div className="border-b-4 border-double border-amber-900/30 pb-4 mb-4">
                            <h2 className="newspaper-headline text-5xl text-amber-900 tracking-wider">CASE FILES</h2>
                        </div>
                        <p className="typewriter-text text-amber-800/70 text-lg">Select a mystery to investigate. The city is counting on you, Detective.</p>
                    </div>
                </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                </div>
            ) : (
                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {cases.length === 0 && (
                         <div className="col-span-full text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                             <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                             <h3 className="text-xl font-semibold text-slate-300">No Cases Assigned Yet</h3>
                             <p className="text-slate-500 mt-2">Check back later for new assignments.</p>
                             <Button onClick={() => window.location.reload()} variant="outline" className="mt-6 border-amber-900 text-amber-600 hover:bg-amber-950">
                                Check for Updates
                             </Button>
                         </div>
                    )}

                    {/* Master Mystery Banner */}
                    <div className="col-span-full mb-6">
                        <Link to={createPageUrl('MasterMystery')}>
                            <motion.div 
                                whileHover={{ scale: 1.01 }}
                                className="bg-gradient-to-r from-slate-900 to-slate-950 border border-amber-900/50 p-6 rounded-xl flex items-center justify-between shadow-lg cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-amber-900/20 p-3 rounded-lg border border-amber-900/50 group-hover:bg-amber-900/40 transition-colors">
                                        <Star className="w-8 h-8 text-amber-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-400 transition-colors">THE MASTER MYSTERY</h3>
                                        <p className="text-slate-400 text-sm">Piece together the truth from all solved cases.</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-amber-600 hover:text-amber-500 hover:bg-transparent">
                                    View Evidence Board <Search className="w-4 h-4 ml-2" />
                                </Button>
                            </motion.div>
                        </Link>
                    </div>

                    {sortedCases.map((c, index) => {
                        const status = getStatus(c.id);
                        const rotations = [-2, 1, -1, 2, 0, -1.5, 1.5];
                        const rotation = rotations[index % rotations.length];

                        return (
                            <motion.div key={c.id} variants={item}>
                                <div
                                    className="manila-folder rounded-lg overflow-hidden scattered-doc group h-full flex flex-col relative"
                                    style={{ transform: `rotate(${rotation}deg)` }}
                                >
                                    {/* Paper clip */}
                                    <div className="paper-clip" style={{ top: '-8px', right: '20px' }}></div>

                                    {/* Status stamp */}
                                    {status === 'solved' && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <div className="confidential-stamp text-[10px] px-2 py-1" style={{ color: '#166534', borderColor: '#166534' }}>
                                                CASE CLOSED
                                            </div>
                                        </div>
                                    )}

                                    {/* Case photo/cover */}
                                    <div className="relative m-3 mb-0">
                                        <div className="suspect-photo" style={{ transform: `rotate(${-rotation}deg)`, padding: '6px 6px 16px 6px' }}>
                                            {c.cover_image ? (
                                                <img
                                                    src={c.cover_image}
                                                    alt={c.title}
                                                    className="w-full h-32 object-cover sepia-photo group-hover:filter-none transition-all duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-32 flex items-center justify-center bg-amber-100">
                                                    <FileText className="w-12 h-12 text-amber-800/30" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Case info on paper */}
                                    <div className="case-paper m-3 p-4 rounded flex-grow flex flex-col" style={{ transform: `rotate(${rotation / 2}deg)` }}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="evidence-tag text-[9px]">{c.subject_focus}</span>
                                            <div className="flex gap-0.5">
                                                {[...Array(c.difficulty === 'Rookie' ? 1 : c.difficulty === 'Inspector' ? 2 : 3)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 text-amber-700 fill-amber-600" />
                                                ))}
                                            </div>
                                        </div>

                                        <h3 className="typewriter-text font-bold text-amber-900 text-lg mb-2 group-hover:text-red-800 transition-colors">
                                            {c.title}
                                        </h3>

                                        <p className="text-xs text-amber-800/60 font-serif line-clamp-3 flex-grow leading-relaxed">
                                            {c.description}
                                        </p>

                                        <div className="mt-4 pt-3 border-t border-amber-900/20">
                                            <Link to={createPageUrl(`Game?caseId=${c.id}`)} className="w-full">
                                                <Button
                                                    className={`w-full typewriter-text text-xs tracking-wider ${
                                                        status === 'solved'
                                                            ? 'bg-amber-800/20 hover:bg-amber-800/40 text-amber-900 border border-amber-800/30'
                                                            : 'bg-red-900 hover:bg-red-800 text-white border border-red-800'
                                                    }`}
                                                >
                                                    {status === 'solved' ? 'REVIEW CASE LOG' : 'OPEN INVESTIGATION'}
                                                    <Play className="w-3 h-3 ml-2" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Coffee stain on some folders */}
                                    {index % 4 === 0 && (
                                        <div
                                            className="absolute bottom-8 left-4 w-14 h-14 rounded-full pointer-events-none"
                                            style={{
                                                background: 'radial-gradient(ellipse at center, transparent 25%, rgba(101, 67, 33, 0.15) 35%, rgba(101, 67, 33, 0.08) 55%, transparent 65%)'
                                            }}
                                        />
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
}