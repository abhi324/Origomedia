"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SearchPanel } from "@/components/origometer/SearchPanel";
import type { Platform } from "@/types/origometer";

export default function OrigometerHome() {
  const router = useRouter();

  async function handleSearch(username: string, _platform: Platform) {
    const clean = username.trim().replace(/^@/, "").toLowerCase();
    if (!clean) return;
    router.push(`/origometer/creator?u=${encodeURIComponent(clean)}`);
  }

  return (
    <section className="w-full min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-5 sm:px-8 py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-[420px] h-[420px] bg-[#F5E68E]/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[360px] h-[360px] bg-[#B794C0]/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-3xl w-full text-center relative">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="eyebrow text-[#4A6357] mb-6 block"
        >
          Creator Analytics
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="text-4xl sm:text-6xl md:text-7xl font-cormorant font-bold text-gray-900 leading-[1.05] mb-6"
        >
          Look up a creator.{" "}
          <span className="italic font-normal block sm:inline">See the truth.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="flex items-center justify-center gap-4 sm:gap-6 mb-6"
        >
          <div className="w-8 sm:w-12 h-px bg-gray-300" />
          <p className="text-base sm:text-lg md:text-xl text-gray-500 font-cormorant font-medium italic leading-snug max-w-xl">
            Public Instagram metrics &mdash; followers, engagement, reach.
            No API keys, no fluff.
          </p>
          <div className="w-8 sm:w-12 h-px bg-gray-300" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="mt-10 sm:mt-12"
        >
          <SearchPanel onSearch={handleSearch} isLoading={false} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-[10px] sm:text-[11px] text-gray-400 font-montserrat font-medium tracking-[0.25em] uppercase mt-12"
        >
          Built for the ORIGO roster
        </motion.p>
      </div>
    </section>
  );
}
