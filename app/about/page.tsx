"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] font-inter font-black tracking-[0.5em] uppercase text-gray-400 mb-6 block">Our Essence</span>
          <h1 className="text-7xl md:text-9xl font-cormorant font-bold text-gray-900 leading-[0.9] mb-12">
            Redefining the <br /> 
            <span className="italic font-normal">Modern Narrative.</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-24">
          <div className="md:col-span-7">
            <p className="text-2xl md:text-3xl font-cormorant text-gray-600 leading-relaxed italic">
              "We believe that in an era of infinite content, true influence is found in the spaces between the noise. Origo Media was founded to build bridges between visionary creators and the audiences that crave depth."
            </p>
          </div>
          
          <div className="md:col-span-5 flex flex-col justify-end">
            <div className="border-l border-gray-100 pl-8 py-4">
              <span className="text-4xl font-cormorant font-bold text-[#4A6357]">2022</span>
              <p className="text-[10px] font-inter tracking-[0.2em] uppercase text-gray-400 mt-2">Inception of the Vanguard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Boxes */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              { title: "The Vision", content: "To architect the most influential media ecosystem of the decade." },
              { title: "The Method", content: "Hyper-focused growth strategies powered by psychological precision." },
              { title: "The Impact", content: "Transforming creators into institutional brands that last generations." }
            ].map((box, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-12 border border-gray-100 flex flex-col justify-between h-[300px]"
              >
                <span className="text-[10px] font-inter font-black tracking-[0.3em] uppercase text-[#4A6357]">0{index + 1}</span>
                <div>
                  <h3 className="text-2xl font-cormorant font-bold mb-4 text-gray-900">{box.title}</h3>
                  <p className="text-gray-500 font-inter text-sm leading-relaxed">{box.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Figures Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-gray-100 pb-12">
            <h2 className="text-5xl font-cormorant font-bold text-gray-900">The Figures</h2>
            <p className="text-gray-400 font-inter text-[11px] tracking-[0.2em] uppercase mt-4 md:mt-0">Quantifying Excellence</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Reach", value: "500M+" },
              { label: "Partners", value: "120+" },
              { label: "Countries", value: "15" },
              { label: "Growth", value: "300%" }
            ].map((stat, index) => (
              <div key={index}>
                <span className="text-6xl md:text-7xl font-cormorant font-bold text-[#4A6357] block mb-2">{stat.value}</span>
                <span className="text-[10px] font-inter tracking-[0.3em] uppercase text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
