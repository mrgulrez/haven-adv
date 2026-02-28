import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow pt-32 pb-16 px-4 md:px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-bold font-heading text-stone-900 mb-6">Build the future <br />of companionship.</h1>
                        <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-8">We are looking for deeply empathetic engineers, researchers, and designers to help us end the loneliness epidemic.</p>
                        <a href="#open-roles">
                            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-8">
                                View Open Roles
                            </Button>
                        </a>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        <div className="bg-amber-100/50 p-8 rounded-3xl border border-amber-200">
                            <h3 className="text-2xl font-bold font-heading text-stone-900 mb-4">Why Nuravya?</h3>
                            <p className="text-stone-700 leading-relaxed mb-4">
                                Most AI companies are building tools to make you work faster. We are building technology to make you feel better.
                            </p>
                            <p className="text-stone-700 leading-relaxed">
                                If you want your life's work to directly impact the mental well-being of millions, this is the place to be. We offer competitive salaries, significant equity, and a culture that prioritizes actual work-life balance (ironic to build a wellness app while burning out).
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-stone-200" id="open-roles">
                            <h3 className="text-2xl font-bold font-heading text-stone-900 mb-6">Open Positions</h3>

                            <div className="space-y-4">
                                {[
                                    { title: "Senior AI Voice Engineer", dept: "Engineering", loc: "Remote (US/EU)" },
                                    { title: "Conversation Designer (Psychology)", dept: "Product", loc: "SF or Remote" },
                                    { title: "Full-Stack Typescript Developer", dept: "Engineering", loc: "Remote" },
                                    { title: "Head of Privacy & Security", dept: "Security", loc: "Remote" }
                                ].map((role, i) => (
                                    <a key={i} href={`mailto:careers@nuravyaai.example.com?subject=Application for ${role.title}`} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100 cursor-pointer block">
                                        <div>
                                            <h4 className="font-bold text-stone-900 group-hover:text-amber-600 transition-colors">{role.title}</h4>
                                            <div className="text-sm text-stone-500 mt-1">{role.dept} • {role.loc}</div>
                                        </div>
                                        <div className="mt-3 sm:mt-0 text-amber-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                            Apply →
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
