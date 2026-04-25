"use client";

import { motion } from "framer-motion";

export default function Solution() {
  return (
    <section id="solution" className="w-full py-20 sm:py-28 md:py-36 bg-[#3D5449] text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#F5E68E]/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#B794C0]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-5 sm:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-[#F5E68E] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-6 block">
            The Solution
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-cormorant font-bold leading-[1.05] mb-8 sm:mb-12">
            We don&rsquo;t chase volume.{" "}
            <br className="hidden sm:block" />
            <span className="italic font-normal text-[#F5E68E]">We curate fit.</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/70 font-inter font-light max-w-2xl mx-auto leading-relaxed">
            Origo connects brands with the right nano and micro creators&mdash;by relevance, audience, and tone&mdash;then runs the campaign end to end.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 mt-14 sm:mt-20 max-w-3xl mx-auto">
            {[
              { stat: "Nano + Micro", label: "Audience trust beats reach" },
              { stat: "Handpicked", label: "Matched on niche and tone" },
              { stat: "End to end", label: "Briefed, reviewed, delivered" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="border-t border-white/15 pt-6 text-left"
              >
                <p className="text-2xl sm:text-3xl font-cormorant text-white mb-2">{item.stat}</p>
                <p className="text-[11px] sm:text-xs uppercase font-montserrat font-semibold tracking-[0.2em] text-white/50">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
