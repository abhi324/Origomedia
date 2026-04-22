"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const threshold = document.documentElement.scrollHeight - window.innerHeight - 1400;
    if (latest > threshold) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isHidden ? -100 : 0,
          opacity: isHidden ? 0 : 1
        }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-3xl border-b border-gray-100/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink">
            <img
              src="/logo-v2.png"
              alt="ORIGO"
              className="w-8 h-8 sm:w-14 sm:h-14 object-contain group-hover:scale-105 transition-transform duration-500"
            />
            <span className="font-cormorant text-lg sm:text-2xl text-gray-900 tracking-[0.2em] sm:tracking-[0.4em] uppercase pl-[0.2em] sm:pl-[0.4em] truncate">ORIGO</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
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

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/join"
              className="px-6 py-3 bg-[#4A6357] text-white rounded-xl text-[11px] uppercase font-montserrat font-bold tracking-widest hover:bg-[#3D5449] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#4A6357]/20 border border-white/10"
            >
              Join as Creator
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 w-full"
            >
              <div className="px-4 py-8 flex flex-col gap-6 items-center text-center">
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
                <Link
                  href="/join"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 px-10 py-4 bg-[#4A6357] text-white rounded-xl text-[11px] uppercase font-montserrat font-bold tracking-widest text-center hover:bg-[#3D5449] transition-all shadow-lg shadow-[#4A6357]/20 w-full max-w-[280px]"
                >
                  Join as Creator
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
