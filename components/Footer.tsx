"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Join", href: "/join" },
    { label: "Contact", href: "mailto:origomedia.co@gmail.com" },
  ];

  return (
    <footer id="contact" className="w-full bg-[#3D5449] text-white py-14 sm:py-20 px-5 sm:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-[#F5E68E]" />
        <div className="flex-1 bg-[#E09486]" />
        <div className="flex-1 bg-[#B794C0]" />
        <div className="flex-1 bg-[#8FBCC4]" />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="mb-12 sm:mb-16 flex flex-col items-center gap-5">
          <img
            src="/logo-v2.png"
            alt="ORIGO"
            className="w-20 h-20 sm:w-28 sm:h-28 object-contain mix-blend-multiply brightness-[1.1]"
          />
          <span className="font-montserrat font-medium text-3xl sm:text-4xl tracking-[0.3em] sm:tracking-[0.4em] uppercase pl-[0.3em] sm:pl-[0.4em]">
            ORIGO
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-10 sm:gap-x-14 gap-y-4 mb-14 sm:mb-16">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white/50 hover:text-white transition-all text-[11px] uppercase font-montserrat font-semibold tracking-[0.2em]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mb-14 sm:mb-16 text-center group">
          <p className="text-[#8FBCC4] text-[10px] uppercase tracking-[0.4em] font-montserrat font-bold mb-3">
            Get in touch
          </p>
          <a
            href="mailto:origomedia.co@gmail.com"
            className="text-lg sm:text-2xl md:text-3xl font-cormorant hover:text-[#F5E68E] transition-all duration-500 break-all sm:break-normal"
          >
            origomedia.co@gmail.com
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 text-white/30 text-[10px] uppercase font-montserrat font-medium tracking-[0.15em] pt-8 sm:pt-10 border-t border-white/10 w-full justify-between text-center">
          <div>© {currentYear} Origo Media Group</div>
          <div className="flex gap-6 items-center">
            <a
              href="https://www.instagram.com/origomedia.co?igsh=MTI3czA0dmU5ZDBzNg=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Origo on Instagram"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span className="text-[10px] tracking-[0.2em]">@origomedia.co</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
