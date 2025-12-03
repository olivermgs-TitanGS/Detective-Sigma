import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Play, Star, AlertTriangle, Search } from 'lucide-react';

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
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto mb-12 text-center">
                <h2 className="text-4xl font-bold text-slate-100 mb-4 font-mono">CASE FILES</h2>
                <p className="text-slate-400 text-lg">Select a mystery to investigate. The city is counting on you, Detective.</p>
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

                    {sortedCases.map((c) => {
                        const status = getStatus(c.id);
                        
                        return (
                            <motion.div key={c.id} variants={item}>
                                <Card className="bg-slate-900 border-slate-800 overflow-hidden hover:border-amber-700/50 transition-all group h-full flex flex-col">
                                    <div className="relative h-48 bg-slate-950 overflow-hidden">
                                        <div className="absolute inset-0 bg-slate-900 opacity-50 group-hover:opacity-30 transition-opacity" />
                                        {c.cover_image ? (
                                            <img src={c.cover_image} alt={c.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-950">
                                                <AlertTriangle className="w-12 h-12 text-slate-800" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <Badge variant={status === 'solved' ? 'default' : 'secondary'} className={status === 'solved' ? 'bg-green-900 text-green-300 border-green-700' : 'bg-slate-800 text-slate-400 border-slate-700'}>
                                                {status === 'solved' ? 'EVIDENCE SECURED' : 'ACTIVE FILE'}
                                            </Badge>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent h-24" />
                                    </div>
                                    
                                    <CardHeader className="pb-2 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className="mb-2 border-amber-900/50 text-amber-600">{c.subject_focus}</Badge>
                                            <div className="flex gap-1">
                                                {[...Array(c.difficulty === 'Rookie' ? 1 : c.difficulty === 'Inspector' ? 2 : 3)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                ))}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-500 transition-colors">{c.title}</h3>
                                    </CardHeader>

                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-slate-400 line-clamp-3">{c.description}</p>
                                    </CardContent>

                                    <CardFooter className="pt-4 border-t border-slate-800/50">
                                        <Link to={createPageUrl(`Game?caseId=${c.id}`)} className="w-full">
                                            <Button className={`w-full text-white ${status === 'solved' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-amber-700 hover:bg-amber-600'}`}>
                                                {status === 'solved' ? 'Review Case Log' : 'Start Investigation'}
                                                <Play className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
}