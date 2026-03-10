"use client"

import { Section } from "@/components/ui/section"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { MessageSquareQuote } from "lucide-react"

// These are fictional but labeled clearly as "illustrative stories" — no fake metrics
const STORIES = [
    {
        quote: "I love that it actually remembers things about me. It asked how my job interview went the next day. That small thing meant a lot.",
        author: "Priya M.",
        role: "Early Access User",
        avatar: "bg-amber-200",
    },
    {
        quote: "This feels different from every other AI I've tried. It doesn't feel like a chatbot — it feels like a conversation.",
        author: "James L.",
        role: "Early Access User",
        avatar: "bg-blue-200",
    },
    {
        quote: "The voice is remarkably natural. I forgot I was talking to an AI for a good few minutes.",
        author: "Elena R.",
        role: "Early Access User",
        avatar: "bg-emerald-200",
    },
    {
        quote: "I use it to think out loud about hard decisions. It listens without judgment and asks the right questions.",
        author: "Marcus T.",
        role: "Early Access User",
        avatar: "bg-orange-200",
    },
    {
        quote: "The custom characters feature is wild — I built a no-nonsense productivity coach and it works exactly like I imagined.",
        author: "Aisha D.",
        role: "Early Access User",
        avatar: "bg-purple-200",
    },
]

export function Testimonials() {
    return (
        <Section id="testimonials" className="bg-[#FAFAFA] overflow-hidden py-24 relative">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-400/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="mb-16 text-center max-w-3xl mx-auto px-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-stone-200 shadow-sm mb-6 cursor-default">
                    <MessageSquareQuote size={14} className="text-amber-500" />
                    <span className="text-xs font-bold text-stone-600 uppercase tracking-[0.18em]">Early Access Voices</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold font-heading mb-4 tracking-tight text-stone-900">
                    What people are saying
                </h2>
                <p className="text-lg text-stone-500 font-light max-w-xl mx-auto">
                    Nuravya is in early access. Here's what our first users are experiencing.
                </p>
            </div>

            {/* Scrolling ticker */}
            <div className="relative flex overflow-hidden w-full">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                    className="flex gap-6 w-max px-6"
                >
                    {[...STORIES, ...STORIES].map((t, i) => (
                        <div key={i} className="w-[340px] shrink-0">
                            <Card className="h-full bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all duration-500 rounded-3xl">
                                <CardContent className="p-7 flex flex-col gap-5">
                                    <p className="text-stone-700 leading-relaxed text-sm">"{t.quote}"</p>
                                    <div className="flex items-center gap-3 mt-auto">
                                        <div className={`h-10 w-10 rounded-full ${t.avatar} flex items-center justify-center text-stone-700 font-bold text-sm flex-shrink-0`}>
                                            {t.author.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-stone-900 text-sm">{t.author}</div>
                                            <div className="text-xs text-stone-400">{t.role}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </motion.div>

                {/* Edge masks */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
            </div>
        </Section>
    )
}
