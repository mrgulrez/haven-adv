"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Mic,
    MicOff,
    Send,
    ChevronLeft,
    MoreVertical,
    PhoneCall,
    PhoneOff,
    X,
    Keyboard,
    Volume2,
    VolumeX
} from "lucide-react"
import Link from "next/link"
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
} from "@livekit/components-react"
import { Track, ConnectionState, Participant, TrackPublication } from "livekit-client"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/components/auth/auth-provider"

// ─── Types ──────────────────────────────────────────────────────

type Message = {
    id: string
    sender: "api" | "user"
    text: string
    time: string
    isAudio?: boolean
}

// ─── Config ─────────────────────────────────────────────────────

const SESSION_ID = `session_${Date.now()}`

export default function ChatPage() {
    const { user, nuravyaUser } = useAuth()
    const USER_ID = useMemo(() => nuravyaUser?.id || user?.uid || "user_default", [nuravyaUser, user])
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [showKeyboard, setShowKeyboard] = useState(false)

    // Call Overlay State
    const [isCallActive, setIsCallActive] = useState(false)
    const [liveKitToken, setLiveKitToken] = useState("")
    const [liveKitUrl, setLiveKitUrl] = useState("")
    const [shouldConnect, setShouldConnect] = useState(false)
    const [isConnectingCall, setIsConnectingCall] = useState(false)

    // Push-to-Talk State
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    const messagesEndRef = useRef<HTMLDivElement>(null)

    // ─── Scroll ─────────────────────────────────────────────────
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])
    useEffect(() => { scrollToBottom() }, [messages, isTyping, scrollToBottom])


    // ─── Text Chat ──────────────────────────────────────────────
    const handleSend = async () => {
        if (!inputValue.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: inputValue.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setMessages(prev => [...prev, userMsg])
        setInputValue("")
        setIsTyping(true)

        try {
            const res = await apiFetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({ message: userMsg.text, session_id: SESSION_ID, user_id: USER_ID }),
            })
            if (!res.ok) throw new Error(`API error: ${res.status}`)
            const data = await res.json()

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: "api",
                text: data.reply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])
        } catch {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: "api",
                text: "Sorry, I couldn't connect right now.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])
        } finally {
            setIsTyping(false)
        }
    }

    // ─── Push-to-Talk ───────────────────────────────────────────
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data)
                }
            }

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                await sendAudioMessage(audioBlob)
            }

            mediaRecorder.start()
            setIsRecording(true)
        } catch (error) {
            console.error("Error accessing microphone:", error)
            alert("Please allow microphone access to send voice messages.")
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
        }
    }

    const sendAudioMessage = async (audioBlob: Blob) => {
        const tempId = Date.now().toString()
        setMessages(prev => [...prev, {
            id: tempId,
            sender: "user",
            text: "🔊 Analyzing...",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
        setIsTyping(true)

        try {
            const formData = new FormData()
            formData.append("audio", audioBlob, "audio.webm")
            formData.append("session_id", SESSION_ID)
            formData.append("user_id", USER_ID)

            const res = await apiFetch("/api/chat/audio", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) throw new Error("Audio API error")
            const data = await res.json()

            // Update user message text
            setMessages(prev => {
                const updated = [...prev]
                const idx = updated.findIndex(m => m.id === tempId)
                if (idx !== -1) updated[idx].text = data.user_transcript
                return updated
            })

            // Add AI response
            const aiMsgId = (Date.now() + 1).toString()
            setMessages(prev => [...prev, {
                id: aiMsgId,
                sender: "api",
                text: data.reply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])

            // Play the audio
            if (data.audio_b64) {
                const audio = new Audio(`data:audio/mp3;base64,${data.audio_b64}`)
                audio.play()
            }
        } catch (e) {
            console.error("Audio handling failed:", e)
            setMessages(prev => {
                const updated = [...prev]
                const idx = updated.findIndex(m => m.id === tempId)
                if (idx !== -1) updated[idx].text = "❌ Failed to process audio"
                return updated
            })
        } finally {
            setIsTyping(false)
        }
    }

    // ─── Call Feature ───────────────────────────────────────────
    const startCall = async () => {
        setIsConnectingCall(true)
        setIsCallActive(true)
        try {
            const res = await apiFetch("/api/voice/token", {
                method: 'POST',
                body: JSON.stringify({ user_id: USER_ID })
            })
            if (!res.ok) throw new Error("Failed to get LK token")
            const data = await res.json()
            setLiveKitToken(data.token)
            setLiveKitUrl(data.livekit_url)
            setShouldConnect(true)
        } catch (e) {
            console.error("Call connection failed:", e)
            setIsCallActive(false)
        } finally {
            setIsConnectingCall(false)
        }
    }

    const endCall = () => {
        setShouldConnect(false)
        setIsCallActive(false)
        setLiveKitToken("")
        setLiveKitUrl("")
    }

    return (
        <div className="fixed inset-0 z-[100] bg-[#FAFAFA] flex flex-col font-sans overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-400/5 blur-[120px] rounded-full pointer-events-none" />

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

            {/* ─── Header ──────────────────────────────────────── */}
            <div className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-stone-200/50 pt-safe">
                <div className="flex items-center justify-between px-4 py-3 h-16">
                    <Link href="/" className="p-2 -ml-2 text-stone-600 hover:text-stone-900 transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-lg text-stone-900 tracking-tight">Nuravya</span>
                        </div>
                        <span className="text-xs font-medium text-stone-500">
                            Always here
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={startCall} className="p-2 text-stone-600 hover:text-amber-500 transition-colors">
                            <PhoneCall size={20} />
                        </button>
                        <button className="p-2 -mr-2 text-stone-600 hover:text-stone-900 transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Chat Area ───────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth relative z-10" style={{ paddingBottom: showKeyboard ? '20px' : '120px' }}>
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
                                <div className="flex items-center gap-2 mt-1.5 px-1">
                                    <span className="text-[10px] text-stone-400 font-medium">{msg.time}</span>
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
            <div className="absolute w-full bottom-0 left-0 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/95 to-transparent pt-10 pb-safe z-20">
                <div className="px-4 pb-4 md:pb-6 max-w-3xl mx-auto w-full">
                    {!showKeyboard ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center justify-between w-full px-4">
                                <button onClick={() => setShowKeyboard(true)} className="p-3 bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow rounded-full text-stone-500 hover:text-stone-700">
                                    <Keyboard size={22} />
                                </button>

                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={`relative flex items-center justify-center w-20 h-20 rounded-full shadow-[0_10px_40px_rgba(245,158,11,0.3)] text-white transition-all duration-300 ${isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/50" : "bg-gradient-to-br from-amber-400 to-orange-500"}`}
                                >
                                    {isRecording ? <X size={32} strokeWidth={2.5} /> : <Mic size={32} strokeWidth={2.5} />}
                                </motion.button>

                                <button className="p-3 opacity-0 pointer-events-none"><Keyboard size={22} /></button>
                            </div>
                            <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">{isRecording ? "Tap to send Message" : "Tap to Speak"}</span>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full p-2 flex items-center gap-2">
                            <button onClick={() => setShowKeyboard(false)} className="p-2.5 text-stone-400 hover:text-amber-500 transition-colors ml-1 rounded-full hover:bg-stone-50">
                                <Mic size={22} />
                            </button>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Message Nuravya..."
                                className="flex-1 bg-transparent border-none outline-none text-stone-700 placeholder:text-stone-400 font-medium px-2 py-2"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className={`p-2.5 rounded-full transition-all flex items-center justify-center ${inputValue.trim() ? "bg-amber-500 text-white shadow-md hover:scale-105" : "bg-stone-100 text-stone-400"}`}
                            >
                                <Send size={20} className={inputValue.trim() ? "ml-0.5" : ""} />
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

function CallInterface({ onEndCall }: { onEndCall: () => void }) {
    const { state: assistantState, audioTrack: assistantAudioTrack } = useVoiceAssistant()
    const { localParticipant } = useLocalParticipant()
    const participants = useParticipants()
    const tracks = useTracks([Track.Source.Microphone, Track.Source.ScreenShareAudio])

    // Find the agent participant (usually identity includes "Agent" or is different from local)
    const agentParticipant = participants.find(p => p.identity !== localParticipant?.identity)
    const remoteAudioTrack = tracks.find(t => t.participant.identity === agentParticipant?.identity && t.source === Track.Source.Microphone)

    const { toggle: toggleMic, enabled: isMicEnabled } = useTrackToggle({
        source: Track.Source.Microphone,
    })
    const connectionState = useConnectionState()

    // States for nice UI
    const isRinging = connectionState === ConnectionState.Connecting
    const isConnected = connectionState === ConnectionState.Connected

    // Call Timer
    const [callDuration, setCallDuration] = useState(0)
    useEffect(() => {
        if (!isConnected) return
        const interval = setInterval(() => setCallDuration(d => d + 1), 1000)
        return () => clearInterval(interval)
    }, [isConnected])

    const formatCallTime = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

    // Custom mic toggle to align with UI expectations
    const handleMicToggle = useCallback(() => {
        toggleMic()
    }, [toggleMic])

    return (
        <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/15 blur-[120px] rounded-full pointer-events-none" />

            {/* Top */}
            <div className="flex flex-col items-center pt-20 gap-4 relative z-10 w-full">
                <span className="text-stone-400 text-sm font-medium uppercase tracking-widest">
                    {isRinging ? "Calling..." : isConnected ? "Connected" : "Disconnected"}
                </span>
                <h2 className="text-white text-4xl font-bold tracking-tight">Nuravya</h2>
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

            {/* Center Visualizer */}
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
                        {/* LiveKit component to render audio visualizer */}
                        {(assistantAudioTrack || remoteAudioTrack) ? (
                            <BarVisualizer
                                trackRef={assistantAudioTrack || remoteAudioTrack}
                                barCount={12}
                                options={{ minHeight: 10 }}
                                className="w-full h-full text-amber-500 opacity-80"
                            />
                        ) : (
                            <div className="flex items-center gap-1 h-20">
                                {/* Fallback animation if track is missing still */}
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="w-1.5 h-[15%] rounded-full bg-gradient-to-t from-stone-600 to-stone-400" />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
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
    )
}
