"use client";

import { useState } from "react";
import { Filter, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NicheType } from "@/types/origometer";

const NICHES: NicheType[] = [
  "beauty",
  "skincare",
  "haircare",
  "lifestyle",
  "fashion",
  "fitness",
  "travel",
  "food",
];

interface Props {
  onFilter: (params: Record<string, any>) => void;
}

export function DiscoveryFilters({ onFilter }: Props) {
  const [niche, setNiche] = useState<NicheType | "">("");
  const [minFollowers, setMinFollowers] = useState("");
  const [minEngagement, setMinEngagement] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  function apply() {
    onFilter({
      platform: "instagram",
      niche: niche || undefined,
      min_followers: minFollowers ? parseInt(minFollowers) : undefined,
      min_engagement: minEngagement ? parseFloat(minEngagement) : undefined,
      verified_only: verifiedOnly,
    });
  }

  function reset() {
    setNiche("");
    setMinFollowers("");
    setMinEngagement("");
    setVerifiedOnly(false);
    onFilter({});
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 eyebrow text-[#4A6357]">
        <Filter className="w-3.5 h-3.5" />
        Filters
      </div>

      <Section title="Niche">
        {NICHES.map((n) => (
          <FilterChip
            key={n}
            label={n}
            active={niche === n}
            onClick={() => setNiche(niche === n ? "" : n)}
          />
        ))}
      </Section>

      <Section title="Min. Followers">
        <input
          type="number"
          placeholder="e.g. 10000"
          className="input text-sm py-2.5"
          value={minFollowers}
          onChange={(e) => setMinFollowers(e.target.value)}
        />
      </Section>

      <Section title="Min. Engagement %">
        <input
          type="number"
          step="0.1"
          placeholder="e.g. 2.5"
          className="input text-sm py-2.5"
          value={minEngagement}
          onChange={(e) => setMinEngagement(e.target.value)}
        />
      </Section>

      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)}
          className="rounded accent-[#3D5449] w-3.5 h-3.5"
        />
        <span className="text-[10px] uppercase tracking-[0.2em] font-montserrat font-semibold text-gray-600">
          ORIGO Verified only
        </span>
      </label>

      <div className="flex gap-2">
        <button className="btn-primary flex-1 !py-2.5 text-[10px]" onClick={apply}>
          Apply
        </button>
        <button
          className="btn-secondary !px-3 !py-2.5"
          onClick={reset}
          title="Reset"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow-sm text-gray-400 mb-2.5">{title}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-montserrat font-semibold capitalize transition-all duration-150",
        active
          ? "bg-[#3D5449] text-white border border-[#3D5449]"
          : "grain-bg border border-gray-300/70 text-gray-500 hover:border-[#3D5449] hover:text-[#3D5449]"
      )}
    >
      {label}
    </button>
  );
}
