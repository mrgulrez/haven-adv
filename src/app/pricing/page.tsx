"use client";

import { Footer } from "@/components/layout/footer";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiPost } from "@/lib/api";

// Load Razorpay Checkout.js
declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PricingPage() {
    const { user, nuravyaUser, loginWithGoogle, refreshProfile } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    // Load Razorpay script
    useEffect(() => {
        if (typeof window !== "undefined" && !window.Razorpay) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => setRazorpayLoaded(true);
            document.body.appendChild(script);
        } else {
            setRazorpayLoaded(true);
        }
    }, []);

    const handleSubscribe = async (plan: "core" | "pro") => {
        // Require login first
        if (!user) {
            try {
                await loginWithGoogle();
            } catch {
                return;
            }
        }

        setLoading(plan);

        try {
            // Create subscription via backend
            const data = await apiPost<{
                subscription_id: string;
                razorpay_key_id: string;
                plan: string;
                amount: number;
                currency: string;
                name: string;
            }>("/api/payments/create-subscription", { plan });

            // Open Razorpay Checkout
            const options = {
                key: data.razorpay_key_id,
                subscription_id: data.subscription_id,
                name: "Nuravya AI",
                description: data.name,
                image: "/icon.png",
                handler: async function (response: any) {
                    // Verify payment on backend
                    try {
                        const result = await apiPost<{ status: string; plan: string; message: string }>(
                            "/api/payments/verify",
                            {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_subscription_id: response.razorpay_subscription_id,
                                razorpay_signature: response.razorpay_signature,
                            }
                        );

                        if (result.status === "success") {
                            await refreshProfile();
                            router.push("/profile");
                        }
                    } catch (err) {
                        console.error("Payment verification failed:", err);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    email: user?.email || "",
                    name: user?.displayName || "",
                },
                theme: {
                    color: "#f59e0b",
                },
                modal: {
                    ondismiss: () => setLoading(null),
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Subscription creation failed:", err);
            alert("Failed to start checkout. Please try again.");
        } finally {
            setLoading(null);
        }
    };

    const handleFreeStart = async () => {
        if (!user) {
            try {
                await loginWithGoogle();
                router.push("/chat");
            } catch {
                return;
            }
        } else {
            router.push("/chat");
        }
    };

    const currentPlan = nuravyaUser?.plan || "free";

    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <div className="flex-grow pt-safe pb-24 px-4 md:px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-amber-100 border border-amber-200 shadow-sm mb-6 max-w-full overflow-hidden">
                            <span className="text-[10px] md:text-sm font-semibold text-amber-800 uppercase tracking-widest md:tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">Nuravya is built on one belief</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold font-heading text-stone-900 mb-6">Everyone deserves to feel heard.</h1>
                        <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                            Whether you are exploring or seeking a deeply personalized companion experience, there is a plan designed for you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Free Tier */}
                        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col hover:shadow-md transition-shadow relative">
                            <div className="mb-10 pr-16 md:pr-20">
                                <h2 className="text-2xl font-bold text-stone-900 mb-2">Free</h2>
                                <p className="text-stone-500 text-sm min-h-[3rem]">Start your journey with zero barriers. Perfect for experiencing Nuravya&apos;s emotional intelligence at your own pace.</p>
                            </div>
                            <div className="absolute top-8 right-8 text-right">
                                <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900">$0</span>
                                <div className="text-stone-500 text-[10px] md:text-xs">/month</div>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow text-sm">
                                <li className="flex items-start gap-3 text-stone-700"><Check className="h-5 w-5 text-emerald-500 shrink-0" /><span>Unlimited text conversations</span></li>
                                <li className="flex items-start gap-3 text-stone-700"><Check className="h-5 w-5 text-emerald-500 shrink-0" /><span>30-day rolling memory</span></li>
                                <li className="flex items-start gap-3 text-stone-700"><Check className="h-5 w-5 text-emerald-500 shrink-0" /><span>Foundational emotional understanding</span></li>
                                <li className="flex items-start gap-3 text-stone-700"><Check className="h-5 w-5 text-emerald-500 shrink-0" /><span>Late-night supportive chat mode</span></li>
                                <li className="flex items-start gap-3 text-stone-700"><Check className="h-5 w-5 text-emerald-500 shrink-0" /><span>Standard encrypted conversations</span></li>
                                <li className="flex items-start gap-3 text-stone-700"><Check className="h-5 w-5 text-emerald-500 shrink-0" /><span>Access via web and mobile</span></li>
                                <li className="flex items-start gap-3 text-stone-400"><X className="h-5 w-5 text-stone-300 shrink-0" /><span>No voice conversations</span></li>
                                <li className="flex items-start gap-3 text-stone-400"><X className="h-5 w-5 text-stone-300 shrink-0" /><span>No proactive outreach</span></li>
                            </ul>
                            <div className="text-xs text-stone-500 text-center mb-4">Built for accessibility. Always free.</div>
                            <Button
                                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-900 h-12"
                                size="lg"
                                onClick={handleFreeStart}
                                disabled={currentPlan !== "free"}
                            >
                                {currentPlan === "free" && user ? "Current Plan" : "Get Started"}
                            </Button>
                        </div>

                        {/* Core Tier */}
                        <div className="bg-gradient-to-b from-amber-50 to-orange-50 p-8 rounded-3xl border-2 border-amber-300 shadow-xl relative flex flex-col transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm whitespace-nowrap z-20">
                                Most Popular
                            </div>
                            <div className="mb-10 pr-16 md:pr-20">
                                <h2 className="text-2xl font-bold text-stone-900 mb-2">Nuravya Core</h2>
                                <p className="text-stone-700 font-medium text-sm min-h-[3rem]">Deeper connection. Real continuity. For users who want Nuravya to truly grow with them.</p>
                            </div>
                            <div className="absolute top-8 right-8 text-right z-10">
                                <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900">$24</span>
                                <div className="text-stone-600 text-[10px] md:text-xs">/month</div>
                            </div>
                            <div className="text-sm font-semibold text-stone-900 mb-4 pb-4 border-b border-amber-200/50">Everything in Free, plus:</div>
                            <ul className="space-y-4 mb-8 flex-grow text-sm">
                                <li className="flex items-start gap-3 text-stone-800"><Check className="h-5 w-5 text-amber-500 shrink-0" /><span className="font-semibold">300 voice minutes per month</span></li>
                                <li className="flex items-start gap-3 text-stone-800"><Check className="h-5 w-5 text-amber-500 shrink-0" /><span className="font-semibold">Infinite long-term memory retention</span></li>
                                <li className="flex items-start gap-3 text-stone-800"><Check className="h-5 w-5 text-amber-500 shrink-0" /><span>Emotional pattern recognition</span></li>
                                <li className="flex items-start gap-3 text-stone-800"><Check className="h-5 w-5 text-amber-500 shrink-0" /><span>Proactive check-ins and thoughtful reminders</span></li>
                                <li className="flex items-start gap-3 text-stone-800"><Check className="h-5 w-5 text-amber-500 shrink-0" /><span>One customizable voice personality</span></li>
                                <li className="flex items-start gap-3 text-stone-800"><Check className="h-5 w-5 text-amber-500 shrink-0" /><span>Faster response priority</span></li>
                                <li className="flex items-start gap-3 text-stone-800"><Check className="h-5 w-5 text-amber-500 shrink-0" /><span>Weekly emotional insight summaries</span></li>
                                <li className="flex items-start gap-3 text-stone-800"><Check className="h-5 w-5 text-amber-500 shrink-0" /><span>Enhanced encrypted memory storage</span></li>
                                <li className="flex items-start gap-3 text-stone-800"><Check className="h-5 w-5 text-amber-500 shrink-0" /><span>Full memory dashboard (view, edit, delete)</span></li>
                            </ul>
                            <div className="text-xs text-amber-700/80 text-center font-medium mb-4">Designed for meaningful, evolving companionship.</div>
                            <Button
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 shadow-md"
                                size="lg"
                                onClick={() => handleSubscribe("core")}
                                disabled={loading === "core" || currentPlan === "core" || currentPlan === "pro"}
                            >
                                {loading === "core" ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                                ) : currentPlan === "core" ? "Current Plan" : currentPlan === "pro" ? "Included in Pro" : "Subscribe Now"}
                            </Button>
                        </div>

                        {/* Pro Tier */}
                        <div className="bg-stone-900 p-8 rounded-3xl border border-stone-800 shadow-xl flex flex-col relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-stone-800/50 to-transparent pointer-events-none"></div>
                            <div className="mb-10 relative z-10 pr-16 md:pr-20">
                                <h2 className="text-2xl font-bold text-white mb-2">Nuravya Pro</h2>
                                <p className="text-stone-300 text-sm min-h-[3rem]">The ultimate emotionally intelligent AI companion for a deeply personalized relationship.</p>
                            </div>
                            <div className="absolute top-8 right-8 text-right z-20">
                                <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">$59</span>
                                <div className="text-stone-400 text-[10px] md:text-xs">/month</div>
                            </div>
                            <div className="text-sm font-semibold text-white mb-4 pb-4 border-b border-stone-800 relative z-10">Everything in Core, plus:</div>
                            <ul className="space-y-4 mb-8 flex-grow text-sm relative z-10">
                                <li className="flex items-start gap-3 text-stone-200"><Check className="h-5 w-5 text-amber-400 shrink-0" /><span className="font-semibold text-white">700 voice minutes per month</span></li>
                                <li className="flex items-start gap-3 text-stone-200"><Check className="h-5 w-5 text-amber-400 shrink-0" /><span>Multiple companion personalities</span></li>
                                <li className="flex items-start gap-3 text-stone-200"><Check className="h-5 w-5 text-amber-400 shrink-0" /><span>Custom voice cloning</span></li>
                                <li className="flex items-start gap-3 text-stone-200"><Check className="h-5 w-5 text-amber-400 shrink-0" /><span className="text-amber-200 font-medium">Full video companion mode</span></li>
                                <li className="flex items-start gap-3 text-stone-200"><Check className="h-5 w-5 text-amber-400 shrink-0" /><span>Advanced long-term contextual intelligence</span></li>
                                <li className="flex items-start gap-3 text-stone-200"><Check className="h-5 w-5 text-amber-400 shrink-0" /><span>Mood trend analytics and growth reports</span></li>
                                <li className="flex items-start gap-3 text-stone-200"><Check className="h-5 w-5 text-amber-400 shrink-0" /><span>Shared milestone tracking</span></li>
                                <li className="flex items-start gap-3 text-stone-200"><Check className="h-5 w-5 text-amber-400 shrink-0" /><span>Adaptive personality evolution</span></li>
                                <li className="flex items-start gap-3 text-stone-200"><Check className="h-5 w-5 text-amber-400 shrink-0" /><span>Private encrypted memory vault</span></li>
                                <li className="flex items-start gap-3 text-stone-200"><Check className="h-5 w-5 text-amber-400 shrink-0" /><span>Early access to experimental features</span></li>
                                <li className="flex items-start gap-3 text-stone-200"><Check className="h-5 w-5 text-amber-400 shrink-0" /><span>Priority human support</span></li>
                            </ul>
                            <div className="text-xs text-stone-400 text-center mb-4 relative z-10">Built for depth. Built for trust.</div>
                            <Button
                                className="w-full bg-white hover:bg-stone-200 text-stone-900 h-12 shadow-lg z-10"
                                size="lg"
                                onClick={() => handleSubscribe("pro")}
                                disabled={loading === "pro" || currentPlan === "pro"}
                            >
                                {loading === "pro" ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                                ) : currentPlan === "pro" ? "Current Plan" : "Subscribe Now"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
