import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <PageHero
        eyebrow="Careers"
        title={<>Small team. <span className="text-[#F2811D]">Serious ambition.</span></>}
        description="Nuravya is currently founder-built. We are not hiring today, but we are always interested in thoughtful people who care about trustworthy AI and exceptional product craft."
      >
        <a href="mailto:hello@nuravya.com"><Button size="lg">Introduce yourself</Button></a>
      </PageHero>
      <div className="flex-grow py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-20">
            <div className="glass-panel hairline-glow p-8 md:p-10 rounded-[2rem]">
              <h3 className="text-2xl font-bold font-heading text-stone-900 mb-4">What is being built</h3>
              <p className="text-stone-700 leading-relaxed mb-4">
                Nuravya brings together web, mobile, backend APIs, Firebase authentication, AI chat, voice interaction, memory, reminders, and deployment work.
              </p>
              <p className="text-stone-700 leading-relaxed">
                The product is presented as a solo-built portfolio project so visitors and recruiters can understand the real engineering ownership behind it.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
