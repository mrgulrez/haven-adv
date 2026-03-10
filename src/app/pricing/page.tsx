"use client";

import { Footer } from "@/components/layout/footer";
import { Check, X, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiPost } from "@/lib/api";
import { PLANS, BRAND } from "@/lib/site.config";
import { motion } from "framer-motion";

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

    const handleSubscribe = async (plan: string) => {
        if (plan === "free") {
            router.push("/chat");
            return;
        }

        // Require login first
        if (!user) {
            try {
                await loginWithGoogle();
                // After login, we don't automatically trigger payment to avoid popup blockers
                // but we let them click again or redirect to chat with plan param
            } catch {
                return;
            }
            return;
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

            if (!window.Razorpay) {
                alert("Payment gateway not loaded. Please refresh.");
                return;
            }

            // Open Razorpay Checkout
            const options = {
                key: data.razorpay_key_id,
                subscription_id: data.subscription_id,
                name: BRAND.name,
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
        } finally {
            setLoading(null);
        }
    };

    const currentPlan = nuravyaUser?.plan || "free";

    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <div className="flex-grow pt-24 pb-24 px-4 md:px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 shadow-sm mb-6"
                        >
                            <Sparkles size={14} className="text-amber-600" />
                            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">{BRAND.tagline}</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold font-heading text-stone-900 mb-6 tracking-tight"
                        >
                            Everyone deserves to<br />feel heard.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed"
                        >
                            Whether you are exploring or seeking a deeply personalized companion experience, there is a plan designed for you.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {PLANS.map((plan, i) => {
                            const isCurrent = currentPlan === plan.id;
                            const isPro = plan.id === "pro";
                            const isCore = plan.id === "core";
                            const isFree = plan.id === "free";

                            const isHigher = (currentPlan === "free" && (isCore || isPro)) || (currentPlan === "core" && isPro);
                            const isLower = (currentPlan === "pro" && (isCore || isFree)) || (currentPlan === "core" && isFree);

                            return (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                    className={`relative rounded-[2.5rem] p-8 flex flex-col transition-all duration-500 border-2 ${plan.highlight
                                            ? "bg-white border-amber-400 shadow-[0_32px_64px_-16px_rgba(245,158,11,0.15)] ring-4 ring-amber-50"
                                            : isPro
                                                ? "bg-stone-950 text-white border-stone-800 shadow-xl"
                                                : "bg-white border-stone-100 shadow-sm hover:shadow-md hover:border-stone-200"
                                        }`}
                                >
                                    {plan.badge && (
                                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm z-20 ${plan.highlight ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-600"
                                            }`}>
                                            {plan.badge}
                                        </div>
                                    )}

                                    <div className="mb-8">
                                        <h2 className={`text-2xl font-bold mb-2 ${isPro ? "text-white" : "text-stone-900"}`}>{plan.name}</h2>
                                        <p className={`text-sm leading-relaxed min-h-[3rem] ${isPro ? "text-stone-400" : "text-stone-500"}`}>
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-5xl font-black font-heading tracking-tighter ${isPro ? "text-white" : plan.highlight ? "text-amber-500" : "text-stone-900"}`}>
                                                {plan.priceLabel}
                                            </span>
                                            <span className={`text-sm font-medium ${isPro ? "text-stone-500" : "text-stone-400"}`}>{plan.period}</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-4 mb-10 flex-grow">
                                        {plan.features.map((feature, fIndex) => (
                                            <li key={fIndex} className={`flex items-start gap-3 text-sm ${isPro ? "text-stone-300" : "text-stone-700"}`}>
                                                <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${isPro ? "bg-amber-500/20 text-amber-400" : "bg-emerald-100 text-emerald-600"}`}>
                                                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                                </div>
                                                <span className={feature.toLowerCase().includes("unlimited") || feature.toLowerCase().includes("infinite") ? "font-bold" : ""}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className={`w-full h-14 rounded-2xl font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${isCurrent
                                                ? "bg-stone-100 text-stone-400 cursor-default"
                                                : isPro
                                                    ? "bg-white text-stone-900 hover:bg-stone-100"
                                                    : plan.highlight
                                                        ? "bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-lg shadow-amber-200"
                                                        : "bg-stone-100 text-stone-800 hover:bg-stone-200"
                                            }`}
                                        disabled={loading === plan.id || (isCurrent && !!user)}
                                        onClick={() => handleSubscribe(plan.id)}
                                    >
                                        {loading === plan.id ? (
                                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Connecting...</>
                                        ) : isCurrent && user ? (
                                            "Current Plan"
                                        ) : (
                                            <>
                                                {isFree ? "Start Free" : "Subscribe Now"}
                                                <ArrowRight size={18} className="ml-2" />
                                            </>
                                        )}
                                    </Button>

                                    {isCurrent && user && (
                                        <div className={`text-center mt-4 text-[10px] font-bold uppercase tracking-widest ${isPro ? "text-stone-500" : "text-stone-400"}`}>
                                            Active since {nuravyaUser?.plan_started_at ? new Date(nuravyaUser.plan_started_at).toLocaleDateString() : "launch"}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="max-w-3xl mx-auto bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-14 border border-stone-100 text-center">
                        <h2 className="text-3xl font-bold font-heading text-stone-900 mb-4">Enterprise & Volume</h2>
                        <p className="text-stone-500 mb-8 font-light">Looking for Nuravya for your team, organization, or specialized use case? We offer custom API access and volume licensing.</p>
                        <Button variant="outline" className="h-14 px-10 rounded-2xl border-stone-200 hover:bg-stone-50 font-bold" onClick={() => router.push("/contact")}>
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
