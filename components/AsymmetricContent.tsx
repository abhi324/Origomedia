"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const specializations = [
  { name: "SKINCARE", image: "/images/skincare_niche.png", accent: "#F5E68E" },
  { name: "MAKEUP", image: "/images/makeup_niche.png", accent: "#8FBCC4" },
];

export default function AsymmetricContent() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section ref={containerRef} className="w-full bg-transparent py-40">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col lg:flex-row gap-16 lg:gap-32">

        {/* Left Column — Sticky Brand Content */}
        <div className="w-full lg:w-[350px] shrink-0">
          <div className="lg:sticky lg:top-32">
            <div className="relative rounded-[4rem] overflow-hidden aspect-[4/5] shadow-[0_48px_96px_-32px_rgba(0,0,0,0.2)]">
              <motion.img
                style={{ y }}
                src="/images/skincare.png"
                alt="Brand Aesthetic"
                className="w-full h-full object-cover grayscale-[0.2]"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[4rem]" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 md:mt-16 pl-6 border-l-2 border-[#4A6357]/10"
            >
              <h4 className="font-inter font-black text-[#4A6357] text-[10px] tracking-[0.4em] uppercase mb-4">The Origo Origin</h4>
              <p className="text-gray-500 text-base leading-relaxed max-w-[280px] font-medium">
                We bridge the gap between niche expertise and commercial success, curating the next generation of beauty voices.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Column — Main Content */}
        <div className="flex-1 w-full flex flex-col gap-48">

          {/* 1. Specialization Grid */}
          <div id="creators">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <h2 className="text-5xl md:text-7xl font-playfair font-bold text-gray-900 leading-[0.95]">
                Excel in Your <br /> <span className="italic font-normal">Specialization.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {specializations.map((spec, i) => (
                <motion.div
                  key={spec.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative cursor-pointer rounded-[3rem] overflow-hidden bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_96px_-32px_rgba(0,0,0,0.15)] transition-all duration-700"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-gray-50">
                    <img
                      src={spec.image}
                      alt={spec.name}
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                    />
                    {/* Color Accent Overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-t from-black transition-opacity duration-700" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-white via-white/95 to-transparent pt-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-[1px] bg-gray-200 group-hover:w-10 group-hover:bg-[#4A6357] transition-all duration-700" />
                      <span className="text-[9px] md:text-[10px] font-inter font-black tracking-[0.2em] md:tracking-[0.4em] text-gray-400 group-hover:text-[#4A6357] uppercase transition-colors duration-700">
                        {spec.name}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-playfair font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">Explore Niche</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 2. Founding Creator Partner Program */}
          <div id="about" className="relative group">
            {/* Background Blob Decor */}
            <div className="absolute -inset-10 bg-[#4A6357]/5 blur-[120px] rounded-[5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative bg-white p-12 md:p-24 rounded-[4rem] border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] group-hover:shadow-[0_64px_128px_-32px_rgba(0,0,0,0.08)] transition-all duration-1000">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-[#4A6357] text-[10px] font-inter font-black tracking-[0.5em] uppercase mb-8 block">Exclusive Membership</span>
                <h2 className="text-4xl md:text-6xl font-playfair font-bold text-gray-900 mb-10 leading-[1.1]">
                  Founding Creator <br /> <span className="italic font-normal">Partner Program.</span>
                </h2>
                <p className="text-gray-500 text-xl mb-16 leading-relaxed max-w-2xl font-medium font-inter">
                  Become part of our exclusive foundation. Early creators receive premium placements and first-look opportunities with global beauty conglomerates.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 gap-12">
                {[
                  { title: "Direct Access", desc: "Skip the queue and go straight to brand selection with high-priority status." },
                  { title: "Guaranteed Payouts", desc: "No more chasing invoices. Transparent, automated, and timely payments for every campaign." },
                  { title: "Early Growth", desc: "Scale your audience with agency-backed collaborations and cross-brand networking." }
                ].map((point, i) => (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                    className="flex items-start gap-8 group/item"
                  >
                    <div className="w-12 h-12 mt-1 rounded-2xl bg-[#4A6357]/5 group-hover/item:bg-[#4A6357] flex items-center justify-center shrink-0 transition-colors duration-500">
                      <svg className="w-5 h-5 text-[#4A6357] group-hover/item:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="pt-1">
                      <h4 className="text-xl font-playfair font-bold text-gray-900 mb-2">{point.title}</h4>
                      <p className="text-gray-500 text-base font-medium font-inter leading-relaxed max-w-lg">{point.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
