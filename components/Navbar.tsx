"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Detect if we are approaching the FinalCTA section earlier
    // Increasing the offset to 1400px from the bottom to trigger "more early"
    const threshold = document.documentElement.scrollHeight - window.innerHeight - 1400;
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
      // Increased duration to 1.5s for a "slow" elegant fade
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-3xl border-b border-gray-100/50"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-11 h-11 overflow-hidden rounded-2xl flex items-center justify-center bg-white shadow-sm group-hover:shadow-md transition-all border border-gray-50">
            <img src="/logo-v2.png" alt="ORIGO" className="w-full h-full object-contain p-1" />
          </div>
          <span className="font-cormorant text-2xl text-gray-900 tracking-[0.4em] uppercase pl-[0.4em]">ORIGO</span>
        </Link>

        {/* Center Nav Links — Refined Modern Aesthetic */}
        <div className="hidden md:flex items-center gap-10">
          {["Creators", "About", "FAQ", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[11px] uppercase text-gray-500 hover:text-[#4A6357] transition-all font-montserrat font-semibold tracking-[0.2em]"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right CTA — Clean Modern Button */}
        <div className="flex items-center gap-8">
          <Link
            href="/join"
            className="px-8 py-3 bg-[#4A6357] text-white rounded-xl text-[11px] uppercase font-montserrat font-bold tracking-widest hover:bg-[#3D5449] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#4A6357]/20 border border-white/10"
          >
            Join as Influencer
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
