"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "What do we do?",
      a: "We architect the future of digital influence. Beyond simple management, we build institutional brands for creators using high-level strategy, psychological precision, and elite media production."
    },
    {
      q: "How you can connect?",
      a: "The path begins at the 'Join Us' threshold. Fill out our application with precision. If your vision aligns with the Vanguard, we will reach out via our private channels."
    },
    {
      q: "Who is this for?",
      a: "We exclusively partner with the top 1% of visionary creators—those who aren't just looking for a manager, but an architect for their legacy."
    },
    {
      q: "What is the Inner Circle?",
      a: "The Inner Circle is our most exclusive partnership tier. It involves deep integration with our strategy team, access to proprietary growth models, and private networking with the world's most elite digital minds."
    },
    {
      q: "Why Origo?",
      a: "Because the era of the 'generic agency' is over. We don't follow trends; we define the architecture that creates them. We are for those who demand excellence over convenience."
    },
    {
      q: "Where are we based?",
      a: "Origo is a borderless entity. While our roots are in the world's media capitals, our influence is global and our operations are decentralized for maximum agility."
    }
  ];

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-[10px] font-inter font-black tracking-[0.5em] uppercase text-gray-400 mb-6 block">Common Queries</span>
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-cormorant font-bold text-gray-900 leading-[0.9]">
            The <span className="italic font-normal">Architecture</span> <br /> of Understanding.
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 sm:p-10 border border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 min-h-[350px]"
            >
              <div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center mb-8">
                  <Plus className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="text-2xl font-cormorant font-bold text-gray-900 mb-6 leading-tight">{faq.q}</h3>
                <p className="text-gray-500 font-inter text-sm leading-relaxed">{faq.a}</p>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-50">
                <span className="text-[9px] font-inter font-black tracking-[0.3em] uppercase text-[#4A6357]">Reference 0{index + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Decorative Final Section */}
      <section className="py-24 px-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl font-cormorant italic text-gray-400 leading-relaxed">
            "Clarity is the foundation of vision. If your questions remain unanswered, the Nexus is always listening."
          </p>
        </div>
      </section>

    </main>
  );
}
