"use client";

import { motion } from "framer-motion";

export default function DataVisualization() {
  return (
    <div className="w-full h-full min-h-[300px] bg-transparent p-8 flex flex-col justify-between overflow-hidden">
      <div className="flex justify-between items-start mb-12">
        <div>
          <p className="text-[10px] font-roboto font-bold tracking-[0.4em] text-white/30 uppercase">Aggregated Trajectory</p>
          <h4 className="text-3xl font-serif text-white mt-2 font-instrument italic">Growth Velocity</h4>
        </div>
        <div className="px-4 py-2 bg-origo-peach/20 border border-origo-peach/30 rounded-full">
          <span className="text-[11px] font-roboto font-bold text-origo-peach tracking-tight">+124% YoY</span>
        </div>
      </div>

      <div className="relative flex-1 flex items-end gap-3 px-2">
        {[40, 25, 60, 45, 90, 75, 100].map((height, i) => {
          const colors = ['bg-white/10', 'bg-white/20', 'bg-origo-peach/40', 'bg-white/10'];
          const bgColor = colors[i % colors.length];
          return (
            <div key={i} className="flex-1 flex flex-col justify-end gap-2 group">
              <motion.div 
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                transition={{ duration: 1.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full ${bgColor} backdrop-blur-md group-hover:bg-origo-peach group-hover:shadow-[0_0_20px_rgba(224,148,134,0.4)] transition-all duration-500 rounded-t-2xl relative`}
              >
                {i === 6 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white text-origo-dark text-[9px] font-black uppercase rounded-full shadow-2xl tracking-tighter"
                  >
                    Peak Origin
                  </motion.div>
                )}
              </motion.div>
            </div>
          );
        })}

        {/* Diagonal Trend Line Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <motion.path 
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M 0 100 L 100 0" 
            stroke="#5F7F6F" 
            strokeWidth="2" 
            strokeDasharray="6 6"
            className="opacity-40"
          />
        </svg>
      </div>

      <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/10">
        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <span className="text-[10px] font-roboto font-bold text-white/30 tracking-widest uppercase">Direct Influence</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-origo-peach" />
            <span className="text-[10px] font-roboto font-bold text-origo-peach/60 tracking-widest uppercase">Ecosystem Velocity</span>
          </div>
        </div>
        <p className="text-[10px] font-roboto font-medium text-white/20 italic tracking-widest">Sourced Data v4.0</p>
      </div>
    </div>
  );
}
