"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const benefits = [
  {
    title: "Direct access",
    desc: "First look at incoming brand briefs, before they go to the wider network.",
  },
  {
    title: "Curated collaborations",
    desc: "Matched to brands that actually fit your voice—not generic outreach at volume.",
  },
  {
    title: "Early opportunities",
    desc: "Featured slots, repeat campaigns, and intros to brands building their first creator roster.",
  },
];

export default function FoundingProgram() {
  return (
    <section id="founding" className="w-full py-20 sm:py-28 md:py-36 bg-transparent">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grain-bg rounded-[2rem] sm:rounded-[2.5rem] border border-gray-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] p-6 sm:p-12 md:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#4A6357] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-4 block">
              Founding Creator Program
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-cormorant font-bold text-gray-900 leading-[1.05] mb-6">
              Be one of the first <br />
              <span className="italic font-normal">creators on the roster.</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-500 font-inter leading-relaxed mb-8 max-w-md">
              We&rsquo;re building the first cohort of nano and micro creators we&rsquo;ll champion to brands. Limited slots, handpicked fits.
            </p>
            <Link
              href="/join"
              className="block w-full text-center sm:inline-block sm:w-auto px-8 py-4 bg-[#3D5449] text-white rounded-xl text-[11px] uppercase font-montserrat font-bold tracking-widest hover:bg-[#2D3F37] transition-all"
            >
              Apply as a Founding Creator
            </Link>
          </motion.div>

          <div className="flex flex-col gap-8 sm:gap-10">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-5 sm:gap-6"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#4A6357]/8 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-[#4A6357]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-cormorant font-bold text-gray-900 mb-1.5">
                    {b.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-500 font-inter leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
