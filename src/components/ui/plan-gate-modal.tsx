"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PlanGateModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature: string;
    requiredPlan?: "core" | "pro";
}

export function PlanGateModal({ isOpen, onClose, feature, requiredPlan = "core" }: PlanGateModalProps) {
    const router = useRouter();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-stone-200 relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative gradient */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-100 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 transition-colors rounded-full hover:bg-stone-100"
                        >
                            <X size={18} />
                        </button>

                        {/* Icon */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-200">
                            {requiredPlan === "pro" ? (
                                <Crown size={28} className="text-white" />
                            ) : (
                                <Zap size={28} className="text-white" />
                            )}
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold font-heading text-stone-900 mb-2">
                            Upgrade to Nuravya {requiredPlan === "pro" ? "Pro" : "Core"}
                        </h3>
                        <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                            <span className="font-semibold text-stone-800">{feature}</span> requires the {requiredPlan === "pro" ? "Pro" : "Core"} plan.
                            Unlock deeper connection, voice calls, and personalized care.
                        </p>

                        {/* Price */}
                        <div className="bg-stone-50 rounded-2xl p-4 mb-6 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-stone-900">
                                ${requiredPlan === "pro" ? "59" : "24"}
                            </span>
                            <span className="text-stone-500 text-sm">/month</span>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={() => {
                                    onClose();
                                    router.push("/pricing");
                                }}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 shadow-md"
                                size="lg"
                            >
                                View Plans
                            </Button>
                            <button
                                onClick={onClose}
                                className="text-stone-500 text-sm font-medium hover:text-stone-700 transition-colors"
                            >
                                Maybe later
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
