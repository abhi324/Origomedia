"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";
import { listVerificationRequests, decideVerification } from "@/lib/origometer/api";
import type { VerificationRequest } from "@/types/origometer";
import { formatNumber } from "@/lib/origometer/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

type Tab = "pending" | "approved" | "rejected";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await listVerificationRequests(tab);
      setRequests(res.requests);
    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function decide(requestId: string, approved: boolean) {
    try {
      await decideVerification(requestId, approved);
      toast.success(approved ? "Creator verified" : "Request rejected");
      load();
    } catch {
      toast.error("Action failed");
    }
  }

  const TABS: { value: Tab; label: string; activeClass: string }[] = [
    {
      value: "pending",
      label: "Pending",
      activeClass: "bg-[#F5E68E]/40 text-[#3D5449] border-[#F5E68E]",
    },
    {
      value: "approved",
      label: "Approved",
      activeClass: "bg-[#3D5449] text-white border-[#3D5449]",
    },
    {
      value: "rejected",
      label: "Rejected",
      activeClass: "bg-[#C8503A]/10 text-[#C8503A] border-[#C8503A]/30",
    },
  ];

  return (
    <div className="w-full">
      <div className="grain-bg border-b border-gray-200/60">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center gap-4">
          <Link
            href="/origometer"
            className="text-gray-400 hover:text-[#3D5449] transition-colors flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] font-montserrat font-bold"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Link>
          <span className="text-gray-300">/</span>
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-montserrat font-semibold text-gray-500">
            <Shield className="w-3.5 h-3.5" /> Admin &middot; Verification Queue
          </span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <div className="mb-8">
          <span className="eyebrow text-[#4A6357] mb-3 block">Admin</span>
          <h1 className="font-cormorant font-bold text-4xl sm:text-5xl text-gray-900 leading-tight">
            Verification Queue
          </h1>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.25em] font-montserrat font-bold border transition-all",
                tab === t.value
                  ? t.activeClass
                  : "grain-bg border-gray-300/70 text-gray-500 hover:border-[#3D5449] hover:text-[#3D5449]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card animate-pulse h-28 bg-gray-100/40" />
            ))}
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="text-center py-20">
            <Clock className="w-10 h-10 mx-auto mb-4 text-gray-300" />
            <p className="font-cormorant font-bold text-2xl text-gray-500 mb-1">
              No {tab} requests
            </p>
            <p className="eyebrow-sm text-gray-400">Queue is empty</p>
          </div>
        )}

        <div className="space-y-3">
          {requests.map((req) => (
            <VerificationRequestCard
              key={req.id}
              request={req}
              showActions={tab === "pending"}
              onApprove={() => decide(req.id, true)}
              onReject={() => decide(req.id, false)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function VerificationRequestCard({
  request,
  showActions,
  onApprove,
  onReject,
}: {
  request: VerificationRequest;
  showActions: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const creator = request.creators;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex flex-col sm:flex-row items-start gap-4 sm:gap-6"
    >
      <div className="flex-1 min-w-0">
        {creator && (
          <>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-cormorant font-bold text-gray-900 text-lg leading-tight">
                {creator.profile_name ?? `@${creator.username}`}
              </span>
              <span className="eyebrow-sm text-gray-400">
                @{creator.username} &middot; {creator.platform}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-montserrat font-semibold text-gray-500 mb-3 flex-wrap">
              <span>{formatNumber(creator.followers)} followers</span>
              {creator.estimated_engagement_rate && (
                <span>
                  {creator.estimated_engagement_rate.toFixed(1)}% ER
                </span>
              )}
              <span>Score: {creator.creator_score ?? "—"}</span>
              {creator.primary_niche && (
                <span className="capitalize">{creator.primary_niche}</span>
              )}
            </div>
          </>
        )}

        <p className="text-[10px] uppercase tracking-[0.2em] font-montserrat font-semibold text-gray-400">
          By <span className="text-gray-700">{request.submitted_by}</span> &middot;{" "}
          {new Date(request.created_at).toLocaleDateString()}
        </p>

        {request.notes && (
          <p className="text-sm text-gray-600 mt-3 bg-[#EFEFED]/60 rounded-lg px-3 py-2.5 border border-gray-200/60 font-inter leading-relaxed">
            {request.notes}
          </p>
        )}

        {request.screenshot_urls?.length > 0 && (
          <div className="flex gap-3 mt-3 flex-wrap">
            {request.screenshot_urls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.2em] font-montserrat font-bold text-[#3D5449] hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" /> Proof {i + 1}
              </a>
            ))}
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={onReject}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-[#C8503A]/30 bg-[#C8503A]/10 text-[#C8503A] text-[10px] uppercase tracking-[0.2em] font-montserrat font-bold hover:bg-[#C8503A]/20 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
          <button
            onClick={onApprove}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#3D5449] text-white text-[10px] uppercase tracking-[0.2em] font-montserrat font-bold hover:bg-[#2D3F37] transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Approve
          </button>
        </div>
      )}

      {!showActions && (
        <span
          className={cn(
            "badge shrink-0",
            request.status === "approved"
              ? "bg-[#3D5449] text-white"
              : "bg-[#C8503A]/10 text-[#C8503A] border border-[#C8503A]/30"
          )}
        >
          {request.status === "approved" ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          )}
          {request.status}
        </span>
      )}
    </motion.div>
  );
}
