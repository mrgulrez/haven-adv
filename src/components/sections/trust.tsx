"use client"

import { Section } from "@/components/ui/section"
import { ShieldCheck, Lock, Database, Cpu } from "lucide-react"
import { motion } from "framer-motion"

const features = [
    {
        icon: Cpu,
        title: "Google Gemini LLM",
        description: "Powered by the latest enterprise-grade AI for natural, safe conversations.",
    },
    {
        icon: ShieldCheck,
        title: "HIPAA-Ready Security",
        description: "Your health data is encrypted and protected with the highest standards.",
    },
    {
        icon: Lock,
        title: "Privacy First",
        description: "You own your data. We never sell or share your personal conversations.",
    },
    {
        icon: Database,
        title: "Secure Cloud",
        description: "Enterprise infrastructure ensuring 99.9% uptime and data reliability.",
    },
]

export function Trust() {
    return (
        <Section className="bg-stone-900 py-24 text-stone-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-16 items-center">

                    <div className="flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6">
                                Built for Trust & Safety
                            </h2>
                            <p className="text-lg text-stone-400 leading-relaxed">
                                We understand that privacy is paramount when it comes to personal companionship.
                                Haven is built on a foundation of enterprise-grade security and ethical AI principles.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex gap-4"
                                >
                                    <div className="shrink-0 rounded-lg bg-stone-800 p-3 h-fit text-amber-500">
                                        <feature.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                                        <p className="text-sm text-stone-400">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-3xl rounded-full" />
                        <div className="relative bg-stone-800/50 backdrop-blur-xl border border-stone-700/50 rounded-2xl p-8 overflow-hidden">
                            <div className="font-mono text-xs text-stone-500 mb-4 flex justify-between">
                                <span>system_status: active</span>
                                <span className="text-emerald-500">● online</span>
                            </div>
                            <div className="space-y-4 font-mono text-sm">
                                <div className="text-emerald-400 typewriter">
                                    {">"} initializing secure_protocol...
                                </div>
                                <div className="text-stone-300 typewriter" style={{ animationDelay: "1s" }}>
                                    {">"} encrypting_data_stream... [OK]
                                </div>
                                <div className="text-stone-300 typewriter" style={{ animationDelay: "2s" }}>
                                    {">"} connecting_to_neural_core... [OK]
                                </div>
                                <div className="text-amber-400 typewriter" style={{ animationDelay: "3s" }}>
                                    {">"} haven_ai_ready
                                </div>
                            </div>

                            {/* Decorative lock icon */}
                            <div className="absolute -bottom-10 -right-10 text-stone-700/20 rotate-12">
                                <Lock size={200} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    )
}
