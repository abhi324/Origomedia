export function formatNumber(n: number | null | undefined): string {
  if (n == null) return "N/A";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function platformColor(platform: string): string {
  const map: Record<string, string> = {
    instagram: "from-purple-500 to-pink-500",
    youtube: "from-red-500 to-red-700",
    tiktok: "from-black to-gray-800",
  };
  return map[platform] ?? "from-gray-400 to-gray-600";
}

export function nicheEmoji(niche: string): string {
  const map: Record<string, string> = {
    beauty: "💄",
    skincare: "✨",
    haircare: "💇",
    lifestyle: "🌿",
    fashion: "👗",
    fitness: "💪",
    travel: "✈️",
    food: "🍽️",
    general: "🌐",
  };
  return map[niche] ?? "🌐";
}

export function confidenceLabel(score: number): { label: string; color: string } {
  if (score >= 0.8) return { label: "High", color: "text-emerald-600" };
  if (score >= 0.5) return { label: "Medium", color: "text-amber-500" };
  return { label: "Low", color: "text-red-500" };
}

export function creatorScoreColor(score: number | null): string {
  if (!score) return "text-gray-400";
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

const API_BASE =
  process.env.NEXT_PUBLIC_ORIGOMETER_API_URL || "http://127.0.0.1:8000";

/**
 * Wrap an Instagram CDN image URL through the backend proxy to bypass
 * Referer/expiration blocks. Static export → absolute backend URL.
 */
export function proxyImage(url: string | null | undefined): string {
  if (!url) return "";
  if (!url.startsWith("http")) return url;
  return `${API_BASE}/api/v1/media/proxy-image?url=${encodeURIComponent(url)}`;
}
