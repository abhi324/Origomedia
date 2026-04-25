"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="w-full py-20 sm:py-28 md:py-36 bg-transparent relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#4A6357]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[320px] h-[320px] bg-[#B794C0]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white p-8 sm:p-14 md:p-20 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_36px_72px_-24px_rgba(0,0,0,0.08)] border border-gray-100 text-center"
        >
          <span className="text-[#4A6357] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-5 block">
            Apply now
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-cormorant font-bold text-gray-900 mb-5 sm:mb-7 leading-[1.05]">
            Ready to land your <br className="hidden sm:block" />
            <span className="italic font-normal">first paid campaign?</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 font-inter mb-8 sm:mb-12 max-w-lg mx-auto leading-relaxed">
            Apply in 3 minutes. We&rsquo;ll review and get back inside a week.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center">
            <Link
              href="/join"
              className="px-8 sm:px-10 py-4 bg-[#3D5449] text-white rounded-xl text-[11px] uppercase font-montserrat font-bold tracking-widest hover:bg-[#2D3F37] transition-all text-center"
            >
              Apply as a Founding Creator
            </Link>
            <a
              href="mailto:origomedia.co@gmail.com?subject=Brand%20enquiry"
              className="px-8 sm:px-10 py-4 bg-transparent text-gray-900 border border-gray-200 rounded-xl text-[11px] uppercase font-montserrat font-bold tracking-widest hover:bg-gray-50 transition-all text-center"
            >
              Brands: start a campaign
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
