"use client"

import { Section } from "@/components/ui/section"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
    {
        question: "Is Nuravya a therapy app?",
        answer: "No. Nuravya is an AI companion for conversation, reflection, and everyday support. It is not a substitute for professional mental health care or emergency help.",
    },
    {
        question: "How does Nuravya remember conversations?",
        answer: "Nuravya stores account-scoped conversation context and uses it to make future chats feel less repetitive. Memory controls should remain visible so users can review or delete saved context.",
    },
    {
        question: "Is my data private?",
        answer: "Conversations are protected in transit and scoped to your signed-in account. Nuravya should avoid selling personal conversations or using them for public model training without explicit consent.",
    },
    {
        question: "What devices does Nuravya work on?",
        answer: "Nuravya works in modern web browsers and the project includes Android support through Capacitor. iOS support can be added later when the product is ready for that release path.",
    },
    {
        question: "What can I try today?",
        answer: "You can start with text chat, explore the companion experience, and use voice features when your plan and environment support them.",
    },
]

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <Section id="faq" className="bg-stone-50 py-24">
            <div className="max-w-3xl mx-auto container px-4">
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-stone-950 text-center mb-12">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={faq.question} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full text-left p-6 flex justify-between items-center gap-4 text-stone-950 font-medium hover:bg-stone-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30"
                                aria-expanded={openIndex === index}
                            >
                                <span className="text-base md:text-lg">{faq.question}</span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-stone-400 shrink-0"
                                >
                                    <ChevronDown size={20} />
                                </motion.div>
                            </button>
                            <AnimatePresence initial={false}>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="p-6 pt-0 text-stone-600 leading-relaxed border-t border-stone-50">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    )
}
