"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Mic, Lock, Volume2, Check, Loader2, Award, PartyPopper,
    User, Bell, Shield, Settings, Camera, Edit3, Save,
    Smartphone, Mail, LogOut, Trash2, CheckCircle2, AlertTriangle,
    ChevronRight, Info, Crown, ExternalLink, Globe, RefreshCw
} from "lucide-react";
import { VoiceCloner } from "@/components/settings/voice-cloner";
import Image from "next/image";
import { PLANS, BRAND } from "@/lib/site.config";

// ─── Types ──────────────────────────────────────────────────────────────────

interface VoiceProfile {
    id: string | null;
    name: string;
    provider: string;
    voice_id: string;
    description?: string;
    gender?: string;
    required_plan: string;
    preview_url?: string;
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

// ─── Tab config ─────────────────────────────────────────────────────────────

const TABS = [
    { id: "profile", label: "Personal Info", icon: User },
    { id: "voice", label: "Voice & AI", icon: Mic },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
] as const;

type TabId = typeof TABS[number]["id"];

// ─── Main Content Component ──────────────────────────────────────────────────

function SettingsContent() {
    const { user, nuravyaUser, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<TabId>(() => {
        const t = searchParams.get("tab") as TabId | null;
        return t && TABS.some(tab => tab.id === t) ? t : "profile";
    });

    // Voice tab state
    const [voices, setVoices] = useState<VoiceProfile[]>([]);
    const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [settingVoice, setSettingVoice] = useState<string | null>(null);
    const [playingUrl, setPlayingUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Profile tab state
    const [displayName, setDisplayName] = useState("");
    const [editingName, setEditingName] = useState(false);
    const [savingName, setSavingName] = useState(false);
    const [nameSaved, setNameSaved] = useState(false);

    // Notifications state
    const [notifSettings, setNotifSettings] = useState({
        email_digests: true,
        milestone_alerts: true,
        weekly_insights: false,
        chat_reminders: true,
    });
    const [notifLoading, setNotifLoading] = useState(false);
    const [savingNotifs, setSavingNotifs] = useState(false);
    const [notifSaved, setNotifSaved] = useState(false);
    const [testingEmail, setTestingEmail] = useState(false);
    const [testEmailSent, setTestEmailSent] = useState(false);

    // Security state
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState("");

    const userPlan = nuravyaUser?.plan || "free";
    const hasCore = userPlan === "core" || userPlan === "pro";
    const hasPro = userPlan === "pro";

    useEffect(() => {
        if (!authLoading && !user) router.push("/");
        if (user) setDisplayName(user.displayName || "");
    }, [user, authLoading, router]);

    // Load notification preferences from real API
    useEffect(() => {
        if (!user) return;
        setNotifLoading(true);
        apiGet<{
            email_digests: boolean;
            milestone_alerts: boolean;
            weekly_insights: boolean;
            chat_reminders: boolean;
        }>("/api/notifications/preferences")
            .then(data => setNotifSettings({
                email_digests: data.email_digests,
                milestone_alerts: data.milestone_alerts,
                weekly_insights: data.weekly_insights,
                chat_reminders: data.chat_reminders,
            }))
            .catch(() => {/* keep defaults */ })
            .finally(() => setNotifLoading(false));
    }, [user]);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            setDataLoading(true);
            try {
                const [voiceData, milestoneData] = await Promise.all([
                    apiGet<VoiceProfile[]>("/api/voice-settings/voices"),
                    apiGet<MilestoneItem[]>("/api/voice-settings/milestones"),
                ]);
                setVoices(voiceData);
                setMilestones(milestoneData);
                // Refresh milestones
                await apiPost("/api/voice-settings/milestones/check", {});
                const refreshed = await apiGet<MilestoneItem[]>("/api/voice-settings/milestones");
                setMilestones(refreshed);
            } catch (err) {
                console.warn("Failed to load settings data:", err);
            } finally {
                setDataLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const fetchVoices = async () => {
        try {
            const d = await apiGet<VoiceProfile[]>("/api/voice-settings/voices");
            setVoices(d);
        } catch { /* silent */ }
    };

    const handleSetVoice = async (voice: VoiceProfile) => {
        if ((voice.required_plan === "pro" && !hasPro) || (voice.required_plan === "core" && !hasCore)) {
            router.push("/pricing"); return;
        }
        setSettingVoice(voice.voice_id);
        try {
            await apiPost("/api/voice-settings/voices/set", {
                voice_id: voice.voice_id, name: voice.name, provider: voice.provider,
            });
            setVoices(prev => prev.map(v => ({ ...v, is_active: v.voice_id === voice.voice_id })));
        } catch { /* silent */ }
        finally { setSettingVoice(null); }
    };

    const togglePlay = (url?: string) => {
        if (!url) return;
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.onended = () => setPlayingUrl(null);
        }
        const audio = audioRef.current;
        if (playingUrl === url) { audio.pause(); setPlayingUrl(null); }
        else { audio.src = url; audio.play(); setPlayingUrl(url); }
    };

    const celebrateMilestone = async (id: string) => {
        try {
            await apiPost(`/api/voice-settings/milestones/${id}/celebrate`, {});
            setMilestones(prev => prev.map(m => m.id === id ? { ...m, is_celebrated: true } : m));
        } catch { /* silent */ }
    };

    const handleSaveName = async () => {
        if (!displayName.trim()) return;
        setSavingName(true);
        try {
            // Update via Firebase profile
            if (user && user.displayName !== displayName) {
                const { updateProfile } = await import("firebase/auth");
                await updateProfile(user, { displayName });
            }
            setNameSaved(true); setEditingName(false);
            setTimeout(() => setNameSaved(false), 2500);
        } catch { /* silent */ }
        finally { setSavingName(false); }
    };

    const handleSaveNotifs = async () => {
        setSavingNotifs(true);
        try {
            await apiPost("/api/notifications/preferences", notifSettings as unknown as Record<string, unknown>);
            setNotifSaved(true);
            setTimeout(() => setNotifSaved(false), 3000);
        } catch { /* silent — show saved anyway */ }
        finally { setSavingNotifs(false); }
    };

    const handleTestEmail = async () => {
        setTestingEmail(true);
        try {
            await apiPost("/api/notifications/test-email", {});
            setTestEmailSent(true);
            setTimeout(() => setTestEmailSent(false), 5000);
        } catch { /* silent */ }
        finally { setTestingEmail(false); }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
                <div className="w-8 h-8 border-[3px] border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const joinedDate = nuravyaUser?.created_at
        ? new Date(nuravyaUser.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : null;

    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <div className="flex-grow pt-24 pb-32 px-4 md:px-6">
                <div className="container mx-auto max-w-4xl">

                    {/* ─── Page header ─── */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-amber-100 rounded-2xl">
                            <Settings size={24} className="text-amber-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-heading text-stone-900">Settings</h1>
                            <p className="text-sm text-stone-500">Manage your account, voice, and preferences</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">

                        {/* ─── Sidebar tabs ─── */}
                        <aside className="md:w-52 flex-shrink-0">
                            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                                {TABS.map((tab, i) => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <div key={tab.id}>
                                            {i > 0 && <div className="h-px bg-stone-50 mx-3" />}
                                            <button
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${isActive
                                                    ? "bg-amber-50 text-amber-700"
                                                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                                                    }`}
                                            >
                                                <tab.icon size={17} className={isActive ? "text-amber-500" : "text-stone-400"} />
                                                <span className={`text-sm font-medium ${isActive ? "font-semibold" : ""}`}>{tab.label}</span>
                                                {isActive && <div className="ml-auto w-1 h-4 rounded-full bg-amber-400" />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Plan badge */}
                            <div className={`mt-4 rounded-2xl p-4 border ${hasPro ? "bg-stone-950 border-stone-800" : hasCore ? "border-amber-200 bg-amber-50" : "border-stone-200 bg-white"}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <Crown size={14} className={hasPro ? "text-amber-400" : hasCore ? "text-amber-600" : "text-stone-400"} />
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${hasPro ? "text-stone-400" : hasCore ? "text-amber-700" : "text-stone-500"}`}>
                                        Current Plan
                                    </span>
                                </div>
                                <p className={`text-base font-bold font-heading capitalize ${hasPro ? "text-white" : "text-stone-900"}`}>{userPlan}</p>
                                {!hasPro && (
                                    <a href="/pricing" className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                                        Upgrade <ExternalLink size={10} />
                                    </a>
                                )}
                            </div>
                        </aside>

                        {/* ─── Tab Content ─── */}
                        <div className="flex-1 min-w-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.18 }}
                                >

                                    {/* ─── PERSONAL INFO TAB ─── */}
                                    {activeTab === "profile" && (
                                        <div className="space-y-5">
                                            {/* Avatar + name card */}
                                            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
                                                <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-5">Identity</h2>
                                                <div className="flex items-center gap-5 mb-6">
                                                    <div className="relative">
                                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 ring-2 ring-offset-2 ring-amber-200">
                                                            {user.photoURL ? (
                                                                <Image src={user.photoURL} alt="Avatar" width={80} height={80} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <User size={36} className="text-stone-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-xl border border-stone-200 shadow-sm">
                                                            <Camera size={13} className="text-stone-500" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-stone-500 mb-0.5">Avatar</p>
                                                        <p className="text-xs text-stone-400">Synced from Google account</p>
                                                        <div className="flex items-center gap-1.5 mt-1.5">
                                                            <Globe size={12} className="text-stone-400" />
                                                            <span className="text-[11px] text-stone-400">Managed by Google Sign-In</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    {/* Display Name */}
                                                    <div>
                                                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2">Display Name</label>
                                                        <div className="flex gap-2">
                                                            {editingName ? (
                                                                <>
                                                                    <input
                                                                        className="flex-1 border border-amber-300 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-900 outline-none focus:ring-2 focus:ring-amber-400/30 transition-all"
                                                                        value={displayName}
                                                                        onChange={e => setDisplayName(e.target.value)}
                                                                        autoFocus
                                                                        onKeyDown={e => e.key === "Enter" && handleSaveName()}
                                                                    />
                                                                    <button
                                                                        onClick={handleSaveName}
                                                                        disabled={savingName}
                                                                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                                                                    >
                                                                        {savingName ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                                                        Save
                                                                    </button>
                                                                    <button onClick={() => { setEditingName(false); setDisplayName(user.displayName || ""); }} className="px-3 py-2.5 text-stone-500 hover:text-stone-700 text-sm rounded-xl hover:bg-stone-50 transition-all">
                                                                        Cancel
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="flex-1 px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-100 text-sm font-medium text-stone-800">
                                                                        {user.displayName || "—"}
                                                                    </div>
                                                                    <button onClick={() => setEditingName(true)} className="px-3 py-2.5 rounded-xl border border-stone-200 text-stone-500 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 transition-all flex items-center gap-1.5 text-sm">
                                                                        <Edit3 size={14} />
                                                                        Edit
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                        {nameSaved && (
                                                            <p className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2">
                                                                <CheckCircle2 size={13} /> Name updated successfully
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Email */}
                                                    <div>
                                                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2">Email Address</label>
                                                        <div className="flex items-center gap-3 px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-100">
                                                            <Mail size={15} className="text-stone-400" />
                                                            <span className="text-sm font-medium text-stone-700">{user.email}</span>
                                                            <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">
                                                                <CheckCircle2 size={11} className="text-emerald-500" />
                                                                <span className="text-[10px] font-bold text-emerald-600">Verified</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-[11px] text-stone-400 mt-1.5 ml-1">Managed by your Google account</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Account info */}
                                            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
                                                <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Account Details</h2>
                                                <div className="space-y-3">
                                                    {[
                                                        { label: "Account ID", value: nuravyaUser?.id?.slice(0, 8).toUpperCase() + "…" || "—", icon: Info },
                                                        { label: "Member Since", value: joinedDate || "—", icon: CheckCircle2 },
                                                        { label: "Plan", value: `Nuravya ${userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}`, icon: Crown },
                                                        { label: "Sign-in Method", value: "Google", icon: Globe },
                                                    ].map(row => (
                                                        <div key={row.label} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-stone-50 transition-colors">
                                                            <div className="flex items-center gap-2.5">
                                                                <row.icon size={15} className="text-stone-400" />
                                                                <span className="text-sm text-stone-500">{row.label}</span>
                                                            </div>
                                                            <span className="text-sm font-semibold text-stone-800">{row.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Feature access */}
                                            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
                                                <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Feature Access</h2>
                                                <div className="space-y-2">
                                                    {(PLANS.find(p => p.id === userPlan)?.features || PLANS[0].features).map(feat => (
                                                        <div key={feat} className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50">
                                                            <span className="text-sm font-medium text-stone-700">{feat}</span>
                                                            <div className="flex items-center gap-1.5 text-emerald-600">
                                                                <Check size={14} /><span className="text-[11px] font-bold">Active</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {!hasPro && (
                                                    <a href="/pricing" className="mt-4 flex items-center justify-center gap-2 p-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-2xl transition-all shadow-md shadow-amber-100">
                                                        <Crown size={15} /> Upgrade to Pro — {PLANS.find(p => p.id === "pro")?.priceLabel}/mo
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ─── VOICE & AI TAB ─── */}
                                    {activeTab === "voice" && (
                                        <div className="space-y-8">
                                            {dataLoading ? (
                                                <div className="flex items-center justify-center py-20">
                                                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Voice grid */}
                                                    <div>
                                                        <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Nuravya&apos;s Voice</h2>
                                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {voices.map(voice => {
                                                                const isLocked = (voice.required_plan === "pro" && !hasPro) || (voice.required_plan === "core" && !hasCore);
                                                                return (
                                                                    <motion.div
                                                                        key={voice.voice_id}
                                                                        whileHover={{ scale: isLocked ? 1 : 1.02 }}
                                                                        whileTap={{ scale: 0.99 }}
                                                                        className={`bg-white rounded-2xl p-5 border-2 transition-all relative cursor-pointer ${voice.is_active ? "border-amber-400 shadow-md shadow-amber-100" :
                                                                            isLocked ? "border-stone-100 bg-stone-50/50 opacity-70" :
                                                                                "border-stone-200 hover:border-amber-200"
                                                                            }`}
                                                                        onClick={() => !isLocked && handleSetVoice(voice)}
                                                                    >
                                                                        <div className="flex items-center justify-between mb-3">
                                                                            <div className="flex items-center gap-2.5">
                                                                                <button
                                                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${voice.is_active ? "bg-amber-100" : "bg-stone-100 hover:bg-amber-50"}`}
                                                                                    onClick={e => { e.stopPropagation(); togglePlay(voice.preview_url); }}
                                                                                >
                                                                                    {playingUrl === voice.preview_url ? (
                                                                                        <div className="flex gap-0.5">
                                                                                            <span className="w-1 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                                                            <span className="w-1 h-4 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                                                            <span className="w-1 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <Volume2 size={17} className={voice.is_active ? "text-amber-600" : "text-stone-500"} />
                                                                                    )}
                                                                                </button>
                                                                                <div>
                                                                                    <p className="font-semibold text-stone-900 text-sm flex items-center gap-1">
                                                                                        {voice.name}
                                                                                        {isLocked && <Lock size={11} className="text-stone-400" />}
                                                                                    </p>
                                                                                    <div className="flex items-center gap-1.5">
                                                                                        <p className="text-stone-400 text-[10px] uppercase tracking-wider">{voice.gender}</p>
                                                                                        {voice.required_plan !== "free" && (
                                                                                            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase">{voice.required_plan}</span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {voice.is_active ? (
                                                                                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                                                                                    <Check size={13} className="text-white" />
                                                                                </div>
                                                                            ) : settingVoice === voice.voice_id ? (
                                                                                <Loader2 size={16} className="animate-spin text-amber-500" />
                                                                            ) : null}
                                                                        </div>
                                                                        <p className="text-xs text-stone-500 leading-relaxed">{voice.description}</p>
                                                                        {isLocked && (
                                                                            <button
                                                                                className="mt-3 w-full py-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-700 text-xs font-semibold transition-all border border-stone-200"
                                                                                onClick={e => { e.stopPropagation(); router.push("/pricing"); }}
                                                                            >
                                                                                Upgrade to Unlock
                                                                            </button>
                                                                        )}
                                                                    </motion.div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Custom voice cloner */}
                                                    <div>
                                                        <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Clone Your Voice</h2>
                                                        <VoiceCloner hasAccess={hasCore} onSuccess={fetchVoices} onUpgradeClick={() => router.push("/pricing")} />
                                                    </div>

                                                    {/* Milestones */}
                                                    <div>
                                                        <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                            <Award size={14} className="text-amber-500" />
                                                            Your Milestones
                                                        </h2>
                                                        {milestones.length === 0 ? (
                                                            <div className="bg-white rounded-3xl p-10 border border-stone-100 text-center">
                                                                <Award className="mx-auto mb-3 text-stone-300" size={32} />
                                                                <p className="text-stone-500 text-sm">Keep chatting to unlock your first milestone!</p>
                                                            </div>
                                                        ) : (
                                                            <div className="grid sm:grid-cols-2 gap-3">
                                                                {milestones.map(ms => (
                                                                    <motion.div
                                                                        key={ms.id}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        className={`rounded-2xl p-5 border ${ms.is_celebrated ? "bg-amber-50 border-amber-200" : "bg-white border-stone-200"}`}
                                                                    >
                                                                        <div className="flex items-start justify-between gap-3">
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
                                                                                <button onClick={() => celebrateMilestone(ms.id)} className="p-2.5 rounded-xl bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors flex-shrink-0">
                                                                                    <PartyPopper size={16} />
                                                                                </button>
                                                                            ) : (
                                                                                <div className="p-2.5 rounded-xl bg-amber-50 flex-shrink-0">
                                                                                    <PartyPopper size={16} className="text-amber-400" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* ─── NOTIFICATIONS TAB ─── */}
                                    {activeTab === "notifications" && (
                                        <div className="space-y-5">
                                            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
                                                <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-5">Email Preferences</h2>
                                                <div className="space-y-2">
                                                    {[
                                                        {
                                                            key: "email_digests" as const,
                                                            label: "Weekly Email Digest",
                                                            sub: "A summary of your conversations and emotional insights",
                                                            icon: Mail,
                                                        },
                                                        {
                                                            key: "milestone_alerts" as const,
                                                            label: "Milestone Achievements",
                                                            sub: "Get notified when you reach a new milestone",
                                                            icon: Award,
                                                        },
                                                        {
                                                            key: "weekly_insights" as const,
                                                            label: "Insights Report",
                                                            sub: "Your mood trends and top conversation themes",
                                                            icon: RefreshCw,
                                                        },
                                                        {
                                                            key: "chat_reminders" as const,
                                                            label: "Chat Reminders",
                                                            sub: "Remind me to check in with Nuravya daily",
                                                            icon: Bell,
                                                        },
                                                    ].map(item => (
                                                        <div key={item.key} className="flex items-center justify-between px-4 py-4 rounded-2xl hover:bg-stone-50 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2.5 rounded-xl bg-stone-100">
                                                                    <item.icon size={16} className="text-stone-500" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-stone-900">{item.label}</p>
                                                                    <p className="text-xs text-stone-400">{item.sub}</p>
                                                                </div>
                                                            </div>
                                                            {/* Toggle */}
                                                            <button
                                                                onClick={() => setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ml-4 ${notifSettings[item.key] ? "bg-amber-500" : "bg-stone-200"}`}
                                                            >
                                                                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${notifSettings[item.key] ? "left-5" : "left-0.5"}`} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-6 pt-5 border-t border-stone-50 flex items-center justify-between">
                                                    {notifSaved && (
                                                        <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                                                            <CheckCircle2 size={13} /> Preferences saved
                                                        </p>
                                                    )}
                                                    <div className="ml-auto">
                                                        <Button
                                                            onClick={handleSaveNotifs}
                                                            disabled={savingNotifs}
                                                            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl px-5"
                                                        >
                                                            {savingNotifs ? <Loader2 size={14} className="animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
                                                            Save Preferences
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 flex items-start gap-4">
                                                <Info size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-amber-800 leading-relaxed">
                                                    Email notifications use your registered Google email address.
                                                    We never share your data with third parties.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* ─── SECURITY TAB ─── */}
                                    {activeTab === "security" && (
                                        <div className="space-y-5">
                                            {/* Auth method */}
                                            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
                                                <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-5">Authentication</h2>
                                                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 mb-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-sm">
                                                        {/* Google G icon */}
                                                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-stone-900">Google Sign-In</p>
                                                        <p className="text-xs text-stone-500">{user.email}</p>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <CheckCircle2 size={12} className="text-emerald-500" />
                                                            <span className="text-[11px] font-semibold text-emerald-600">Active Session</span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-auto text-right">
                                                        <p className="text-[10px] text-stone-400">Secured by</p>
                                                        <p className="text-xs font-bold text-stone-700">Firebase Auth</p>
                                                    </div>
                                                </div>

                                                {/* Security items */}
                                                <div className="space-y-2">
                                                    {[
                                                        { icon: Shield, label: "End-to-End Encryption", sub: "All conversations are encrypted at rest", status: "Active", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                                                        { icon: Lock, label: "Secure Token Auth", sub: "Session tokens auto-expire every 24h", status: "Active", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                                                        { icon: Smartphone, label: "Pinecone AI Memory Encryption", sub: "Vector memory is user-scoped & private", status: "Active", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                                                    ].map(item => (
                                                        <div key={item.label} className={`flex items-center gap-3 p-4 rounded-2xl border ${item.color}`}>
                                                            <item.icon size={16} />
                                                            <div>
                                                                <p className="text-sm font-semibold">{item.label}</p>
                                                                <p className="text-xs opacity-70">{item.sub}</p>
                                                            </div>
                                                            <span className="ml-auto text-[10px] font-bold uppercase tracking-widest opacity-80">{item.status}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Sign out all devices */}
                                            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
                                                <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Session Management</h2>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-semibold text-stone-900">Sign Out of This Device</p>
                                                        <p className="text-xs text-stone-500 mt-0.5">Your data remains safe. Sign back in anytime.</p>
                                                    </div>
                                                    <button
                                                        onClick={logout}
                                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all text-sm font-semibold"
                                                    >
                                                        <LogOut size={15} />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Danger zone */}
                                            <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-6">
                                                <h2 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <AlertTriangle size={13} />
                                                    Danger Zone
                                                </h2>
                                                {!deletingAccount ? (
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-semibold text-stone-900">Delete Account</p>
                                                            <p className="text-xs text-stone-500 mt-0.5">Permanently removes all your data. This cannot be undone.</p>
                                                        </div>
                                                        <button
                                                            onClick={() => setDeletingAccount(true)}
                                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all text-sm font-semibold"
                                                        >
                                                            <Trash2 size={15} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                                                            <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                                                            <p className="text-sm text-red-700">
                                                                This will permanently delete your account and all associated data including conversations, memories, and settings. <strong>This cannot be undone.</strong>
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-stone-500">Type <strong>DELETE</strong> to confirm:</p>
                                                        <div className="flex gap-2">
                                                            <input
                                                                className="flex-1 border border-red-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300/30 text-red-700 font-mono"
                                                                placeholder="DELETE"
                                                                value={confirmDelete}
                                                                onChange={e => setConfirmDelete(e.target.value)}
                                                            />
                                                            <button
                                                                disabled={confirmDelete !== "DELETE"}
                                                                className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold disabled:opacity-40 transition-all"
                                                                onClick={async () => {
                                                                    try {
                                                                        await apiPost("/api/users/delete", {});
                                                                        logout();
                                                                    } catch { /* Contact support */ }
                                                                }}
                                                            >
                                                                Confirm Delete
                                                            </button>
                                                            <button onClick={() => { setDeletingAccount(false); setConfirmDelete(""); }} className="px-4 py-2.5 rounded-xl text-stone-500 hover:bg-stone-50 text-sm font-semibold transition-all">
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Data policy note */}
                                            <div className="bg-stone-50 border border-stone-100 rounded-3xl p-5 flex items-start gap-3">
                                                <Shield size={16} className="text-stone-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-stone-500 leading-relaxed">
                                                    Your privacy matters. All conversations are encrypted, never sold, and never used to train AI models without your explicit consent.
                                                    Read our <a href="/privacy" className="text-amber-600 hover:underline font-medium">Privacy Policy</a>.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

// ─── Suspense Wrapper ────────────────────────────────────────────────────────

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
                <div className="w-8 h-8 border-[3px] border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}
