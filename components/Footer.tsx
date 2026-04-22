"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#3D5449] text-white py-24 px-6 relative overflow-hidden">
      {/* Decorative Brand Accent Lines */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-[#F5E68E]" />
        <div className="flex-1 bg-[#E09486]" />
        <div className="flex-1 bg-[#B794C0]" />
        <div className="flex-1 bg-[#8FBCC4]" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">

        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center p-3 shadow-2xl">
            <img src="/logo-v2.png" alt="ORIGO" className="w-full h-full object-contain" />
          </div>
          <span className="font-instrument text-4xl tracking-tighter">ORIGO</span>
        </motion.div>

        {/* Links Grid — Refined Modern Aesthetic */}
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 mb-20">
          {["Contact", "FAQ", "Privacy Policy", "Terms of Service", "Instagram"].map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase().replace(/ /g, '-')}`}
              className="text-white/40 hover:text-white transition-all text-[11px] uppercase font-montserrat font-semibold tracking-[0.2em]"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Contact Email Section */}
        <div className="mb-20 text-center group cursor-pointer">
          <p className="text-[#8FBCC4] text-[10px] uppercase tracking-[0.6em] font-montserrat font-black mb-4">Inquiries</p>
          <a
            href="mailto:origomedia.co@gmail.com"
            className="text-2xl md:text-5xl font-instrument hover:text-[#F5E68E] transition-all duration-500 relative inline-block"
          >
            origomedia.co@gmail.com
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          </a>
        </div>

        {/* Bottom Metadata */}
        <div className="flex flex-col md:flex-row items-center gap-8 text-white/20 text-[10px] uppercase font-montserrat font-medium tracking-[0.15em] pt-12 border-t border-white/5 w-full justify-between">
          <div>© {currentYear} ORIGO MEDIA GROUP. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-8">
            <span className="hover:text-white transition-colors cursor-pointer">Studio Paris</span>
            <span className="hover:text-white transition-colors cursor-pointer">Studio London</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
