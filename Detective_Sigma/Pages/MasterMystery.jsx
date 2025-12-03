import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Map, Lock, Unlock, AlertTriangle, ArrowRight, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";

export default function MasterMystery() {
    const [deduction, setDeduction] = useState('');

    const { data: progress } = useQuery({
        queryKey: ['progress'],
        queryFn: () => base44.entities.Progress.list(),
        initialData: []
    });

    const { data: cases } = useQuery({
        queryKey: ['cases'],
        queryFn: () => base44.entities.Case.list(),
        initialData: []
    });

    // Gather revealed master clues from solved cases
    const solvedCaseIds = progress.filter(p => p.status === 'solved').map(p => p.case_id);
    const revealedFragments = cases
        .filter(c => solvedCaseIds.includes(c.id) && c.master_clue_fragment)
        .map(c => ({
            caseTitle: c.title,
            fragment: c.master_clue_fragment
        }));

    const totalFragments = cases.filter(c => c.master_clue_fragment).length;
    const collectedFragments = revealedFragments.length;
    const isReadyToSolve = totalFragments > 0 && collectedFragments === totalFragments;

    const handleSubmitDeduction = (e) => {
        e.preventDefault();
        // Hardcoded "Master Answer" for demo purposes. In a real app, this would be in a MasterMystery entity or backend check.
        // Let's assume the master mystery answer is "The Principal".
        if (deduction.toLowerCase().includes("principal")) {
            toast.success("GRAND MYSTERY SOLVED!", { description: "You have uncovered the truth behind Noir Academy." });
        } else {
            toast.error("INCORRECT DEDUCTION", { description: "Re-examine the evidence fragments. Something doesn't add up." });
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <div className="max-w-5xl mx-auto space-y-12">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-block p-3 rounded-full bg-slate-900 border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                        <Brain className="w-10 h-10 text-amber-500" />
                    </div>
                    <h1 className="text-5xl font-bold text-slate-100 font-mono tracking-tight">THE MASTER MYSTERY</h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Each case you solve provides a fragment of the truth. Combine them here to solve the ultimate crime: <span className="text-amber-500 font-bold">Who is the 'Professor of Crime'?</span>
                    </p>
                </div>

                {/* Evidence Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cases.map((c, index) => {
                        const isSolved = solvedCaseIds.includes(c.id);
                        
                        return (
                            <motion.div 
                                key={c.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className={`h-full border-2 ${isSolved ? 'bg-slate-900 border-amber-900/50' : 'bg-slate-950 border-slate-800 border-dashed'} relative overflow-hidden`}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-mono uppercase text-slate-500 flex justify-between items-center">
                                            <span>Evidence #{index + 1}</span>
                                            {isSolved ? <Unlock className="w-4 h-4 text-green-500" /> : <Lock className="w-4 h-4 text-slate-700" />}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {isSolved ? (
                                            <div className="space-y-2">
                                                <p className="text-amber-100 font-medium font-serif text-lg italic">
                                                    "{c.master_clue_fragment || 'No master clue found in this case.'}"
                                                </p>
                                                <p className="text-xs text-amber-600/50 mt-2 text-right">
                                                    — From: {c.title}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-24 text-slate-700 gap-2">
                                                <Database className="w-8 h-8 opacity-20" />
                                                <p className="text-xs font-mono">DATA FRAGMENT ENCRYPTED</p>
                                                <Link to={createPageUrl(`Game?caseId=${c.id}`)}>
                                                    <Button variant="link" className="text-slate-500 hover:text-amber-500 h-auto p-0 text-xs">
                                                        Solve Case to Decrypt
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </CardContent>
                                    {isSolved && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none" />}
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Final Deduction Input */}
                <Card className="bg-slate-900 border-amber-600/30 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl text-slate-200">
                            <Map className="w-6 h-6 text-amber-600" />
                            FINAL DEDUCTION
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-black/40 rounded border border-slate-800 text-slate-400 text-sm font-mono leading-relaxed">
                            <p className="mb-2">INSTRUCTIONS:</p>
                            <p>1. Analyze the fragments above.</p>
                            <p>2. Identify the pattern, location, or person linking all cases.</p>
                            <p>3. Enter your conclusion below to issue an arrest warrant.</p>
                        </div>

                        <form onSubmit={handleSubmitDeduction} className="flex gap-4">
                            <Input 
                                value={deduction}
                                onChange={(e) => setDeduction(e.target.value)}
                                placeholder="Who is the mastermind? Enter name..."
                                className="bg-slate-950 border-slate-700 text-lg h-12 font-mono"
                                disabled={!isReadyToSolve}
                            />
                            <Button 
                                type="submit" 
                                disabled={!isReadyToSolve || !deduction}
                                className="h-12 px-8 bg-amber-600 hover:bg-amber-700 text-white font-bold tracking-widest"
                            >
                                SOLVE
                            </Button>
                        </form>
                        {!isReadyToSolve && (
                            <p className="text-center text-red-500 text-xs font-mono animate-pulse">
                                <AlertTriangle className="w-3 h-3 inline mr-1" />
                                INSUFFICIENT EVIDENCE. COMPLETE MORE CASES.
                            </p>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}