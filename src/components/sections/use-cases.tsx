"use client"

import { Section } from "@/components/ui/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRef } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const cases = [
    {
        title: "Daily Reflection",
        description: "For people who want to think out loud, unpack a feeling, or end the day with a little more clarity.",
        features: ["Mood check-ins", "Journal-style memory", "Gentle next steps"],
        image: "/images/therapy.png",
        color: "border-l-4 border-emerald-500",
    },
    {
        title: "Study and Focus",
        description: "For students and builders who want a calm partner for planning, revision, and accountability.",
        features: ["Goal breakdowns", "Learning support", "Progress reminders"],
        image: "/images/kids.png",
        color: "border-l-4 border-blue-500",
    },
    {
        title: "Everyday Companionship",
        description: "For quick voice calls, casual conversation, and remembering the small things between sessions.",
        features: ["Voice conversations", "Personal context", "Custom personas"],
        image: "/images/parents.png",
        color: "border-l-4 border-amber-500",
    },
]

export function UseCases() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: "left" | "right") => {
        if (!scrollContainerRef.current) return
        const scrollAmount = 350
        const currentScroll = scrollContainerRef.current.scrollLeft
        scrollContainerRef.current.scrollTo({
            left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
            behavior: "smooth",
        })
    }

    return (
        <Section className="bg-stone-100 py-24">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 container mx-auto px-4 md:px-6">
                <div className="max-w-2xl">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-[0.18em] mb-3">Use cases</p>
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-stone-950 mb-4">
                        Useful without pretending to be everything.
                    </h2>
                    <p className="text-stone-600 leading-relaxed">
                        Nuravya works best when the need is personal, conversational, and ongoing: reflection, focus, planning, and companionship.
                    </p>
                </div>
                <div className="hidden md:flex gap-2 mt-4 md:mt-0">
                    <Button variant="outline" size="icon" onClick={() => scroll("left")} aria-label="Scroll use cases left">
                        <ArrowLeft size={20} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => scroll("right")} aria-label="Scroll use cases right">
                        <ArrowRight size={20} />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 container mx-auto px-4 md:px-6 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {cases.map((useCase, index) => (
                    <motion.div
                        key={useCase.title}
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.45, delay: index * 0.08 }}
                        viewport={{ once: true }}
                        className="min-w-[300px] snap-center"
                    >
                        <Card className={`h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg ${useCase.color}`}>
                            <div className="h-48 w-full relative bg-stone-100">
                                <Image src={useCase.image} alt="" fill className="object-cover" sizes="(min-width: 768px) 33vw, 300px" />
                            </div>
                            <CardHeader>
                                <CardTitle>{useCase.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-stone-600 leading-relaxed text-sm">{useCase.description}</p>
                                <ul className="space-y-2">
                                    {useCase.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm text-stone-700">
                                            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </Section>
    )
}
