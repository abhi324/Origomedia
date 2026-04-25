"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutBlock() {
  return (
    <section id="about" className="w-full py-20 sm:py-28 md:py-36 bg-transparent">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#4A6357] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-4 block">
              About Origo
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-cormorant font-bold text-gray-900 leading-[1.05]">
              Small roster. <br />
              <span className="italic font-normal">Serious fit.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="space-y-6 sm:space-y-8"
          >
            <p className="text-xl sm:text-2xl font-cormorant text-gray-900 leading-snug">
              Origo is an influencer marketing agency for beauty and skincare. We work with nano and micro creators&mdash;people whose audiences actually trust them.
            </p>
            <p className="text-base sm:text-lg text-gray-500 font-inter leading-relaxed">
              We started Origo because the matchmaking was broken. Brands kept ending up with creators who didn&rsquo;t fit, and creators kept getting cold-pitched for unpaid &ldquo;collabs.&rdquo; Both sides deserved better.
            </p>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-[10px] font-montserrat font-bold tracking-[0.3em] uppercase text-[#4A6357] mb-3">
                Our principle
              </p>
              <p className="text-lg sm:text-xl text-gray-900 font-cormorant italic leading-relaxed mb-8">
                &ldquo;Creators shouldn&rsquo;t work for free.&rdquo;
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[11px] uppercase font-montserrat font-bold tracking-widest text-[#4A6357] hover:text-[#2D3F37] transition-all group"
              >
                Read the full story
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
