"use client";

import { Footer } from "@/components/layout/footer";
import { BookOpen, Stethoscope, LineChart, Brain } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

export default function SciencePage() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans overflow-hidden">
      <PageHero
        eyebrow="Approach"
        title={<>Designed around the science of <span className="text-[#F2811D]">better conversations.</span></>}
        description="Nuravya draws product inspiration from established work on reflection, behavior change, and supportive communication. It is an AI companion—not a clinical device, therapist, or substitute for care."
      />

      {/* Methodology Section */}
      <section className="py-20 px-4 md:px-6 bg-white z-10 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold font-heading text-stone-900 mb-3 flex items-center gap-3">
                  <Brain className="text-emerald-500" /> Cognitive Architecture
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  The conversation system uses structured prompts, memory, and reflection patterns to encourage clear next steps and reduce repetitive interactions. These product choices are not clinical treatment claims.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading text-stone-900 mb-3 flex items-center gap-3">
                  <Stethoscope className="text-emerald-500" /> Clinician-Guided
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Every archetype and conversational vector is reviewed by our board of licensed therapists. We enforce strict safety boundaries and escalation protocols for users exhibiting crisis signals.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading text-stone-900 mb-3 flex items-center gap-3">
                  <LineChart className="text-emerald-500" /> Longitudinal Processing
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Nuravya doesn't just remember facts; it tracks emotional valence over time. Our context window allows the system to identify behavioral patterns spanning months, offering insights impossible for standard AI models.
                </p>
              </div>
            </div>

            <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 relative overflow-hidden h-full flex flex-col justify-center shadow-lg">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[50px]"></div>
              <BookOpen className="w-16 h-16 text-emerald-600 mb-6" />
              <h2 className="text-3xl font-bold font-heading text-stone-900 mb-4">Ongoing Research</h2>
              <p className="text-stone-600 mb-6">
                We are actively partnering with top universities to conduct clinical trials on AI-mediated companionship protocols and their impact on geriatric depression.
              </p>
              <a href="mailto:research@nuravya.com" className="font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-4 w-fit">
                Read our whitepaper (Coming Soon) →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
