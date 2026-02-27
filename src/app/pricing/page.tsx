import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow pt-32 pb-16 px-4 md:px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold font-heading text-stone-900 mb-6">Simple, transparent pricing</h1>
                        <p className="text-xl text-stone-600 max-w-2xl mx-auto">Companionship should be accessible. Choose the plan that fits your life.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Core Plan */}
                        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-stone-900 mb-2">Haven Core</h2>
                                <p className="text-stone-500">Perfect for daily check-ins and light conversation.</p>
                            </div>
                            <div className="mb-8">
                                <span className="text-5xl font-bold text-stone-900">Free</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-center gap-3 text-stone-600">
                                    <Check className="h-5 w-5 text-emerald-500" />
                                    <span>30 minutes of voice interaction daily</span>
                                </li>
                                <li className="flex items-center gap-3 text-stone-600">
                                    <Check className="h-5 w-5 text-emerald-500" />
                                    <span>Unlimited text chat</span>
                                </li>
                                <li className="flex items-center gap-3 text-stone-600">
                                    <Check className="h-5 w-5 text-emerald-500" />
                                    <span>7-day memory retention</span>
                                </li>
                                <li className="flex items-center gap-3 text-stone-600">
                                    <Check className="h-5 w-5 text-emerald-500" />
                                    <span>Single voice profile</span>
                                </li>
                            </ul>
                            <Link href="/#waitlist">
                                <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white h-12" size="lg">Join Waitlist</Button>
                            </Link>
                        </div>

                        {/* Plus Plan */}
                        <div className="bg-gradient-to-b from-amber-50 to-orange-50 p-8 rounded-3xl border border-amber-200 shadow-lg relative flex flex-col transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
                                MOST POPULAR
                            </div>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-stone-900 mb-2">Haven Plus</h2>
                                <p className="text-stone-600">For a truly continuous, lifelong AI companion.</p>
                            </div>
                            <div className="mb-8 flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-stone-900">$12</span>
                                <span className="text-stone-600">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-center gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500" />
                                    <span className="font-medium">Unlimited voice interactions</span>
                                </li>
                                <li className="flex items-center gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500" />
                                    <span className="font-medium">Infinite memory graph retention</span>
                                </li>
                                <li className="flex items-center gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500" />
                                    <span>Proactive outreach & reminders</span>
                                </li>
                                <li className="flex items-center gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500" />
                                    <span>Multiple custom voice profiles</span>
                                </li>
                                <li className="flex items-center gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500" />
                                    <span>Priority access to new models</span>
                                </li>
                            </ul>
                            <Link href="/#waitlist">
                                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 shadow-md" size="lg">Secure Early Access</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
