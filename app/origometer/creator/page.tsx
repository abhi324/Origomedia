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
  Tooltip,
} from "recharts";
import { lookupCreator, pingBackend } from "@/lib/origometer/api";
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
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [showVerifyForm, setShowVerifyForm] = useState(false);

  useEffect(() => {
    // Wake the backend immediately — by the time we issue the actual lookup
    // (which happens in this same effect), it's hopefully already warm.
    pingBackend();
  }, []);

  useEffect(() => {
    if (!username) {
      router.push("/origometer");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        let res = await lookupCreator(username, "instagram");
        const hasBreakdown =
          res.data?.image_avg_likes != null || res.data?.reel_avg_likes != null;
        if (!hasBreakdown) {
          res = await lookupCreator(username, "instagram", true);
        }
        if (!cancelled) setCreator(res.data);
      } catch (err: any) {
        if (cancelled) return;
        const detail = err?.response?.data?.detail;
        const msg =
          typeof detail === "string"
            ? detail
            : detail?.error ??
              (err?.code === "ECONNABORTED"
                ? "Took too long to respond — Instagram may be rate-limiting. Try again."
                : "Couldn't load this creator. Try again or check the username.");
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username, router, attempt]);

  if (loading) return <LoadingState username={username} />;
  if (error) {
    return (
      <ErrorState
        username={username}
        message={error}
        onRetry={() => setAttempt((a) => a + 1)}
      />
    );
  }
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

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-14 space-y-6 sm:space-y-8">
        <ProfileCard creator={creator} onVerify={() => setShowVerifyForm(true)} />
        <ImpactOverview creator={creator} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ContentDistribution creator={creator} />
          <ImageEngagement creator={creator} />
          <ReelEngagement creator={creator} />
        </div>

        <EngagementQuality creator={creator} />

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
      className="card relative overflow-hidden p-5 sm:p-9"
    >
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#F5E68E]/15 rounded-full -mr-36 -mt-36 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5 sm:gap-6">
        <div className="relative shrink-0 mx-auto md:mx-0">
          {creator.profile_image_url ? (
            <img
              src={proxyImage(creator.profile_image_url)}
              alt={creator.profile_name ?? creator.username}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover ring-1 ring-gray-200/80"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${creator.username}&background=3D5449&color=fff&size=112`;
              }}
            />
          ) : (
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#3D5449] flex items-center justify-center text-white text-2xl sm:text-3xl font-cormorant font-bold">
              {(creator.profile_name ?? creator.username)[0].toUpperCase()}
            </div>
          )}
          {creator.is_platform_verified && (
            <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 text-[#3D5449] fill-white" />
          )}
        </div>

        <div className="flex-1 min-w-0 text-center md:text-left">
          <span className="eyebrow text-[#4A6357] mb-2 block capitalize">
            {creator.primary_niche} &middot; {creator.platform}
          </span>
          <h1 className="font-cormorant font-bold text-2xl sm:text-4xl md:text-5xl text-gray-900 leading-[1.05] mb-2 break-words">
            {creator.profile_name ?? creator.username}
          </h1>
          <p className="text-sm text-gray-400 mb-3 font-inter break-all sm:break-normal">
            @{creator.username}
          </p>
          {creator.bio && (
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed font-inter">
              {creator.bio}
            </p>
          )}
          {creator.is_verified && (
            <span className="badge bg-[#F5E68E]/40 text-[#3D5449] border border-[#F5E68E] mt-3 sm:mt-4">
              <CheckCircle className="w-3 h-3" /> ORIGO Verified
            </span>
          )}
        </div>

        <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
          <button className="btn-secondary text-[10px] !py-2.5 flex-1 md:flex-none">
            <Calendar className="w-3 h-3" /> <span className="hidden sm:inline">Schedule</span> Meeting
          </button>
          <button className="btn-primary text-[10px] !py-2.5 flex-1 md:flex-none">
            <Send className="w-3 h-3" /> <span className="hidden sm:inline">Invite to</span> Campaign
          </button>
          {!creator.is_verified && (
            <button
              onClick={onVerify}
              className="hidden md:flex text-[10px] uppercase font-montserrat font-bold tracking-[0.2em] text-[#C8503A] hover:underline items-center justify-center gap-1.5 mt-1"
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
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="eyebrow text-[#4A6357]">Impact Overview</h2>
        {creator.is_benchmark_estimated && (
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-montserrat font-semibold text-[#C8503A] bg-[#C8503A]/10 px-3 py-1 rounded-full">
            Estimated · Industry benchmark
          </span>
        )}
      </div>
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

// All cells here are computed from public scraper data — no estimates.
function EngagementQuality({ creator }: { creator: Creator }) {
  const followers = creator.followers ?? 0;
  const following = creator.following ?? 0;
  const avgLikes = creator.avg_likes ?? 0;
  const avgComments = creator.avg_comments ?? 0;
  const totalPosts = creator.total_posts ?? 0;

  // Follower : following ratio. Healthy creators have far more followers than
  // following (>10:1 typical). A near-1:1 ratio suggests a follow-for-follow
  // account; very high ratios suggest a curator/celebrity profile.
  const followRatio =
    following > 0 ? followers / following : null;
  const followRatioLabel =
    followRatio == null
      ? "—"
      : followRatio >= 100
        ? `${(followRatio / 1).toFixed(0)}:1`
        : `${followRatio.toFixed(1)}:1`;

  // Like : comment ratio. Healthy ratios are 20:1 to 100:1. A very low ratio
  // (e.g. <10:1) often means engagement pods or comment-for-comment groups;
  // very high (>200:1) suggests passive double-tap engagement.
  const likeCommentRatio =
    avgComments > 0 ? avgLikes / avgComments : null;
  const likeCommentLabel =
    likeCommentRatio == null
      ? "—"
      : likeCommentRatio >= 100
        ? `${likeCommentRatio.toFixed(0)}:1`
        : `${likeCommentRatio.toFixed(1)}:1`;

  // Comments per 1k followers — direct measure of how many people care enough
  // to type, normalized so it's comparable across creator sizes.
  const commentsPer1k =
    followers > 0 ? (avgComments / followers) * 1000 : null;
  const commentsPer1kLabel =
    commentsPer1k == null
      ? "—"
      : commentsPer1k.toFixed(1);

  const cells: { label: string; value: string; hint: string }[] = [
    {
      label: "Follower : Following",
      value: followRatioLabel,
      hint:
        followRatio == null
          ? "Insufficient data"
          : followRatio >= 50
            ? "Curator / public figure"
            : followRatio >= 5
              ? "Healthy creator profile"
              : followRatio >= 1
                ? "Mutual / consumer-leaning"
                : "Following more than followed",
    },
    {
      label: "Likes : Comments",
      value: likeCommentLabel,
      hint:
        likeCommentRatio == null
          ? "No comment data"
          : likeCommentRatio < 20
            ? "Comment-heavy (engaged)"
            : likeCommentRatio < 100
              ? "Healthy mix"
              : "Like-heavy (passive)",
    },
    {
      label: "Comments per 1K followers",
      value: commentsPer1kLabel,
      hint:
        commentsPer1k == null
          ? "—"
          : commentsPer1k >= 5
            ? "Strong audience pull"
            : commentsPer1k >= 1
              ? "Average for the size tier"
              : "Quiet audience",
    },
    {
      label: "Posts in feed",
      value: totalPosts > 0 ? totalPosts.toLocaleString() : "—",
      hint:
        totalPosts >= 100
          ? "Established account"
          : totalPosts >= 30
            ? "Growing account"
            : totalPosts > 0
              ? "Newer account"
              : "—",
    },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="eyebrow text-[#4A6357]">Engagement Quality</h3>
        <span className="text-[9px] uppercase tracking-[0.2em] font-montserrat font-semibold text-gray-400">
          Computed from public data
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cells.map((c) => (
          <div
            key={c.label}
            className="flex flex-col gap-1.5 border-l-2 border-[#3D5449]/15 pl-4"
          >
            <p className="eyebrow-sm text-gray-400">{c.label}</p>
            <p className="text-2xl font-cormorant font-bold text-gray-900 leading-none">
              {c.value}
            </p>
            <p className="text-[10px] text-gray-500 font-inter leading-snug">
              {c.hint}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CredibilityCard({ creator }: { creator: Creator }) {
  const score = creator.creator_score ?? 0;
  const ring = `conic-gradient(#3D5449 0% ${score}%, #EFEFED ${score}% 100%)`;

  return (
    <div className="card flex flex-col sm:flex-row items-center gap-5 sm:gap-7 p-5 sm:p-9 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5E68E]/15 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
      <div
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shrink-0 relative"
        style={{ background: ring }}
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full grain-bg flex flex-col items-center justify-center">
          <span className="text-2xl sm:text-3xl font-cormorant font-bold text-[#3D5449] leading-none">
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
        <h3 className="font-cormorant font-bold text-xl sm:text-3xl text-gray-900 mb-2 leading-tight">
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

// Cycling status copy — keeps the user oriented during the 5-30s a fresh
// scrape can take (worst case: cold-start + first-time creator).
const LOADING_STAGES = [
  "Looking up the profile",
  "Reading public posts",
  "Calculating engagement",
  "Crunching the credibility score",
  "Almost there — first lookups can be slow",
];

function LoadingState({ username }: { username: string }) {
  const [stageIdx, setStageIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setStageIdx((i) => Math.min(i + 1, LOADING_STAGES.length - 1));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <div className="inline-block w-12 h-12 border-2 border-gray-200 border-t-[#3D5449] rounded-full animate-spin mb-5" />
        <p className="font-cormorant font-bold text-2xl sm:text-3xl text-gray-900 mb-2">
          Analyzing @{username || "creator"}
        </p>
        <p className="text-[10px] uppercase tracking-[0.25em] font-montserrat font-semibold text-gray-400 mb-3">
          {LOADING_STAGES[stageIdx]}
        </p>
      </div>
    </div>
  );
}

function ErrorState({
  username,
  message,
  onRetry,
}: {
  username: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center px-5 py-10">
      <div className="text-center max-w-md card !p-8">
        <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-[#C8503A]/10 border border-[#C8503A]/30 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-[#C8503A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="eyebrow text-[#4A6357] mb-3">Lookup failed</p>
        <p className="font-cormorant font-bold text-2xl sm:text-3xl text-gray-900 mb-2 leading-tight">
          We couldn&rsquo;t pull @{username || "that creator"}.
        </p>
        <p className="text-sm text-gray-500 font-inter leading-relaxed mb-6">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button onClick={onRetry} className="btn-primary !py-3">
            Try again
          </button>
          <Link href="/origometer" className="btn-secondary !py-3">
            New search
          </Link>
        </div>
      </div>
    </div>
  );
}
