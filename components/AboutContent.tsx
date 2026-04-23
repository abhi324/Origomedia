"use client";

import { motion } from "framer-motion";

export default function AboutContent() {
  return (
    <main className="min-h-screen bg-[#FCF9F5] selection:bg-[#4A6357]/20 flex flex-col">
      {/* Hero Section — Minimalist Narrative */}
      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-left"
        >
          <span className="text-[#4A6357] text-[10px] font-inter font-black tracking-[0.5em] uppercase mb-8 block">The Genesis of Intentional Influence</span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-cormorant font-bold text-gray-900 leading-[0.9] mb-16">
            Bridging the Gap Between <br /> <span className="italic font-normal text-[#4A6357]">Vision and Voice.</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 border-t border-gray-100 pt-16">
            <div className="space-y-8">
              <p className="font-cormorant font-medium italic text-3xl md:text-4xl leading-tight text-gray-900">
                Origo is a specialized influencer marketing agency dedicated to the nuanced worlds of beauty and skincare. Our journey began with a singular, sharp observation: a profound disconnect where brands struggled to find authentic voices, and creators were overlooked for the very opportunities they were built for.
              </p>
              <p className="text-lg md:text-xl text-gray-600 font-inter leading-relaxed">
                We engineered Origo to mend that divide. By championing nano and micro-creators—those with unwavering engagement and deep-seated audience trust—we curate partnerships with brands that truly value substance over scale.
              </p>
            </div>
            
            <div className="space-y-8">
              <p className="text-lg md:text-xl text-gray-600 font-inter leading-relaxed">
                We've eliminated the noise of mass outreach and the friction of random collaborations. Instead, we focus on the precision of the <span className="text-[#4A6357] font-bold italic">"right fit."</span>
              </p>
              <p className="text-lg md:text-xl text-gray-600 font-inter leading-relaxed">
                For our creators, this translates to exclusive access to paid campaigns and a trajectory of consistent, meaningful opportunities. For our brand partners, it ensures a roster of reliable talent and content that resonates with an effortless, organic authenticity.
              </p>
              <div className="pt-8 border-t border-gray-100">
                <p className="text-sm font-black tracking-[0.3em] uppercase text-[#4A6357] mb-4">Our Commitment</p>
                <p className="text-2xl md:text-3xl text-gray-900 font-cormorant font-medium italic leading-relaxed">
                  "Every decision we make is designed to render collaborations more intentional, more efficient, and undeniably more valuable for the entire ecosystem."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>


      {/* Decorative Watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        whileInView={{ opacity: 0.2, scale: 1, rotate: -12 }}
        viewport={{ once: true }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-[250px] sm:-bottom-[400px] -left-20 z-[-1] pointer-events-none mix-blend-multiply"
      >
        <div className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] md:w-[1000px] md:h-[1000px]">
          <img 
            src="/images/logo_insta.png" 
            alt="Origo Media Brand Presence" 
            className="w-full h-full object-contain" 
          />
        </div>
      </motion.div>

    </main>
  );
}
