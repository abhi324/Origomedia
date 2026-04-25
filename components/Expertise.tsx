"use client";

import { motion } from "framer-motion";

const niches = [
  {
    name: "Skincare",
    desc: "Routine-led creators who can break down ingredients without hype.",
    image: "/images/skincare_niche.png",
    accent: "#F5E68E",
  },
  {
    name: "Dermacosmetics",
    desc: "Science-literate voices for actives, sunscreens, and clinical brands.",
    image: "/images/skincare_strategy.png",
    accent: "#B794C0",
  },
  {
    name: "Makeup",
    desc: "Tutorial and trend creators who actually drive try-on intent.",
    image: "/images/makeup_niche.png",
    accent: "#8FBCC4",
  },
];

export default function Expertise() {
  return (
    <section id="expertise" className="w-full py-20 sm:py-28 md:py-36 bg-transparent">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 sm:mb-20 max-w-2xl"
        >
          <span className="text-[#4A6357] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-4 block">
            What we cover
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-cormorant font-bold text-gray-900 leading-[1.05]">
            Three niches. <br />
            <span className="italic font-normal">Done properly.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {niches.map((n, i) => (
            <motion.div
              key={n.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-[2rem] overflow-hidden grain-bg shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_36px_72px_-24px_rgba(0,0,0,0.12)] transition-all duration-700"
            >
              <div className="h-64 sm:h-72 md:aspect-[4/5] md:h-auto overflow-hidden bg-gray-50 relative">
                <img
                  src={n.image}
                  alt={`${n.name} creator content`}
                  className="w-full h-full object-cover grayscale-[0.25] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 mix-blend-multiply"
                  style={{ backgroundColor: n.accent }}
                />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-6 h-px transition-all duration-700 group-hover:w-10"
                    style={{ backgroundColor: n.accent }}
                  />
                  <span className="text-[10px] font-montserrat font-bold tracking-[0.3em] text-gray-400 uppercase">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-cormorant font-bold text-gray-900 mb-2">{n.name}</h3>
                <p className="text-sm text-gray-500 font-inter leading-relaxed">{n.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
