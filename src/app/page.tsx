import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Solution } from "@/components/sections/solution";
import { UseCases } from "@/components/sections/use-cases";
import { Trust } from "@/components/sections/trust";
import { Pricing } from "@/components/sections/pricing";
import { Testimonials } from "@/components/sections/testimonials";
import { Waitlist } from "@/components/sections/waitlist";
import { FAQ } from "@/components/sections/faq";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <Hero />
      <Problem />
      <Solution />
      <UseCases />
      <Trust />
      <Pricing />
      <Testimonials />
      <Waitlist />
      <FAQ />
      <Footer />
    </main>
  );
}
