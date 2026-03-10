"use client"

import { Section } from "@/components/ui/section"
import { Check, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { PLANS } from "@/lib/site.config"

export function Pricing() {
    return (
        <Section className="bg-[#FFFBEB]" id="pricing">
            <div className="max-w-5xl mx-auto text-center">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-[0.15em] mb-5">
                        <Sparkles size={13} /> Simple, Transparent Pricing
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-stone-900 mb-4 tracking-tight">
                        Choose your plan
                    </h2>
                    <p className="text-stone-500 max-w-lg mx-auto text-lg font-light">
                        Start free. Upgrade when you're ready. No hidden fees, no lock-in.
                    </p>
                </motion.div>

                {/* Plan cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {PLANS.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative rounded-3xl p-7 text-left flex flex-col ${plan.highlight
                                    ? "bg-stone-950 text-white border-2 border-amber-500 shadow-2xl shadow-amber-100"
                                    : "bg-white border border-stone-100 shadow-sm"
                                }`}
                        >
                            {plan.badge && (
                                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${plan.highlight ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-600"
                                    }`}>
                                    {plan.badge}
                                </div>
                            )}

                            <div className="mb-5">
                                <h3 className={`font-bold text-xl mb-1 ${plan.highlight ? "text-white" : "text-stone-900"}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-xs mb-4 ${plan.highlight ? "text-stone-400" : "text-stone-500"}`}>
                                    {plan.description}
                                </p>
                                <div className={`text-4xl font-black font-heading ${plan.highlight ? "text-amber-400" : "text-stone-900"}`}>
                                    {plan.priceLabel}
                                    <span className={`text-sm font-normal ml-1 ${plan.highlight ? "text-stone-400" : "text-stone-500"}`}>
                                        {plan.period}
                                    </span>
                                </div>
                            </div>

                            <ul className="space-y-2.5 flex-1 mb-8">
                                {plan.features.map((f, j) => (
                                    <li key={j} className={`flex items-start gap-2.5 text-sm ${plan.highlight ? "text-stone-300" : "text-stone-600"}`}>
                                        <Check size={15} className={`flex-shrink-0 mt-0.5 ${plan.highlight ? "text-amber-400" : "text-emerald-500"}`} />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link href={plan.cta.href}>
                                <button className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] ${plan.highlight
                                        ? "bg-amber-500 hover:bg-amber-400 text-stone-950"
                                        : "bg-stone-100 hover:bg-stone-200 text-stone-800"
                                    }`}>
                                    {plan.cta.label} <ArrowRight size={14} />
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Full comparison link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Link href="/pricing" className="text-sm text-stone-500 hover:text-amber-600 underline underline-offset-4 transition-colors">
                        View full feature comparison →
                    </Link>
                </motion.div>
            </div>
        </Section>
    )
}
