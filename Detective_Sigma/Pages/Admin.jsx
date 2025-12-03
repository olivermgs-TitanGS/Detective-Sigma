import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Save, FileText, Puzzle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from "sonner";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Admin() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('cases');
    const [isEditing, setIsEditing] = useState(false);
    const [currentCase, setCurrentCase] = useState({});

    // Data Fetching
    const { data: cases, isLoading } = useQuery({
        queryKey: ['admin_cases'],
        queryFn: () => base44.entities.Case.list(),
    });

    // Mutations
    const createCaseMutation = useMutation({
        mutationFn: (data) => base44.entities.Case.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin_cases']);
            setIsEditing(false);
            toast.success("Case Created");
        }
    });

    const deleteCaseMutation = useMutation({
        mutationFn: (id) => base44.entities.Case.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin_cases']);
            toast.success("Case Deleted");
        }
    });

    // Seed Function for "On The Fly" fixes
    const handleSeed = async () => {
        try {
            // Check if case exists first to avoid dupes in this simple logic
            if (cases && cases.length > 0) {
                toast.info("Data already exists.");
                return;
            }
            
            await base44.entities.Case.create({
                title: "The Case of the Broken Ratio",
                description: "A high-stakes mystery at Singapore's elite Noir Academy. The Golden Ratio Artifact has been stolen.",
                difficulty: "Inspector",
                subject_focus: "Math",
                status: "Published",
                chapter_order: 1,
                cover_image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301"
            });
            
            queryClient.invalidateQueries(['admin_cases']);
            toast.success("System Seeded Successfully");
        } catch (error) {
            toast.error("Seeding Failed");
        }
    };

    const handleSaveCase = (e) => {
        e.preventDefault();
        createCaseMutation.mutate(currentCase);
    };

    return (
        <div className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-200">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-mono text-amber-500">ADMIN CONSOLE</h1>
                    <p className="text-slate-400">Content Management System</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSeed} className="border-amber-900 text-amber-600">
                        Re-Initialize Data
                    </Button>
                </div>
            </header>

            <Tabs defaultValue="cases" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="cases">Cases & Story</TabsTrigger>
                    <TabsTrigger value="analytics" disabled>Analytics (Pro)</TabsTrigger>
                    <TabsTrigger value="users" disabled>User Management</TabsTrigger>
                </TabsList>

                <TabsContent value="cases" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* List */}
                        <div className="md:col-span-1 space-y-4">
                            <Button className="w-full bg-amber-700 hover:bg-amber-600" onClick={() => { setCurrentCase({}); setIsEditing(true); }}>
                                <Plus className="w-4 h-4 mr-2" /> New Case
                            </Button>
                            
                            <div className="space-y-2">
                                {isLoading ? <p>Loading...</p> : cases?.map(c => (
                                    <Card key={c.id} className="bg-slate-900 border-slate-800 cursor-pointer hover:border-amber-500 transition-colors">
                                        <CardContent className="p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-slate-200">CH {c.chapter_order}: {c.title}</p>
                                                <p className="text-xs text-slate-500">{c.status}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteCaseMutation.mutate(c.id); }}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Editor */}
                        <div className="md:col-span-2">
                            {isEditing ? (
                                <Card className="bg-slate-900 border-slate-800">
                                    <CardHeader>
                                        <CardTitle>Case Editor</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSaveCase} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Title</Label>
                                                    <Input 
                                                        value={currentCase.title || ''} 
                                                        onChange={e => setCurrentCase({...currentCase, title: e.target.value})}
                                                        className="bg-slate-950 border-slate-700"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Chapter Order</Label>
                                                    <Input 
                                                        type="number"
                                                        value={currentCase.chapter_order || 1} 
                                                        onChange={e => setCurrentCase({...currentCase, chapter_order: parseInt(e.target.value)})}
                                                        className="bg-slate-950 border-slate-700"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Description (Story Hook)</Label>
                                                <Textarea 
                                                    value={currentCase.description || ''} 
                                                    onChange={e => setCurrentCase({...currentCase, description: e.target.value})}
                                                    className="bg-slate-950 border-slate-700"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Subject</Label>
                                                    <select 
                                                        className="w-full bg-slate-950 border border-slate-700 rounded-md p-2"
                                                        value={currentCase.subject_focus || 'Math'}
                                                        onChange={e => setCurrentCase({...currentCase, subject_focus: e.target.value})}
                                                    >
                                                        <option value="Math">Mathematics</option>
                                                        <option value="Science">Science</option>
                                                        <option value="Integrated">Integrated</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Difficulty</Label>
                                                    <select 
                                                        className="w-full bg-slate-950 border border-slate-700 rounded-md p-2"
                                                        value={currentCase.difficulty || 'Rookie'}
                                                        onChange={e => setCurrentCase({...currentCase, difficulty: e.target.value})}
                                                    >
                                                        <option value="Rookie">Rookie</option>
                                                        <option value="Inspector">Inspector</option>
                                                        <option value="Detective">Detective</option>
                                                        <option value="Chief">Chief</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-end gap-2 pt-4">
                                                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                                                    <Save className="w-4 h-4 mr-2" /> Save Case
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl">
                                    <p>Select "New Case" to add content or manage existing cases.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}