import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Calculator, FlaskConical, BrainCircuit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";

export default function PuzzleModal({ puzzle, onSolve, onClose }) {
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Normalize answer for string comparison (basic)
        const normalizedInput = answer.toString().toLowerCase().trim();
        const normalizedCorrect = puzzle.correct_answer.toString().toLowerCase().trim();

        if (normalizedInput === normalizedCorrect) {
            toast.success("PUZZLE SOLVED", { description: "Access granted. Clue unlocked." });
            onSolve(puzzle.id);
        } else {
            setError(true);
            toast.error("ACCESS DENIED", { description: "Incorrect solution. Try again." });
            setTimeout(() => setError(false), 500);
        }
    };

    const getIcon = () => {
        switch(puzzle.type) {
            case 'math_word': return <Calculator className="w-6 h-6 text-blue-400" />;
            case 'science_inquiry': return <FlaskConical className="w-6 h-6 text-green-400" />;
            case 'logic_cipher': return <BrainCircuit className="w-6 h-6 text-purple-400" />;
            default: return <Lock className="w-6 h-6 text-slate-400" />;
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-full max-w-md bg-slate-900 border-2 ${error ? 'border-red-500' : 'border-amber-600'} rounded-xl shadow-2xl overflow-hidden`}
            >
                {/* Header */}
                <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                            {getIcon()}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-100 font-mono">{puzzle.title}</h3>
                            <Badge variant="outline" className="text-xs">{puzzle.type.replace('_', ' ').toUpperCase()}</Badge>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="prose prose-invert">
                        <p className="text-lg font-medium leading-relaxed text-slate-200">
                            {puzzle.question_text}
                        </p>
                    </div>

                    {puzzle.question_image && (
                        <img src={puzzle.question_image} alt="Puzzle context" className="w-full rounded-lg border border-slate-700" />
                    )}

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {puzzle.options && puzzle.options.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2">
                                {puzzle.options.map((opt, i) => (
                                    <Button 
                                        key={i} 
                                        type="button"
                                        variant={answer === opt ? "default" : "outline"}
                                        className={`justify-start h-auto py-3 px-4 text-left ${answer === opt ? 'bg-amber-600 hover:bg-amber-700 border-amber-500' : 'bg-slate-950 border-slate-700 hover:bg-slate-800'}`}
                                        onClick={() => setAnswer(opt)}
                                    >
                                        <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs mr-3 border border-slate-600">
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        {opt}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="answer" className="text-slate-400">Enter Solution Code</Label>
                                <Input 
                                    id="answer"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className="bg-slate-950 border-slate-700 text-lg font-mono tracking-wider text-center"
                                    placeholder="TYPE ANSWER..."
                                    autoFocus
                                />
                            </div>
                        )}

                        {/* Hint Section */}
                        {showHint && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="bg-amber-900/20 border border-amber-900/50 p-3 rounded text-sm text-amber-200"
                            >
                                <span className="font-bold">HINT:</span> {puzzle.hint}
                            </motion.div>
                        )}

                        <div className="flex justify-between items-center pt-4">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                className="text-slate-500 hover:text-amber-400"
                                onClick={() => setShowHint(!showHint)}
                            >
                                {showHint ? 'Hide Hint' : 'Need a Hint?'}
                            </Button>
                            
                            <Button 
                                type="submit" 
                                className="bg-green-700 hover:bg-green-600 text-white px-8 font-bold tracking-wider"
                                disabled={!answer}
                            >
                                {error ? 'ERROR' : 'UNLOCK'}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}