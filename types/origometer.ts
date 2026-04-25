export type Platform = "instagram";

export type NicheType =
  | "beauty"
  | "skincare"
  | "haircare"
  | "lifestyle"
  | "fashion"
  | "fitness"
  | "travel"
  | "food"
  | "general";

export interface NicheScore {
  niche: NicheType;
  score: number;
}

export interface Creator {
  id: string;
  platform: Platform;
  username: string;
  profile_name: string | null;
  bio: string | null;
  profile_url: string;
  profile_image_url: string | null;
  is_platform_verified: boolean;

  followers: number | null;
  followers_formatted: string;
  following: number | null;
  total_posts: number | null;
  avg_likes: number | null;
  avg_comments: number | null;
  estimated_engagement_rate: number | null;

  image_avg_likes: number | null;
  image_avg_comments: number | null;
  image_engagement_rate: number | null;
  image_estimated_reach: number | null;

  reel_avg_likes: number | null;
  reel_avg_comments: number | null;
  reel_avg_views: number | null;
  reel_engagement_rate: number | null;
  reel_estimated_reach: number | null;

  image_sample_size?: number;
  reel_sample_size?: number;

  primary_niche: NicheType;
  niches: NicheScore[];

  data_source: string;
  confidence_score: number;
  is_verified: boolean;
  creator_score: number | null;

  last_scraped_at: string | null;
  created_at: string;
}

export interface LookupResponse {
  source: "cache" | "live";
  data: Creator;
}

export interface CreatorsListResponse {
  creators: Creator[];
  count: number;
}

export interface VerificationRequest {
  id: string;
  creator_id: string;
  submitted_by: string;
  notes: string | null;
  screenshot_urls: string[];
  status: "pending" | "approved" | "rejected";
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  creators?: Creator;
}
