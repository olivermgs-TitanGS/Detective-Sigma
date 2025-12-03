import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, Shield, Star } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Leaderboard() {
    // Mock Data for now as we don't have many users
    const topDetectives = [
        { name: "Detective Sherlock", score: 15400, cases: 12, rank: "Chief" },
        { name: "Inspector Gadget", score: 12300, cases: 9, rank: "Inspector" },
        { name: "Rookie Holmes", score: 8900, cases: 5, rank: "Detective" },
        { name: "Agent Smith", score: 6500, cases: 4, rank: "Rookie" },
        { name: "Nancy Drew", score: 4200, cases: 3, rank: "Rookie" },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
             <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-100 mb-4 font-mono flex items-center justify-center gap-3">
                    <Trophy className="text-amber-500 w-10 h-10" />
                    TOP DETECTIVES
                </h1>
                <p className="text-slate-400 text-lg">The finest minds in the academy. Will you join their ranks?</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
                {topDetectives.map((d, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-6 hover:border-amber-700/50 transition-colors relative overflow-hidden group">
                         {/* Rank Number */}
                         <div className="w-12 h-12 flex items-center justify-center font-bold text-2xl text-slate-700 font-mono z-10">
                             #{i + 1}
                         </div>
                         
                         {/* Avatar */}
                         <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 z-10">
                             {i === 0 ? <Medal className="text-amber-400" /> : i === 1 ? <Medal className="text-slate-400" /> : i === 2 ? <Medal className="text-amber-700" /> : <Shield className="text-slate-600" />}
                         </div>

                         {/* Info */}
                         <div className="flex-grow z-10">
                             <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                                 {d.name}
                                 {i < 3 && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                             </h3>
                             <div className="flex gap-4 text-xs text-slate-500 mt-1 font-mono">
                                 <span>{d.cases} CASES SOLVED</span>
                                 <span>|</span>
                                 <span className="text-amber-600">{d.rank.toUpperCase()}</span>
                             </div>
                         </div>

                         {/* Score */}
                         <div className="text-right z-10">
                             <p className="text-2xl font-bold text-amber-500 font-mono">{d.score.toLocaleString()}</p>
                             <p className="text-xs text-slate-600">XP</p>
                         </div>

                         {/* Background Effect */}
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
        </div>
    );
}