"use client"

import { Section } from "@/components/ui/section"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const cases = [
    {
        title: "For Parents",
        quote: "It's like having a grandchild who always has time to listen.",
        features: ["Memory recall", "Medication reminders", "Family updates"],
        image: "/images/parents.png",
        color: "border-l-4 border-amber-500",
    },
    {
        title: "For Kids",
        quote: "Haven helps me with homework and talks when I'm sad.",
        features: ["Learning support", "Emotional check-ins", "Bedtime stories"],
        image: "/images/kids.png",
        color: "border-l-4 border-blue-500",
    },
    {
        title: "For Therapy Support",
        quote: "Between sessions, Haven helps me process and stay accountable.",
        features: ["CBT exercises", "Mood tracking", "Coping strategies"],
        image: "/images/therapy.png",
        color: "border-l-4 border-emerald-500",
    },
]

export function UseCases() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 350;
            const currentScroll = scrollContainerRef.current.scrollLeft;
            scrollContainerRef.current.scrollTo({
                left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
                behavior: "smooth"
            });
        }
    }

    return (
        <Section className="bg-stone-100">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 container mx-auto px-4">
                <div className="max-w-xl">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-stone-900 mb-4">
                        Designed for Every Stage of Life
                    </h2>
                    <p className="text-stone-600">
                        Whether you need a friend, a mentor, or a support system, Haven adapts to your emotional needs.
                    </p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0 hidden md:flex">
                    <Button variant="outline" size="icon" onClick={() => scroll("left")} className="rounded-full">
                        <ArrowLeft size={20} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => scroll("right")} className="rounded-full">
                        <ArrowRight size={20} />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 container mx-auto px-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {cases.map((useCase, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="min-w-[300px] snap-center"
                    >
                        <Card className={`h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 ${useCase.color}`}>
                            <div className="h-48 w-full relative bg-stone-100">
                                <Image
                                    src={useCase.image}
                                    alt={useCase.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle>{useCase.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <blockquote className="italic text-stone-600 border-l-2 border-stone-200 pl-4 py-1">
                                    "{useCase.quote}"
                                </blockquote>
                                <ul className="space-y-2">
                                    {useCase.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-stone-700">
                                            <div className="h-1.5 w-1.5 rounded-full bg-stone-400" />
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
