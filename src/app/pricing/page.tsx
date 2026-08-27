"use client";

import { Footer } from "@/components/layout/footer";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiPost } from "@/lib/api";
import { PLANS, BRAND } from "@/lib/site.config";
import { motion } from "framer-motion";
import { PageHero } from "@/components/ui/page-hero";
import { StatusModal } from "@/components/ui/success-modal";

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", handler: () => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let razorpayLoader: Promise<void> | null = null;

function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (razorpayLoader) return razorpayLoader;

  razorpayLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    const script = existing ?? document.createElement("script");

    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => {
      script.remove();
      razorpayLoader = null;
      reject(new Error("Payment gateway could not be loaded"));
    }, { once: true });

    if (!existing) {
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return razorpayLoader;
}

function paymentErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("503")) {
    return "This plan is temporarily unavailable. Please try again shortly.";
  }
  if (message.includes("401")) {
    return "Your sign-in session expired. Please sign in again and retry.";
  }
  if (message.includes("gateway could not be loaded")) {
    return "The secure payment window could not load. Check your connection and try again.";
  }
  return "We couldn't start the secure checkout. No payment was taken—please try again.";
}

export default function PricingPage() {
  const { user, nuravyaUser, loginWithGoogle, refreshProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    title: string;
    message: string;
    variant: "success" | "error";
  } | null>(null);

  // Load Razorpay script
  useEffect(() => {
    void loadRazorpay().catch(() => undefined);
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
        setNotice({
          title: "You're signed in",
          message: "Select Subscribe Now once more to open the secure checkout.",
          variant: "success",
        });
      } catch (error) {
        console.error("Sign-in before checkout failed:", error);
        setNotice({
          title: "Sign-in didn't complete",
          message: "Please finish signing in, then select your plan again.",
          variant: "error",
        });
        return;
      }
      return;
    }

    setLoading(plan);

    try {
      await loadRazorpay();

      // Create subscription via backend
      const data = await apiPost<{
        subscription_id: string;
        razorpay_key_id: string;
        plan: string;
        amount: number;
        currency: string;
        name: string;
      }>("/api/payments/create-subscription", { plan });

      if (!window.Razorpay) throw new Error("Payment gateway could not be loaded");

      // Open Razorpay Checkout
      const options = {
        key: data.razorpay_key_id,
        subscription_id: data.subscription_id,
        name: BRAND.name,
        description: data.name,
        image: "/icon.png",
        handler: async function (response: RazorpayResponse) {
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
            setNotice({
              title: "Payment needs verification",
              message: "Your payment response could not be verified yet. Please contact support before retrying.",
              variant: "error",
            });
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
      rzp.on("payment.failed", () => {
        setLoading(null);
        setNotice({
          title: "Payment wasn't completed",
          message: "No subscription was activated. You can safely retry when you're ready.",
          variant: "error",
        });
      });
      rzp.open();
    } catch (err) {
      console.error("Subscription creation failed:", err);
      setNotice({
        title: "Checkout unavailable",
        message: paymentErrorMessage(err),
        variant: "error",
      });
    } finally {
      setLoading(null);
    }
  };

  const currentPlan = nuravyaUser?.plan || "free";

  return (
    <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <PageHero
        eyebrow="Simple pricing"
        title={<>Start with trust. <span className="text-[#F2811D]">Grow with depth.</span></>}
        description="Use text chat for free. Upgrade when richer memory, real-time voice, and more companion styles become valuable to you."
      />
      <div className="flex-grow py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {PLANS.map((plan, i) => {
              const isCurrent = currentPlan === plan.id;
              const isPro = plan.id === "pro";
              const isFree = plan.id === "free";

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
                    className={`w-full h-14 font-bold text-base ${isCurrent
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
            <Button variant="outline" className="h-14 px-10 border-stone-200 font-bold" onClick={() => router.push("/contact")}>
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
      <Footer />
      <StatusModal
        isOpen={notice !== null}
        onClose={() => setNotice(null)}
        title={notice?.title ?? ""}
        message={notice?.message ?? ""}
        variant={notice?.variant}
      />
    </main>
  );
}
