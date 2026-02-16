"use client"

import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function Pricing() {
    return (
        <Section className="bg-amber-50/50">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-amber-100 overflow-hidden"
                >
                    {/* Spotlight effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-1/2 bg-amber-500/10 blur-[100px] rounded-full pointing-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-6">
                            <Sparkles size={16} />
                            Early Bird Special
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold font-heading text-stone-900 mb-6">
                            Reserve Your Spot Today
                        </h2>

                        <div className="flex items-center justify-center gap-4 mb-8">
                            <span className="text-2xl text-stone-400 line-through decoration-amber-500 decoration-2">
                                $29/mo
                            </span>
                            <span className="text-5xl md:text-6xl font-bold text-amber-600">
                                $19<span className="text-xl text-stone-500 font-normal">/mo</span>
                            </span>
                        </div>

                        <p className="text-stone-600 mb-10 max-w-lg mx-auto">
                            Secure the lowest price forever by joining the waitlist.
                            Only available for the first 500 members.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto mb-10">
                            {["Unlimited Voice Conversations", "Advanced Memory Recall", "Priority Support", "Multi-platform Access"].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-sm font-medium text-stone-700">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="#waitlist" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg shadow-xl shadow-amber-200">
                                Reserve My Spot
                            </Button>
                        </Link>

                        <p className="mt-4 text-xs text-stone-400">
                            No credit card required to join waitlist.
                        </p>
                    </div>
                </motion.div>
            </div>
        </Section>
    )
}
