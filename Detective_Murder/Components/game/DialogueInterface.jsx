import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, MessageSquare, X } from 'lucide-react';

export default function DialogueInterface({ suspect, onClose, onUpdateProgress }) {
    const [currentNodeId, setCurrentNodeId] = useState('root');
    const [history, setHistory] = useState([]);

    // Find current dialogue node
    const currentNode = suspect.dialogue_tree.find(n => n.id === currentNodeId) || suspect.dialogue_tree[0];

    const handleOptionClick = (option) => {
        setHistory([...history, { text: currentNode.text, type: 'npc' }, { text: option.label, type: 'player' }]);
        
        // Logic to unlock clues could go here
        if (option.required_clue_id) {
            // check if user has clue
        }
        
        if (option.next_id) {
            setCurrentNodeId(option.next_id);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-8 flex justify-center items-end pointer-events-none"
        >
            <Card className="w-full max-w-4xl bg-slate-900/95 border-slate-700 shadow-2xl backdrop-blur-xl pointer-events-auto flex overflow-hidden rounded-xl">
                {/* Character Portrait */}
                <div className="w-1/3 md:w-1/4 relative border-r border-slate-800">
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                    <img 
                        src={suspect.image_url} 
                        alt={suspect.name} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 z-20">
                        <div className="bg-black/60 backdrop-blur-md p-2 rounded border border-slate-700">
                            <p className="text-amber-500 font-bold text-sm truncate">{suspect.name}</p>
                            <p className="text-slate-400 text-xs truncate">{suspect.role}</p>
                        </div>
                    </div>
                </div>

                {/* Dialogue Box */}
                <div className="w-2/3 md:w-3/4 flex flex-col h-[300px]">
                    <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950/50">
                        <h3 className="text-slate-300 font-mono text-sm flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-amber-600" /> INTERROGATION IN PROGRESS
                        </h3>
                        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 rounded-full hover:bg-red-900/20 hover:text-red-500">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Scrollable History/Current Text */}
                    <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-900/50">
                        {history.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.type === 'player' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.type === 'player' ? 'bg-slate-800 text-slate-300' : 'bg-amber-900/20 text-amber-100 border border-amber-900/30'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        
                        <div className="flex justify-start">
                             <div className="max-w-[90%]">
                                <p className="text-lg text-white font-medium leading-relaxed typewriter-text">
                                    "{currentNode.text}"
                                </p>
                             </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentNode.options?.map((opt, idx) => (
                            <Button 
                                key={idx} 
                                variant="outline" 
                                onClick={() => handleOptionClick(opt)}
                                className="justify-start text-left h-auto py-3 border-slate-700 hover:bg-amber-950 hover:text-amber-200 hover:border-amber-800 transition-all"
                            >
                                <span className="mr-2 text-amber-600 font-mono">{idx + 1}.</span> {opt.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}