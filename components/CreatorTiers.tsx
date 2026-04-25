"use client";

import { motion } from "framer-motion";

interface Tier {
  tag: string;
  range: string;
  unit: string;
  tagline: string;
  features: string[];
  featured: boolean;
  featuredLabel?: string;
}

const tiers: Tier[] = [
  {
    tag: "Seedling",
    range: "0–10K",
    unit: "Followers",
    tagline: "Real brand deals before the algorithm notices you.",
    features: [
      "Paid placements with vetted brands",
      "Know your rate — so you never undersell",
      "A community of creators at your exact stage",
      "Skills that grow your income alongside your audience",
    ],
    featured: false,
  },
  {
    tag: "Creator",
    range: "10K–100K",
    unit: "Followers",
    tagline: "Briefs that fit. Support that stays. Pay that doesn't wait.",
    features: [
      "First look at brand briefs — before anyone else",
      "One dedicated manager, zero chasing",
      "Payment in 30 days, guaranteed",
      "Media kit + rate card, built for you",
    ],
    featured: true,
    featuredLabel: "Founding",
  },
  {
    tag: "Signature",
    range: "100K+",
    unit: "Followers",
    tagline: "Long-term brand relationships — not one-off posts.",
    features: [
      "Matched to brands that fit your audience, not just your reach",
      "Retainer deals that build a predictable income",
      "Product collabs with real creative control",
      "Invite-only retreats with top-tier brand partners",
    ],
    featured: false,
  },
];

const CheckIcon = () => (
  <svg
    className="w-3.5 h-3.5 shrink-0 mt-0.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export default function CreatorTiers() {
  return (
    <section
      id="creator-tiers"
      aria-labelledby="tiers-heading"
      className="w-full py-20 sm:py-28 md:py-36 bg-transparent"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="text-[#4A6357] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-4 block">
            Creator Tiers
          </span>
          <h2
            id="tiers-heading"
            className="text-3xl sm:text-5xl md:text-6xl font-cormorant font-bold text-gray-900 leading-[1.05]"
          >
            Find your place{" "}
            <span className="italic font-normal">in the roster.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-gray-500 font-inter leading-relaxed max-w-xl mx-auto">
            We work with creators at every stage. Your follower count is a
            starting point—your content is what gets you in.
          </p>
        </motion.div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.tag}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.75,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative flex"
            >
              {/* Featured floating badge */}
              {tier.featured && tier.featuredLabel && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-[#C8503A] text-white text-[9px] font-montserrat font-bold tracking-[0.35em] uppercase px-4 py-1.5 rounded-full shadow-[0_4px_16px_-4px_rgba(200,80,58,0.5)]">
                    {tier.featuredLabel}
                  </span>
                </div>
              )}

              <div
                className={`
                  group relative flex flex-col w-full rounded-[1.75rem] sm:rounded-[2rem] 
                  border transition-all duration-500 overflow-hidden
                  ${tier.featured
                    ? "bg-[#2D3F37] border-transparent shadow-[0_32px_64px_-16px_rgba(45,63,55,0.4)] md:-mt-6 md:-mb-6 z-10"
                    : "grain-bg border-gray-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                  }
                `}
              >
                {/* Card body */}
                <div className="flex flex-col flex-1 p-7 sm:p-8 lg:p-10">
                  {/* Tag */}
                  <span
                    className={`text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-5 block ${tier.featured ? "text-[#C8503A]" : "text-[#4A6357]"
                      }`}
                  >
                    {tier.tag}
                  </span>

                  {/* Follower range — editorial large type */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span
                        className={`font-cormorant font-bold leading-none tracking-tight ${tier.featured
                          ? "text-white"
                          : "text-gray-900"
                          } ${tier.range.length > 6
                            ? "text-5xl sm:text-6xl"
                            : "text-6xl sm:text-7xl"
                          }`}
                      >
                        {tier.range}
                      </span>
                      <span
                        className={`font-montserrat font-bold text-[9px] tracking-[0.35em] uppercase ${tier.featured ? "text-white/50" : "text-gray-400"
                          }`}
                      >
                        {tier.unit}
                      </span>
                    </div>
                  </div>

                  {/* Tagline */}
                  <p
                    className={`font-inter text-sm sm:text-base leading-relaxed mb-8 ${tier.featured ? "text-white/65" : "text-gray-500"
                      }`}
                  >
                    {tier.tagline}
                  </p>

                  {/* Divider */}
                  <div
                    className={`w-full h-px mb-8 ${tier.featured ? "bg-white/10" : "bg-gray-100"
                      }`}
                  />

                  {/* Features */}
                  <ul className="flex flex-col gap-3.5 flex-1 mb-0">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className={`flex items-start gap-3 font-inter text-sm ${tier.featured ? "text-white/80" : "text-gray-600"
                          }`}
                      >
                        <span
                          className={
                            tier.featured ? "text-[#C8503A]" : "text-[#4A6357]"
                          }
                        >
                          <CheckIcon />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center text-xs text-gray-400 font-inter mt-10 sm:mt-12"
        >
          All tiers require a brief application. Acceptance is based on fit, not
          follower count alone.
        </motion.p>
      </div>
    </section>
  );
}
