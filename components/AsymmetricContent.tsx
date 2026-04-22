"use client";

import { motion } from "framer-motion";

const specializations = [
  { name: "SKINCARE", image: "/images/skincare_growth.png" },
  { name: "DERMACOSMETICS", image: "/images/skincare_strategy.png" },
  { name: "PERFUMES", image: "/images/banner_1.png" },
  { name: "MAKEUP", image: "/images/skincare_work.png" },
];

export default function AsymmetricContent() {
  return (
    <section className="w-full bg-[#FCF9F5] py-32">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-20">
        
        {/* Left Column — Sticky Brand Context */}
        <div className="hidden md:block md:w-1/3">
          <div className="sticky top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[4rem] overflow-hidden aspect-[4/5] shadow-2xl"
            >
              <img 
                src="/images/skincare_growth.png" 
                alt="Brand Aesthetic" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="mt-12 pl-4">
              <h4 className="font-montserrat font-bold text-[#5F7F6F] text-xs tracking-[0.4em] uppercase mb-6">The Origo Origin</h4>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-medium">
                We bridge the gap between niche expertise and commercial success, curating the next generation of beauty voices.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column — Main Content */}
        <div className="w-full md:w-2/3 flex flex-col gap-40">
          
          {/* 1. Specialization Grid */}
          <div id="creators">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-montserrat font-bold text-gray-900 leading-tight">
                Excel in Your <br/> Specialization.
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-6">
              {specializations.map((spec, i) => (
                <motion.div
                  key={spec.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="group cursor-pointer rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-gray-50">
                    <img
                      src={spec.image}
                      alt={spec.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                  </div>
                  <div className="py-6 text-center">
                    <span className="text-[11px] font-black tracking-[0.3em] text-[#5F7F6F] uppercase">
                      {spec.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 2. Founding Creator Partner Program */}
          <div id="about" className="bg-white p-12 md:p-20 rounded-[4rem] border border-gray-100 shadow-sm">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-montserrat font-bold text-gray-900 mb-10 leading-tight"
            >
              Founding Creator <br/> Partner Program.
            </motion.h2>
            <p className="text-gray-500 text-lg mb-12 leading-relaxed max-w-xl font-medium">
              Become part of our exclusive foundation. Early creators receive premium placements and first-look opportunities with global beauty conglomerates.
            </p>
            <div className="grid grid-cols-1 gap-8">
              {[
                { title: "Direct Access", desc: "Skip the queue and go straight to brand selection." },
                { title: "Guaranteed Payouts", desc: "No more chasing invoices. Transparent, timely payments." },
                { title: "Early Growth", desc: "Scale your audience with agency-backed collaborations." }
              ].map((point, i) => (
                <motion.div 
                  key={point.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-6"
                >
                  <div className="w-8 h-8 mt-1 rounded-full bg-[#5F7F6F]/10 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#5F7F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{point.title}</h4>
                    <p className="text-gray-500 text-sm font-medium">{point.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
