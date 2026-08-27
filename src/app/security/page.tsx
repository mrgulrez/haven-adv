import { Footer } from "@/components/layout/footer";
import { Lock, Server, EyeOff } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <PageHero
        eyebrow="Security"
        title={<>Trust should be <span className="text-[#F2811D]">visible.</span></>}
        description="Nuravya handles deeply personal context. Our security model starts with authenticated ownership, encrypted content, explicit memory controls, and honest claims about what is—and is not—verified."
      />
      <div className="flex-grow py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-center">
              <Lock className="w-8 h-8 text-stone-900 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Encrypted conversations</h3>
              <p className="text-stone-600 text-sm">Conversation content is encrypted before database storage and production traffic is served over secure transport.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-center">
              <EyeOff className="w-8 h-8 text-stone-900 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Account-scoped memory</h3>
              <p className="text-stone-600 text-sm">Authenticated ownership checks keep memory, characters, and conversation history scoped to the signed-in account.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-center">
              <Server className="w-8 h-8 text-stone-900 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Transparent maturity</h3>
              <p className="text-stone-600 text-sm">We do not claim certifications we have not earned. Independent audits and formal controls remain roadmap work.</p>
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
