"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="w-full py-16 sm:py-28 md:py-40 bg-transparent relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#4A6357]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#B794C0]/5 blur-[120px] rounded-full" />

      <div className="max-w-5xl mx-auto px-6 relative text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white p-6 sm:p-12 md:p-16 lg:p-32 rounded-[2rem] sm:rounded-[5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col items-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-gray-900 mb-6 sm:mb-12 leading-[0.95] text-center">
            Ready to Land Your
            <br />
            <span className="italic font-normal">Brand Collaboration?</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-xl font-inter font-medium mb-8 sm:mb-16 max-w-xl mx-auto leading-relaxed text-center">
            We bridge creators and brands through meaningful, high-impact partnerships that actually grow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full sm:w-auto">
            <Link
              href="/join"
              className="px-8 sm:px-14 py-4 sm:py-5 bg-[#4A6357] text-white rounded-xl text-[11px] uppercase font-montserrat font-bold tracking-widest hover:bg-[#3D5449] transition-all hover:scale-[1.05] shadow-2xl shadow-[#4A6357]/30 border border-white/10 text-center"
            >
              Join as Creator
            </Link>
            <Link
              href="#about"
              className="px-8 sm:px-14 py-4 sm:py-5 bg-transparent text-gray-900 border-2 border-gray-100 rounded-xl text-[11px] uppercase font-montserrat font-bold tracking-widest hover:bg-gray-50 transition-all text-center"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
