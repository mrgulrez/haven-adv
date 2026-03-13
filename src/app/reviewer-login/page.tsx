"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/site.config";
import { Shield, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function ReviewerLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // These credentials must match what is in the backend config.py
    const REVIEWER_EMAIL = "reviewer@nuravya.com";
    const REVIEWER_PASSWORD = "NuravyaReview2026!";
    const BYPASS_TOKEN = "nuravya_static_bypass_token_8k2m9n4p";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulate a small delay for realism
        await new Promise(r => setTimeout(r, 800));

        if (email.toLowerCase() === REVIEWER_EMAIL && password === REVIEWER_PASSWORD) {
            // Store the static bypass token
            localStorage.setItem("BYPASS_TOKEN", BYPASS_TOKEN);
            
            // Redirect to chat/dashboard
            router.push("/chat");
            router.refresh();
        } else {
            setError("Invalid credentials. Please refer to the documentation provided in the Play Console.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FFFBEB] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-[2rem] border border-stone-200 shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-stone-50 px-8 py-10 text-center border-b border-stone-100">
                        <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-200">
                            <Shield className="text-white" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-stone-900 mb-2">Reviewer Access</h1>
                        <p className="text-stone-500 text-sm">Authorized Google Play Reviewers Only</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="p-8 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 bg-stone-50 border border-stone-200 rounded-xl px-4 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-stone-900"
                                    placeholder="reviewer@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-14 bg-stone-50 border border-stone-200 rounded-xl px-4 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-stone-900"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Verify Access
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="px-8 py-6 bg-stone-50 border-t border-stone-100 text-center">
                        <p className="text-[11px] text-stone-400 leading-relaxed uppercase tracking-tighter">
                            Secure Access Point for {BRAND.name} Version 1.0.0<br />
                            System ID: NRV-REVIEW-PROD
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
