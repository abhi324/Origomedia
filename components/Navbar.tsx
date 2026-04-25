"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "mailto:origomedia.co@gmail.com" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("founding");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        pointerEvents: hidden ? "none" : "auto",
        backgroundColor: "#FAFAF8",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-300/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <img
            src="/logo-v2.png"
            alt="ORIGO"
            className="w-9 h-9 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <span className="font-montserrat font-medium text-base sm:text-xl text-gray-900 tracking-[0.25em] sm:tracking-[0.35em] uppercase pl-[0.25em] sm:pl-[0.35em]">
            ORIGO
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] uppercase text-gray-500 hover:text-[#4A6357] transition-all font-montserrat font-semibold tracking-[0.2em]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/join"
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-[#3D5449] text-white rounded-lg text-[10px] sm:text-[11px] uppercase font-montserrat font-bold tracking-widest hover:bg-[#2D3F37] transition-all whitespace-nowrap"
          >
            Join as Creator
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-gray-300/40"
            style={{ backgroundColor: "#FAFAF8", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
          >
            <div className="px-6 py-6 flex flex-col gap-4 items-center text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm uppercase text-gray-600 hover:text-[#4A6357] transition-colors font-montserrat font-semibold tracking-[0.2em] w-full py-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

