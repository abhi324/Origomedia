"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  CheckCircle,
  Shield,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Film,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatNumber,
  confidenceLabel,
  creatorScoreColor,
  proxyImage,
} from "@/lib/origometer/utils";
import { VerificationRequestForm } from "@/components/origometer/VerificationRequestForm";
import type { Creator } from "@/types/origometer";

interface Props {
  creator: Creator;
  onClose: () => void;
}

export function CreatorDetailModal({ creator, onClose }: Props) {
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const { label: confLabel } = confidenceLabel(creator.confidence_score);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#1a1a1a]/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-2xl grain-bg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-200/60"
        >
          <div className="h-1 flex shrink-0">
            <div className="flex-1 bg-[#F5E68E]" />
            <div className="flex-1 bg-[#E09486]" />
            <div className="flex-1 bg-[#B794C0]" />
            <div className="flex-1 bg-[#8FBCC4]" />
          </div>

          <div className="p-7 pb-5 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {creator.profile_image_url ? (
                  <img
                    src={proxyImage(creator.profile_image_url)}
                    alt={creator.username}
                    className="w-16 h-16 rounded-full object-cover ring-1 ring-gray-200/80"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${creator.username}&background=3D5449&color=fff&size=64`;
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#3D5449] flex items-center justify-center text-white text-2xl font-cormorant font-bold">
                    {(creator.profile_name ?? creator.username)[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-cormorant font-bold text-gray-900">
                      {creator.profile_name ?? `@${creator.username}`}
                    </h2>
                    {creator.is_verified && (
                      <span className="badge bg-[#F5E68E]/40 text-[#3D5449] border border-[#F5E68E]">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-montserrat font-semibold mt-1">
                    @{creator.username} &middot; {creator.platform}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="badge bg-[#EFEFED] text-[#4A6357] border border-gray-200/60 capitalize">
                      {creator.primary_niche}
                    </span>
                    {creator.niches.slice(1, 3).map((n) => (
                      <span key={n.niche} className="badge bg-transparent text-gray-400 border border-gray-200/80 capitalize">
                        {n.niche}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {creator.creator_score != null && (
                  <div className="text-center pr-2 border-r border-gray-200">
                    <p className={cn("text-3xl font-cormorant font-bold leading-none", creatorScoreColor(creator.creator_score))}>
                      {Math.round(creator.creator_score)}
                    </p>
                    <p className="eyebrow-sm text-gray-400 mt-1.5">Brand Score</p>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 px-7 pb-7 space-y-5">
            {creator.bio && (
              <div className="bg-[#EFEFED]/60 rounded-2xl p-4 border border-gray-200/60">
                <p className="text-sm text-gray-600 leading-relaxed font-inter">{creator.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <BigMetric icon={<Users className="w-4 h-4" />} label="Followers" value={creator.followers_formatted ?? formatNumber(creator.followers)} />
              <BigMetric icon={<Film className="w-4 h-4" />} label="Posts" value={formatNumber(creator.total_posts)} />
              <BigMetric icon={<Heart className="w-4 h-4" />} label="Avg Likes" value={formatNumber(creator.avg_likes)} />
              <BigMetric icon={<MessageCircle className="w-4 h-4" />} label="Avg Comments" value={formatNumber(creator.avg_comments)} />
            </div>

            <div className="grain-bg border border-gray-200/60 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="eyebrow text-[#4A6357] mb-2 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5" /> Engagement Rate
                </p>
                <p className="text-[10px] text-gray-400 font-montserrat tracking-[0.15em] uppercase">
                  (Avg likes + comments) &divide; followers
                </p>
              </div>
              <p className="text-4xl font-cormorant font-bold text-[#3D5449]">
                {creator.estimated_engagement_rate != null
                  ? `${creator.estimated_engagement_rate.toFixed(2)}%`
                  : "—"}
              </p>
            </div>

            {(creator.image_avg_likes != null || creator.reel_avg_likes != null) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {creator.image_avg_likes != null && (
                  <BreakdownCard
                    title="Image Posts"
                    accentBar="bg-[#F5E68E]"
                    engagement={creator.image_engagement_rate}
                    reach={creator.image_estimated_reach}
                    rows={[
                      ["Avg likes", formatNumber(creator.image_avg_likes)],
                      ["Avg comments", formatNumber(creator.image_avg_comments)],
                    ]}
                  />
                )}
                {creator.reel_avg_likes != null && (
                  <BreakdownCard
                    title="Reels"
                    accentBar="bg-[#B794C0]"
                    engagement={creator.reel_engagement_rate}
                    reach={creator.reel_estimated_reach}
                    rows={[
                      ["Avg likes", formatNumber(creator.reel_avg_likes)],
                      ["Avg comments", formatNumber(creator.reel_avg_comments)],
                      ["Avg views", formatNumber(creator.reel_avg_views)],
                    ]}
                  />
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-montserrat font-semibold pt-2">
              <span className="text-gray-500">
                Confidence: <span className="text-[#3D5449]">{confLabel}</span> ({Math.round(creator.confidence_score * 100)}%)
              </span>
              <span className="text-gray-400 normal-case tracking-normal font-inter font-normal">
                Source: {creator.data_source}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={creator.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Profile
              </a>
              {!creator.is_verified && (
                <button
                  className="btn-primary flex-1"
                  onClick={() => setShowVerifyForm(true)}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Request Verification
                </button>
              )}
            </div>

            {showVerifyForm && (
              <VerificationRequestForm
                creatorId={creator.id}
                onSuccess={() => setShowVerifyForm(false)}
                onCancel={() => setShowVerifyForm(false)}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function BigMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grain-bg border border-gray-200/60 rounded-2xl p-4 text-center">
      <div className="flex items-center justify-center gap-1.5 text-[#4A6357] mb-1.5">
        {icon}
        <span className="eyebrow-sm">{label}</span>
      </div>
      <p className="text-xl font-cormorant font-bold text-gray-900">{value}</p>
    </div>
  );
}

function BreakdownCard({
  title,
  accentBar,
  engagement,
  reach,
  rows,
}: {
  title: string;
  accentBar: string;
  engagement: number | null;
  reach: number | null;
  rows: [string, string][];
}) {
  return (
    <div className="grain-bg border border-gray-200/60 rounded-2xl overflow-hidden">
      <div className={`h-1 ${accentBar}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-cormorant font-bold text-gray-900 text-lg">{title}</h4>
          {engagement != null && (
            <span className="badge bg-[#3D5449] text-white">
              {engagement.toFixed(2)}% ER
            </span>
          )}
        </div>
        <div className="space-y-2">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="eyebrow-sm text-gray-400">{label}</span>
              <span className="font-cormorant font-bold text-gray-900 text-base">{value}</span>
            </div>
          ))}
          {reach != null && (
            <div className="flex items-center justify-between text-xs pt-2 mt-2 border-t border-gray-200/80">
              <span className="eyebrow-sm text-gray-400">Est. reach</span>
              <span className="font-cormorant font-bold text-gray-900 text-base">
                {reach >= 1000 ? `${(reach / 1000).toFixed(1)}K` : reach}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
