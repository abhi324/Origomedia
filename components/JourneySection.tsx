"use client";

import { motion } from "framer-motion";

const steps = [
  { 
    step: "Register", 
    desc: "Submit your portfolio and join our global creator network.", 
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
  },
  { 
    step: "Match", 
    desc: "Our AI-driven curators pair you with the perfect brand identity.", 
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
  },
  { 
    step: "Create", 
    desc: "Execute high-impact campaigns and monetize your craft.", 
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
  }
];

export default function JourneySection() {
  return (
    <section className="w-full py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-24 flex flex-col items-center justify-center text-center"
        >
          <div className="z-10">
            <span className="text-[#4A6357] text-xs font-montserrat font-black tracking-[0.5em] uppercase mb-6 block">The Onboarding</span>
            <h2 className="text-5xl md:text-7xl font-cormorant text-gray-900 leading-[1.1]">
              Start Your <br className="hidden md:block" /> Journey.
            </h2>
          </div>
        </motion.div>

        <div className="relative">
          {/* Subtle connecting line decoration */}
          <div className="absolute top-[60px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 relative">
            {steps.map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col items-center"
              >
                <div className="relative mb-12">
                   {/* Background aura */}
                   <div className="absolute inset-0 bg-[#4A6357]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   
                   <div className="relative w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-100 z-10 group-hover:-translate-y-2 group-hover:shadow-[0_32px_64px_-16px_rgba(74,99,87,0.15)] transition-all duration-700">
                      <svg className="w-10 h-10 text-[#4A6357]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.2">
                        <path d={item.icon} />
                      </svg>
                      {/* Step Number Badge */}
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#4A6357] text-white font-cormorant text-sm flex items-center justify-center rounded-2xl border-4 border-[#FCF9F5]">
                        0{i + 1}
                      </div>
                   </div>
                </div>

                <h4 className="text-3xl font-cormorant text-gray-900 mb-6">{item.step}</h4>
                <p className="text-gray-500 font-inter font-medium leading-relaxed max-w-[280px]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
