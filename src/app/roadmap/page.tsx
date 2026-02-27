import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Check, Clock, Sparkles } from "lucide-react";

export default function RoadmapPage() {
    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow pt-32 pb-16 px-4 md:px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading text-stone-900 mb-6">Our Journey Ahead</h1>
                        <p className="text-xl text-stone-600 max-w-2xl mx-auto">We are building Haven openly. Here is what we are working on to make your companion even better.</p>
                    </div>

                    <div className="relative border-l-2 border-amber-200 ml-4 md:ml-8 pl-8 space-y-12">
                        {/* Q1 2026 */}
                        <div className="relative">
                            <div className="absolute -left-11 bg-white border-2 border-amber-500 rounded-full p-1.5 shadow-sm">
                                <Check className="w-5 h-5 text-amber-500" />
                            </div>
                            <h3 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-2">Q1 2026 (Completed)</h3>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                <h4 className="text-xl font-bold text-stone-900 mb-3">Alpha Voice Engine v1</h4>
                                <ul className="space-y-2 text-stone-600">
                                    <li>• Sub-800ms natural voice synthesis</li>
                                    <li>• Basic contextual memory graph implementation</li>
                                    <li>• iOS TestFlight launch to 500 alpha testers</li>
                                </ul>
                            </div>
                        </div>

                        {/* Q2 2026 */}
                        <div className="relative">
                            <div className="absolute -left-11 bg-amber-500 rounded-full p-2 shadow-md">
                                <Clock className="w-4 h-4 text-white animate-pulse" />
                            </div>
                            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-2">Q2 2026 (Current)</h3>
                            <div className="bg-gradient-to-r from-amber-50 to-white p-6 rounded-2xl shadow-md border border-amber-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-bl-full -z-10 opacity-50"></div>
                                <h4 className="text-xl font-bold text-stone-900 mb-3">Public Early Access Launch</h4>
                                <ul className="space-y-2 text-stone-800 font-medium">
                                    <li>• Waitlist onboarding (first 5,000 users)</li>
                                    <li>• Emotionally-resonant voice profiles (V2)</li>
                                    <li>• Proactive morning/evening check-ins</li>
                                    <li>• SOC2 Type II compliance audit</li>
                                </ul>
                            </div>
                        </div>

                        {/* Q3 2026 */}
                        <div className="relative">
                            <div className="absolute -left-[43px] bg-stone-100 border-2 border-stone-200 rounded-full p-[7px] shadow-sm">
                                <div className="w-3 h-3 bg-stone-300 rounded-full"></div>
                            </div>
                            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Q3 2026</h3>
                            <div className="bg-white p-6 rounded-2xl border border-stone-100 opacity-75">
                                <h4 className="text-xl font-bold text-stone-900 mb-3 text-stone-700">The Visual Companion</h4>
                                <ul className="space-y-2 text-stone-500">
                                    <li>• Live2D emotional avatar integration</li>
                                    <li>• Vision system (show Haven things via camera)</li>
                                    <li>• "Remember this face" relationship networking</li>
                                </ul>
                            </div>
                        </div>

                        {/* Q4 2026 & Beyond */}
                        <div className="relative">
                            <div className="absolute -left-[43px] bg-stone-100 border-2 border-stone-200 rounded-full p-[7px] shadow-sm">
                                <div className="w-3 h-3 bg-stone-300 rounded-full"></div>
                            </div>
                            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Q4 2026 & Beyond</h3>
                            <div className="bg-white p-6 rounded-2xl border border-stone-100 opacity-60">
                                <h4 className="flex items-center gap-2 text-xl font-bold text-stone-900 mb-3 text-stone-700">
                                    Full Integration <Sparkles className="w-4 h-4 text-amber-400" />
                                </h4>
                                <ul className="space-y-2 text-stone-500">
                                    <li>• Apple Health / Wearable biometric integration for stress</li>
                                    <li>• Complete API for third-party knowledge bases</li>
                                    <li>• Local-first offline mode for extreme privacy</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
