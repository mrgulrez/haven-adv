"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, LogOut, ChevronRight, Settings, Bell, CreditCard, Mic, BarChart3 } from "lucide-react";
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

export default function ProfilePage() {
    const { user, nuravyaUser, loading, logout } = useAuth();
    const router = useRouter();
    const [usage, setUsage] = useState<UsageData | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    // Fetch usage data
    useEffect(() => {
        if (user && nuravyaUser) {
            apiGet<UsageData>("/api/usage/current")
                .then(setUsage)
                .catch(console.warn);
        }
    }, [user, nuravyaUser]);

    const handleCancelSubscription = async () => {
        if (!confirm("Are you sure you want to cancel your subscription? You'll retain access until the end of your billing period.")) return;
        setCancelling(true);
        try {
            await apiPost("/api/payments/cancel", {});
            window.location.reload();
        } catch (err) {
            console.error("Cancel failed:", err);
            alert("Failed to cancel subscription. Please try again.");
        } finally {
            setCancelling(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const currentPlan = nuravyaUser?.plan || "free";
    const isPaid = currentPlan === "core" || currentPlan === "pro";

    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <div className="flex-grow pt-24 pb-24 px-4 md:px-6">
                <div className="container mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-amber-100 shadow-sm bg-stone-50">
                                    {user.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || "User"}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                                            <User size={40} />
                                        </div>
                                    )}
                                </div>
                                <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl border border-stone-200 shadow-sm text-stone-500 hover:text-amber-600 transition-colors">
                                    <Settings size={16} />
                                </button>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl font-bold font-heading text-stone-900 mb-1">{user.displayName}</h1>
                                <p className="text-stone-500 flex items-center justify-center md:justify-start gap-2 text-sm mb-4">
                                    <Mail size={14} />
                                    {user.email}
                                </p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${currentPlan === "pro" ? "bg-stone-900 text-white border-stone-700" :
                                            currentPlan === "core" ? "bg-amber-100 text-amber-800 border-amber-200" :
                                                "bg-stone-100 text-stone-600 border-stone-200"
                                        }`}>
                                        Nuravya {currentPlan === "pro" ? "Pro" : currentPlan === "core" ? "Core" : "Free"}
                                    </span>
                                    <span className="text-xs text-stone-400">
                                        {nuravyaUser?.created_at ? `Joined ${new Date(nuravyaUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ""}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Usage Stats (for paid plans) */}
                    {isPaid && usage && (
                        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm mb-8">
                            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">This Month&apos;s Usage</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Voice Minutes */}
                                <div className="bg-stone-50 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Mic size={16} className="text-amber-500" />
                                        <span className="text-xs font-semibold text-stone-600">Voice Minutes</span>
                                    </div>
                                    <div className="text-2xl font-bold text-stone-900 mb-1">
                                        {Math.round(usage.voice_minutes_used)}
                                        <span className="text-sm font-normal text-stone-400">/{usage.voice_minutes_limit}</span>
                                    </div>
                                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${usage.voice_quota_pct > 90 ? "bg-red-500" :
                                                    usage.voice_quota_pct > 70 ? "bg-amber-500" : "bg-emerald-500"
                                                }`}
                                            style={{ width: `${Math.min(usage.voice_quota_pct, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Text Messages */}
                                <div className="bg-stone-50 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BarChart3 size={16} className="text-blue-500" />
                                        <span className="text-xs font-semibold text-stone-600">Messages</span>
                                    </div>
                                    <div className="text-2xl font-bold text-stone-900">
                                        {usage.text_messages_sent}
                                    </div>
                                    <div className="text-xs text-stone-400 mt-1">Unlimited</div>
                                </div>

                                {/* Plan */}
                                <div className="bg-stone-50 rounded-2xl p-4 col-span-2 md:col-span-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard size={16} className="text-purple-500" />
                                        <span className="text-xs font-semibold text-stone-600">Plan</span>
                                    </div>
                                    <div className="text-2xl font-bold text-stone-900 capitalize">
                                        {currentPlan}
                                    </div>
                                    <div className="text-xs text-stone-400 mt-1">
                                        ${currentPlan === "pro" ? "59" : "24"}/month
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Settings Group */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest px-4">Account Settings</h2>
                            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
                                <button className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-stone-100 rounded-xl text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                            <User size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-stone-900">Personal Information</p>
                                            <p className="text-xs text-stone-500">Name, birthday, gender</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-stone-400 group-hover:text-amber-500 transition-colors" />
                                </button>
                                <div className="h-px bg-stone-100 mx-4"></div>
                                <button className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-stone-100 rounded-xl text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                            <Shield size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-stone-900">Security & Privacy</p>
                                            <p className="text-xs text-stone-500">Passwords, encryption, activity</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-stone-400 group-hover:text-amber-500 transition-colors" />
                                </button>
                                <div className="h-px bg-stone-100 mx-4"></div>
                                <button className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-stone-100 rounded-xl text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                            <Bell size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-stone-900">Notifications</p>
                                            <p className="text-xs text-stone-500">Email, push, reminders</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-stone-400 group-hover:text-amber-500 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Billing & Support Group */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest px-4">Billing & Support</h2>
                            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
                                <Link href="/pricing" className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-stone-100 rounded-xl text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                            <CreditCard size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-stone-900">
                                                {isPaid ? "Manage Subscription" : "Upgrade Plan"}
                                            </p>
                                            <p className="text-xs text-stone-500">
                                                {isPaid ? `Currently on ${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} plan` : "Unlock voice, memory, and more"}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-stone-400 group-hover:text-amber-500 transition-colors" />
                                </Link>

                                {isPaid && (
                                    <>
                                        <div className="h-px bg-stone-100 mx-4"></div>
                                        <button
                                            onClick={handleCancelSubscription}
                                            disabled={cancelling}
                                            className="w-full flex items-center justify-between p-4 hover:bg-orange-50 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-100/50 rounded-xl text-orange-600 transition-colors">
                                                    <CreditCard size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-semibold text-orange-600">
                                                        {cancelling ? "Cancelling..." : "Cancel Subscription"}
                                                    </p>
                                                    <p className="text-xs text-orange-500/70">You&apos;ll keep access until period ends</p>
                                                </div>
                                            </div>
                                        </button>
                                    </>
                                )}

                                <div className="h-px bg-stone-100 mx-4"></div>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100/50 rounded-xl text-red-600 transition-colors">
                                            <LogOut size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-red-600">Logout</p>
                                            <p className="text-xs text-red-500/70">Sign out of your account</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
