"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutContent() {
  return (
    <main className="min-h-screen bg-[#FCF9F5] selection:bg-[#4A6357]/20">
      <section className="pt-32 sm:pt-40 pb-20 sm:pb-28 px-5 sm:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[#4A6357] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-6 block">
            About Origo
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-cormorant font-bold text-gray-900 leading-[1.0] mb-12 sm:mb-16 max-w-4xl">
            We don&rsquo;t chase volume. <br />
            <span className="italic font-normal text-[#4A6357]">We curate fit.</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 border-t border-gray-200 pt-12 sm:pt-16">
            <div className="space-y-6 sm:space-y-8">
              <p className="font-cormorant text-2xl sm:text-3xl md:text-4xl leading-snug text-gray-900">
                Origo is an influencer marketing agency for beauty and skincare. We work with nano and micro creators&mdash;people whose audiences actually trust them.
              </p>
              <p className="text-base sm:text-lg text-gray-600 font-inter leading-relaxed">
                We started Origo because the matchmaking was broken. Brands kept ending up with creators who didn&rsquo;t fit, and creators kept getting cold-pitched for unpaid “collabs.” Both sides deserved better.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <p className="text-base sm:text-lg text-gray-600 font-inter leading-relaxed">
                For brands, we curate creators by niche, audience, and tone&mdash;then handle briefing and delivery. For creators, we bring real brand collaborations that actually fit the work.
              </p>
              <p className="text-base sm:text-lg text-gray-600 font-inter leading-relaxed">
                That&rsquo;s the whole pitch. Small roster, serious fit, no theatre.
              </p>
              <div className="pt-8 border-t border-gray-100">
                <p className="text-[10px] font-montserrat font-bold tracking-[0.3em] uppercase text-[#4A6357] mb-3">
                  Our principle
                </p>
                <p className="text-xl sm:text-2xl text-gray-900 font-cormorant italic leading-relaxed">
                  &ldquo;Creators shouldn&rsquo;t work for free.&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 sm:mt-20 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/join"
              className="px-8 py-4 bg-[#3D5449] text-white rounded-xl text-[11px] uppercase font-montserrat font-bold tracking-widest hover:bg-[#2D3F37] transition-all text-center"
            >
              Join as Creator
            </Link>
            <a
              href="mailto:origomedia.co@gmail.com?subject=Brand%20enquiry"
              className="px-8 py-4 bg-transparent text-gray-900 border border-gray-200 rounded-xl text-[11px] uppercase font-montserrat font-bold tracking-widest hover:bg-gray-100 transition-all text-center"
            >
              Brands: get in touch
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
