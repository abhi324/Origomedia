"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Detect if we are near the bottom of the page (where FinalCTA is)
    // We'll hide it when the scroll is deep into the page.
    const threshold = document.documentElement.scrollHeight - window.innerHeight - 800;
    if (latest > threshold) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isHidden ? -100 : 0, 
        opacity: isHidden ? 0 : 1 
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-3xl border-b border-gray-100/50"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-11 h-11 overflow-hidden rounded-2xl flex items-center justify-center bg-white shadow-sm group-hover:shadow-md transition-all border border-gray-50">
            <img src="/logo-v2.png" alt="ORIGO" className="w-full h-full object-contain p-1" />
          </div>
          <span className="font-playfair font-bold text-2xl text-gray-900 tracking-tight">ORIGO</span>
        </Link>

        {/* Center Nav Links — Formal Serif Aesthetic */}
        <div className="hidden md:flex items-center gap-10">
          {["Creators", "About", "FAQ", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-gray-600 hover:text-[#4A6357] transition-all font-playfair italic font-medium tracking-wide"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right CTA — Formal Serif Button */}
        <div className="flex items-center gap-8">
          <Link
            href="/join"
            className="px-8 py-3 bg-[#4A6357] text-white rounded-xl text-sm font-playfair italic font-bold hover:bg-[#3D5449] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#4A6357]/20 border border-white/10"
          >
            Join as Influencer
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
