"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FCF9F5] flex items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-lg"
      >
        <span className="text-[#4A6357] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-6 block">
          404
        </span>
        <h1 className="text-4xl sm:text-6xl font-cormorant font-bold text-gray-900 mb-6 leading-tight">
          Page <span className="italic font-normal text-[#4A6357]">not found.</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-500 font-inter mb-10 leading-relaxed">
          The page you&rsquo;re looking for doesn&rsquo;t exist&mdash;or has moved.
        </p>
        <Link
          href="/"
          className="inline-block px-10 py-4 bg-[#3D5449] text-white rounded-xl text-[11px] uppercase font-montserrat font-bold tracking-widest hover:bg-[#2D3F37] transition-all"
        >
          Back to home
        </Link>
      </motion.div>
    </main>
  );
}
