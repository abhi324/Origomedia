"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Calendar,
  Send,
  CheckCircle,
  ExternalLink,
  Users,
  TrendingUp,
  Eye,
  Image as ImageIcon,
  Film,
  Heart,
  MessageCircle,
  Sparkles,
  Shield,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import toast from "react-hot-toast";

import { lookupCreator } from "@/lib/origometer/api";
import { formatNumber, proxyImage } from "@/lib/origometer/utils";
import type { Creator } from "@/types/origometer";
import { VerificationRequestForm } from "@/components/origometer/VerificationRequestForm";

const PALETTE = {
  green: "#3D5449",
  greenSoft: "#4A6357",
  peach: "#C8503A",
  peachLight: "#E09486",
  yellow: "#F5E68E",
  purple: "#B794C0",
  teal: "#8FBCC4",
  muted: "#9ca3af",
};

export default function CreatorAnalyticsPage() {
  return (
    <Suspense fallback={<LoadingState username="creator" />}>
      <CreatorAnalyticsInner />
    </Suspense>
  );
}

function CreatorAnalyticsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = (searchParams.get("u") ?? "").replace(/^@/, "").trim();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVerifyForm, setShowVerifyForm] = useState(false);

  useEffect(() => {
    if (!username) {
      router.push("/origometer");
      return;
    }
    (async () => {
      try {
        let res = await lookupCreator(username, "instagram");
        const hasBreakdown =
          res.data?.image_avg_likes != null || res.data?.reel_avg_likes != null;
        if (!hasBreakdown) {
          res = await lookupCreator(username, "instagram", true);
        }
        setCreator(res.data);
      } catch (err: any) {
        const detail = err?.response?.data?.detail;
        const msg =
          typeof detail === "string"
            ? detail
            : detail?.error ?? "Could not load creator analytics";
        toast.error(msg, { duration: 6000 });
        router.push("/origometer");
      } finally {
        setLoading(false);
      }
    })();
  }, [username, router]);

  if (loading) return <LoadingState username={username} />;
  if (!creator) return null;

  return (
    <div className="w-full">
      <div className="grain-bg border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center gap-4">
          <Link
            href="/origometer"
            className="text-gray-400 hover:text-[#3D5449] transition-colors flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] font-montserrat font-bold"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Discover
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-[10px] uppercase tracking-[0.25em] font-montserrat font-semibold text-gray-500">
            Creator Report
          </span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-8">
        <ProfileCard creator={creator} onVerify={() => setShowVerifyForm(true)} />
        <ImpactOverview creator={creator} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ContentDistribution creator={creator} />
          <ImageEngagement creator={creator} />
          <ReelEngagement creator={creator} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AudienceGender />
          <AudienceDemographics />
        </div>

        <CredibilityCard creator={creator} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 text-[10px] uppercase tracking-[0.2em] font-montserrat font-semibold">
          <span className="text-gray-400">
            Source: {creator.data_source} · Confidence{" "}
            {Math.round(creator.confidence_score * 100)}%
          </span>
          <a
            href={creator.profile_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#3D5449] hover:text-[#2D3F37] transition-colors"
          >
            View on Instagram <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {showVerifyForm && (
          <VerificationRequestForm
            creatorId={creator.id}
            onSuccess={() => setShowVerifyForm(false)}
            onCancel={() => setShowVerifyForm(false)}
          />
        )}
      </main>
    </div>
  );
}

function ProfileCard({
  creator,
  onVerify,
}: {
  creator: Creator;
  onVerify: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card relative overflow-hidden p-7 sm:p-9"
    >
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#F5E68E]/15 rounded-full -mr-36 -mt-36 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative shrink-0">
          {creator.profile_image_url ? (
            <img
              src={proxyImage(creator.profile_image_url)}
              alt={creator.profile_name ?? creator.username}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-1 ring-gray-200/80"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${creator.username}&background=3D5449&color=fff&size=112`;
              }}
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#3D5449] flex items-center justify-center text-white text-3xl font-cormorant font-bold">
              {(creator.profile_name ?? creator.username)[0].toUpperCase()}
            </div>
          )}
          {creator.is_platform_verified && (
            <CheckCircle className="absolute -bottom-1 -right-1 w-6 h-6 text-[#3D5449] fill-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <span className="eyebrow text-[#4A6357] mb-2 block">
            {creator.primary_niche} &middot; {creator.platform}
          </span>
          <h1 className="font-cormorant font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 leading-[1.05] mb-2">
            {creator.profile_name ?? creator.username}
          </h1>
          <p className="text-sm text-gray-400 mb-3 font-inter">
            @{creator.username}
          </p>
          {creator.bio && (
            <p className="text-base text-gray-600 max-w-2xl leading-relaxed font-inter">
              {creator.bio}
            </p>
          )}
          {creator.is_verified && (
            <span className="badge bg-[#F5E68E]/40 text-[#3D5449] border border-[#F5E68E] mt-4">
              <CheckCircle className="w-3 h-3" /> ORIGO Verified
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2.5 shrink-0 w-full md:w-auto">
          <button className="btn-secondary text-[10px] !py-2.5">
            <Calendar className="w-3 h-3" /> Schedule Meeting
          </button>
          <button className="btn-primary text-[10px] !py-2.5">
            <Send className="w-3 h-3" /> Invite to Campaign
          </button>
          {!creator.is_verified && (
            <button
              onClick={onVerify}
              className="text-[10px] uppercase font-montserrat font-bold tracking-[0.2em] text-[#C8503A] hover:underline flex items-center justify-center gap-1.5 mt-1"
            >
              <Shield className="w-3 h-3" /> Request Verification
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ImpactOverview({ creator }: { creator: Creator }) {
  const kpis = [
    {
      icon: <Users className="w-4 h-4" />,
      label: "Followers",
      value: formatNumber(creator.followers),
      accent: PALETTE.green,
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: "Engagement Rate",
      value:
        creator.estimated_engagement_rate != null
          ? `${creator.estimated_engagement_rate.toFixed(2)}%`
          : "—",
      accent: PALETTE.peach,
    },
    {
      icon: <Film className="w-4 h-4" />,
      label: "Reels Reach",
      value: formatNumber(creator.reel_estimated_reach),
      accent: PALETTE.purple,
    },
    {
      icon: <ImageIcon className="w-4 h-4" />,
      label: "Image Reach",
      value: formatNumber(creator.image_estimated_reach),
      accent: PALETTE.teal,
    },
  ];

  return (
    <div>
      <h2 className="eyebrow text-[#4A6357] mb-4">Impact Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card !p-5 flex flex-col gap-3"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: k.accent }}
            >
              {k.icon}
            </div>
            <div>
              <p className="eyebrow-sm text-gray-400 mb-1.5">{k.label}</p>
              <p className="text-3xl font-cormorant font-bold text-gray-900 leading-none">
                {k.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ContentDistribution({ creator }: { creator: Creator }) {
  const imgWeight = creator.image_avg_likes ?? 0;
  const reelWeight = creator.reel_avg_likes ?? 0;
  const total = imgWeight + reelWeight || 1;

  const data = [
    {
      name: "Images",
      value: Math.round((imgWeight / total) * 100),
      color: PALETTE.yellow,
    },
    {
      name: "Reels",
      value: Math.round((reelWeight / total) * 100),
      color: PALETTE.purple,
    },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center text-gray-400">
        <p className="eyebrow text-[#4A6357] mb-1.5">Content Distribution</p>
        <p className="text-sm font-inter">No post data</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="eyebrow text-[#4A6357] mb-4">Content Distribution</h3>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={42}
              outerRadius={72}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-5 text-[10px] uppercase tracking-[0.2em] font-montserrat font-semibold">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-gray-500">{d.name}</span>
            <span className="text-[#3D5449]">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageEngagement({ creator }: { creator: Creator }) {
  const n = creator.image_sample_size ?? 0;
  const isEstimated = n === 0;
  return (
    <EngagementCard
      title="Image Engagement"
      icon={<ImageIcon className="w-3.5 h-3.5" />}
      accentBar="bg-[#F5E68E]"
      engagement={creator.image_engagement_rate}
      caption={
        isEstimated
          ? "Estimated — no recent image posts"
          : `Based on ${n} recent image post${n > 1 ? "s" : ""}`
      }
      rows={[
        ["Avg Likes", formatNumber(creator.image_avg_likes), <Heart key="h" className="w-3 h-3" />],
        ["Avg Comments", formatNumber(creator.image_avg_comments), <MessageCircle key="c" className="w-3 h-3" />],
        ["Est. Reach", formatNumber(creator.image_estimated_reach), <Eye key="r" className="w-3 h-3" />],
      ]}
    />
  );
}

function ReelEngagement({ creator }: { creator: Creator }) {
  const n = creator.reel_sample_size ?? 0;
  const isEstimated = n === 0;
  return (
    <EngagementCard
      title="Reel Engagement"
      icon={<Film className="w-3.5 h-3.5" />}
      accentBar="bg-[#B794C0]"
      engagement={creator.reel_engagement_rate}
      caption={
        isEstimated
          ? "Estimated — no recent reels"
          : `Based on ${n} recent reel${n > 1 ? "s" : ""}`
      }
      rows={[
        ["Avg Likes", formatNumber(creator.reel_avg_likes), <Heart key="h" className="w-3 h-3" />],
        ["Avg Comments", formatNumber(creator.reel_avg_comments), <MessageCircle key="c" className="w-3 h-3" />],
        ["Avg Views", formatNumber(creator.reel_avg_views), <Eye key="v" className="w-3 h-3" />],
      ]}
    />
  );
}

function EngagementCard({
  title,
  icon,
  accentBar,
  engagement,
  caption,
  rows,
}: {
  title: string;
  icon: React.ReactNode;
  accentBar: string;
  engagement: number | null;
  caption: string;
  rows: [string, string, React.ReactNode][];
}) {
  return (
    <div className="card !p-0 overflow-hidden">
      <div className={`h-1 ${accentBar}`} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="eyebrow text-[#4A6357] flex items-center gap-2">
            {icon} {title}
          </h3>
          {engagement != null && (
            <span className="badge bg-[#3D5449] text-white">
              {engagement.toFixed(2)}% ER
            </span>
          )}
        </div>
        <div className="space-y-2.5">
          {rows.map(([label, value, ic]) => (
            <div
              key={label}
              className="flex items-center justify-between py-1.5 border-b border-gray-200/60 last:border-0"
            >
              <span className="flex items-center gap-2 eyebrow-sm text-gray-400">
                {ic} {label}
              </span>
              <span className="font-cormorant font-bold text-gray-900 text-base">
                {value}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[9px] uppercase tracking-[0.2em] font-montserrat font-semibold text-gray-300 mt-4 text-center">
          {caption}
        </p>
      </div>
    </div>
  );
}

function AudienceGender() {
  const data = [
    { name: "Female", value: 68, color: PALETTE.peach },
    { name: "Male", value: 30, color: PALETTE.greenSoft },
    { name: "Other", value: 2, color: PALETTE.muted },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="eyebrow text-[#4A6357]">Audience Gender</h3>
        <span className="badge bg-[#EFEFED] text-gray-400 border border-gray-200/60">
          Estimated
        </span>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={52}
              outerRadius={84}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-around text-[10px] uppercase tracking-[0.2em] font-montserrat font-semibold">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-gray-500">{d.name}</span>
            <span className="text-[#3D5449]">{d.value}%</span>
          </div>
        ))}
      </div>
      <p className="text-[9px] uppercase tracking-[0.2em] font-montserrat font-semibold text-gray-300 mt-3 text-center">
        Estimated from niche &amp; regional averages
      </p>
    </div>
  );
}

function AudienceDemographics() {
  const data = [
    { age: "13-17", percent: 8 },
    { age: "18-24", percent: 34 },
    { age: "25-34", percent: 38 },
    { age: "35-44", percent: 14 },
    { age: "45-54", percent: 4 },
    { age: "55+", percent: 2 },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="eyebrow text-[#4A6357]">Age Distribution</h3>
        <span className="badge bg-[#EFEFED] text-gray-400 border border-gray-200/60">
          Estimated
        </span>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="age"
              tick={{ fontSize: 10, fill: PALETTE.muted, fontFamily: "var(--font-montserrat)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip formatter={(v: number) => `${v}%`} cursor={{ fill: "#EFEFED" }} />
            <Bar dataKey="percent" fill={PALETTE.green} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[9px] uppercase tracking-[0.2em] font-montserrat font-semibold text-gray-300 mt-3 text-center">
        Estimated from niche &amp; regional averages
      </p>
    </div>
  );
}

function CredibilityCard({ creator }: { creator: Creator }) {
  const score = creator.creator_score ?? 0;
  const ring = `conic-gradient(#3D5449 0% ${score}%, #EFEFED ${score}% 100%)`;

  return (
    <div className="card flex flex-col sm:flex-row items-center gap-7 p-7 sm:p-9 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5E68E]/15 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center shrink-0 relative"
        style={{ background: ring }}
      >
        <div className="w-24 h-24 rounded-full grain-bg flex flex-col items-center justify-center">
          <span className="text-3xl font-cormorant font-bold text-[#3D5449] leading-none">
            {Math.round(score)}
          </span>
          <span className="eyebrow-sm text-gray-400 mt-1">/100</span>
        </div>
      </div>
      <div className="flex-1 text-center sm:text-left relative">
        <span className="eyebrow text-[#4A6357] mb-2 flex items-center gap-2 justify-center sm:justify-start">
          <Sparkles className="w-3.5 h-3.5" />
          Credibility Score
        </span>
        <h3 className="font-cormorant font-bold text-2xl sm:text-3xl text-gray-900 mb-2 leading-tight">
          A signal of partnership fit.
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xl font-inter">
          Calculated from follower tier, authentic engagement, bio quality, profile signals,
          and data confidence. Higher scores indicate stronger fit for brand collaboration.
        </p>
      </div>
    </div>
  );
}

function LoadingState({ username }: { username: string }) {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-2 border-gray-200 border-t-[#3D5449] rounded-full animate-spin mb-5" />
        <p className="font-cormorant font-bold text-2xl text-gray-900 mb-1.5">
          Analyzing @{username}
        </p>
        <p className="text-[10px] uppercase tracking-[0.25em] font-montserrat font-semibold text-gray-400">
          Fetching public Instagram data
        </p>
      </div>
    </div>
  );
}
