"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-gray-100/50"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-11 h-11 overflow-hidden rounded-2xl flex items-center justify-center bg-white shadow-sm group-hover:shadow-md transition-all">
            <img src="/logo-v2.png" alt="ORIGO" className="w-full h-full object-contain p-1" />
          </div>
          <span className="font-playfair font-bold text-2xl text-gray-900 tracking-tight">ORIGO</span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-12">
          {["Creators", "About", "FAQ", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[11px] text-gray-400 hover:text-[#4A6357] transition-all font-inter font-black uppercase tracking-[0.3em]"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-8">
          <Link
            href="/join"
            className="px-8 py-3 bg-[#4A6357] text-white rounded-2xl text-[11px] font-inter font-black uppercase tracking-[0.2em] hover:bg-[#3D5449] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#4A6357]/20"
          >
            Join as Influencer
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
