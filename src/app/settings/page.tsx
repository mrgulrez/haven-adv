"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import {
    Mic, Lock, Volume2, Check, Loader2, Award, PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface VoiceProfile {
    id: string | null;
    name: string;
    provider: string;
    voice_id: string;
    description?: string;
    gender?: string;
    is_active: boolean;
    is_preset: boolean;
}

interface MilestoneItem {
    id: string;
    title: string;
    description?: string;
    category?: string;
    milestone_date?: string;
    is_celebrated: boolean;
}

export default function VoiceSettingsPage() {
    const { user, nuravyaUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const [voices, setVoices] = useState<VoiceProfile[]>([]);
    const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [settingVoice, setSettingVoice] = useState<string | null>(null);

    const isPaid = nuravyaUser?.plan === "core" || nuravyaUser?.plan === "pro";

    useEffect(() => {
        if (!authLoading && !user) router.push("/");
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [voiceData, milestoneData] = await Promise.all([
                    isPaid ? apiGet<VoiceProfile[]>("/api/voice-settings/voices") : Promise.resolve([]),
                    apiGet<MilestoneItem[]>("/api/voice-settings/milestones"),
                ]);
                setVoices(voiceData);
                setMilestones(milestoneData);

                // Check for new milestones
                await apiPost("/api/voice-settings/milestones/check", {});
                const refreshed = await apiGet<MilestoneItem[]>("/api/voice-settings/milestones");
                setMilestones(refreshed);
            } catch (err) {
                console.warn("Failed to load:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, isPaid]);

    const handleSetVoice = async (voice: VoiceProfile) => {
        setSettingVoice(voice.voice_id);
        try {
            await apiPost("/api/voice-settings/voices/set", {
                voice_id: voice.voice_id,
                name: voice.name,
                provider: voice.provider,
            });
            setVoices((prev) =>
                prev.map((v) => ({
                    ...v,
                    is_active: v.voice_id === voice.voice_id,
                }))
            );
        } catch (err) {
            console.warn("Failed to set voice:", err);
        } finally {
            setSettingVoice(null);
        }
    };

    const celebrateMilestone = async (id: string) => {
        try {
            await apiPost(`/api/voice-settings/milestones/${id}/celebrate`, {});
            setMilestones((prev) =>
                prev.map((m) => (m.id === id ? { ...m, is_celebrated: true } : m))
            );
        } catch (err) {
            console.warn("Celebrate failed:", err);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <div className="flex-grow pt-24 pb-24 px-4 md:px-6">
                <div className="container mx-auto max-w-5xl">

                    {/* Header */}
                    <h1 className="text-3xl font-bold font-heading text-stone-900 flex items-center gap-3 mb-2">
                        <Mic className="text-amber-500" size={32} />
                        Voice & Milestones
                    </h1>
                    <p className="text-stone-500 mb-8">Personalize Nuravya&apos;s voice and celebrate your journey</p>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                        </div>
                    ) : (
                        <>
                            {/* ── Voice Personalities ──────────────────── */}
                            <section className="mb-12">
                                <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Voice Personalities</h2>

                                {!isPaid ? (
                                    <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center">
                                        <Lock className="mx-auto mb-3 text-stone-300" size={32} />
                                        <p className="text-stone-500 mb-4">Voice personalization requires Nuravya Core or Pro</p>
                                        <Link href="/pricing">
                                            <Button className="bg-amber-500 hover:bg-amber-600 text-white">Upgrade</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {voices.map((voice) => (
                                            <motion.div
                                                key={voice.voice_id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`bg-white rounded-2xl p-5 border-2 transition-all cursor-pointer ${voice.is_active
                                                        ? "border-amber-400 shadow-md shadow-amber-100"
                                                        : "border-stone-200 hover:border-amber-200"
                                                    }`}
                                                onClick={() => handleSetVoice(voice)}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${voice.is_active ? "bg-amber-100" : "bg-stone-100"
                                                            }`}>
                                                            <Volume2 size={18} className={voice.is_active ? "text-amber-600" : "text-stone-500"} />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-stone-900 text-sm">{voice.name}</p>
                                                            <p className="text-[10px] text-stone-400 uppercase tracking-wider">{voice.gender || voice.provider}</p>
                                                        </div>
                                                    </div>
                                                    {voice.is_active ? (
                                                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                                                            <Check size={14} className="text-white" />
                                                        </div>
                                                    ) : settingVoice === voice.voice_id ? (
                                                        <Loader2 size={16} className="animate-spin text-amber-500" />
                                                    ) : null}
                                                </div>
                                                <p className="text-xs text-stone-500">{voice.description}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* ── Milestones ──────────────────────────── */}
                            <section>
                                <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Award size={16} className="text-amber-500" />
                                    Your Milestones
                                </h2>

                                {milestones.length === 0 ? (
                                    <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center">
                                        <Award className="mx-auto mb-3 text-stone-300" size={32} />
                                        <p className="text-stone-500">Keep chatting to unlock your first milestone!</p>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {milestones.map((ms) => (
                                            <motion.div
                                                key={ms.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`rounded-2xl p-5 border ${ms.is_celebrated
                                                        ? "bg-amber-50 border-amber-200"
                                                        : "bg-white border-stone-200"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-semibold text-stone-900 text-sm mb-1">{ms.title}</p>
                                                        <p className="text-xs text-stone-500">{ms.description}</p>
                                                        {ms.milestone_date && (
                                                            <p className="text-[10px] text-stone-400 mt-2">
                                                                {new Date(ms.milestone_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {!ms.is_celebrated ? (
                                                        <button
                                                            onClick={() => celebrateMilestone(ms.id)}
                                                            className="p-2 rounded-xl bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                                                            title="Celebrate!"
                                                        >
                                                            <PartyPopper size={16} />
                                                        </button>
                                                    ) : (
                                                        <div className="p-2 rounded-xl bg-amber-100/50">
                                                            <PartyPopper size={16} className="text-amber-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
