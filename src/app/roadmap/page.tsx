import { Footer } from "@/components/layout/footer";
import { Check, Clock, Sparkles } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <PageHero
        eyebrow="Roadmap"
        title={<>Build trust first. <span className="text-[#F2811D]">Then expand.</span></>}
        description="A living view of what is working today, what is being hardened, and what remains exploratory. Dates are directional until a release is verified."
      />
      <div className="flex-grow py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="relative border-l-2 border-amber-200 ml-4 md:ml-8 pl-8 space-y-12">
            {/* Foundation */}
            <div className="relative">
              <div className="absolute -left-11 bg-white border-2 border-amber-500 rounded-full p-1.5 shadow-sm">
                <Check className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-2">Foundation · Available</h3>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <h4 className="text-xl font-bold text-stone-900 mb-3">Companion foundations</h4>
                <ul className="space-y-2 text-stone-600">
                  <li>• Authenticated text and real-time voice experiences</li>
                  <li>• Account-scoped conversation history and memory</li>
                  <li>• Web and Android application foundations</li>
                </ul>
              </div>
            </div>

            {/* Current */}
            <div className="relative">
              <div className="absolute -left-11 bg-amber-500 rounded-full p-2 shadow-md">
                <Clock className="w-4 h-4 text-white animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-2">August 2026 · In progress</h3>
              <div className="bg-gradient-to-r from-amber-50 to-white p-6 rounded-2xl shadow-md border border-amber-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-bl-full -z-10 opacity-50"></div>
                <h4 className="text-xl font-bold text-stone-900 mb-3">Production hardening</h4>
                <ul className="space-y-2 text-stone-800 font-medium">
                  <li>• Reliable billing, quotas, and replay-safe usage accounting</li>
                  <li>• Versioned migrations and automated quality gates</li>
                  <li>• Clear privacy, memory, and cancellation controls</li>
                  <li>• Unified accessible design across public and product surfaces</li>
                </ul>
              </div>
            </div>

            {/* Next */}
            <div className="relative">
              <div className="absolute -left-[43px] bg-stone-100 border-2 border-stone-200 rounded-full p-[7px] shadow-sm">
                <div className="w-3 h-3 bg-stone-300 rounded-full"></div>
              </div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Next · Early access readiness</h3>
              <div className="bg-white p-6 rounded-2xl border border-stone-100 opacity-75">
                <h4 className="text-xl font-bold mb-3 text-stone-700">A dependable daily companion</h4>
                <ul className="space-y-2 text-stone-500">
                  <li>• Guided onboarding and memory-consent education</li>
                  <li>• Faster startup, stronger observability, and graceful recovery</li>
                  <li>• Broader accessibility and device testing</li>
                </ul>
              </div>
            </div>

            {/* Q4 2026 & Beyond */}
            <div className="relative">
              <div className="absolute -left-[43px] bg-stone-100 border-2 border-stone-200 rounded-full p-[7px] shadow-sm">
                <div className="w-3 h-3 bg-stone-300 rounded-full"></div>
              </div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Exploratory · No committed date</h3>
              <div className="bg-white p-6 rounded-2xl border border-stone-100 opacity-60">
                <h4 className="flex items-center gap-2 text-xl font-bold text-stone-900 mb-3 text-stone-700">
                  New forms of presence <Sparkles className="w-4 h-4 text-amber-400" />
                </h4>
                <ul className="space-y-2 text-stone-500">
                  <li>• Expressive visual companion experiments</li>
                  <li>• Carefully permissioned third-party context integrations</li>
                  <li>• More local processing and offline privacy options</li>
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
