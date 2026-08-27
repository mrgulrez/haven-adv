"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    PhoneCall,
    PhoneOff,
    Mic,
    MicOff,
    Volume1,
    Volume2,
    Headphones,
    Circle,
    StopCircle,
} from "lucide-react";
import Image from "next/image";
import {
    BarVisualizer,
    useVoiceAssistant,
    useLocalParticipant,
    useTrackToggle,
    useConnectionState,
    useParticipants,
    useTracks,
    useRoomContext,
} from "@livekit/components-react";
import { Track, ConnectionState } from "livekit-client";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import lamejs from "@breezystack/lamejs";

export function CallInterface({ onEndCall, onNotice }: { onEndCall: (durationSeconds?: number) => void; onNotice: (notice: { title: string; message: string }) => void }) {
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
    
    // ─── Native Audio Routing (Speaker / Earpiece / Bluetooth) ───
    const room = useRoomContext();
    const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
    const [currentOutputIndex, setCurrentOutputIndex] = useState(0);

    useEffect(() => {
        const getDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const outputs = devices.filter(d => d.kind === 'audiooutput');
                if (outputs.length > 0) {
                    setAudioOutputDevices(outputs);
                    // Match current active device if available
                    const activeId = room?.getActiveDevice('audiooutput');
                    const idx = outputs.findIndex(d => d.deviceId === activeId);
                    setCurrentOutputIndex(Math.max(0, idx));
                }
            } catch (e) {
                console.warn("Failed to enumerate audio devices:", e);
            }
        };
        // Needs a slight delay to ensure permissions are fully granted
        setTimeout(getDevices, 1000);
        navigator.mediaDevices.addEventListener('devicechange', getDevices);
        return () => navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    }, [room]);

    const cycleAudioOutput = async () => {
        if (isNativeApp && typeof window !== 'undefined' && 'AudioToggle' in window) {
            const Toggle = (window as any).AudioToggle;
            if (!Toggle) return;
            
            if (currentOutputIndex === 0) { // Speaker -> Earpiece
                Toggle.setAudioMode(Toggle.EARPIECE);
                setCurrentOutputIndex(1); 
            } else { // Earpiece -> Speaker
                Toggle.setAudioMode(Toggle.SPEAKER);
                setCurrentOutputIndex(0); 
            }
            return;
        }

        if (audioOutputDevices.length <= 1 || !room) return;
        const nextIndex = (currentOutputIndex + 1) % audioOutputDevices.length;
        const nextDevice = audioOutputDevices[nextIndex];
        try {
            await room.switchActiveDevice('audiooutput', nextDevice.deviceId);
            setCurrentOutputIndex(nextIndex);
        } catch (e) {
            console.error("Failed to switch audio output:", e);
        }
    };

    const getAudioOutputIcon = () => {
        if (isNativeApp && typeof window !== 'undefined' && 'AudioToggle' in window) {
            return currentOutputIndex === 0 ? <Volume2 size={24} /> : <Volume1 size={24} />;
        }

        if (audioOutputDevices.length === 0) return <Volume2 size={24} />;
        const label = audioOutputDevices[currentOutputIndex]?.label?.toLowerCase() || "";
        if (label.includes("bluetooth") || label.includes("head")) return <Headphones size={24} />;
        if (label.includes("ear") || label.includes("phone")) return <Volume1 size={24} />;
        return <Volume2 size={24} />; // default to speaker
    };
    
    // ─── Client-Side Call Recording (App-Only, MP3) ───────────────
    
    const [isNativeApp, setIsNativeApp] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    
    // Audio Context references
    const audioCtxRef = useRef<AudioContext | null>(null);
    const mp3EncoderRef = useRef<any>(null); // lamejs encoder
    const mp3ChunksRef = useRef<Int8Array[]>([]);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

    useEffect(() => {
        setIsNativeApp(Capacitor.isNativePlatform());
    }, []);

    useEffect(() => {
        if (!isConnected) return;
        const interval = setInterval(() => setCallDuration(d => d + 1), 1000);
        return () => clearInterval(interval);
    }, [isConnected]);

    useEffect(() => {
        if (!isRecording) return;
        const interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatCallTime = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const handleMicToggle = useCallback(() => {
        toggleMic();
    }, [toggleMic]);

    const startRecording = async () => {
        if (!localParticipant || !room) return;
        
        try {
            const localPub = localParticipant.getTrackPublication(Track.Source.Microphone);
            const remotePub = agentParticipant?.getTrackPublication(Track.Source.Microphone);
            
            const localMediaStreamTrack = localPub?.track?.mediaStreamTrack;
            const remoteMediaStreamTrack = remotePub?.track?.mediaStreamTrack;
            
            if (!localMediaStreamTrack) {
                onNotice({ title: "Recording not ready", message: "The microphone track is not available yet. Wait for the call to connect, then try recording again." });
                return;
            }

            // 2. Setup Web Audio API Context
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass();
            if (ctx.state === 'suspended') {
                await ctx.resume();
            }
            audioCtxRef.current = ctx;

            const mixer = ctx.createGain();
            mixer.gain.value = 1.0;
            
            // Connect Local Track
            const localStream = new MediaStream([localMediaStreamTrack]);
            const localSource = ctx.createMediaStreamSource(localStream);
            localSource.connect(mixer);
            
            // Connect Remote Track (if available)
            if (remoteMediaStreamTrack) {
                const remoteStream = new MediaStream([remoteMediaStreamTrack]);
                const remoteSource = ctx.createMediaStreamSource(remoteStream);
                remoteSource.connect(mixer);
            }

            // Set up lamejs MP3 Encoder
            // 1 channel (mono), 44100Hz sample rate, 128kbps bitrate
            const sampleRate = ctx.sampleRate;
            const EncoderClass = lamejs.Mp3Encoder || (lamejs as any).default?.Mp3Encoder;
            if (!EncoderClass) {
                 throw new Error("LameJS MP3 Encoder not found in bundle.");
            }
            mp3EncoderRef.current = new EncoderClass(1, sampleRate, 128);
            mp3ChunksRef.current = [];

            // 3. Process raw PCM audio into MP3 chunks
            const processor = ctx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = processor;
            
            mixer.connect(processor);
            processor.connect(ctx.destination); // Required for processor to run, but shouldn't cause echo if we don't route back to speaker

            processor.onaudioprocess = (e) => {
                const channelData = e.inputBuffer.getChannelData(0);
                // Convert Float32 to Int16
                const sampleBuffer = new Int16Array(channelData.length);
                for (let i = 0; i < channelData.length; i++) {
                    const s = Math.max(-1, Math.min(1, channelData[i]));
                    sampleBuffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }
                
                // Encode chunk
                const mp3buf = mp3EncoderRef.current.encodeBuffer(sampleBuffer);
                if (mp3buf.length > 0) {
                    mp3ChunksRef.current.push(new Int8Array(mp3buf));
                }
            };

            setRecordingTime(0);
            setIsRecording(true);

        } catch (e: any) {
            console.error("Failed to start recording:", e);
            const errName = e?.name || "";
            const errMsg = e?.message || String(e);
            onNotice({ title: "Recording could not start", message: `${errName}: ${errMsg}` });
        }
    };

    const stopRecording = useCallback(async () => {
        setIsRecording(false);
        try {
            // Stop processing
            if (scriptProcessorRef.current) {
                scriptProcessorRef.current.disconnect();
                scriptProcessorRef.current = null;
            }
            if (audioCtxRef.current) {
                await audioCtxRef.current.close();
                audioCtxRef.current = null;
            }
            
            // Flush final MP3 frames
            if (mp3EncoderRef.current) {
                const mp3buf = mp3EncoderRef.current.flush();
                if (mp3buf.length > 0) {
                    mp3ChunksRef.current.push(new Int8Array(mp3buf));
                }
                mp3EncoderRef.current = null;
            }

            if (mp3ChunksRef.current.length === 0) return;

            // Combine chunks into a single Blob
            const blob = new Blob(mp3ChunksRef.current as any[], { type: 'audio/mpeg' });
            mp3ChunksRef.current = [];

            // Convert to Base64 for Capacitor
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64Data = (reader.result as string).split(',')[1];
                
                const fileName = `Nuravya_Call_${new Date().toISOString().replace(/[:.]/g, '-')}.mp3`;
                
                // Save using Capacitor Filesystem
                try {
                    // 1. Request permissions explicitly (esp. for Android)
                    if (isNativeApp) {
                        const permStatus = await Filesystem.checkPermissions();
                        if (permStatus.publicStorage !== 'granted') {
                            await Filesystem.requestPermissions();
                        }
                        
                        // 2. Ensure Documents directory exists (some Androids need this)
                        try {
                            await Filesystem.mkdir({
                                path: '',
                                directory: Directory.Documents,
                                recursive: true
                            });
                        } catch {
                            // Directory might already exist, ignore error this time.
                        }
                    }

                    const savedFile = await Filesystem.writeFile({
                        path: fileName,
                        data: base64Data,
                        directory: Directory.Documents,
                    });

                    // Prompt user to Share/Save natively
                    if (isNativeApp) {
                        await Share.share({
                            title: 'Nuravya Call Recording',
                            text: 'Here is your recorded conversation.',
                            url: savedFile.uri,
                            dialogTitle: 'Save or Share Recording',
                        });
                    } else {
                        // Web fallback for testing
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        document.body.appendChild(a);
                        a.style.display = "none";
                        a.href = url;
                        a.download = fileName;
                        a.click();
                        URL.revokeObjectURL(url);
                    }
                } catch (writeErr: any) {
                    console.error("Failed to write recording:", writeErr);
                    onNotice({ title: "Recording was not saved", message: writeErr.message || String(writeErr) });
                }
            };

        } catch (e) {
            console.error("Failed to save recording:", e);
            onNotice({ title: "Recording was not saved", message: "Check storage permissions and try again." });
        }
    }, [isNativeApp, onNotice]);

    // Cleanup recording if the call ends abruptly.
    useEffect(() => {
        if (!isConnected && isRecording) {
            void stopRecording();
        }
    }, [isConnected, isRecording, stopRecording]);

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
                    <div className="flex flex-col items-center gap-1">
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-400 text-lg font-mono tracking-wider flex items-center gap-2">
                            {formatCallTime(callDuration)}
                            {isRecording && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold tracking-widest animate-pulse">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> REC {formatCallTime(recordingTime)}
                                </span>
                            )}
                        </motion.span>
                        <span className="text-stone-400 text-xs font-medium">
                            {(!agentParticipant && participants.length <= 1) ? "Agent joining..." :
                                assistantState === "listening" ? "Listening..." :
                                    assistantState === "thinking" ? "Thinking..." :
                                        assistantState === "speaking" ? "Speaking..." : "Connected"}
                        </span>
                    </div>
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

            <div className="pb-20 relative z-10 flex flex-col items-center gap-6 w-full px-8">
                {isConnected && (
                    <div className="flex items-center justify-center gap-6 w-full max-w-[300px]">
                        
                        {/* Audio Routing Toggle */}
                        <button
                            onClick={cycleAudioOutput}
                            disabled={!isNativeApp && audioOutputDevices.length <= 1}
                            className="w-12 h-12 justify-center items-center rounded-full flex transition-all bg-stone-700/50 text-stone-300 border border-stone-600 hover:bg-stone-600/50 disabled:opacity-30 disabled:hover:bg-stone-700/50"
                            title="Switch Audio Output"
                            aria-label="Switch audio output"
                        >
                            {getAudioOutputIcon()}
                        </button>

                        {/* Mute Mic */}
                        <button
                            onClick={handleMicToggle}
                            className={`w-14 h-14 justify-center items-center rounded-full flex transition-all ${isMicEnabled
                                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                                : "bg-stone-700/50 text-stone-400 border border-stone-600"
                                }`}
                            title={isMicEnabled ? "Mute Microphone" : "Unmute Microphone"}
                            aria-label={isMicEnabled ? "Mute microphone" : "Unmute microphone"}
                        >
                            {isMicEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                        </button>

                        {/* Record Button (App Only) */}
                        {isNativeApp ? (
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`w-12 h-12 justify-center items-center rounded-full flex transition-all ${isRecording
                                    ? "bg-red-500/20 text-red-500 border border-red-500 animate-pulse"
                                    : "bg-stone-700/50 text-red-400 border border-stone-600 hover:bg-stone-600/50"
                                    }`}
                                title={isRecording ? "Stop Recording" : "Start MP3 Recording"}
                                aria-label={isRecording ? "Stop recording" : "Start recording"}
                            >
                                {isRecording ? <StopCircle size={22} /> : <Circle size={22} className="fill-red-400" />}
                            </button>
                        ) : (
                            <div className="w-12 h-12" /> // spacer to maintain layout
                        )}
                    </div>
                )}
                
                <button 
                    aria-label="End call"
                    onClick={() => {
                        if (isRecording) {
                            stopRecording().then(() => onEndCall(callDuration));
                        } else {
                            onEndCall(callDuration);
                        }
                    }} 
                    className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"
                >
                    <PhoneOff size={28} />
                </button>
            </div>
        </>
    );
}
