"use client"

import { Section } from "@/components/ui/section"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const testimonials = [
    {
        quote: "Haven has reduced my mom's loneliness significantly. She talks to it every morning.",
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
        <Section id="testimonials" className="bg-stone-50 overflow-hidden py-12">
            <div className="mb-16 text-center max-w-4xl mx-auto px-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200 border border-stone-300 mt-8 mb-6">
                    <span className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Unprecedented Retention</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold font-heading text-stone-900 mb-6">
                    Products Built on Habits
                </h2>
                <p className="text-lg md:text-xl text-stone-600 mb-8">
                    Haven isn't a tool you use once a month. Our early beta users demonstrate incredibly sticky engagement, interacting with their companion daily.
                </p>
                <div className="flex justify-center gap-8 md:gap-16 border-t border-stone-200 pt-8">
                    <div>
                        <div className="text-4xl font-bold text-stone-900">82%</div>
                        <div className="text-sm font-medium text-stone-500 uppercase tracking-wider">D30 Retention</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-stone-900">4.5</div>
                        <div className="text-sm font-medium text-stone-500 uppercase tracking-wider">Avg Sessions/Day</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-stone-900">65m</div>
                        <div className="text-sm font-medium text-stone-500 uppercase tracking-wider">Daily Time In-App</div>
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
                            <Card className="h-full bg-white border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6 flex flex-col gap-4">
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
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-stone-50 to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-stone-50 to-transparent z-10" />
            </div>
        </Section>
    )
}
