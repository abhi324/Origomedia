"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What does Origo actually do?",
    a: "We&rsquo;re an influencer marketing agency for beauty and skincare. We connect brands with vetted nano and micro creators, then run the campaign end to end&mdash;briefing, creator matching, and content review.",
  },
  {
    q: "Who can join as a creator?",
    a: "Nano and micro creators in skincare, dermacosmetics, or makeup. We don&rsquo;t require a minimum follower count. We look at audience trust, content quality, and niche fit.",
  },
  {
    q: "How do you select creators for a brand?",
    a: "We match by niche, audience demographics, content tone, and engagement quality&mdash;not just follower count. We&rsquo;d rather suggest 5 creators who fit than 50 who don&rsquo;t.",
  },
  {
    q: "What does a brand campaign look like?",
    a: "We scope the brief with the brand, shortlist creators who fit, handle outreach and briefing, then review content end to end. You see the shortlist before anything goes live.",
  },
  {
    q: "What makes Origo different from an influencer marketplace?",
    a: "Marketplaces optimise for volume; we optimise for fit. Every shortlist is curated by our team, not an algorithm, and we only work in three niches&mdash;skincare, dermacosmetics, and makeup&mdash;so the matches actually land.",
  },
  {
    q: "How long does a typical campaign run?",
    a: "Most campaigns run two to four weeks end to end&mdash;brief, shortlist, content production, and review. Bigger or staggered rollouts can run longer; we&rsquo;ll scope the timeline with you up front.",
  },
  {
    q: "How do I get in touch?",
    a: "Creators: apply via the Join page. Brands: email origomedia.co@gmail.com. We reply within a week.",
  },
];

const decodeEntities = (s: string) =>
  s
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&amp;/g, "&");

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((f) => ({
    "@type": "Question",
    "name": decodeEntities(f.q),
    "acceptedAnswer": {
      "@type": "Answer",
      "text": decodeEntities(f.a),
    },
  })),
};

export default function FAQContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[#FCF9F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="pt-32 sm:pt-40 pb-20 sm:pb-28 px-5 sm:px-8 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-14 sm:mb-20"
        >
          <span className="text-[#4A6357] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-5 block">
            FAQ
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-cormorant font-bold text-gray-900 leading-[1.0]">
            Common <span className="italic font-normal">questions.</span>
          </h1>
        </motion.div>

        <div className="border-t border-gray-200">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-6 sm:py-8 text-left group"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-lg sm:text-2xl font-cormorant font-bold text-gray-900 leading-snug flex-1">
                    {faq.q}
                  </h3>
                  <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0 mt-1 group-hover:border-[#4A6357] transition-colors">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-[#4A6357]" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p
                        className="pb-6 sm:pb-8 pr-12 text-sm sm:text-base text-gray-600 font-inter leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: faq.a }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 font-inter mb-5">Still have a question?</p>
          <a
            href="mailto:origomedia.co@gmail.com"
            className="inline-block px-8 py-4 bg-[#3D5449] text-white rounded-xl text-[11px] uppercase font-montserrat font-bold tracking-widest hover:bg-[#2D3F37] transition-all"
          >
            Email us
          </a>
        </div>
      </section>
    </main>
  );
}
