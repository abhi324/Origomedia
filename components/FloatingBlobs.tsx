"use client";

import { motion } from "framer-motion";

export default function FloatingBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Blob 1 - Peach/Coral */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-[#E09486]/5 blur-[120px]"
      />

      {/* Blob 2 - Muted Green */}
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-[#5F7F6F]/5 blur-[100px]"
      />

      {/* Blob 3 - Soft Lavender/Purple */}
      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -120, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[-100px] right-1/4 w-[550px] h-[550px] rounded-full bg-[#B794C0]/5 blur-[110px]"
      />
    </div>
  );
}
