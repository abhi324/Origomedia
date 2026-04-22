"use client";

import { motion } from "framer-motion";

const steps = [
  { 
    step: "Register", 
    desc: "Submit your portfolio and join our exclusive creator network.", 
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
  },
  { 
    step: "Match", 
    desc: "We pair your unique voice with premium beauty & skincare brands.", 
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
  },
  { 
    step: "Create", 
    desc: "Execute world-class campaigns and grow your professional craft.", 
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
  }
];

export default function JourneySection() {
  return (
    <section className="w-full py-40 bg-white relative z-10 rounded-t-[5rem] -mt-16 md:-mt-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-24"
        >
          <span className="text-[#5F7F6F] font-black text-[10px] tracking-[0.5em] uppercase mb-6 block">Onboarding</span>
          <h2 className="text-5xl md:text-7xl font-montserrat font-bold text-gray-900 tracking-tight leading-[0.9]">
            Start Your <br/> <span className="text-[#5F7F6F]">Journey.</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Horizontal connecting line (Desktop) */}
          <div className="absolute top-20 left-[15%] right-[15%] h-px bg-gray-100 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 relative">
            {steps.map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col items-center"
              >
                <div className="w-40 h-40 bg-[#FCF9F5] rounded-[3.5rem] flex items-center justify-center shadow-sm mb-12 border border-gray-100 z-10 group-hover:scale-110 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-[#5F7F6F]/10 group-hover:bg-white group-hover:rotate-6">
                  <svg className="w-16 h-16 text-[#5F7F6F] group-hover:text-[#E09486] transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
                    <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h4 className="text-3xl font-montserrat font-bold text-gray-900 mb-6">{item.step}</h4>
                <p className="text-gray-400 font-medium leading-relaxed max-w-xs group-hover:text-gray-600 transition-colors">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
