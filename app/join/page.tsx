"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinForm from "@/components/JoinForm";
import { motion } from "framer-motion";

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-[#FCF9F5] selection:bg-[#4A6357]/20 flex flex-col">
      <Navbar />
      
      {/* Split Hero Section — Form First Design */}
      <section className="flex-1 flex flex-col lg:flex-row pt-32 lg:pt-0 min-h-screen">
        {/* Left Side — Functional Form */}
        <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-20 bg-white z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl"
          >
            <div className="mb-12">
              <span className="text-[#4A6357] text-[10px] font-inter font-black tracking-[0.6em] uppercase mb-4 block">Application Form</span>
              <h1 className="text-5xl md:text-6xl font-cormorant font-bold text-gray-900 leading-[0.95]">
                Step into the <br /> <span className="italic font-normal">Inner Circle.</span>
              </h1>
            </div>
            <JoinForm />
          </motion.div>
        </div>

        {/* Right Side — Editorial Visuals */}
        <div className="hidden lg:flex flex-1 bg-[#3D5449] relative overflow-hidden items-center justify-center p-20">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: "url('/noise.png')", backgroundRepeat: 'repeat' }}></div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative text-center"
          >
            <h2 className="text-[8rem] xl:text-[12rem] font-cormorant font-bold text-white/5 leading-none absolute -top-20 xl:-top-32 left-1/2 -translate-x-1/2 whitespace-nowrap select-none">
              INNER CIRCLE
            </h2>
            <div className="relative z-10 max-w-lg">
              <p className="text-white/80 text-3xl font-cormorant italic leading-relaxed mb-12">
                "We provide the strategy; <br /> you provide the voice."
              </p>
              <div className="w-px h-32 bg-gradient-to-b from-white/40 to-transparent mx-auto" />
            </div>
          </motion.div>

          {/* Decorative Corner Element */}
          <div className="absolute bottom-12 right-12 text-white/20 text-[10px] font-inter font-black tracking-[0.4em] uppercase">
            ORIGO MEDIA GROUP / MMXXVI
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
