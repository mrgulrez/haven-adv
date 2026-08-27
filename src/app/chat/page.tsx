"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Send,
    ChevronLeft,
    PhoneCall,
    Mic,
    MicOff,
    Volume2,
    Sparkles,
    Brain,
    Crown,
    Loader2,
    X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    LiveKitRoom,
    RoomAudioRenderer,
} from "@livekit/components-react";
import { apiFetch, apiGet, apiPost } from "@/lib/api";
import { useAuth } from "@/components/auth/auth-provider";
import { StatusModal } from "@/components/ui/success-modal";
import { CharacterPanel, Character, NURAVYA_DEFAULT } from "@/components/chat/character-panel";
import { MemoryPanel } from "@/components/chat/memory-panel";
import { CallInterface } from "@/components/chat/call-interface";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CHAT_SUGGESTIONS, RingingSession, SESSION_ID, type ChatMessage as Message } from "@/components/chat/chat-core";

export default function ChatPage() {
    const { user, nuravyaUser } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const [isCallActive, setIsCallActive] = useState(false);
    const [liveKitToken, setLiveKitToken] = useState("");
    const [liveKitUrl, setLiveKitUrl] = useState("");
    const [shouldConnect, setShouldConnect] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [noticeModal, setNoticeModal] = useState<{ title: string; message: string } | null>(null);

    // Character state
    const [showCharPanel, setShowCharPanel] = useState(false);
    const [showMemoryPanel, setShowMemoryPanel] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState<Character>(NURAVYA_DEFAULT);
    const [isUncapped, setIsUncapped] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const isDefaultCharacter = selectedCharacter.id === "__nuravya__";

    // Restore saved character preference from database on mount
    useEffect(() => {
        if (!nuravyaUser?.selected_character_id) return;
        const savedId = nuravyaUser.selected_character_id;
        // Fetch user's characters and find the saved one
        (async () => {
            try {
                const chars = await apiGet<Character[]>("/api/characters");
                const found = chars.find(c => c.id === savedId);
                if (found) setSelectedCharacter(found);
            } catch { /* ignore — will default to Nuravya */ }
        })();
    }, [nuravyaUser?.selected_character_id]);

    // Persist selected character to database
    const handleSelectCharacter = async (c: Character) => {
        setSelectedCharacter(c);
        try {
            await apiFetch("/api/users/me", {
                method: "PUT",
                body: JSON.stringify({
                    selected_character_id: c.id === "__nuravya__" ? "" : c.id,
                }),
            });
        } catch { /* ignore — local state still updated */ }
    };

    // TTS playback state
    const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const ringRef = useRef<RingingSession | null>(null);

    // Daily briefing state
    const [briefing, setBriefing] = useState<{
        greeting: string;
        highlights: string[];
        mood_trend: string;
        streak: number;
    } | null>(null);
    const [briefingDismissed, setBriefingDismissed] = useState(false);

    // Fetch daily briefing on mount
    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                const data = await apiGet<{
                    greeting: string;
                    highlights: string[];
                    mood_trend: string;
                    streak: number;
                }>("/api/briefing/today");
                if (data?.greeting) setBriefing(data);
            } catch { /* silent — briefing is optional */ }
        })();
    }, [user]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const USER_ID = nuravyaUser?.id || user?.uid || "user_default"; // Modified from diff, keeping user?.uid
    const userPlan = nuravyaUser?.plan || "free"; // Added from diff
    const hasCore = userPlan === "core" || userPlan === "pro"; // Added from diff

    // ─── Scroll ─────────────────────────────────────────────────
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);
    useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

    // ─── Text Chat ──────────────────────────────────────────────
    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: inputValue.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        try {
            const chatPayload: Record<string, unknown> = {
                message: userMsg.text,
                session_id: SESSION_ID,
                user_id: USER_ID,
                is_uncapped: isUncapped || selectedCharacter.is_uncapped,
            };
            if (!isDefaultCharacter) chatPayload.character_id = selectedCharacter.id;

            const res = await apiFetch("/api/chat", {
                method: "POST",
                body: JSON.stringify(chatPayload),
            });

            if (!res.ok) throw new Error(`API error: ${res.status}`);

            const aiMsgId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, {
                id: aiMsgId,
                sender: "api",
                text: "",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);

            // Capacitor native HTTP doesn't always support streaming yet.
            // Check for body before attempting to stream.
            if (!res.body) {
                const text = await res.text();
                setMessages(prev => {
                    const updated = [...prev];
                    const idx = updated.findIndex(m => m.id === aiMsgId);
                    if (idx !== -1) {
                        updated[idx] = { ...updated[idx], text };
                    }
                    return updated;
                });
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;
            let accumulatedText = "";

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value, { stream: true });

                if (chunkValue) {
                    accumulatedText += chunkValue;
                    setMessages(prev => {
                        const updated = [...prev];
                        const idx = updated.findIndex(m => m.id === aiMsgId);
                        if (idx !== -1) {
                            updated[idx] = { ...updated[idx], text: accumulatedText };
                        }
                        return updated;
                    });
                }
            }
        } catch (e: any) {
            console.error(e);
            setNoticeModal({
                title: "Message could not be sent",
                message: "Nuravya could not reach the chat service. Please check your connection and try again.",
            });
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: "api",
                text: "I could not send that message. Please try again in a moment.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    };
    
    // ─── Speech to Text ─────────────────────────────────────────
    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setNoticeModal({
                title: "Voice input unavailable",
                message: "This browser does not support speech recognition yet. You can still type to Nuravya or use live voice calling on a supported device.",
            });
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(prev => prev + (prev ? " " : "") + transcript);
        };

        recognition.start();
    };

    // ─── Speak Message (Core/Pro) ───────────────────────────────
    const handleSpeakMessage = async (msgId: string, text: string) => {
        // Enforce Core/Pro Plan
        const isPaid = nuravyaUser?.plan === "core" || nuravyaUser?.plan === "pro";
        if (!isPaid) {
            setShowUpgradeModal(true);
            return;
        }

        // If currently playing the same message, do nothing or pause (optional)
        if (playingMsgId === msgId && audioRef.current) {
            audioRef.current.pause();
            setPlayingMsgId(null);
            return;
        }

        setPlayingMsgId(msgId);

        try {
            const data = await apiPost<{ audio_b64: string }>("/api/chat/speak", { text });
            if (data?.audio_b64) {
                if (audioRef.current) {
                    audioRef.current.pause();
                }
                const audio = new Audio(`data:audio/mp3;base64,${data.audio_b64}`);
                audioRef.current = audio;

                audio.onended = () => {
                    setPlayingMsgId(null);
                };

                await audio.play();
            } else {
                setPlayingMsgId(null);
            }
        } catch (e) {
            console.error("Text to speech failed:", e);
            setPlayingMsgId(null);
        }
    };

    // Clean up audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    // ─── Call Feature ───────────────────────────────────────────
    const startCall = async () => {
        if (!hasCore) {
            setShowUpgradeModal(true);
            return;
        }

        // Request microphone permission explicitly for WebView/Android
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Stop immediately, we just wanted the perm
        } catch (e) {
            console.error("Mic permission denied:", e);
            setNoticeModal({
                title: "Microphone access needed",
                message: "Nuravya needs microphone permission before a live call can start. Enable microphone access in your browser or device settings, then try again.",
            });
            return;
        }

        setIsCallActive(true);

        // 1. Start synthesized ringing
        const ringer = new RingingSession();
        ringer.start();
        ringRef.current = ringer;

        // 2. Wait briefly to let the call state feel intentional before connecting.
        const ringTime = 2800;
        await new Promise(resolve => setTimeout(resolve, ringTime));

        // 3. Stop ringing if we haven't already
        ringer.stop();
        ringRef.current = null;

        try {
            const res = await apiFetch("/api/voice/token", {
                method: 'POST',
                body: JSON.stringify({
                    user_id: USER_ID,
                    character_id: isDefaultCharacter ? undefined : selectedCharacter.id
                })
            });
            if (!res.ok) throw new Error("Failed to get LK token");
            const data = await res.json();
            setLiveKitToken(data.token);
            setLiveKitUrl(data.livekit_url);
            setShouldConnect(true);
        } catch (e) {
            console.error("Call connection failed:", e);
            setIsCallActive(false);
        }
    };

    const endCall = (_durationSeconds?: number) => {
        void _durationSeconds;
        ringRef.current?.stop();
        ringRef.current = null;
        setShouldConnect(false);
        setIsCallActive(false);
        setLiveKitToken("");
        setLiveKitUrl("");

        // LiveKit's signed participant-left webhook is the authoritative usage
        // source. Client timers are intentionally not trusted for billing.
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#FAFAFA] flex flex-col font-sans overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-400/5 blur-[120px] rounded-full pointer-events-none" />

            {/* ─── Character Panel ─────────────────────────────────────────────── */}
            <CharacterPanel
                isOpen={showCharPanel}
                onClose={() => setShowCharPanel(false)}
                selectedCharacter={selectedCharacter}
                onSelectCharacter={(c) => { handleSelectCharacter(c); setShowCharPanel(false); }}
                isUncapped={isUncapped}
                onToggleUncapped={setIsUncapped}
            />

            <MemoryPanel
                isOpen={showMemoryPanel}
                onClose={() => setShowMemoryPanel(false)}
            />

            {/* ─── Call Overlay (LiveKit Room) ─────────────────────────────────── */}
            <AnimatePresence>
                {isCallActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex flex-col items-center justify-between bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900"
                    >
                        <LiveKitRoom
                            serverUrl={liveKitUrl}
                            token={liveKitToken}
                            connect={shouldConnect}
                            audio={true}
                            video={false}
                            className="w-full h-full flex flex-col items-center justify-between"
                        >
                            <CallInterface onEndCall={endCall} onNotice={setNoticeModal} />
                            <RoomAudioRenderer />
                        </LiveKitRoom>
                    </motion.div>
                )}
            </AnimatePresence>

            <StatusModal
                isOpen={showUpgradeModal}
                onClose={() => {
                    setShowUpgradeModal(false);
                    router.push("/pricing");
                }}
                title="Premium Feature"
                message="Live voice calling requires Nuravya Core or Pro. Upgrade your plan to talk organically with your personalized AI companion."
                variant="error"
            />
            <StatusModal
                isOpen={Boolean(noticeModal)}
                onClose={() => setNoticeModal(null)}
                title={noticeModal?.title || "Something went wrong"}
                message={noticeModal?.message || "Please try again."}
                variant="error"
            />

            {/* ─── Header ──────────────────────────────────────── */}
            <div className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-stone-200/50 pt-safe">
                <div className="flex items-center justify-between px-4 py-3 h-16">
                    <Link href="/" aria-label="Back to home" className="p-2 -ml-2 text-stone-600 hover:text-stone-900 transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            {isDefaultCharacter && (
                                <Image
                                    src="/images/NuravyaLogo.png"
                                    alt="Nuravya"
                                    width={24}
                                    height={24}
                                    className="rounded-md"
                                />
                            )}
                            <span className="font-heading font-bold text-lg text-stone-900 tracking-tight">
                                {selectedCharacter.name}
                            </span>
                            {(isUncapped || selectedCharacter.is_uncapped) && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-600">UNCAPPED</span>
                            )}
                        </div>
                        <span className="text-xs font-medium text-stone-500">
                            {isDefaultCharacter ? "Always here" : selectedCharacter.description || "Custom persona"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={startCall} aria-label="Start voice call" className="p-2 text-stone-600 hover:text-amber-500 transition-colors">
                            <PhoneCall size={20} />
                        </button>
                        <button
                            onClick={() => setShowCharPanel(true)}
                            className="p-2 text-stone-600 hover:text-amber-500 transition-colors relative"
                            title="Characters"
                            aria-label="Open character selector"
                        >
                            <Sparkles size={20} />
                            {!isDefaultCharacter && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 border border-white" />
                            )}
                        </button>
                        <button
                            onClick={() => setShowMemoryPanel(true)}
                            className="p-2 -mr-2 text-stone-600 hover:text-amber-500 transition-colors"
                            title="Memory Dashboard"
                            aria-label="Open memory dashboard"
                        >
                            <Brain size={20} className="text-amber-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Chat Area ───────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth relative z-10 pb-28">
                <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                    {/* ─── Daily Briefing Card ─────────────── */}
                    {briefing && !briefingDismissed && (
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-200/60 shadow-sm">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-bl-full" />
                            <div className="relative p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">☀️</span>
                                        <span className="text-sm font-bold text-amber-700 uppercase tracking-wider">Daily Briefing</span>
                                    </div>
                                    <button
                                        onClick={() => setBriefingDismissed(true)}
                                        className="p-1 text-stone-400 hover:text-stone-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <p className="text-stone-700 text-[15px] leading-relaxed font-medium">
                                    {briefing.greeting}
                                </p>
                                {briefing.highlights.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {briefing.highlights.map((h, i) => (
                                            <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/70 text-amber-700 border border-amber-200/50">
                                                {h}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {messages.length === 0 && (
                        <div className="pt-8 md:pt-14">
                            <div className="mx-auto max-w-2xl rounded-3xl border border-stone-200/80 bg-white/80 p-6 md:p-8 shadow-sm backdrop-blur">
                                <div className="flex flex-col items-center text-center gap-4">
                                    <button
                                        onClick={startCall}
                                        aria-label="Start voice call with Nuravya"
                                        className="w-16 h-16 rounded-2xl bg-stone-950 flex items-center justify-center shadow-lg shadow-stone-200 hover:bg-stone-800 transition-colors"
                                    >
                                        <PhoneCall size={28} className="text-white" />
                                    </button>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold font-heading text-stone-950 tracking-tight">Start with whatever is on your mind.</h1>
                                        <p className="mt-2 text-stone-500 text-sm md:text-base leading-relaxed">
                                            Type a message, dictate a quick thought, or start a voice call when conversation feels easier than writing.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {CHAT_SUGGESTIONS.map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => setInputValue(suggestion)}
                                            className="text-left rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 hover:border-amber-300 hover:bg-amber-50/60 transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {messages.length > 0 && (
                        <div className="text-center">
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest bg-stone-100/50 px-3 py-1 rounded-full backdrop-blur-sm">Today</span>
                        </div>
                    )}

                    <AnimatePresence>
                        {messages.map(msg => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
                            >
                                <div className={`px-5 py-3.5 rounded-3xl shadow-sm relative group overflow-hidden ${msg.sender === "user"
                                    ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-tr-sm"
                                    : "bg-white border border-stone-200/60 text-stone-800 rounded-tl-sm backdrop-blur-md"
                                    }`}>
                                    {msg.sender === "api" && <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    <div className="text-base leading-relaxed relative z-10 font-medium tracking-wide">
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({node: _node, ...props}) => <h1 className="text-xl font-bold my-2" {...props} />,
                                                h2: ({node: _node, ...props}) => <h2 className="text-lg font-bold my-2" {...props} />,
                                                h3: ({node: _node, ...props}) => <h3 className="text-base font-extrabold my-2 text-amber-600" {...props} />,
                                                p: ({node: _node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({node: _node, ...props}) => <ul className="list-disc ml-5 mb-2" {...props} />,
                                                ol: ({node: _node, ...props}) => <ol className="list-decimal ml-5 mb-2" {...props} />,
                                                li: ({node: _node, ...props}) => <li className="mb-0.5" {...props} />,
                                                strong: ({node: _node, ...props}) => <strong className="font-extrabold text-amber-700" {...props} />,
                                                a: ({node: _node, ...props}) => <a className="text-amber-600 underline hover:text-amber-700" {...props} />,
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-1.5 px-2">
                                    <span className="text-[10px] text-stone-400 font-medium">{msg.time}</span>

                                    {/* TTS Action Button for Assistant Messages */}
                                    {msg.sender === "api" && (
                                        <button
                                            onClick={() => handleSpeakMessage(msg.id, msg.text)}
                                            className="ml-1 p-1 hover:bg-amber-100 text-stone-400 hover:text-amber-600 rounded-full transition-colors flex items-center gap-1"
                                            title="Read aloud"
                                        >
                                            {playingMsgId === msg.id ? (
                                                <Loader2 size={14} className="animate-spin text-amber-500" />
                                            ) : (
                                                <Volume2 size={14} />
                                            )}
                                            {nuravyaUser?.plan === "free" && <Crown size={10} className="text-amber-500" />}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="self-start items-start flex flex-col max-w-[85%]">
                            <div className="px-5 py-4 rounded-3xl rounded-tl-sm bg-white border border-stone-200/60 shadow-sm flex items-center gap-1.5 w-fit">
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* ─── Bottom Input ─────────────────────────────────── */}
            <div className="absolute w-full bottom-0 left-0 bg-[#FAFAFA]/95 backdrop-blur-xl border-t border-stone-200/60 pb-safe z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <div className="px-4 py-3 md:py-4 max-w-3xl mx-auto w-full">
                    <div className="bg-white/95 border border-stone-200 shadow-sm rounded-[28px] p-2.5 flex items-end gap-2 pr-2.5 focus-within:ring-4 focus-within:ring-stone-950/5 focus-within:border-stone-300 transition-all">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Message Nuravya..."
                            autoComplete="on"
                            autoCorrect="on"
                            autoCapitalize="sentences"
                            spellCheck={true}
                            rows={1}
                            className="max-h-32 min-h-11 flex-1 resize-none bg-transparent border-none outline-none focus:outline-none focus-visible:outline-none text-stone-800 placeholder:text-stone-400 font-medium px-4 py-2.5 text-[15px] w-full leading-relaxed"
                        />
                        <div className="flex items-center gap-1.5 px-1.5 pb-0.5">
                            <button
                                onClick={toggleListening}
                                aria-label={isListening ? "Stop voice dictation" : "Start voice dictation"}
                                className={cn(
                                    "p-2.5 rounded-full transition-all flex items-center justify-center shrink-0",
                                    isListening 
                                        ? "bg-rose-100 text-rose-500 animate-pulse shadow-sm" 
                                        : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
                                )}
                                title={isListening ? "Stop listening" : "Voice message"}
                            >
                                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isTyping}
                                aria-label="Send message"
                                className={cn(
                                    "p-2.5 shrink-0 rounded-full transition-all flex items-center justify-center",
                                    inputValue.trim() && !isTyping
                                        ? "bg-stone-950 text-white shadow-md hover:bg-stone-800" 
                                        : "bg-stone-100 text-stone-400"
                                )}
                            >
                                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />}
                            </button>
                        </div>
                    </div>
                    <div className="mt-2 px-3 text-[11px] text-stone-400 flex justify-between gap-4">
                        <span>Enter to send. Shift + Enter adds a line.</span>
                        <span className="shrink-0">{inputValue.length > 0 ? `${inputValue.length} chars` : ""}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
