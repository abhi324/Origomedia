"use client";

import { motion } from "framer-motion";

const pairs = [
  {
    side: "Brands",
    line: "can&rsquo;t find the right creators.",
    detail: "Generic outreach, mismatched fits, and content that never lands.",
  },
  {
    side: "Creators",
    line: "can&rsquo;t find the right brands.",
    detail: "Cold pitches, ghosted DMs, and unpaid “collabs.”",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="w-full py-20 sm:py-28 md:py-36 bg-transparent">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14 sm:mb-20"
        >
          <span className="text-[#4A6357] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-4 block">
            The Problem
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-cormorant font-bold text-gray-900 leading-[1.05] max-w-3xl">
            Both sides of the table are <span className="italic font-normal">talking past each other.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {pairs.map((p, i) => (
            <motion.div
              key={p.side}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-gray-200 pt-8 sm:pt-10"
            >
              <span className="text-[10px] font-montserrat font-bold tracking-[0.3em] uppercase text-gray-400 mb-3 block">
                0{i + 1} &middot; {p.side}
              </span>
              <p
                className="text-2xl sm:text-3xl md:text-4xl font-cormorant text-gray-900 leading-snug mb-4"
                dangerouslySetInnerHTML={{ __html: `${p.side} ${p.line}` }}
              />
              <p
                className="text-sm sm:text-base text-gray-500 font-inter leading-relaxed max-w-md"
                dangerouslySetInnerHTML={{ __html: p.detail }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
