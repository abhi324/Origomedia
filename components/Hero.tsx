"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const heroImages = [
  "/hero-studio.png",
  "/images/hero-slide-1.png",
  "/images/hero-slide-2.png",
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="w-full pt-20 bg-transparent relative">
      {/* Hero Banner — Ultra High Fidelity Dynamic View */}
      <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={heroImages[currentImageIndex]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            alt="Creator Studio"
            className="w-full h-full object-cover object-center absolute inset-0"
          />
        </AnimatePresence>
        
        {/* Multilayered Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />

        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 lg:px-32 max-w-4xl z-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl md:text-8xl font-cormorant font-bold text-white leading-[0.95] mb-8">
              Where Growth <br /> <span className="italic font-normal">Begins.</span>
            </h1>

            <div className="flex items-center gap-6 mb-10">
              <div className="w-12 h-px bg-white/40" />
              <h3 className="text-xl md:text-2xl text-white font-cormorant font-medium opacity-90 italic">
                Growth isn’t random—it starts with the right origin.
              </h3>
            </div>

            <p className="text-sm md:text-base text-white/70 font-montserrat font-medium max-w-md leading-relaxed uppercase tracking-widest">
              Meet your growth with us
            </p>
          </motion.div>
        </div>
      </div>

      {/* Overlapping Transition Logo — Massive, Tilted, Submerged Watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        whileInView={{ opacity: 0.3, scale: 1, rotate: -12 }}
        viewport={{ once: true }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-1/2 -translate-x-1/2 -bottom-[450px] z-[100] pointer-events-none"
      >
        <div className="w-[500px] h-[500px] md:w-[900px] md:h-[900px]">
          <img 
            src="/images/new_logo.png" 
            alt="Brand Logo Decoration" 
            className="w-full h-full object-contain filter grayscale contrast-0 brightness-0 opacity-50" 
          />
        </div>
      </motion.div>

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
