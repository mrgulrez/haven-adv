"use client"

import { Section } from "@/components/ui/section"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
    {
        question: "Is my data secure?",
        answer: "Absolutely. We use enterprise-grade encryption for all data storage and transmission. Your conversations are private and never used to train public AI models without your explicit consent.",
    },
    {
        question: "How does Haven remember conversations?",
        answer: "Haven uses a sophisticated memory architecture that stores key details, preferences, and stories from your conversations in a secure, private database unique to you.",
    },
    {
        question: "Can I use my own voice or a family member's voice?",
        answer: "Currently, Haven offers a selection of warm, natural AI voices. We are exploring voice cloning technology for future updates with strict ethical guidelines.",
    },
    {
        question: "What devices does Haven work on?",
        answer: "Haven is accessible via any modern web browser on desktop, tablet, and mobile devices. A dedicated mobile app is coming in Q3 2026.",
    },
    {
        question: "When will Haven launch?",
        answer: "We are targeting a full public launch in Q2 2026. Join the waitlist to get early access and help shape the product during our beta phase.",
    },
]

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <Section id="faq" className="bg-stone-50 py-24">
            <div className="max-w-3xl mx-auto container px-4">
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-stone-900 text-center mb-12">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full text-left p-6 flex justify-between items-center text-stone-900 font-medium hover:bg-stone-50 transition-colors focus:outline-none"
                            >
                                <span className="text-lg">{faq.question}</span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-stone-400"
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
