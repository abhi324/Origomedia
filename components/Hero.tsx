"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} id="hero" className="relative w-full min-h-[90vh] pt-20 bg-[#FCF9F5] overflow-hidden">
      {/* Hero Banner — Parallax Background */}
      <div className="relative w-full h-[600px] md:h-[750px] overflow-hidden rounded-b-[4rem] md:rounded-b-[6rem] shadow-2xl">
        <motion.div style={{ y: imgY }} className="absolute inset-0 w-full h-[120%]">
          <img
            src="/hero-studio.png"
            alt="Creator Studio"
            className="w-full h-full object-cover object-center"
          />
          {/* Advanced multi-layer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FCF9F5]/30" />
        </motion.div>

        {/* Text Content */}
        <motion.div 
          style={{ y: textY, opacity }}
          className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 z-10"
        >
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-px w-12 bg-white/40" />
              <span className="text-white/60 text-[10px] uppercase font-black tracking-[0.4em]">Premiere Agency</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-[9rem] font-montserrat font-bold text-white leading-[0.85] mb-12 -ml-1 md:-ml-2 tracking-tighter"
            >
              Where <br /> Growth <br /> <span className="text-white/40 italic">Begins.</span>
            </motion.h1>
            
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-3xl text-white font-medium mb-8 tracking-tight max-w-xl"
            >
              Growth isn’t random—it starts with the right origin.
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm md:text-lg text-white/70 font-medium max-w-md leading-relaxed"
            >
              Beauty & Skincare Creator Agency, powered by micro & nano creators.
            </motion.p>
          </div>
        </motion.div>

        {/* Animated Instagram Badge */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-12 md:right-24 bottom-24 flex flex-col items-center gap-6 bg-white/10 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/20 shadow-2xl hidden lg:flex hover:bg-white/20 transition-all cursor-pointer group"
        >
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-lg" 
            style={{
              background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)"
            }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </motion.div>
          <div className="text-center">
            <p className="text-white/90 text-[10px] font-black tracking-[0.3em] uppercase mb-1">Authenticated</p>
            <p className="text-white/40 text-[9px] font-bold tracking-widest uppercase">Via Instagram Graph API</p>
          </div>
        </motion.div>

        {/* Bottom Banner Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-[#F5E68E]" />
          <div className="flex-1 bg-[#E09486]" />
          <div className="flex-1 bg-[#B794C0]" />
          <div className="flex-1 bg-[#8FBCC4]" />
        </div>
      </div>
    </section>
  );
}
