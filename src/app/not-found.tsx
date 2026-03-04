"use client";

import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Search, HeartPulse } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <div className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="mb-8 relative inline-block">
                        <div className="w-24 h-24 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm relative z-10">
                            <Search size={40} className="text-amber-600" />
                        </div>
                        <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full scale-110 -z-10"></div>
                        <div className="absolute -top-4 -right-4 bg-white p-2 rounded-xl shadow-sm border border-stone-100 animate-bounce">
                            <HeartPulse size={20} className="text-red-400" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold font-heading text-stone-900 mb-4">Are you lost?</h1>
                    <p className="text-stone-600 mb-8 leading-relaxed">
                        Even the most thoughtful journeys take unexpected turns. The page you're looking for seems to have found peace elsewhere.
                    </p>

                    <div className="space-y-4">
                        <Link href="/" className="block">
                            <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-stone-200">
                                <Home size={18} />
                                Back to Home
                            </Button>
                        </Link>
                        <Link href="/contact" className="block">
                            <Button variant="ghost" className="w-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 h-12 rounded-2xl">
                                Contact Support
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-12 pt-8 border-t border-stone-200/50">
                        <p className="text-stone-400 text-xs italic">
                            "Not all those who wander are lost, but we'd love to help you find your way back."
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
