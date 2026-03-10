"use client";

import { useState, useEffect } from "react";
import { X, Brain, Plus, Trash2, ShieldCheck, Info } from "lucide-react";
import { apiGet, apiPost, apiFetch } from "@/lib/api";

interface MemoryFact {
    id: string;
    fact_text: string;
    created_at: string;
    is_pinned: boolean;
}

interface MemoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MemoryPanel({ isOpen, onClose }: MemoryPanelProps) {
    const [facts, setFacts] = useState<MemoryFact[]>([]);
    const [newFact, setNewFact] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) fetchFacts();
    }, [isOpen]);

    const fetchFacts = async () => {
        try {
            const data = await apiGet<MemoryFact[]>("/api/memory-facts");
            setFacts(data);
        } catch (e) {
            console.error("Failed to fetch memory facts", e);
        }
    };

    const handleAddFact = async () => {
        if (!newFact.trim()) return;
        setLoading(true);
        try {
            await apiPost("/api/memory-facts", { fact_text: newFact });
            setNewFact("");
            await fetchFacts();
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-amber-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                            <Brain size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-stone-800 leading-tight">Long-Term Memory</h2>
                            <p className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">Pinned Facts & Deep Context</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/50">
                        <div className="flex items-start gap-3 text-stone-600 mb-3">
                            <Info size={16} className="mt-0.5 text-amber-500" />
                            <p className="text-xs leading-relaxed">
                                Nuravya remembers these facts to provide better responses. You can manually add details or remove things you want me to forget.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all font-medium"
                                placeholder="Add a fact (e.g. I hate spicy food)"
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
                                <p className="text-sm text-stone-400 font-medium">No facts pinned yet.<br />I'll learn more as we talk.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {facts.map(fact => (
                                    <div key={fact.id} className="group p-4 bg-white border border-stone-100 rounded-2xl hover:border-amber-200 hover:shadow-sm transition-all flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                                            <p className="text-sm text-stone-700 font-medium leading-relaxed">{fact.fact_text}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteFact(fact.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-stone-100 bg-stone-50/50">
                    <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
                        <ShieldCheck size={14} className="text-green-500" />
                        <span>All memories are encrypted and private to you.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
