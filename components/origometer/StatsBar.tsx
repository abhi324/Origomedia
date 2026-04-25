"use client";

import { useEffect, useState } from "react";
import { listCreators } from "@/lib/origometer/api";

export function StatsBar() {
  const [stats, setStats] = useState({ total: 0, verified: 0, beauty: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [all, verified, beauty] = await Promise.all([
          listCreators({ limit: 1 }),
          listCreators({ verified_only: true, limit: 1 }),
          listCreators({ niche: "beauty", limit: 1 }),
        ]);
        setStats({
          total: all.count,
          verified: verified.count,
          beauty: beauty.count,
        });
      } catch {
        /* stats are non-critical */
      }
    }
    load();
  }, []);

  const items = [
    { label: "Creators discovered", value: stats.total.toLocaleString() },
    { label: "ORIGO verified", value: stats.verified.toLocaleString() },
    { label: "Beauty & skincare", value: stats.beauty.toLocaleString() },
    { label: "Platforms", value: "1" },
  ];

  return (
    <div className="grain-bg border-y border-gray-200/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
            <span className="text-2xl sm:text-3xl font-cormorant font-bold text-[#3D5449] leading-none">
              {item.value}
            </span>
            <span className="eyebrow-sm text-gray-400 mt-1 sm:mt-0">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
