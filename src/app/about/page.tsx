"use client";

import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Heart, Brain, Shield, Users } from "lucide-react";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";

export default function AboutUs() {
  const values = [
    {
      title: "True Friendship",
      description: "We build conversations that make room for reflection instead of optimizing only for speed or engagement.",
      icon: <Heart className="h-8 w-8 text-rose-500" />
    },
    {
      title: "Continuous Memory",
      description: "Relationships grow through shared history. Nuravya's memory is designed to retain what matters to you over time.",
      icon: <Brain className="h-8 w-8 text-amber-500" />
    },
    {
      title: "Unwavering Privacy",
      description: "Personal context requires authenticated ownership, encryption, clear controls, and claims that match the system we actually operate.",
      icon: <Shield className="h-8 w-8 text-emerald-500" />
    },
    {
      title: "Accessible Companionship",
      description: "We believe everyone deserves a friend they can talk to at 2 AM without fear of judgment. Emotional support should have zero barriers.",
      icon: <Users className="h-8 w-8 text-blue-500" />
    }
  ];

  return (
    <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans overflow-hidden">
      <PageHero
        eyebrow="Our mission"
        title={<>Technology that makes space to <span className="text-[#F2811D]">feel heard.</span></>}
        description="Nuravya explores a different role for AI: not another productivity layer, but a calm companion for reflection, continuity, and everyday conversation."
      />

      {/* The Story Section */}
      <section className="py-20 px-4 md:px-6 bg-white z-10 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="space-y-6 text-lg text-stone-600 leading-relaxed"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-stone-900 mb-6">Our Story</h2>
              <p>
                Nuravya AI was born out of a simple, profound observation: people need to be heard. Not analyzed, not pitched to, and not optimized. Just heard.
              </p>
              <p>
                In an era where AI is primarily being used to increase productivity, write emails faster, and write code, we saw an opportunity to use this breakthrough technology to solve a very human problem. What if an AI wasn&apos;t built to be a servant, but a companion?
              </p>
              <p>
                What if it remembered your dog&apos;s name, asked you how your big presentation went, and noticed when you sounded a bit stressed in your voice? That vision became Nuravya.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative w-full min-h-[300px] md:min-h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-amber-100 flex items-center justify-center p-8"
            >
              {/* Abstract representation of connection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 via-orange-100 to-amber-200 opacity-80" />
              <div className="relative z-10 text-center">
                <Heart className="w-24 h-24 mx-auto text-rose-400 mb-6 drop-shadow-lg" />
                <h3 className="text-3xl font-bold font-heading text-stone-800">Designed for Humanity</h3>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 md:px-6 z-10 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-stone-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">The principles that guide every line of code we write and every feature we launch.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FFFBEB] flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{value.title}</h3>
                <p className="text-stone-600 leading-relaxed text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 px-4 md:px-6 bg-stone-50 z-10 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-stone-900 mb-6">Built by Gulrez Alam</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Nuravya AI is an independent product built across full-stack web, mobile, AI, voice, memory, authentication, and deployment systems.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200 text-center shadow-sm">
              <div className="w-24 h-24 mx-auto bg-stone-200 rounded-full mb-6 overflow-hidden border-2 border-amber-100 shadow-inner">
                <Image
                  src="/images/Teams/Gulrez.png"
                  alt="Gulrez Alam"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-1">Gulrez Alam</h3>
              <p className="text-amber-600 font-medium text-sm mb-4">Founder & Full-Stack Builder</p>
              <p className="text-stone-600 text-sm leading-relaxed">
                Designed and built Nuravya AI as a human-centered companion platform focused on emotionally intelligent conversation, voice interaction, memory, and privacy-first product thinking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team/Joining Section */}
      <section className="py-20 px-4 md:px-6 bg-stone-900 text-stone-300 z-10 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6">Built by humans, for humans.</h2>
          <p className="text-lg md:text-xl text-stone-400 mb-10 max-w-2xl mx-auto">
            Nuravya AI is currently an independent project by Gulrez Alam, built with the belief that technology should feel useful, respectful, and emotionally aware.
          </p>
          <motion.div className="inline-block">
            <a href="mailto:hello@nuravya.com" className="inline-flex items-center justify-center overflow-hidden h-14 px-8 rounded-[0.8rem] bg-white bg-[length:0%_100%] bg-no-repeat [background-image:linear-gradient(#F2811D,#F2811D)] text-stone-950 font-semibold text-lg shadow-lg transition-[background-size,color] duration-300 hover:bg-[length:100%_100%] hover:text-white">
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
