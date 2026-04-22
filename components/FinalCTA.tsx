"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="w-full py-40 bg-transparent relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#4A6357]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#B794C0]/5 blur-[120px] rounded-full" />

      <div className="max-w-5xl mx-auto px-6 relative text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white p-16 md:p-32 rounded-[5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col items-center"
        >
          <span className="text-[#4A6357] text-[10px] font-inter font-black tracking-[0.6em] uppercase mb-10 block">The Next Step</span>
          <h2 className="text-5xl md:text-8xl font-playfair font-bold text-gray-900 mb-12 leading-[0.95]">
            Ready to Find Your <br /> <span className="italic font-normal underline decoration-[#4A6357]/20 underline-offset-[12px]">Origin?</span>
          </h2>
          <p className="text-gray-500 text-xl font-inter font-medium mb-16 max-w-xl mx-auto leading-relaxed">
            Join the most exclusive network of beauty and skincare creators. High-impact campaigns, guaranteed payouts, and brand-first growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center">
             <Link
                href="/join"
                className="px-12 py-5 bg-[#4A6357] text-white rounded-[2rem] text-sm font-inter font-black uppercase tracking-[0.3em] hover:bg-[#3D5449] transition-all hover:scale-[1.05] shadow-2xl shadow-[#4A6357]/30"
             >
                Apply to Join
             </Link>
             <Link
                href="#about"
                className="px-12 py-5 bg-transparent text-gray-900 border-2 border-gray-100 rounded-[2rem] text-sm font-inter font-black uppercase tracking-[0.3em] hover:bg-gray-50 transition-all"
             >
                Learn More
             </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
