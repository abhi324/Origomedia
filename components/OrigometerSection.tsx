"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, FormEvent } from "react";
import {
  ArrowRight,
  Search,
  TrendingUp,
  Users,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { lookupCreator, pingBackend } from "@/lib/origometer/api";
import {
  formatNumber,
  proxyImage,
  creatorScoreColor,
} from "@/lib/origometer/utils";
import type { Creator } from "@/types/origometer";

const SAMPLE = {
  username: "samplecreator",
  profile_name: "Sample Creator",
  profile_image_url: null as string | null,
  creator_score: 82,
  followers_label: "48.2K",
  engagement_label: "5.1%",
  reach_label: "12.4K",
};

export default function OrigometerSection() {
  const [username, setUsername] = useState("");
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const clean = username.trim().replace(/^@/, "").toLowerCase();
    if (!clean || loading) return;

    setLoading(true);
    setError(null);
    try {
      // Hits /api/v1/lookup → backend caches/persists in Supabase automatically.
      const res = await lookupCreator(clean, "instagram");
      setCreator(res.data);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : detail?.error ?? "Couldn't find that creator";
      setError(msg);
      setCreator(null);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setCreator(null);
    setError(null);
    setUsername("");
  }

  return (
    <section
      id="origometer"
      aria-labelledby="origometer-heading"
      className="w-full py-20 sm:py-28 md:py-36 bg-transparent"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <span className="text-[#4A6357] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-5 block">
              Tool &middot; Origometer
            </span>
            <h2
              id="origometer-heading"
              className="text-3xl sm:text-5xl md:text-6xl font-cormorant font-bold text-gray-900 leading-[1.05] mb-6"
            >
              Look up any creator.{" "}
              <span className="italic font-normal block sm:inline">See the truth.</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-500 font-inter leading-relaxed max-w-xl mb-8">
              Pull public Instagram metrics for any creator in seconds &mdash; followers,
              engagement, reach, content mix, and a credibility score we use to vet our
              own roster. No API keys, no fluff.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-10">
              {[
                { icon: <Users className="w-3.5 h-3.5" />, label: "Real follower & post counts" },
                { icon: <TrendingUp className="w-3.5 h-3.5" />, label: "Engagement & reach" },
                { icon: <Search className="w-3.5 h-3.5" />, label: "Content-type breakdown" },
                { icon: <Sparkles className="w-3.5 h-3.5" />, label: "ORIGO credibility score" },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 text-sm text-gray-600 font-inter"
                >
                  <span className="text-[#4A6357] shrink-0">{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ul>

            <Link
              href="/origometer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#3D5449] text-white rounded-lg text-[11px] uppercase font-montserrat font-bold tracking-widest hover:bg-[#2D3F37] transition-all group"
            >
              Open the Origometer
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Interactive quick-search card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="lg:col-span-6 relative"
          >
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#F5E68E]/30 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 -left-8 w-72 h-72 bg-[#B794C0]/25 blur-[120px] rounded-full pointer-events-none" />

            <div
              className="relative grain-bg rounded-[1.75rem] sm:rounded-[2rem] border border-gray-200/60 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.12)] overflow-hidden"
              onMouseEnter={() => pingBackend()}
            >
              {/* Brand mosaic stripe */}
              <div className="h-1 flex">
                <div className="flex-1 bg-[#F5E68E]" />
                <div className="flex-1 bg-[#E09486]" />
                <div className="flex-1 bg-[#B794C0]" />
                <div className="flex-1 bg-[#8FBCC4]" />
              </div>

              <div className="p-5 sm:p-8">
                {/* Search row — real form */}
                <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-6">
                  <div className="flex-1 flex items-center gap-2 px-3 sm:px-4 py-3 rounded-lg border border-gray-300/70 bg-white/80 focus-within:border-[#3D5449] focus-within:ring-1 focus-within:ring-[#3D5449] transition-all">
                    <span className="font-cormorant font-semibold text-[#4A6357] shrink-0">
                      @
                    </span>
                    <input
                      type="text"
                      onFocus={() => pingBackend()}
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="creatorusername"
                      disabled={loading}
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className="flex-1 min-w-0 bg-transparent font-inter text-sm text-gray-900 placeholder:text-gray-400 outline-none disabled:opacity-50"
                      aria-label="Creator username"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !username.trim()}
                    className="px-4 py-3 rounded-lg bg-[#3D5449] text-white text-[10px] uppercase font-montserrat font-bold tracking-widest flex items-center gap-2 hover:bg-[#2D3F37] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {loading ? (
                      <span className="inline-block w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Search className="w-3 h-3" />
                    )}
                    {loading ? "Loading" : "Discover"}
                  </button>
                </form>

                {/* Error state */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-5"
                    >
                      <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[#C8503A]/10 border border-[#C8503A]/30 text-[#C8503A]">
                        <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <p className="text-xs font-inter leading-relaxed">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Result vs sample */}
                <AnimatePresence mode="wait">
                  {creator ? (
                    <motion.div
                      key="real"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                    >
                      <ResultCard creator={creator} onClear={reset} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sample"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className={loading ? "opacity-40 transition-opacity" : ""}
                    >
                      <SampleCard />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <p className="text-center mt-5 text-[10px] uppercase tracking-[0.25em] font-montserrat font-semibold text-gray-400">
              {creator
                ? "Live data · Public profiles only"
                : "Try it · Type any Instagram handle"}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Sample (placeholder before any search) ─────────────────────────────────
function SampleCard() {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#3D5449] flex items-center justify-center text-white font-cormorant font-bold text-lg shrink-0">
          A
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-cormorant font-bold text-gray-900 text-lg leading-tight truncate">
            {SAMPLE.profile_name}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-montserrat font-semibold mt-0.5">
            @{SAMPLE.username}
          </p>
        </div>
        <div className="text-center pl-3 border-l border-gray-200 shrink-0">
          <p className="text-2xl font-cormorant font-bold text-[#3D5449] leading-none">
            {SAMPLE.creator_score}
          </p>
          <p className="text-[9px] font-montserrat font-bold tracking-[0.35em] uppercase text-gray-400 mt-1">
            Score
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-gray-200/80 pt-5">
        <Metric label="Followers" value={SAMPLE.followers_label} />
        <Metric label="Engagement" value={SAMPLE.engagement_label} />
        <Metric label="Avg Reach" value={SAMPLE.reach_label} />
      </div>
    </>
  );
}

// ─── Real result (after a successful lookup) ────────────────────────────────
function ResultCard({
  creator,
  onClear,
}: {
  creator: Creator;
  onClear: () => void;
}) {
  const initial = (creator.profile_name ?? creator.username)[0].toUpperCase();
  const reach =
    creator.reel_estimated_reach ?? creator.image_estimated_reach ?? null;

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        {creator.profile_image_url ? (
          <img
            src={proxyImage(creator.profile_image_url)}
            alt={creator.profile_name ?? creator.username}
            className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200/80 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${creator.username}&background=3D5449&color=fff&size=48`;
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#3D5449] flex items-center justify-center text-white font-cormorant font-bold text-lg shrink-0">
            {initial}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-cormorant font-bold text-gray-900 text-lg leading-tight truncate">
            {creator.profile_name ?? `@${creator.username}`}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-montserrat font-semibold mt-0.5 truncate">
            @{creator.username}
          </p>
        </div>
        {creator.creator_score != null && (
          <div className="text-center pl-3 border-l border-gray-200 shrink-0">
            <p
              className={`text-2xl font-cormorant font-bold leading-none ${creatorScoreColor(creator.creator_score)}`}
            >
              {Math.round(creator.creator_score)}
            </p>
            <p className="text-[9px] font-montserrat font-bold tracking-[0.35em] uppercase text-gray-400 mt-1">
              Score
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-gray-200/80 pt-5">
        <Metric
          label="Followers"
          value={creator.followers_formatted ?? formatNumber(creator.followers)}
        />
        <Metric
          label="Engagement"
          value={
            creator.estimated_engagement_rate != null
              ? `${creator.estimated_engagement_rate.toFixed(1)}%`
              : "—"
          }
        />
        <Metric label="Avg Reach" value={formatNumber(reach)} />
      </div>

      <div className="flex items-center gap-2 mt-5 pt-5 border-t border-gray-200/80">
        <Link
          href={`/origometer/creator?u=${encodeURIComponent(creator.username)}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#3D5449] text-white text-[10px] uppercase font-montserrat font-bold tracking-widest hover:bg-[#2D3F37] transition-all group"
        >
          View full report
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2.5 rounded-lg border border-gray-300/70 text-gray-500 text-[10px] uppercase font-montserrat font-bold tracking-widest hover:border-[#3D5449] hover:text-[#3D5449] transition-all"
        >
          Clear
        </button>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[9px] font-montserrat font-bold tracking-[0.35em] uppercase text-gray-400 mb-1.5">
        {label}
      </p>
      <p className="text-lg font-cormorant font-bold text-gray-900">{value}</p>
    </div>
  );
}
