"use client";

import { motion } from "framer-motion";
import { CheckCircle, TrendingUp, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatNumber,
  confidenceLabel,
  creatorScoreColor,
  proxyImage,
} from "@/lib/origometer/utils";
import type { Creator } from "@/types/origometer";

interface Props {
  creator: Creator;
  onClick: () => void;
}

export function CreatorCard({ creator, onClick }: Props) {
  const { label: confLabel, color: confColor } = confidenceLabel(
    creator.confidence_score
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="card cursor-pointer relative overflow-hidden group hover:shadow-editorial-hover transition-all"
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="relative">
          {creator.profile_image_url ? (
            <img
              src={proxyImage(creator.profile_image_url)}
              alt={creator.profile_name ?? creator.username}
              className="w-14 h-14 rounded-full object-cover bg-gray-100 ring-1 ring-gray-200/80"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${creator.username}&background=3D5449&color=fff&size=56`;
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#3D5449] flex items-center justify-center text-white font-cormorant font-bold text-xl">
              {(creator.profile_name ?? creator.username)[0].toUpperCase()}
            </div>
          )}
          {creator.is_verified && (
            <CheckCircle className="absolute -bottom-1 -right-1 w-4 h-4 text-[#3D5449] fill-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-cormorant font-bold text-gray-900 text-lg leading-tight truncate">
              {creator.profile_name ?? `@${creator.username}`}
            </p>
            {creator.is_platform_verified && (
              <span title="Platform verified" className="text-[#3D5449] text-xs">✓</span>
            )}
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-montserrat font-semibold mt-0.5">
            @{creator.username}
          </p>
        </div>

        {creator.creator_score != null && (
          <div className="flex flex-col items-center pl-2 border-l border-gray-200">
            <span className={cn("text-2xl font-cormorant font-bold leading-none", creatorScoreColor(creator.creator_score))}>
              {Math.round(creator.creator_score)}
            </span>
            <span className="eyebrow-sm text-gray-400 mt-1">Score</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="badge bg-[#EFEFED] text-[#4A6357] border border-gray-200/60 capitalize">
          {creator.primary_niche}
        </span>
        <span className="badge bg-[#3D5449] text-white capitalize">
          {creator.platform}
        </span>
      </div>

      {creator.bio && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-5 leading-relaxed font-inter">
          {creator.bio}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2 border-t border-gray-200/80 pt-4">
        <MetricCell
          icon={<Users className="w-3 h-3" />}
          label="Followers"
          value={creator.followers_formatted ?? formatNumber(creator.followers)}
        />
        <MetricCell
          icon={<FileText className="w-3 h-3" />}
          label="Posts"
          value={formatNumber(creator.total_posts)}
        />
        <MetricCell
          icon={<TrendingUp className="w-3 h-3" />}
          label="Engagement"
          value={creator.estimated_engagement_rate != null
            ? `${creator.estimated_engagement_rate.toFixed(1)}%`
            : "—"}
        />
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/80">
        <span className={cn("text-[10px] uppercase tracking-[0.2em] font-montserrat font-semibold", confColor)}>
          {confLabel} confidence
        </span>
        {creator.is_verified && (
          <span className="badge bg-[#F5E68E]/40 text-[#3D5449] border border-[#F5E68E]">
            ORIGO Verified
          </span>
        )}
      </div>
    </motion.div>
  );
}

function MetricCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
        {icon}
        <span className="eyebrow-sm">{label}</span>
      </div>
      <p className="text-base font-cormorant font-bold text-gray-900">{value}</p>
    </div>
  );
}
