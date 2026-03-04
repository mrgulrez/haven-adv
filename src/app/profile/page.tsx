"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, LogOut, ChevronRight, Settings, Bell, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function ProfilePage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

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
                                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200 uppercase tracking-wider">
                                        Nuravya Free
                                    </span>
                                    <span className="text-xs text-stone-400">Joined March 2026</span>
                                </div>
                            </div>
                        </div>
                    </div>

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

                        {/* Subscription Group */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest px-4">Billing & Support</h2>
                            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
                                <button className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-stone-100 rounded-xl text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                            <CreditCard size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-stone-900">Subscription Plan</p>
                                            <p className="text-xs text-stone-500">Manage your current plan</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-stone-400 group-hover:text-amber-500 transition-colors" />
                                </button>
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
