"use client"

import { Section } from "@/components/ui/section"
import { ShieldCheck, Lock, Database, Cpu } from "lucide-react"
import { motion } from "framer-motion"

const features = [
    {
        icon: Cpu,
        title: "Memory-aware conversations",
        description: "Built around conversation context, long-term memory, and safety boundaries instead of one-off replies.",
    },
    {
        icon: ShieldCheck,
        title: "Authenticated access",
        description: "User data is scoped through signed-in accounts and protected API routes.",
    },
    {
        icon: Lock,
        title: "Privacy-first promise",
        description: "We do not sell personal conversations. Users should be able to inspect and delete remembered context.",
    },
    {
        icon: Database,
        title: "Cloud foundation",
        description: "The platform uses managed storage, service checks, and encrypted transport as it matures toward broader launch.",
    },
]

export function Trust() {
    return (
        <Section className="bg-stone-950 py-24 text-stone-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-14 items-center">
                    <div className="flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.18em] mb-4">Trust model</p>
                            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6 tracking-tight">
                                Personal AI needs visible boundaries.
                            </h2>
                            <p className="text-lg text-stone-400 leading-relaxed">
                                Nuravya asks for sensitive context, so the landing page should be plain about privacy, memory, and where the product is still early. No fake certifications, no inflated uptime promises.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45, delay: index * 0.08 }}
                                    viewport={{ once: true }}
                                    className="flex gap-4"
                                >
                                    <div className="shrink-0 rounded-xl bg-white/5 border border-white/10 p-3 h-fit text-amber-400">
                                        <feature.icon size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                                        <p className="text-sm text-stone-400 leading-relaxed">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md relative">
                        <div className="relative bg-stone-900 border border-white/10 rounded-2xl p-8 overflow-hidden shadow-2xl">
                            <div className="font-mono text-xs text-stone-500 mb-5 flex justify-between gap-4">
                                <span>memory_scope: user_account</span>
                                <span className="text-emerald-400">online</span>
                            </div>
                            <div className="space-y-4 font-mono text-sm">
                                <div className="text-emerald-400">{">"} auth boundary verified</div>
                                <div className="text-stone-300">{">"} conversation stored with account scope</div>
                                <div className="text-stone-300">{">"} memory controls available</div>
                                <div className="text-amber-400">{">"} companion ready</div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 text-stone-700/20 rotate-12">
                                <Lock size={190} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    )
}
