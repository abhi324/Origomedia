"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "Register",
    desc: "Submit your handle, niche, and a few content samples. Takes about 3 minutes.",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  },
  {
    step: "Get vetted",
    desc: "We review fit, engagement, and tone. If you&rsquo;re right for our brands, you&rsquo;re in.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    step: "Access campaigns",
    desc: "Get matched to brand briefs that actually fit your niche, audience, and tone of voice.",
    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
  },
];

export default function JourneySection() {
  return (
    <section id="how-it-works" className="w-full py-16 sm:py-24 md:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-24 flex flex-col items-center justify-center text-center"
        >
          <span className="text-[#4A6357] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-5 block">
            How it works
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-cormorant font-bold text-gray-900 leading-[1.05] max-w-3xl">
            Three steps from <br className="hidden sm:block" />
            <span className="italic font-normal">application to campaign.</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-16 md:gap-20 relative">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col items-center"
              >
                <div className="relative mb-10">
                  <div className="absolute inset-0 bg-[#4A6357]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 grain-bg rounded-[1.75rem] flex items-center justify-center shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-200/60 z-10 group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_56px_-16px_rgba(74,99,87,0.15)] transition-all duration-700">
                    <svg className="w-9 h-9 text-[#4A6357]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.4">
                      <path d={item.icon} />
                    </svg>
                    <div className="absolute -top-3 -right-3 w-9 h-9 bg-[#4A6357] text-white font-montserrat font-bold text-xs flex items-center justify-center rounded-xl border-4 border-[#FCF9F5]">
                      0{i + 1}
                    </div>
                  </div>
                </div>

                <h4 className="text-2xl sm:text-3xl font-cormorant text-gray-900 mb-4">{item.step}</h4>
                <p
                  className="text-gray-500 font-inter text-sm sm:text-base leading-relaxed max-w-[280px]"
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
