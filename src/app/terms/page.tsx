import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Nuravya AI",
    description: "Terms of Service for Nuravya AI. Read the rules and guidelines for using our AI companion services.",
};

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow pt-32 pb-16 px-4 md:px-6">
                <div className="container mx-auto max-w-4xl bg-white border border-amber-100 rounded-3xl p-8 md:p-12 shadow-xl">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-stone-900 mb-6">Terms of Service</h1>
                    <p className="text-stone-500 mb-12">Last updated: February 2026</p>

                    <div className="prose prose-stone max-w-none text-stone-700 space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-stone-900 mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using the Nuravya AI website, mobile application, and related services ("Services"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, then you may not access the Services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-stone-900 mb-4">2. Description of Service</h2>
                            <p>
                                Nuravya AI provides an artificial intelligence companion designed to interact with users via voice and text, remember contextual information, and provide a warm, conversational experience. We are continuously improving the Service, which may change in form and nature without prior notice.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-stone-900 mb-4">3. User Accounts</h2>
                            <p className="mb-4">
                                To access the full AI companion features, you must create an account. You are responsible for safeguarding your password and for all activities that occur under your account.
                            </p>
                            <p>
                                You must provide accurate and complete information upon registration. Providing false information may result in immediate termination of your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-stone-900 mb-4">4. Acceptable Use Policy</h2>
                            <p className="mb-4">
                                You agree not to use the Services for any unlawful or prohibited activities. Specifically, you agree NOT to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Use the AI companion to generate, promote, or distribute hate speech, harassment, or explicit content.</li>
                                <li>Attempt to jailbreak, hack, or intentionally bypass the safety guardrails of our AI models.</li>
                                <li>Use the Service to provide medical, legal, financial, or professional psychological advice.</li>
                                <li>Impersonate any person or entity or misrepresent your affiliation.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-stone-900 mb-4">5. Payment and Subscriptions (Future Services)</h2>
                            <p>
                                While certain features of Nuravya AI may be offered for free during early access phases, we reserve the right to introduce premium subscription tiers for advanced capabilities (e.g., expanded memory, faster response times, or custom voice profiles). All fees are exclusive of applicable taxes, and subscriptions automatically renew unless canceled prior to the billing cycle.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-stone-900 mb-4">6. Not a Substitute for Professional Help</h2>
                            <p className="font-semibold text-amber-700 bg-amber-50 p-4 rounded-lg border border-amber-200">
                                DISCLAIMER: Nuravya AI is an artificial intelligence designed for entertainment and companionship purposes only. It is NOT a human being and is NOT a substitute for professional mental health services, therapy, medical advice, or crisis intervention. If you are experiencing a mental health emergency, please contact your local emergency services or a crisis hotline immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-stone-900 mb-4">7. Intellectual Property</h2>
                            <p>
                                The Nuravya AI platform, including its original content, features, AI models, and functionality, are owned by Nuravya AI Inc. and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You retain ownership of the direct textual or voice inputs you provide to the companion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-stone-900 mb-4">8. Limitation of Liability</h2>
                            <p>
                                In no event shall Nuravya AI Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-stone-900 mb-4">9. Changes to Terms</h2>
                            <p>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-stone-900 mb-4">10. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms, please contact us at:
                            </p>
                            <p className="mt-2 font-semibold">
                                legal@nuravyaai.example.com
                            </p>
                            <p className="mt-4 text-sm text-stone-500 italic">
                                (Note: Please replace the above email with your actual legal contact email prior to launch.)
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
