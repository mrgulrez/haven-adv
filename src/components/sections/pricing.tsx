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
                            Simple, Transparent Pricing
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold font-heading text-stone-900 mb-6">
                            A Plan for Every Journey
                        </h2>

                        <p className="text-stone-600 mb-10 max-w-lg mx-auto">
                            Whether you're exploring emotional AI for the first time or seeking deep continuity, Haven grows with you.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-left">
                            {/* Tier 1 */}
                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                <h3 className="font-bold text-lg text-stone-900 mb-1">Free</h3>
                                <div className="text-2xl font-bold text-amber-600 mb-4">$0<span className="text-sm text-stone-500 font-normal">/mo</span></div>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex gap-2 text-sm text-stone-600"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Unlimited text</li>
                                    <li className="flex gap-2 text-sm text-stone-600"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> 30-day memory</li>
                                </ul>
                            </div>

                            {/* Tier 2 */}
                            <div className="bg-white p-6 rounded-2xl border-2 border-amber-400 shadow-md relative">
                                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Most Popular</div>
                                <h3 className="font-bold text-lg text-stone-900 mb-1">Haven Core</h3>
                                <div className="text-2xl font-bold text-amber-600 mb-4">$24<span className="text-sm text-stone-500 font-normal">/mo</span></div>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex gap-2 text-sm text-stone-600"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Voice minutes</li>
                                    <li className="flex gap-2 text-sm text-stone-600"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Infinite memory</li>
                                </ul>
                            </div>

                            {/* Tier 3 */}
                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                <h3 className="font-bold text-lg text-stone-900 mb-1">Haven Pro</h3>
                                <div className="text-2xl font-bold text-amber-600 mb-4">$49<span className="text-sm text-stone-500 font-normal">/mo</span></div>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex gap-2 text-sm text-stone-600"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Unlimited voice</li>
                                    <li className="flex gap-2 text-sm text-stone-600"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Therapist portal directly</li>
                                </ul>
                            </div>
                        </div>

                        <Link href="/pricing" className="inline-block">
                            <Button size="lg" className="h-14 px-10 text-lg shadow-xl shadow-amber-200">
                                Compare All Features
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </Section>
    )
}
