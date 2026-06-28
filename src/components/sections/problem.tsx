"use client"

import { Section } from "@/components/ui/section"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Brain, HeartHandshake, Mic, ShieldCheck } from "lucide-react"

const moments = [
    {
        title: "A thought you do not want to lose",
        description: "Capture feelings, plans, and small details in a conversation that can carry context forward.",
        icon: Brain,
        tone: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
        title: "A check-in when the day gets heavy",
        description: "Talk through what happened, name what you need, and leave with one grounded next step.",
        icon: HeartHandshake,
        tone: "bg-rose-50 text-rose-700 border-rose-100",
    },
    {
        title: "A voice call when typing feels like work",
        description: "Switch from text to real-time voice so the product feels present, not like another form to fill.",
        icon: Mic,
        tone: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
        title: "A private space with clear boundaries",
        description: "Account-scoped conversations, memory controls, and plain-language privacy promises keep trust visible.",
        icon: ShieldCheck,
        tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
]

export function Problem() {
    return (
        <Section id="problem" className="bg-[#FAFAFA] relative overflow-hidden py-24 md:py-28">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mb-12">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-[0.18em] mb-4">Why it exists</p>
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-stone-950 tracking-tight mb-5">
                        Built for the moments ordinary chat apps forget.
                    </h2>
                    <p className="text-lg text-stone-600 leading-relaxed">
                        Nuravya is not a market-size slide and it is not a replacement for care. It is a companion layer for everyday life: remembering context, listening in voice, and helping you return to what matters.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {moments.map((moment, index) => (
                        <motion.div
                            key={moment.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: index * 0.06 }}
                            viewport={{ once: true, margin: "-40px" }}
                        >
                            <Card className="h-full rounded-xl bg-white border-stone-200/80 shadow-sm">
                                <CardContent className="p-6">
                                    <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${moment.tone}`}>
                                        <moment.icon size={21} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-stone-950 mb-2 leading-snug">{moment.title}</h3>
                                    <p className="text-sm text-stone-600 leading-relaxed">{moment.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    )
}
