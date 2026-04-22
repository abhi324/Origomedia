"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="hero" className="w-full pt-20 bg-transparent">
      {/* Hero Banner — Ultra High Fidelity Studio View */}
      <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden">
        <img
          src="/hero-studio.png"
          alt="Creator Studio"
          className="w-full h-full object-cover object-center scale-105 animate-subtle-zoom"
        />
        {/* Multilayered Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 lg:px-32 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl md:text-8xl font-playfair font-bold text-white leading-[0.95] mb-8">
              Where Growth <br /> <span className="italic font-normal">Begins.</span>
            </h1>

            <div className="flex items-center gap-6 mb-10">
              <div className="w-12 h-px bg-white/40" />
              <h3 className="text-xl md:text-2xl text-white font-inter font-light tracking-tight opacity-90">
                Growth isn’t random—it starts with the right origin.
              </h3>
            </div>

            <p className="text-sm md:text-base text-white/70 font-inter font-medium max-w-md leading-relaxed uppercase tracking-widest">
              Meet your growth with us
            </p>
          </motion.div>
        </div>


        {/* Floating Brand Elements Decor */}
        <div className="absolute bottom-0 left-0 right-0 h-2.5 flex shadow-2xl">
          <div className="flex-1 bg-[#F5E68E]" />
          <div className="flex-1 bg-[#E09486]" />
          <div className="flex-1 bg-[#B794C0]" />
          <div className="flex-1 bg-[#8FBCC4]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 20s infinite alternate ease-in-out;
        }
      `}</style>
    </section>
  );
}
