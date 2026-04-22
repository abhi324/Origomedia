"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function MidPageBanner() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={containerRef} className="relative w-full h-[600px] overflow-hidden my-20">
      {/* Parallax Image Background */}
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%]">
        <img
          src="/images/skincare_strategy.png"
          alt="Premium Skincare Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </motion.div>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/80 backdrop-blur-xl p-12 md:p-20 rounded-[4rem] text-center max-w-4xl shadow-2xl border border-white/20"
        >
          <h2 className="text-4xl md:text-6xl font-montserrat font-bold text-gray-900 mb-8 leading-tight">
            Curating Excellence in <br /> Beauty Creation.
          </h2>
          <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
            We don't just manage influencers—we build lasting brands. Join a community that values craft over clout.
          </p>
          <button className="px-10 py-4 bg-[#5F7F6F] text-white rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#4A6357] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#5F7F6F]/20">
            Learn More About Our Philosophy
          </button>
        </motion.div>
      </div>
    </section>
  );
}
