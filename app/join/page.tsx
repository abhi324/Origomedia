"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinForm from "@/components/JoinForm";
import { motion } from "framer-motion";

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-[#FCF9F5] selection:bg-[#4A6357]/20">
      <Navbar />
      
      <section className="pt-40 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#4A6357] text-[10px] font-inter font-black tracking-[0.6em] uppercase mb-8 block">Partner Program</span>
            <h1 className="text-6xl md:text-8xl font-playfair font-bold text-gray-900 mb-8 leading-[0.95]">
              Join the <br /> <span className="italic font-normal underline decoration-[#4A6357]/10 underline-offset-[16px]">Inner Circle.</span>
            </h1>
            <p className="text-gray-500 text-xl font-inter font-medium max-w-xl mx-auto leading-relaxed">
              Scale your impact with premium brand partnerships. We provide the strategy; you provide the voice.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white p-12 md:p-24 rounded-[4rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.06)] border border-gray-100"
        >
          <JoinForm />
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
