"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StatusModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    message: string
    variant?: "success" | "error"
}

export function StatusModal({ isOpen, onClose, title, message, variant = "success" }: StatusModalProps) {
    const isError = variant === "error"

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        {/* Modal Card */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative border border-stone-100 text-center"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300",
                                isError ? "bg-red-50 text-red-500" : "bg-amber-100 text-amber-600"
                            )}>
                                {isError ? <AlertCircle size={40} /> : <CheckCircle2 size={40} />}
                            </div>

                            <h3 className="text-2xl font-bold font-heading text-stone-900 mb-3">
                                {title}
                            </h3>

                            <p className="text-stone-600 mb-8 leading-relaxed">
                                {message}
                            </p>

                            <Button
                                onClick={onClose}
                                className={cn(
                                    "w-full text-white font-bold h-12 rounded-xl shadow-lg transition-all active:scale-95",
                                    isError
                                        ? "bg-red-500 hover:bg-red-600 shadow-red-200"
                                        : "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
                                )}
                            >
                                {isError ? "Close" : "Got it!"}
                            </Button>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
