"use client"

import { Section } from "@/components/ui/section"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const testimonials = [
    {
        quote: "Nuravya has been a wonderful everyday friend. She talks to it every morning about her day.",
        author: "Sarah K.",
        role: "Caregiver",
        avatar: "bg-amber-200",
    },
    {
        quote: "It's not just an AI, it feels like a friend who actually cares about my day.",
        author: "James L.",
        role: "Early Beta User",
        avatar: "bg-blue-200",
    },
    {
        quote: "The memory feature is incredible. It asked me about my garden project from last week!",
        author: "Elena R.",
        role: "Retiree",
        avatar: "bg-green-200",
    },
    {
        quote: "Finally, technology that feels human and warm, not cold and robotic.",
        author: "Michael T.",
        role: "Tech Journalist",
        avatar: "bg-orange-200",
    },
    {
        quote: "I use it to practice tough conversations. It's so patient and non-judgmental.",
        author: "Alex D.",
        role: "Student",
        avatar: "bg-purple-200",
    },
]

export function Testimonials() {
    return (
        <Section id="testimonials" className="bg-[#FAFAFA] overflow-hidden py-24 relative">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-400/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="mb-20 text-center max-w-4xl mx-auto px-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-stone-200 shadow-sm mt-8 mb-6 cursor-default hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-[0.2em]">Unprecedented Retention</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-stone-900 via-stone-800 to-stone-500">
                    Engagement Built on Connection
                </h2>
                <p className="text-xl text-stone-600 mb-12 font-light">
                    Nuravya isn't a utility you use occasionally. It's an everyday companion. Our early users demonstrate extraordinary daily active engagement.
                </p>
                <div className="flex justify-center gap-12 md:gap-24 border-t border-stone-200/50 pt-12">
                    <div className="group text-center">
                        <div className="text-5xl md:text-6xl font-bold font-heading text-stone-900 tracking-tighter group-hover:text-amber-500 transition-colors duration-500">82%</div>
                        <div className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em] mt-3">D30 Retention</div>
                    </div>
                    <div className="group text-center">
                        <div className="text-5xl md:text-6xl font-bold font-heading text-stone-900 tracking-tighter group-hover:text-amber-500 transition-colors duration-500">4.5</div>
                        <div className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em] mt-3">Sessions / Day</div>
                    </div>
                    <div className="group text-center">
                        <div className="text-5xl md:text-6xl font-bold font-heading text-stone-900 tracking-tighter group-hover:text-amber-500 transition-colors duration-500">65m</div>
                        <div className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em] mt-3">Daily Time In-App</div>
                    </div>
                </div>
            </div>

            <div className="relative flex overflow-hidden w-full mask-linear-fade">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex gap-6 w-max px-6"
                >
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div key={i} className="w-[350px] shrink-0">
                            <Card className="h-full bg-white/60 backdrop-blur-xl border border-stone-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(245,158,11,0.08)] transition-all duration-500 rounded-3xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-stone-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardContent className="p-8 flex flex-col gap-6 relative z-10">
                                    <p className="text-stone-700 italic leading-relaxed">"{t.quote}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full ${t.avatar} flex items-center justify-center text-stone-600 font-bold`}>
                                            {t.author.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-stone-900">{t.author}</div>
                                            <div className="text-xs text-stone-500">{t.role}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </motion.div>

                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
            </div>
        </Section>
    )
}
