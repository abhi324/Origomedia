"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[110vh] overflow-hidden flex items-center justify-center bg-[#FCF9F5]"
    >
      {/* Cinematic Studio Background with subtle parallax/zoom */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/images/origo_hero_studio.png" 
          alt="Studio Photography" 
          className="w-full h-full object-cover brightness-[0.95]"
        />
        {/* Soft paper-like gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FCF9F5]" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity }}
        >
          <h4 className="text-[#4A6357] font-inter font-black text-[10px] tracking-[0.8em] uppercase mb-10">The Premier Beauty Syndicate</h4>
          
          <h1 className="text-7xl md:text-[10rem] font-playfair font-bold text-gray-900 leading-[0.85] tracking-tighter mb-12">
            Elevate Your <br /> <span className="italic font-normal serif">Influence.</span>
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-16">
             <div className="flex flex-col items-center gap-4">
                <div className="w-px h-16 bg-gray-200" />
                <p className="text-gray-400 text-[10px] font-inter font-black tracking-[0.4em] uppercase">Beauty Focused</p>
             </div>
             
             <div className="flex flex-col items-center gap-4">
                <div className="w-px h-16 bg-gray-200" />
                <p className="text-gray-400 text-[10px] font-inter font-black tracking-[0.4em] uppercase">Skincare Strategy</p>
             </div>

             <div className="flex flex-col items-center gap-4">
                <div className="w-px h-16 bg-gray-200" />
                <p className="text-gray-400 text-[10px] font-inter font-black tracking-[0.4em] uppercase">Global Reach</p>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="text-[9px] font-inter font-black uppercase tracking-[0.5em] text-gray-400">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-300 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
