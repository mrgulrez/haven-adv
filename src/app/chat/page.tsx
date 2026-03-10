"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    ChevronLeft,
    PhoneCall,
    PhoneOff,
    Mic,
    MicOff,
    Volume2,
    Loader2,
    Crown,
    Sparkles,
    Brain,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    LiveKitRoom,
    RoomAudioRenderer,
    BarVisualizer,
    useVoiceAssistant,
    useLocalParticipant,
    useTrackToggle,
    useConnectionState,
    useParticipants,
    useTracks,
} from "@livekit/components-react";
import { Track, ConnectionState } from "livekit-client";
import { apiFetch, apiPost, getAuthHeaders } from "@/lib/api";
import { useAuth } from "@/components/auth/auth-provider";
import { StatusModal } from "@/components/ui/success-modal";
import { CharacterPanel, Character, NURAVYA_DEFAULT } from "@/components/chat/character-panel";
import { MemoryPanel } from "@/components/chat/memory-panel";

// ─── Types ──────────────────────────────────────────────────────

type Message = {
    id: string;
    sender: "api" | "user";
    text: string;
    time: string;
};

// ─── Config ─────────────────────────────────────────────────────

const SESSION_ID = `session_${Date.now()}`;

// ─── Audio Helpers (Synthesized Ringing) ─────────────────────────

class RingingSession {
    private ctx: AudioContext | null = null;
    private osc1: OscillatorNode | null = null;
    private osc2: OscillatorNode | null = null;
    private gain: GainNode | null = null;

    start() {
        try {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.gain = this.ctx.createGain();

            // Traditional US Ringback tone: 440Hz + 480Hz
            this.osc1 = this.ctx.createOscillator();
            this.osc2 = this.ctx.createOscillator();

            this.osc1.frequency.setValueAtTime(440, this.ctx.currentTime);
            this.osc2.frequency.setValueAtTime(480, this.ctx.currentTime);

            this.osc1.connect(this.gain);
            this.osc2.connect(this.gain);
            this.gain.connect(this.ctx.destination);

            // Rhythmic ringing: 2s on, 4s off (Standard cadence)
            const now = this.ctx.currentTime;
            this.gain.gain.setValueAtTime(0, now);

            // Loop the gain automation
            const duration = 60; // 60 seconds total "ringing" time
            for (let i = 0; i < duration; i += 6) {
                this.gain.gain.linearRampToValueAtTime(0.15, now + i + 0.1);
                this.gain.gain.linearRampToValueAtTime(0.15, now + i + 2);
                this.gain.gain.linearRampToValueAtTime(0, now + i + 2.1);
            }

            this.osc1.start();
            this.osc2.start();
        } catch (e) {
            console.error("Failed to start ringing synthesis:", e);
        }
    }

    stop() {
        if (this.ctx) {
            this.osc1?.stop();
            this.osc2?.stop();
            this.ctx.close();
            this.ctx = null;
        }
    }
}

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

    // Character state
    const [showCharPanel, setShowCharPanel] = useState(false);
    const [showMemoryPanel, setShowMemoryPanel] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState<Character>(NURAVYA_DEFAULT);
    const [isUncapped, setIsUncapped] = useState(false);
    const isDefaultCharacter = selectedCharacter.id === "__nuravya__";

    // TTS playback state
    const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const ringRef = useRef<RingingSession | null>(null);

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
        if (!inputValue.trim()) return;

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
            const errorMsg = e instanceof Error ? e.message : String(e);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: "api",
                text: `Connection Error: ${errorMsg}. (Target: ${process.env.NEXT_PUBLIC_API_URL || "https://backend.enord.in"})`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    // ─── Speak Message (Core/Pro) ───────────────────────────────
    const handleSpeakMessage = async (msgId: string, text: string) => {
        // Enforce Core/Pro Plan
        const isPaid = nuravyaUser?.plan === "core" || nuravyaUser?.plan === "pro";
        if (!isPaid) {
            if (confirm("Voice playback requires Nuravya Core or Pro. Upgrade now?")) {
                router.push("/pricing");
            }
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

        setIsCallActive(true);

        // 1. Start synthesized ringing
        const ringer = new RingingSession();
        ringer.start();
        ringRef.current = ringer;

        // 2. Wait a random amount of time to simulate ringing (2s - 4s)
        const ringTime = Math.floor(Math.random() * 2000) + 2000;
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

    const endCall = () => {
        ringRef.current?.stop();
        ringRef.current = null;
        setShouldConnect(false);
        setIsCallActive(false);
        setLiveKitToken("");
        setLiveKitUrl("");
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
                onSelectCharacter={(c) => { setSelectedCharacter(c); setShowCharPanel(false); }}
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
                            <CallInterface onEndCall={endCall} />
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

            {/* ─── Header ──────────────────────────────────────── */}
            <div className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-stone-200/50 pt-safe">
                <div className="flex items-center justify-between px-4 py-3 h-16">
                    <Link href="/" className="p-2 -ml-2 text-stone-600 hover:text-stone-900 transition-colors">
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
                        <button onClick={startCall} className="p-2 text-stone-600 hover:text-amber-500 transition-colors">
                            <PhoneCall size={20} />
                        </button>
                        <button
                            onClick={() => setShowCharPanel(true)}
                            className="p-2 text-stone-600 hover:text-amber-500 transition-colors relative"
                            title="Characters"
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
                        >
                            <Brain size={20} className="text-amber-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Chat Area ───────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth relative z-10 pb-28">
                <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center pt-20 gap-4">
                            <button onClick={startCall} className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200 hover:scale-105 transition-transform">
                                <PhoneCall size={28} className="text-white" />
                            </button>
                            <p className="text-stone-500 text-center text-sm font-medium">Tap the phone to talk to Nuravya, or say hello below!</p>
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
                                    <p className="text-base leading-relaxed relative z-10 font-medium tracking-wide">{msg.text}</p>
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
            <div className="absolute w-full bottom-0 left-0 bg-[#FAFAFA] border-t border-stone-200/60 pb-safe z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <div className="px-4 py-3 md:py-4 max-w-3xl mx-auto w-full">
                    <div className="bg-white border border-stone-200/80 shadow-sm rounded-full p-1.5 flex items-center gap-2 pr-2 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-400 transition-all">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Message Nuravya..."
                            className="flex-1 bg-transparent border-none outline-none text-stone-700 placeholder:text-stone-400 font-medium px-4 py-2.5 text-[15px] w-full"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className={`p-2.5 shrink-0 rounded-full transition-all flex items-center justify-center ${inputValue.trim() ? "bg-amber-500 text-white shadow-md hover:scale-105" : "bg-stone-100 text-stone-400"}`}
                        >
                            <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CallInterface({ onEndCall }: { onEndCall: () => void }) {
    const { state: assistantState, audioTrack: assistantAudioTrack } = useVoiceAssistant();
    const { localParticipant } = useLocalParticipant();
    const participants = useParticipants();
    const tracks = useTracks([Track.Source.Microphone, Track.Source.ScreenShareAudio]);

    const agentParticipant = participants.find(p => p.identity !== localParticipant?.identity);
    const remoteAudioTrack = tracks.find(t => t.participant.identity === agentParticipant?.identity && t.source === Track.Source.Microphone);

    const { toggle: toggleMic, enabled: isMicEnabled } = useTrackToggle({
        source: Track.Source.Microphone,
    });
    const connectionState = useConnectionState();

    const isRinging = connectionState === ConnectionState.Connecting;
    const isConnected = connectionState === ConnectionState.Connected;

    const [callDuration, setCallDuration] = useState(0);
    useEffect(() => {
        if (!isConnected) return;
        const interval = setInterval(() => setCallDuration(d => d + 1), 1000);
        return () => clearInterval(interval);
    }, [isConnected]);

    const formatCallTime = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const handleMicToggle = useCallback(() => {
        toggleMic();
    }, [toggleMic]);

    return (
        <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/15 blur-[120px] rounded-full pointer-events-none" />

            <div className="flex flex-col items-center pt-20 gap-4 relative z-10 w-full">
                <span className="text-stone-400 text-sm font-medium uppercase tracking-widest">
                    {isRinging ? "Calling..." : isConnected ? "Connected" : "Disconnected"}
                </span>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 shadow-lg shadow-black/30 flex items-center justify-center">
                        <Image
                            src="/images/NuravyaLogo.png"
                            alt="Nuravya"
                            width={80}
                            height={80}
                            className="w-full h-full object-contain p-2"
                        />
                    </div>
                    <h2 className="text-white text-4xl font-bold tracking-tight">Nuravya</h2>
                </div>
                {isConnected && (
                    <>
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-400 text-lg font-mono tracking-wider">
                            {formatCallTime(callDuration)}
                        </motion.span>
                        <span className="text-stone-400 text-xs font-medium mt-1">
                            {(!agentParticipant && participants.length <= 1) ? "Agent joining..." :
                                assistantState === "listening" ? "Listening..." :
                                    assistantState === "thinking" ? "Thinking..." :
                                        assistantState === "speaking" ? "Speaking..." : "Connected"}
                        </span>
                    </>
                )}
            </div>

            <div className="relative z-10 flex items-center justify-center flex-1 w-full">
                {isRinging ? (
                    <motion.div className="relative">
                        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -inset-8 rounded-full bg-amber-500/20" />
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }} className="absolute -inset-16 rounded-full bg-amber-500/10" />
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                            <PhoneCall size={48} className="text-white" />
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-24 w-full px-12 flex justify-center">
                        {(assistantAudioTrack || remoteAudioTrack) ? (
                            <BarVisualizer
                                trackRef={assistantAudioTrack || remoteAudioTrack}
                                barCount={12}
                                options={{ minHeight: 10 }}
                                className="w-full h-full text-amber-500 opacity-80"
                            />
                        ) : (
                            <div className="flex items-center gap-1 h-20">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="w-1.5 h-[15%] rounded-full bg-gradient-to-t from-stone-600 to-stone-400" />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="pb-20 relative z-10 flex flex-col items-center gap-6 w-full">
                {isConnected && (
                    <button
                        onClick={handleMicToggle}
                        className={`w-14 h-14 justify-center items-center rounded-full flex transition-all ${!isMicEnabled
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                            : "bg-stone-700/50 text-stone-300 hover:bg-stone-600"
                            }`}
                    >
                        {!isMicEnabled ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                )}
                <button onClick={onEndCall} className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors">
                    <PhoneOff size={28} />
                </button>
            </div>
        </>
    );
}
