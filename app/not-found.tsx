"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FCF9F5] flex items-center justify-center p-6 text-center">
      <div className="max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#4A6357] text-[10px] font-inter font-black tracking-[0.5em] uppercase mb-8 block">Error 404</span>
          <h1 className="text-5xl sm:text-7xl font-cormorant font-bold text-gray-900 mb-8 leading-tight">
            The Origin was <br /> <span className="italic font-normal text-[#4A6357]">Not Found.</span>
          </h1>
          <p className="text-gray-500 font-inter text-sm mb-12 leading-relaxed">
            The path you are looking for does not exist in the current architecture. 
            Return to the nexus to continue your journey.
          </p>
          <Link
            href="/"
            className="inline-block px-12 py-5 bg-[#4A6357] text-white rounded-full text-[10px] font-inter font-black uppercase tracking-[0.3em] hover:bg-[#3D5449] transition-all shadow-xl shadow-[#4A6357]/20"
          >
            Return to Nexus
          </Link>
        </motion.div>
      </div>
      
      {/* Decorative Watermark */}
      <div className="fixed -bottom-32 -right-32 z-[-1] pointer-events-none opacity-10">
        <div className="w-[500px] h-[500px] sm:w-[800px] sm:h-[800px]">
          <img 
            src="/images/new_logo.png" 
            alt="" 
            className="w-full h-full object-contain filter grayscale contrast-0 brightness-0" 
          />
        </div>
      </div>
    </main>
  );
}
