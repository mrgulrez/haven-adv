"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar, BookOpen, Sparkles, Filter } from "lucide-react";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { format } from "date-fns";

interface JournalEntry {
    id: string;
    entry_date: string;
    content: string;
    mood_summary: string;
    key_topics: string[];
    created_at: string;
}

export default function JournalPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const data = await apiGet<JournalEntry[]>("/api/journal");
                setEntries(data || []);
            } catch (error) {
                console.error("Failed to fetch journal entries:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEntries();
    }, []);

    const getMoodEmoji = (mood: string) => {
        const m = mood.toLowerCase();
        if (m.includes("happy") || m.includes("great") || m.includes("productive")) return "😊";
        if (m.includes("sad") || m.includes("anxious") || m.includes("tired")) return "😔";
        if (m.includes("reflective") || m.includes("neutral")) return "🤔";
        return "☀️";
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
                        <h1 className="text-xl font-heading font-bold tracking-tight">Daily Journal</h1>
                    </div>
                    <BookOpen className="text-amber-500" size={24} />
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-rotate" />
                        <p className="text-stone-500 font-medium">Reliving your memories...</p>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 shadow-sm px-6">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="text-amber-500" size={32} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">No entries yet</h3>
                        <p className="text-stone-500 max-w-xs mx-auto">
                            I'll automatically write a journal entry for you after our daily conversations. 
                            Start chatting to see your story unfold!
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {entries.map((entry, index) => (
                            <motion.article 
                                key={entry.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 text-sm font-bold text-amber-600 uppercase tracking-wider mb-1">
                                                <Calendar size={14} />
                                                {format(new Date(entry.entry_date), "MMMM d, yyyy")}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{getMoodEmoji(entry.mood_summary)}</span>
                                                <span className="text-stone-500 text-sm font-medium capitalize">
                                                    Feeling {entry.mood_summary}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose prose-stone max-w-none">
                                        {entry.content.split("\n").map((para, i) => (
                                            <p key={i} className="text-stone-700 leading-relaxed mb-4 last:mb-0">
                                                {para}
                                            </p>
                                        ))}
                                    </div>

                                    {entry.key_topics?.length > 0 && (
                                        <div className="mt-6 flex flex-wrap gap-2">
                                            {entry.key_topics.map((topic, i) => (
                                                <span 
                                                    key={i} 
                                                    className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded-full border border-stone-200/50"
                                                >
                                                    #{topic.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
