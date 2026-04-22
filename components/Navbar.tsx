"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 overflow-hidden rounded-full flex items-center justify-center">
            <img src="/logo-v2.png" alt="ORIGO" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight font-montserrat">ORIGO</span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-10">
          {["Creators", "About", "FAQ", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors font-semibold uppercase tracking-wider"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-6">
          <Link
            href="/join"
            className="px-6 py-2.5 bg-[#5F7F6F] text-white rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-[#4A6357] transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#5F7F6F]/20"
          >
            Join as Influencer
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
