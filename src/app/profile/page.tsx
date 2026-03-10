"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Footer } from "@/components/layout/footer";
import {
    User, Mail, Shield, LogOut, ChevronRight, Settings, Bell,
    CreditCard, Mic, BarChart3, Sparkles, Brain, Star,
    TrendingUp, MessageSquare, Calendar, Zap, Crown, Check, ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api";

interface UsageData {
    plan: string;
    period_start: string;
    voice_minutes_used: number;
    voice_minutes_limit: number;
    text_messages_sent: number;
    voice_quota_pct: number;
}

const PLAN_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType; gradient: string; badge: string }> = {
    free: { label: "Free", color: "text-stone-500", icon: User, gradient: "from-stone-200 to-stone-100", badge: "bg-stone-100 text-stone-600 border-stone-200" },
    core: { label: "Core", color: "text-amber-600", icon: Zap, gradient: "from-amber-400 to-amber-200", badge: "bg-amber-100 text-amber-800 border-amber-200" },
    pro: { label: "Pro", color: "text-white", icon: Crown, gradient: "from-stone-900 to-stone-700", badge: "bg-stone-900 text-white border-stone-700" },
};

export default function ProfilePage() {
    const { user, nuravyaUser, loading, logout } = useAuth();
    const router = useRouter();
    const [usage, setUsage] = useState<UsageData | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push("/");
    }, [user, loading, router]);

    useEffect(() => {
        if (user && nuravyaUser) {
            apiGet<UsageData>("/api/usage/current").then(setUsage).catch(console.warn);
        }
    }, [user, nuravyaUser]);

    const handleCancelSubscription = async () => {
        if (!confirm("Are you sure you want to cancel? You'll retain access until the end of your billing period.")) return;
        setCancelling(true);
        try {
            await apiPost("/api/payments/cancel", {});
            window.location.reload();
        } catch {
            alert("Failed to cancel subscription. Please try again.");
        } finally {
            setCancelling(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
                <div className="w-8 h-8 border-[3px] border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const currentPlan = nuravyaUser?.plan || "free";
    const isPaid = currentPlan === "core" || currentPlan === "pro";
    const plan = PLAN_CONFIG[currentPlan] || PLAN_CONFIG.free;
    const PlanIcon = plan.icon;

    const joinedDate = nuravyaUser?.created_at
        ? new Date(nuravyaUser.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : null;

    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <div className="flex-grow pt-24 pb-32 px-4 md:px-6">
                <div className="container mx-auto max-w-4xl space-y-6">

                    {/* ─── Hero Profile Card ───────────────────────────────────── */}
                    <div className="relative rounded-3xl overflow-hidden bg-stone-950 text-white">
                        {/* Background texture */}
                        <div className="absolute inset-0">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[80px]" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px]" />
                        </div>

                        <div className="relative z-10 p-7 md:p-10">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-amber-500/30 bg-stone-800">
                                        {user.photoURL ? (
                                            <Image
                                                src={user.photoURL}
                                                alt={user.displayName || "User"}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-stone-800 text-stone-400">
                                                <User size={40} />
                                            </div>
                                        )}
                                    </div>
                                    {/* Active dot */}
                                    <span className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-stone-950 rounded-full" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h1 className="text-2xl md:text-3xl font-bold font-heading leading-tight truncate">{user.displayName}</h1>
                                        <span className={`px-3 py-1 text-[11px] font-bold rounded-full border uppercase tracking-widest flex items-center gap-1.5 ${plan.badge}`}>
                                            <PlanIcon size={11} />
                                            Nuravya {plan.label}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-stone-400">
                                        <span className="flex items-center gap-1.5">
                                            <Mail size={14} className="text-stone-500" />
                                            {user.email}
                                        </span>
                                        {joinedDate && (
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-stone-500" />
                                                Member since {joinedDate}
                                            </span>
                                        )}
                                    </div>
                                    {/* Quick action pills */}
                                    <div className="flex flex-wrap gap-2 mt-5">
                                        <Link href="/chat" className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-amber-500/30 active:scale-95">
                                            <MessageSquare size={15} />
                                            Open Chat
                                        </Link>
                                        <Link href="/settings" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm font-semibold transition-all backdrop-blur-sm">
                                            <Settings size={15} />
                                            Settings
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Usage Stats Bento ──────────────────────────────────── */}
                    {isPaid && usage && (
                        <div className="grid grid-cols-3 gap-4">
                            {/* Voice Minutes */}
                            <div className="col-span-3 md:col-span-1 bg-white rounded-3xl p-5 border border-stone-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-amber-50 rounded-xl">
                                        <Mic size={18} className="text-amber-500" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Voice</span>
                                </div>
                                <div className="text-3xl font-bold font-heading text-stone-900 leading-none mb-0.5">
                                    {Math.round(usage.voice_minutes_used)}
                                    <span className="text-base font-normal text-stone-400">/{usage.voice_minutes_limit}m</span>
                                </div>
                                <p className="text-xs text-stone-500 mb-3">minutes used</p>
                                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${usage.voice_quota_pct > 90 ? "bg-red-500" :
                                            usage.voice_quota_pct > 70 ? "bg-amber-500" : "bg-emerald-500"
                                            }`}
                                        style={{ width: `${Math.min(usage.voice_quota_pct, 100)}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-stone-400 mt-1.5">{Math.round(usage.voice_quota_pct)}% used</p>
                            </div>

                            {/* Messages */}
                            <div className="col-span-3 md:col-span-1 bg-white rounded-3xl p-5 border border-stone-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-blue-50 rounded-xl">
                                        <BarChart3 size={18} className="text-blue-500" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Messages</span>
                                </div>
                                <div className="text-3xl font-bold font-heading text-stone-900 leading-none mb-0.5">
                                    {usage.text_messages_sent.toLocaleString()}
                                </div>
                                <p className="text-xs text-stone-500 mb-3">this month</p>
                                <div className="flex items-center gap-1.5">
                                    <TrendingUp size={13} className="text-emerald-500" />
                                    <span className="text-[11px] font-medium text-emerald-600">Unlimited</span>
                                </div>
                            </div>

                            {/* Plan Card */}
                            <div className={`col-span-3 md:col-span-1 rounded-3xl p-5 bg-gradient-to-br ${plan.gradient} relative overflow-hidden`}>
                                <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <PlanIcon size={18} className={currentPlan === "pro" ? "text-amber-400" : "text-amber-600"} />
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${currentPlan === "pro" ? "text-stone-400" : "text-stone-500"}`}>Plan</span>
                                    </div>
                                    <div className={`text-3xl font-bold font-heading leading-none mb-0.5 capitalize ${currentPlan === "pro" ? "text-white" : "text-stone-900"}`}>
                                        {currentPlan}
                                    </div>
                                    <p className={`text-xs mb-3 ${currentPlan === "pro" ? "text-stone-400" : "text-stone-500"}`}>
                                        ${currentPlan === "pro" ? "59" : "24"}/month
                                    </p>
                                    <Link href="/pricing" className={`text-[11px] font-bold flex items-center gap-1 ${currentPlan === "pro" ? "text-amber-400 hover:text-amber-300" : "text-amber-600 hover:text-amber-700"} transition-colors`}>
                                        Manage <ExternalLink size={10} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Upgrade Banner for free users */}
                    {!isPaid && (
                        <div className="bg-gradient-to-r from-amber-500 to-amber-400 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Star size={16} className="text-stone-900" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-stone-800">Upgrade Nuravya</span>
                                </div>
                                <p className="text-stone-900 font-semibold text-lg font-heading">Unlock voice calls & infinite memory</p>
                                <p className="text-stone-800/70 text-sm mt-0.5">Core from $24/mo — cancel anytime.</p>
                            </div>
                            <Link href="/pricing" className="flex-shrink-0 bg-stone-950 hover:bg-stone-800 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:shadow-lg active:scale-95 flex items-center gap-2">
                                <Crown size={15} />
                                View Plans
                            </Link>
                        </div>
                    )}

                    {/* ─── Settings Grid ──────────────────────────────────────── */}
                    <div className="grid md:grid-cols-2 gap-4">

                        {/* Account Settings */}
                        <div>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-4 mb-3">Account</p>
                            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
                                {[
                                    { icon: User, label: "Personal Information", sub: "Name, birthday, gender", href: "/settings?tab=profile", color: "text-amber-600 bg-amber-50" },
                                    { icon: Mic, label: "Voice & Personas", sub: "Custom characters, voice cloning", href: "/settings?tab=voice", color: "text-purple-600 bg-purple-50" },
                                    { icon: Brain, label: "Memory Settings", sub: "Pinned facts, conversation history", href: "/memory", color: "text-blue-600 bg-blue-50" },
                                    { icon: Bell, label: "Notifications", sub: "Email, push, reminders", href: "/settings?tab=notifications", color: "text-green-600 bg-green-50" },
                                    { icon: Shield, label: "Security & Privacy", sub: "Encryption, activity log", href: "/settings?tab=security", color: "text-stone-600 bg-stone-100" },
                                ].map((item, i) => (
                                    <div key={i}>
                                        {i > 0 && <div className="h-px bg-stone-50 mx-4" />}
                                        <Link href={item.href} className="flex items-center justify-between p-4 hover:bg-stone-50/80 transition-colors group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`p-2.5 rounded-xl flex-shrink-0 ${item.color}`}>
                                                    <item.icon size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-stone-900 truncate">{item.label}</p>
                                                    <p className="text-xs text-stone-400 truncate">{item.sub}</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className="text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                                        </Link>
                                    </div>
                                ))}

                                {nuravyaUser?.is_admin && (
                                    <>
                                        <div className="h-px bg-stone-50 mx-4" />
                                        <Link href="/admin" className="flex items-center justify-between p-4 hover:bg-amber-50/80 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 flex-shrink-0">
                                                    <Shield size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-amber-700">Admin Panel</p>
                                                    <p className="text-xs text-stone-400">Manage users, stats, limits</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className="text-stone-300 group-hover:text-amber-500 transition-colors flex-shrink-0" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Billing & Explore */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-4 mb-3">Billing & Explore</p>
                                <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
                                    <Link href="/pricing" className="flex items-center justify-between p-4 hover:bg-stone-50/80 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                                                <CreditCard size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-stone-900">
                                                    {isPaid ? "Manage Subscription" : "Upgrade Plan"}
                                                </p>
                                                <p className="text-xs text-stone-400">
                                                    {isPaid ? `Currently on ${plan.label} plan` : "Unlock voice, memory, and more"}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-stone-300 group-hover:text-amber-500 transition-colors flex-shrink-0" />
                                    </Link>

                                    <div className="h-px bg-stone-50 mx-4" />

                                    <Link href="/insights" className="flex items-center justify-between p-4 hover:bg-stone-50/80 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                                                <TrendingUp size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-stone-900">Emotional Insights</p>
                                                <p className="text-xs text-stone-400">Your mood trends & patterns</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-stone-300 group-hover:text-amber-500 transition-colors flex-shrink-0" />
                                    </Link>

                                    <div className="h-px bg-stone-50 mx-4" />

                                    <Link href="/memory" className="flex items-center justify-between p-4 hover:bg-stone-50/80 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                                                <Brain size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-stone-900">Conversation History</p>
                                                <p className="text-xs text-stone-400">Browse past sessions</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-stone-300 group-hover:text-amber-500 transition-colors flex-shrink-0" />
                                    </Link>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-4 mb-3">Danger Zone</p>
                                <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
                                    {isPaid && (
                                        <>
                                            <button
                                                onClick={handleCancelSubscription}
                                                disabled={cancelling}
                                                className="w-full flex items-center justify-between p-4 hover:bg-orange-50/70 transition-colors group text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 rounded-xl bg-orange-50 text-orange-500">
                                                        <CreditCard size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-orange-600">
                                                            {cancelling ? "Cancelling…" : "Cancel Subscription"}
                                                        </p>
                                                        <p className="text-xs text-orange-400">Access remains until period ends</p>
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-stone-300 flex-shrink-0" />
                                            </button>
                                            <div className="h-px bg-stone-50 mx-4" />
                                        </>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center p-4 gap-3 hover:bg-red-50/70 transition-colors group text-left"
                                    >
                                        <div className="p-2.5 rounded-xl bg-red-50 text-red-500">
                                            <LogOut size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-red-500">Sign Out</p>
                                            <p className="text-xs text-red-400/70">Sign out of your account</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Features banner ─────────────────────────────────────── */}
                    <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">What's included in your plan</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { icon: MessageSquare, label: "Unlimited text chat", available: true },
                                { icon: Mic, label: `${isPaid ? "Voice calling" : "Voice calls (Upgrade)"}`, available: isPaid },
                                { icon: Brain, label: "Long-term memory", available: isPaid },
                                { icon: Sparkles, label: "Custom personas", available: true },
                            ].map((feat, i) => (
                                <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl border ${feat.available ? "border-emerald-100 bg-emerald-50/60" : "border-stone-100 bg-stone-50 opacity-60"}`}>
                                    <div className={`p-2 rounded-xl ${feat.available ? "bg-emerald-100 text-emerald-600" : "bg-stone-100 text-stone-400"}`}>
                                        <feat.icon size={16} />
                                    </div>
                                    <span className="text-xs font-semibold text-stone-700">{feat.label}</span>
                                    {feat.available && <Check size={14} className="ml-auto text-emerald-500 flex-shrink-0" />}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </main>
    );
}
