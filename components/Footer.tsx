"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#3D5449] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2">
            <img src="/logo-v2.png" alt="ORIGO" className="w-full h-full object-contain" />
          </div>
          <span className="font-montserrat font-bold text-3xl tracking-tighter">ORIGO</span>
        </motion.div>

        {/* Links Grid */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-12">
          {["Contact", "FAQ", "Privacy Policy", "Terms of Service", "Instagram"].map((link) => (
            <Link 
              key={link} 
              href={`/${link.toLowerCase().replace(/ /g, '-')}`}
              className="text-white/60 hover:text-white transition-colors text-sm font-semibold uppercase tracking-widest"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Contact Email */}
        <div className="mb-12 text-center">
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-black mb-2">Get in touch</p>
          <a href="mailto:hello@origomedia.com" className="text-xl md:text-2xl font-montserrat font-bold hover:text-[#B794C0] transition-colors">
            hello@origomedia.com
          </a>
        </div>

        {/* Bottom Strip Decor */}
        <div className="w-full max-w-sm h-1 flex rounded-full overflow-hidden mb-8">
          <div className="flex-1 bg-[#F5E68E]" />
          <div className="flex-1 bg-[#E09486]" />
          <div className="flex-1 bg-[#B794C0]" />
          <div className="flex-1 bg-[#8FBCC4]" />
        </div>

        {/* Copyright */}
        <div className="text-white/30 text-xs font-medium">
          © {currentYear} ORIGO MEDIA GROUP. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
