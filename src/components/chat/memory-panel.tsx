"use client";

import React, { useState, useEffect } from "react";
import { X, Brain, Plus, Trash2, ShieldCheck, Info, Target, BookOpen, Clock, Bell, CheckCircle2, TrendingUp } from "lucide-react";
import { apiGet, apiPost, apiFetch } from "@/lib/api";
import Link from "next/link";
import { format } from "date-fns";

interface MemoryFact {
    id: string;
    fact_text: string;
    created_at: string;
    is_pinned: boolean;
}

interface Reminder {
    id: string;
    title: string;
    description?: string;
    remind_at: string;
    status: string;
}

interface MemoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MemoryPanel({ isOpen, onClose }: MemoryPanelProps) {
    const [facts, setFacts] = useState<MemoryFact[]>([]);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [activeTab, setActiveTab] = useState<"facts" | "reminders" | "companion">("facts");
    const [newFact, setNewFact] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchFacts();
            fetchReminders();
        }
    }, [isOpen]);

    const fetchFacts = async () => {
        try {
            const data = await apiGet<MemoryFact[]>("/api/memory-facts");
            setFacts(data || []);
        } catch (e) {
            console.error("Failed to fetch memory facts", e);
        }
    };

    const fetchReminders = async () => {
        try {
            const data = await apiGet<Reminder[]>("/api/reminders");
            setReminders(data || []);
        } catch (e) {
            console.error("Failed to fetch reminders", e);
        }
    };

    const handleAddFact = async () => {
        if (!newFact.trim()) return;
        setLoading(true);
        try {
            const res = await apiPost("/api/memory-facts", { fact_text: newFact });
            if (res) {
                setNewFact("");
                await fetchFacts();
            }
        } catch (e) {
            console.error("Add fact failed", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFact = async (id: string) => {
        try {
            await apiFetch(`/api/memory-facts/${id}`, { method: "DELETE" });
            setFacts(f => f.filter(x => x.id !== id));
        } catch (e) {
            console.error("Delete fact failed", e);
        }
    };

    const handleDismissReminder = async (id: string) => {
        try {
            await apiFetch(`/api/reminders/${id}`, { method: "DELETE" });
            setReminders(r => r.filter(x => x.id !== id));
        } catch (e) {
            console.error("Dismiss reminder failed", e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="px-6 py-4 pt-safe border-b border-stone-100 flex flex-col gap-4 bg-amber-50/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                                <Brain size={20} />
                            </div>
                            <div className="py-1">
                                <h2 className="font-bold text-stone-800 leading-tight">Assistant Hub</h2>
                                <p className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">Memory & Agentic Features</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-2 -mr-2 hover:bg-stone-200/50 rounded-full text-stone-400 hover:text-stone-600 transition-all active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex bg-stone-200/50 p-1 rounded-xl">
                        <button 
                            onClick={() => setActiveTab("facts")}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "facts" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
                        >
                            Facts
                        </button>
                        <button 
                            onClick={() => setActiveTab("reminders")}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "reminders" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"} flex items-center justify-center gap-1.5`}
                        >
                            Reminders
                            {reminders.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                        </button>
                        <button 
                            onClick={() => setActiveTab("companion")}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "companion" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
                        >
                            Insights
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === "facts" && (
                        <div className="space-y-6">
                            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/50">
                                <div className="flex items-start gap-3 text-stone-600 mb-3">
                                    <Info size={16} className="mt-0.5 text-amber-500" />
                                    <p className="text-xs leading-relaxed">
                                        Nuravya remembers these facts to provide better responses. You can manually add details or remove things.
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-400 font-medium"
                                        placeholder="Add a fact (e.g. My birthday is Aug 10)"
                                        value={newFact}
                                        onChange={e => setNewFact(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleAddFact()}
                                    />
                                    <button
                                        onClick={handleAddFact}
                                        disabled={loading}
                                        className="p-2 bg-amber-400 text-white rounded-xl hover:bg-amber-500 transition-colors disabled:opacity-50"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Current Knowledge</h3>
                                {facts.length === 0 ? (
                                    <div className="text-center py-12 px-4 border-2 border-dashed border-stone-100 rounded-3xl">
                                        <p className="text-sm text-stone-400 font-medium">No facts pinned yet.<br />I'll learn from our chats.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {facts.map(fact => (
                                            <div key={fact.id} className="group p-4 bg-white border border-stone-100 rounded-2xl hover:border-amber-200 transition-all flex items-start justify-between gap-3 shadow-sm">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                                    <p className="text-sm text-stone-700 font-medium leading-relaxed">{fact.fact_text}</p>
                                                </div>
                                                <button onClick={() => handleDeleteFact(fact.id)} className="opacity-0 group-hover:opacity-100 p-1 text-stone-300 hover:text-red-400 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "reminders" && (
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Active Reminders</h3>
                            {reminders.length === 0 ? (
                                <div className="text-center py-20 bg-stone-50/50 rounded-3xl border border-stone-100">
                                    <Bell className="mx-auto text-stone-300 mb-3" size={32} />
                                    <p className="text-sm text-stone-400 font-medium">No pending reminders.<br />Tell me: "Remind me at 6 PM..."</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {reminders.map(reminder => (
                                        <div key={reminder.id} className="p-4 bg-white border border-stone-100 rounded-2xl shadow-sm flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-stone-800 mb-1">{reminder.title}</h4>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                                                    <Clock size={12} />
                                                    {format(new Date(reminder.remind_at), "MMM d, h:mm a")}
                                                </div>
                                            </div>
                                            <button onClick={() => handleDismissReminder(reminder.id)} className="p-1.5 text-stone-300 hover:text-green-500 transition-colors">
                                                <CheckCircle2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "companion" && (
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Companion Features</h3>
                            
                            <Link href="/journal" onClick={onClose} className="block group">
                                <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-3xl group-hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                                            <BookOpen size={20} />
                                        </div>
                                        <div className="text-[10px] font-bold text-amber-600 bg-white px-2 py-0.5 rounded-full border border-amber-100">UPDATED DAILY</div>
                                    </div>
                                    <h4 className="font-bold text-stone-800 mb-1">Daily Journal</h4>
                                    <p className="text-xs text-stone-500 leading-relaxed">Let me capture your thoughts and moods from our daily conversations.</p>
                                </div>
                            </Link>

                            <Link href="/goals" onClick={onClose} className="block group">
                                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl group-hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                                            <Target size={20} />
                                        </div>
                                        <div className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-full border border-blue-100">ACCOUNTABILITY</div>
                                    </div>
                                    <h4 className="font-bold text-stone-800 mb-1">Growth & Goals</h4>
                                    <p className="text-xs text-stone-500 leading-relaxed">Set trackable goals and I'll keep you accountable on your journey.</p>
                                </div>
                            </Link>

                            <div className="p-5 bg-stone-50 border border-stone-200 rounded-3xl opacity-60">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-stone-400 shadow-sm">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-stone-800 text-sm">Life Insights</h4>
                                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">SOON</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-stone-100 bg-stone-50/50">
                    <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
                        <ShieldCheck size={14} className="text-green-500" />
                        <span>Private, encrypted, and yours alone.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
