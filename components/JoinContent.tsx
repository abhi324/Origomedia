"use client";

import JoinForm from "@/components/JoinForm";
import { motion } from "framer-motion";

export default function JoinContent() {
  return (
    <main className="min-h-screen bg-[#FCF9F5] selection:bg-[#4A6357]/20">
      <section className="flex flex-col lg:flex-row pt-28 lg:pt-0 min-h-screen">
        <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl"
          >
            <div className="mb-10 sm:mb-12">
              <span className="text-[#4A6357] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-4 block">
                Creator application
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-cormorant font-bold text-gray-900 leading-[1.05]">
                Apply to join the <br />
                <span className="italic font-normal">creator network.</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-500 font-inter mt-5 leading-relaxed max-w-md">
                Takes about 3 minutes. We&rsquo;ll review and reach out within a week if you&rsquo;re a fit.
              </p>
            </div>
            <JoinForm />
          </motion.div>
        </div>

        <div className="hidden lg:flex flex-1 bg-[#3D5449] relative overflow-hidden items-center justify-center p-16 xl:p-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#F5E68E]/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#B794C0]/10 blur-[120px] rounded-full" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative text-center max-w-md"
          >
            <p className="text-white/80 text-2xl xl:text-3xl font-cormorant italic leading-relaxed mb-10">
              &ldquo;Creators shouldn&rsquo;t work for free.&rdquo;
            </p>
            <div className="w-px h-20 bg-gradient-to-b from-white/40 to-transparent mx-auto mb-10" />
            <ul className="text-left space-y-4 text-white/70 font-inter text-sm">
              <li className="flex gap-3 items-start">
                <span className="text-[#F5E68E] mt-0.5">&#10003;</span>
                <span>Collaborations with beauty &amp; skincare brands that actually fit.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#F5E68E] mt-0.5">&#10003;</span>
                <span>Briefs matched to your niche, audience, and tone.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#F5E68E] mt-0.5">&#10003;</span>
                <span>No application fee. Limited founding slots.</span>
              </li>
            </ul>
          </motion.div>

          <div className="absolute bottom-10 right-10 text-white/20 text-[10px] font-montserrat font-bold tracking-[0.3em] uppercase">
            Origo Media Group
          </div>
        </div>
      </section>
    </main>
  );
}
