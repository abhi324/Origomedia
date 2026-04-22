"use client";

import { motion } from "framer-motion";

const steps = [
  { 
    step: "Register", 
    desc: "Submit your portfolio and join our creator network.", 
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
  },
  { 
    step: "Match", 
    desc: "We pair you with premium beauty & skincare brands.", 
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
  },
  { 
    step: "Create", 
    desc: "Execute campaigns and get paid for your craft.", 
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
  }
];

export default function JourneySection() {
  return (
    <section className="w-full py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-montserrat font-bold text-gray-900 mb-20"
        >
          Start Your Journey.
        </motion.h2>

        <div className="relative">
          {/* Horizontal connecting line (Desktop) */}
          <div className="absolute top-12 left-[15%] right-[15%] h-px bg-gray-100 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {steps.map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-[#FCF9F5] rounded-[2rem] flex items-center justify-center shadow-sm mb-8 border border-gray-100 z-10 group-hover:scale-110 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#5F7F6F]/10 group-hover:bg-white">
                  <svg className="w-10 h-10 text-[#5F7F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.2">
                    <path d={item.icon} />
                  </svg>
                </div>
                <h4 className="text-2xl font-montserrat font-bold text-gray-900 mb-4">{item.step}</h4>
                <p className="text-gray-500 font-medium leading-relaxed max-w-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
