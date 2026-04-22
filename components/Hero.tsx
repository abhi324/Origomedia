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
              Beauty & Skincare Creator Agency, <br/>
              powered by micro & nano creators.
            </p>
          </motion.div>
        </div>

        {/* Instagram Badge — Glassmorphism Refinement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="absolute right-12 md:right-32 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 bg-white/10 backdrop-blur-2xl p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20 hidden xl:flex group"
        >
          <div className="relative w-20 h-20 rounded-3xl flex items-center justify-center overflow-hidden shadow-inner transform group-hover:scale-110 transition-transform duration-500" style={{
            background: "linear-gradient(45deg, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)"
          }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10 drop-shadow-lg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <div className="text-center">
             <p className="text-white text-[10px] font-inter font-black tracking-[0.3em] uppercase opacity-40 mb-1">Affiliated</p>
             <p className="text-white text-sm font-inter font-bold">Powered by Instagram</p>
          </div>
        </motion.div>

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
