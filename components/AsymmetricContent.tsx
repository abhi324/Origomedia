"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const specializations = [
  { name: "SKINCARE", image: "/images/skincare_growth.png", color: "#F5EFE8" },
  { name: "DERMACOSMETICS", image: "/images/skincare_strategy.png", color: "#EEF0F5" },
  { name: "PERFUMES", image: "/images/banner_1.png", color: "#F5F0EE" },
  { name: "MAKEUP", image: "/images/skincare_work.png", color: "#F0EEF5" },
];

export default function AsymmetricContent() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  return (
    <section ref={containerRef} className="w-full bg-[#FCF9F5] py-40 relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-24">
        
        {/* Left Column — Sticky Premium Image */}
        <div className="hidden md:block md:w-2/5">
          <div className="sticky top-32">
            <motion.div 
              style={{ rotate }}
              className="rounded-[5rem] overflow-hidden aspect-[4/5] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-white border-8 border-white group"
            >
              <img 
                src="/images/skincare_growth.png" 
                alt="Brand Aesthetic" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
              />
            </motion.div>
            <div className="mt-16 pl-8 border-l-2 border-[#5F7F6F]/20">
              <h4 className="font-montserrat font-bold text-[#5F7F6F] text-xs tracking-[0.5em] uppercase mb-8">The Origo Philosophy</h4>
              <p className="text-gray-500 text-lg leading-relaxed max-w-sm font-medium italic">
                "We believe growth isn't just about numbers—it's about the depth of the story you tell."
              </p>
            </div>
          </div>
        </div>

        {/* Right Column — Narrative Content */}
        <div className="w-full md:w-3/5 flex flex-col gap-48">
          
          {/* Specialization Grid */}
          <div id="creators">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="mb-20"
            >
              <span className="text-[#5F7F6F] font-black text-[10px] tracking-[0.4em] uppercase mb-6 block">Categories</span>
              <h2 className="text-5xl md:text-8xl font-montserrat font-bold text-gray-900 leading-[0.9] tracking-tighter">
                Excel in Your <br/> <span className="text-[#5F7F6F]">Specialization.</span>
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {specializations.map((spec, i) => (
                <motion.div
                  key={spec.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  whileHover={{ y: -12 }}
                  className="group cursor-pointer rounded-[3rem] overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700"
                >
                  <div className="aspect-[1/1] overflow-hidden" style={{ backgroundColor: spec.color }}>
                    <img
                      src={spec.image}
                      alt={spec.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0"
                    />
                  </div>
                  <div className="py-8 text-center bg-white">
                    <span className="text-[11px] font-black tracking-[0.4em] text-gray-400 group-hover:text-[#5F7F6F] transition-colors uppercase">
                      {spec.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Partner Program */}
          <div id="about" className="bg-white p-12 md:p-24 rounded-[5rem] border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5F7F6F]/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-[#5F7F6F]/10 transition-colors duration-1000" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-montserrat font-bold text-gray-900 mb-12 leading-[1.1] tracking-tight">
                Founding Creator <br/> Partner Program.
              </h2>
              <p className="text-gray-500 text-xl mb-16 leading-relaxed max-w-xl font-medium">
                Become part of our exclusive foundation. Early creators receive premium placements and first-look opportunities with global beauty conglomerates.
              </p>
              
              <div className="grid grid-cols-1 gap-12">
                {[
                  { title: "Direct Access", desc: "Skip the queue and go straight to brand selection.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                  { title: "Guaranteed Payouts", desc: "No more chasing invoices. Transparent, timely payments.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                  { title: "Early Growth", desc: "Scale your audience with agency-backed collaborations.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }
                ].map((point, i) => (
                  <motion.div 
                    key={point.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-8 group/item"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#5F7F6F]/5 flex items-center justify-center shrink-0 group-hover/item:bg-[#5F7F6F] group-hover/item:text-white transition-all duration-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d={point.icon} />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{point.title}</h4>
                      <p className="text-gray-500 text-base font-medium leading-relaxed">{point.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
