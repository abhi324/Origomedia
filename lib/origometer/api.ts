import axios from "axios";
import type {
  Creator,
  LookupResponse,
  CreatorsListResponse,
  Platform,
  VerificationRequest,
} from "@/types/origometer";

// Static export: no Next.js rewrites. The browser hits the backend directly,
// so the URL must be baked in at build time via NEXT_PUBLIC_ORIGOMETER_API_URL.
// Backend must allow CORS from origomedia.co.
const API_BASE =
  process.env.NEXT_PUBLIC_ORIGOMETER_API_URL || "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 60_000,
});

export async function lookupCreator(
  username: string,
  platform: Platform,
  forceRefresh = false
): Promise<LookupResponse> {
  const res = await client.post<LookupResponse>("/api/v1/lookup", {
    username,
    platform,
    force_refresh: forceRefresh,
  });
  return res.data;
}

export async function listCreators(params: {
  platform?: Platform;
  niche?: string;
  min_followers?: number;
  min_engagement?: number;
  verified_only?: boolean;
  limit?: number;
  offset?: number;
}): Promise<CreatorsListResponse> {
  const res = await client.get<CreatorsListResponse>("/api/v1/creators", {
    params,
  });
  return res.data;
}

export async function getCreator(
  platform: Platform,
  username: string
): Promise<Creator> {
  const res = await client.get<Creator>(
    `/api/v1/creators/${platform}/${username}`
  );
  return res.data;
}

export async function submitVerification(payload: {
  creator_id: string;
  submitted_by: string;
  notes?: string;
  screenshot_urls?: string[];
}): Promise<{ message: string; request: VerificationRequest }> {
  const res = await client.post("/api/v1/verify/request", payload);
  return res.data;
}

export async function listVerificationRequests(
  status?: string
): Promise<{ requests: VerificationRequest[] }> {
  const res = await client.get("/api/v1/admin/verification/requests", {
    params: { status },
    headers: { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY ?? "" },
  });
  return res.data;
}

export async function decideVerification(
  request_id: string,
  approved: boolean
): Promise<{ message: string }> {
  const res = await client.post(
    "/api/v1/admin/verification/decide",
    { request_id, approved },
    { headers: { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY ?? "" } }
  );
  return res.data;
}
