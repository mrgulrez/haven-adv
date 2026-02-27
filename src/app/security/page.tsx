import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ShieldAlert, Lock, Server, EyeOff } from "lucide-react";

export default function SecurityPage() {
    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow pt-32 pb-16 px-4 md:px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
                            <ShieldAlert className="h-10 w-10 text-emerald-600" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading text-stone-900 mb-6">Enterprise-Grade Security for Personal Data</h1>
                        <p className="text-xl text-stone-600 max-w-2xl mx-auto">Your thoughts, feelings, and memories are sacred. Here is how we protect them.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-center">
                            <Lock className="w-8 h-8 text-stone-900 mx-auto mb-4" />
                            <h3 className="text-lg font-bold mb-2">Encryption at Rest & Transit</h3>
                            <p className="text-stone-600 text-sm">All data is encrypted using AES-256 at rest and TLS 1.3 in transit.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-center">
                            <EyeOff className="w-8 h-8 text-stone-900 mx-auto mb-4" />
                            <h3 className="text-lg font-bold mb-2">Zero-Knowledge Memory</h3>
                            <p className="text-stone-600 text-sm">Our engineers cannot view your personalized memory graph contexts.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-center">
                            <Server className="w-8 h-8 text-stone-900 mx-auto mb-4" />
                            <h3 className="text-lg font-bold mb-2">SOC2 Type II (Pending)</h3>
                            <p className="text-stone-600 text-sm">We are actively pursuing strict independent security audits.</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 md:p-12 rounded-3xl border border-stone-200 shadow-md">
                        <h2 className="text-2xl font-bold font-heading text-stone-900 mb-6">Our Data Principles</h2>
                        <div className="space-y-6 text-stone-700">
                            <div>
                                <h4 className="font-semibold text-stone-900 mb-1">1. We will never sell your data</h4>
                                <p>Our business model is built on providing you a valuable service, not exploiting your personal information to third-party advertisers. Your secrets stay yours.</p>
                            </div>
                            <hr className="border-stone-100" />
                            <div>
                                <h4 className="font-semibold text-stone-900 mb-1">2. You have the right to forget</h4>
                                <p>Memory is a feature, not a trap. You can instantly wipe specific memories ("Forget I told you that") or nuke your entire account history with a single button in settings.</p>
                            </div>
                            <hr className="border-stone-100" />
                            <div>
                                <h4 className="font-semibold text-stone-900 mb-1">3. Privacy by design</h4>
                                <p>Voice recordings are processed in temporary memory buffers and transcribed securely. The raw audio files are instantly deleted and never stored on our servers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
