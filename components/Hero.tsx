"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

const heroImages = [
  "/hero-studio.png",
  "/images/hero-slide-1.png",
  "/images/hero-slide-2.png",
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="w-full pt-16 sm:pt-20 bg-transparent relative">
      <div className="relative w-full h-[460px] sm:h-[560px] md:h-[680px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={heroImages[currentImageIndex]}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.04 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            alt="Beauty and skincare creator at work"
            className="w-full h-full object-cover object-center absolute inset-0"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent z-10" />

        <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 md:px-24 lg:px-32 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-cormorant font-bold text-white leading-[0.95] mb-5 sm:mb-7">
              Turn your content <br /> <span className="italic font-normal">into income.</span>
            </h1>

            <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="w-8 sm:w-12 h-px bg-white/40 shrink-0" />
              <h3 className="text-base sm:text-lg md:text-xl text-white font-cormorant font-medium opacity-90 italic leading-snug">
                Growth isn&apos;t random&mdash;it starts with the right origin.
              </h3>
            </div>

            <p className="text-[10px] sm:text-xs md:text-sm text-white/70 font-montserrat font-medium max-w-md leading-relaxed uppercase tracking-[0.25em] mb-8 sm:mb-10">
              Paid campaigns for nano &amp; micro creators.
            </p>

            <HeroCTACycler />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const ctaButtons = [
  {
    label: "Join as Creator",
    href: "/join",
    style: "bg-white text-[#3D5449] hover:bg-[#F5E68E]",
  },
  {
    label: "See how it works",
    href: "#how-it-works",
    style: "bg-transparent text-white border border-white/40 hover:bg-white/10",
  },
];

function HeroCTACycler() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((prev) => (prev + 1) % ctaButtons.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const btn = ctaButtons[active];

  return (
    <div className="flex flex-col gap-3">
      {/* Fixed-size frame — one button visible at a time, no layout shift */}
      <div className="relative h-[52px] w-full max-w-[260px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Link
              href={btn.href}
              className={`flex items-center justify-center w-full h-full rounded-xl text-[10px] sm:text-[11px] uppercase font-montserrat font-bold tracking-widest transition-all ${btn.style}`}
            >
              {btn.label}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators — click to jump to a button */}
      <div className="flex items-center gap-2">
        {ctaButtons.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Show ${ctaButtons[i].label}`}
            className={`rounded-full transition-all duration-300 ${i === active
                ? "w-4 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
