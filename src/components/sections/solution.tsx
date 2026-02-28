"use client"

import { Section } from "@/components/ui/section"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Mic, Brain, Clock, Heart } from "lucide-react"

const features = [
    {
        icon: Mic,
        title: "Natural Voice",
        description: "Talk naturally, AI responds with warmth and empathy.",
        color: "bg-amber-100 text-amber-600",
    },
    {
        icon: Brain,
        title: "Emotional Memory",
        description: "Nuravya remembers your stories and important moments.",
        color: "bg-rose-100 text-rose-600",
    },
    {
        icon: Clock,
        title: "Smart Reminders",
        description: "Never miss medications or daily check-ins.",
        color: "bg-blue-100 text-blue-600",
    },
    {
        icon: Heart,
        title: "Always Available",
        description: "24/7 companionship without judgment or fatigue.",
        color: "bg-emerald-100 text-emerald-600",
    },
]

export function Solution() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    })

    const y = useTransform(scrollYProgress, [0, 1], [100, -100])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

    return (
        <Section id="features" className="bg-stone-50 overflow-hidden" ref={containerRef}>
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="text-3xl md:text-5xl font-bold font-heading text-stone-900 mb-6">
                    A Companion That Truly Understands
                </h2>
                <p className="text-lg text-stone-600">
                    More than just a chatbot. Nuravya is designed to be present, attentive, and helpful in your daily life.
                </p>
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Interactive Demo Placeholder */}
                <div className="relative h-[400px] md:h-[500px] bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden flex flex-col">
                    <div className="bg-stone-50 border-b border-stone-100 p-4 flex items-center justify-between">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="text-xs font-medium text-stone-400">NURAVYA VOICE INTERFACE</div>
                    </div>
                    <div className="flex-1 p-4 md:p-6 flex flex-col justify-end space-y-4">
                        <div className="bg-stone-100 self-start rounded-2xl rounded-tl-none p-3 md:p-4 max-w-[90%] md:max-w-[80%]">
                            <p className="text-sm md:text-base text-stone-700">Good morning, Sarah! How did you sleep? I remember you were worried about your appointment today.</p>
                        </div>
                        <div className="bg-amber-100 self-end rounded-2xl rounded-tr-none p-3 md:p-4 max-w-[90%] md:max-w-[80%]">
                            <p className="text-sm md:text-base text-stone-800">I slept okay. Yes, I'm a bit nervous about the doctor visit.</p>
                        </div>
                        <div className="bg-stone-100 self-start rounded-2xl rounded-tl-none p-3 md:p-4 max-w-[90%] md:max-w-[80%] flex gap-2 items-center">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>

                    {/* Voice Input Bar */}
                    <div className="p-4 border-t border-stone-100 bg-white">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
                                <Mic size={20} />
                            </div>
                            <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ width: ["0%", "40%", "20%", "60%", "30%"] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-2xl shadow-md border border-stone-100"
                        >
                            <div className={`p-3 rounded-xl w-fit ${feature.color} mb-4`}>
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold font-heading text-stone-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-stone-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    )
}
