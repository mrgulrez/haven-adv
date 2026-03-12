"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiFetch } from "@/lib/api";
import {
    Brain,
    MessageSquare,
    Clock,
    Trash2,
    ChevronRight,
    Shield,
    BarChart3,
    Loader2,
    ArrowLeft,
    AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MemoryStats {
    total_conversations: number;
    total_messages: number;
    memory_since: string | null;
    encrypted: boolean;
}

interface ConversationItem {
    id: string;
    session_id: string;
    started_at: string | null;
    message_count: number;
    mode: string;
}

interface MessageItem {
    id: string;
    role: string;
    content: string;
    emotion: string | null;
    created_at: string | null;
}

export default function MemoryPage() {
    const { user, nuravyaUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<MemoryStats | null>(null);
    const [conversations, setConversations] = useState<ConversationItem[]>([]);
    const [selectedConv, setSelectedConv] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [deletingAll, setDeletingAll] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) router.push("/");
    }, [user, authLoading, router]);

    // Fetch stats and conversations
    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsData, convData] = await Promise.all([
                    apiGet<MemoryStats>("/api/memory/stats"),
                    apiGet<ConversationItem[]>("/api/memory/conversations?limit=50"),
                ]);
                setStats(statsData);
                setConversations(convData);
            } catch (err) {
                console.warn("Failed to load memory:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const loadMessages = async (convId: string) => {
        setSelectedConv(convId);
        setMessagesLoading(true);
        try {
            const msgs = await apiGet<MessageItem[]>(`/api/memory/conversations/${convId}/messages`);
            setMessages(msgs);
        } catch (err) {
            console.warn("Failed to load messages:", err);
        } finally {
            setMessagesLoading(false);
        }
    };

    const deleteConversation = async (convId: string) => {
        if (!confirm("Permanently delete this conversation?")) return;
        setDeleting(convId);
        try {
            await apiFetch(`/api/memory/conversations/${convId}`, { method: "DELETE" });
            setConversations((prev) => prev.filter((c) => c.id !== convId));
            if (selectedConv === convId) {
                setSelectedConv(null);
                setMessages([]);
            }
            // Refresh stats
            const newStats = await apiGet<MemoryStats>("/api/memory/stats");
            setStats(newStats);
        } catch (err) {
            console.warn("Failed to delete:", err);
        } finally {
            setDeleting(null);
        }
    };

    const deleteAllMemory = async () => {
        if (!confirm("⚠️ This will permanently delete ALL your conversations and memories. This action cannot be undone. Are you sure?")) return;
        setDeletingAll(true);
        try {
            await apiFetch("/api/memory/all", { method: "DELETE" });
            setConversations([]);
            setMessages([]);
            setSelectedConv(null);
            setStats({ total_conversations: 0, total_messages: 0, memory_since: null, encrypted: true });
        } catch (err) {
            console.warn("Failed to delete all:", err);
        } finally {
            setDeletingAll(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isPaid = nuravyaUser?.plan === "core" || nuravyaUser?.plan === "pro";

    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <div className="flex-grow pt-safe md:pt-28 pb-24 px-4 md:px-6">
                <div className="container mx-auto max-w-5xl">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold font-heading text-stone-900 flex items-center gap-3">
                                <Brain className="text-amber-500" size={32} />
                                Memory Dashboard
                            </h1>
                            <p className="text-stone-500 mt-1">View, explore, and manage your conversation history</p>
                        </div>
                        {conversations.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={deleteAllMemory}
                                disabled={deletingAll}
                            >
                                {deletingAll ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Trash2 size={14} className="mr-1" />}
                                Delete All
                            </Button>
                        )}
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <MessageSquare size={16} className="text-blue-500" />
                                    <span className="text-xs font-semibold text-stone-500">Conversations</span>
                                </div>
                                <p className="text-2xl font-bold text-stone-900">{stats.total_conversations}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <BarChart3 size={16} className="text-amber-500" />
                                    <span className="text-xs font-semibold text-stone-500">Messages</span>
                                </div>
                                <p className="text-2xl font-bold text-stone-900">{stats.total_messages}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock size={16} className="text-purple-500" />
                                    <span className="text-xs font-semibold text-stone-500">Memory Since</span>
                                </div>
                                <p className="text-sm font-bold text-stone-900">
                                    {stats.memory_since
                                        ? new Date(stats.memory_since).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                        : "No data yet"}
                                </p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield size={16} className="text-emerald-500" />
                                    <span className="text-xs font-semibold text-stone-500">Encryption</span>
                                </div>
                                <p className="text-sm font-bold text-emerald-600">AES-256-GCM ✓</p>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center">
                            <Brain className="mx-auto mb-4 text-stone-300" size={48} />
                            <h3 className="text-lg font-bold text-stone-900 mb-2">No memories yet</h3>
                            <p className="text-stone-500 mb-6">Start a conversation with Nuravya to build your memory.</p>
                            <Link href="/chat">
                                <Button className="bg-amber-500 hover:bg-amber-600 text-white">Start Chatting</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Conversation List */}
                            <div className="md:col-span-1 space-y-2">
                                <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-3">Conversations</h2>
                                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                                    {conversations.map((conv) => (
                                        <motion.button
                                            key={conv.id}
                                            onClick={() => loadMessages(conv.id)}
                                            className={`w-full text-left p-4 rounded-2xl border transition-all group ${selectedConv === conv.id
                                                    ? "bg-amber-50 border-amber-200 shadow-sm"
                                                    : "bg-white border-stone-200 hover:border-amber-200 hover:shadow-sm"
                                                }`}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-stone-900 truncate">
                                                        {conv.started_at
                                                            ? new Date(conv.started_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                                                            : "Conversation"}
                                                    </p>
                                                    <p className="text-xs text-stone-500 mt-0.5">
                                                        {conv.message_count} messages · {conv.mode}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                                                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        {deleting === conv.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                                    </button>
                                                    <ChevronRight size={14} className="text-stone-400" />
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Message View */}
                            <div className="md:col-span-2">
                                <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-3">Messages</h2>
                                <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
                                    {!selectedConv ? (
                                        <div className="p-12 text-center text-stone-400">
                                            <MessageSquare className="mx-auto mb-3" size={32} />
                                            <p>Select a conversation to view messages</p>
                                        </div>
                                    ) : messagesLoading ? (
                                        <div className="p-12 flex justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                                        </div>
                                    ) : (
                                        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
                                            {messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div
                                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user"
                                                                ? "bg-amber-100 text-stone-900 rounded-tr-sm"
                                                                : "bg-stone-100 text-stone-800 rounded-tl-sm"
                                                            }`}
                                                    >
                                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                                        {msg.created_at && (
                                                            <p className="text-[10px] text-stone-400 mt-1">
                                                                {new Date(msg.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
