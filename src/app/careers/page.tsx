import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <div className="flex-grow pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold font-heading text-stone-900 mb-6">
              Built independently.
            </h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-8">
              Nuravya AI is currently designed and built by Gulrez Alam as an independent product. There are no open roles right now.
            </p>
            <a href="mailto:hello@nuravya.com">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-8">
                Contact Gulrez
              </Button>
            </a>
          </div>

          <div className="mb-20">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200 shadow-sm">
              <h3 className="text-2xl font-bold font-heading text-stone-900 mb-4">Project Scope</h3>
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
