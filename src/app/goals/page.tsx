"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, 
    Target, 
    Plus, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    Trash2,
    Zap
} from "lucide-react";
import Link from "next/link";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface Goal {
    id: string;
    title: string;
    description?: string;
    target_date?: string;
    status: string;
    progress_notes: { date: string; note: string }[];
    created_at: string;
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showNewGoal, setShowNewGoal] = useState(false);
    
    // New Goal Form
    const [newGoal, setNewGoal] = useState({
        title: "",
        description: "",
        target_date: ""
    });

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const data = await apiGet<Goal[]>("/api/goals");
            setGoals(data || []);
        } catch (error) {
            console.error("Failed to fetch goals:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoal.title) return;

        try {
            await apiPost("/api/goals", newGoal);
            setNewGoal({ title: "", description: "", target_date: "" });
            setShowNewGoal(false);
            fetchGoals();
        } catch (error) {
            console.error("Failed to create goal:", error);
        }
    };

    const handleComplete = async (id: string) => {
        try {
            await apiPut(`/api/goals/${id}/complete`, {});
            fetchGoals();
        } catch (error) {
            console.error("Failed to complete goal:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to abandon this goal?")) return;
        try {
            await apiDelete(`/api/goals/${id}`);
            fetchGoals();
        } catch (error) {
            console.error("Failed to delete goal:", error);
        }
    };

    const getRemainingDays = (dateStr?: string) => {
        if (!dateStr) return null;
        const target = new Date(dateStr);
        const now = new Date();
        const diffTime = target.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200 px-4 py-4 sm:px-6">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/chat" className="p-2 -ml-2 text-stone-500 hover:text-stone-900 transition-colors">
                            <ChevronLeft size={24} />
                        </Link>
                        <h1 className="text-xl font-heading font-bold tracking-tight">Active Goals</h1>
                    </div>
                    <Button
                        type="button"
                        size="icon"
                        aria-label="Create a new goal"
                        onClick={() => setShowNewGoal(true)}
                        className="bg-amber-500 text-stone-950 shadow-lg shadow-amber-200"
                    >
                        <Plus size={20} />
                    </Button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg shadow-amber-100">
                        <div className="flex items-center gap-2 mb-2 opacity-80">
                            <Target size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Active</span>
                        </div>
                        <div className="text-3xl font-bold">{goals.length}</div>
                        <div className="text-xs mt-1 opacity-70">Focusing on these</div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-stone-400">
                            <Zap size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Consistency</span>
                        </div>
                        <div className="text-3xl font-bold text-stone-700">85%</div>
                        <div className="text-xs mt-1 text-stone-500">Last 7 days</div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-rotate" />
                        <p className="text-stone-500 font-medium">Tracking your progress...</p>
                    </div>
                ) : goals.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-sm px-6">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="text-amber-500" size={32} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Dream something big</h3>
                        <p className="text-stone-500 max-w-xs mx-auto mb-6">
                            You haven't set any goals yet. I can help you stay accountable and motivated.
                        </p>
                        <button 
                            onClick={() => setShowNewGoal(true)}
                            className="bg-amber-100 text-amber-700 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-amber-200 transition-colors"
                        >
                            Set a Goal
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {goals.map((goal, index) => {
                            const daysLeft = getRemainingDays(goal.target_date);
                            return (
                                <motion.div 
                                    key={goal.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 hover:border-amber-200 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-stone-900 mb-1">{goal.title}</h3>
                                            {goal.description && (
                                                <p className="text-stone-500 text-sm mb-4 line-clamp-2">{goal.description}</p>
                                            )}
                                            
                                            <div className="flex flex-wrap gap-4">
                                                {goal.target_date && (
                                                    <div className={`flex items-center gap-1.5 text-xs font-bold ${daysLeft !== null && daysLeft < 0 ? 'text-rose-500' : 'text-stone-400'}`}>
                                                        <Calendar size={14} />
                                                        {format(new Date(goal.target_date), "MMM d, yyyy")}
                                                        {daysLeft !== null && (
                                                            <span className="ml-1 opacity-60">
                                                                ({daysLeft < 0 ? 'Overdue' : `${daysLeft}d left`})
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-400">
                                                    <Clock size={14} />
                                                    Started {format(new Date(goal.created_at), "MMM d")}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col gap-2">
                                            <button 
                                                onClick={() => handleComplete(goal.id)}
                                                className="w-10 h-10 rounded-full bg-stone-50 text-stone-400 hover:bg-green-50 hover:text-green-500 flex items-center justify-center transition-colors"
                                                title="Complete Target"
                                            >
                                                <CheckCircle2 size={22} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(goal.id)}
                                                className="w-10 h-10 rounded-full bg-stone-50 text-stone-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-colors"
                                                title="Abandon Goal"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar (Simulated based on notes) */}
                                    <div className="mt-6">
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
                                            <span>Progress</span>
                                            <span>{Math.min(100, (goal.progress_notes.length * 20) + 10)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, (goal.progress_notes.length * 20) + 10)}%` }}
                                                className="h-full bg-amber-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* New Goal Modal */}
            <AnimatePresence>
                {showNewGoal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl"
                        >
                            <h2 className="text-2xl font-heading font-bold mb-6">Set a New Goal</h2>
                            <form onSubmit={handleCreateGoal} className="flex flex-col gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Title</label>
                                    <input 
                                        autoFocus
                                        required
                                        type="text" 
                                        placeholder="What do you want to achieve?"
                                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all text-stone-800 font-medium"
                                        value={newGoal.title}
                                        onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Detail (Optional)</label>
                                    <textarea 
                                        placeholder="Add some details or motivation..."
                                        rows={3}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all text-stone-800 font-medium resize-none"
                                        value={newGoal.description}
                                        onChange={e => setNewGoal({...newGoal, description: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Target Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all text-stone-800 font-medium"
                                        value={newGoal.target_date}
                                        onChange={e => setNewGoal({...newGoal, target_date: e.target.value})}
                                    />
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setShowNewGoal(false)}
                                        className="flex-1 px-6 py-3 rounded-2xl font-bold text-stone-500 hover:bg-stone-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-amber-600 shadow-lg shadow-amber-200 active:scale-95 transition-all"
                                    >
                                        Start Goal
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
