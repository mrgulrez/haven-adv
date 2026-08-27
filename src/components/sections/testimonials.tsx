"use client"

import { Section } from "@/components/ui/section"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { MessageSquareQuote } from "lucide-react"

const STORIES = [
    {
        title: "Focus coaching",
        prompt: "I keep jumping between tasks.",
        response: "Pick the smallest next action. I will hold the rest of the list for you.",
        avatar: "bg-orange-200",
    },
    {
        title: "Custom persona",
        prompt: "Be direct with me today. I need momentum.",
        response: "Good. Ten minutes, one task, no perfection. Start with the draft title.",
        avatar: "bg-purple-200",
    },
    {
        title: "Morning reset",
        prompt: "I slept better, but I still feel behind.",
        response: "Let us choose one grounding thing you can leave for later.",
        avatar: "bg-amber-200",
    },
    {
        title: "Memory follow-up",
        prompt: "Do you remember the interview I mentioned?",
        response: "Yes. You were worried about the portfolio review. Want to rehearse the opening answer?",
        avatar: "bg-blue-200",
    },
]

export function Testimonials() {
    return (
        <Section id="testimonials" className="bg-[#F5F5F3] overflow-hidden py-24 relative">
            <div className="mb-16 text-center max-w-3xl mx-auto px-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-stone-200 shadow-sm mb-6 cursor-default">
                    <MessageSquareQuote size={14} className="text-amber-500" />
                    <span className="text-xs font-bold text-stone-600 uppercase tracking-[0.18em]">Example moments</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 tracking-tight text-stone-950">
                    What the companion experience feels like
                </h2>
                <p className="text-lg text-stone-500 font-light max-w-xl mx-auto">
                    Early access products should show the intended interaction clearly before claiming broad social proof.
                </p>
            </div>

            <div className="relative flex overflow-hidden w-full">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
                    className="flex gap-6 w-max px-6"
                >
                    {[...STORIES, ...STORIES].map((story, i) => (
                        <div key={`${story.title}-${i}`} className="w-[340px] shrink-0">
                            <Card className="h-full bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all duration-500 rounded-xl">
                                <CardContent className="p-7 flex flex-col gap-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full ${story.avatar} flex items-center justify-center text-stone-700 font-bold text-sm flex-shrink-0`}>
                                            {story.title.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-stone-950 text-sm">{story.title}</div>
                                            <div className="text-xs text-stone-400">Illustrative conversation</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-sm leading-relaxed">
                                        <p className="rounded-2xl rounded-tr-sm bg-stone-950 px-4 py-3 text-white">{story.prompt}</p>
                                        <p className="rounded-2xl rounded-tl-sm bg-stone-100 px-4 py-3 text-stone-700">{story.response}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </motion.div>

                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
            </div>
        </Section>
    )
}
