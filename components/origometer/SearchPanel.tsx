"use client";

import { useState } from "react";
import { Search, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Platform } from "@/types/origometer";

interface Props {
  onSearch: (username: string, platform: Platform) => void;
  isLoading: boolean;
}

const PLATFORMS: { value: Platform; label: string; icon: React.ReactNode }[] = [
  { value: "instagram", label: "Instagram", icon: <Instagram className="w-3.5 h-3.5" /> },
];

export function SearchPanel({ onSearch, isLoading }: Props) {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = username.trim().replace(/^@/, "");
    if (!clean) return;
    onSearch(clean, platform);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {PLATFORMS.length > 1 && (
        <div className="flex justify-center gap-2 mb-5">
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPlatform(p.value)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] uppercase font-montserrat font-bold tracking-[0.2em] transition-all duration-150",
                platform === p.value
                  ? "bg-[#3D5449] text-white"
                  : "grain-bg border border-gray-300/70 text-gray-500 hover:border-[#3D5449] hover:text-[#3D5449]"
              )}
            >
              {p.icon}
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A6357] text-sm font-cormorant font-semibold">
            @
          </span>
          <input
            className="input pl-9 py-3.5"
            placeholder="creatorusername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !username.trim()}
          className="btn-primary min-w-[150px] py-3.5"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
          {isLoading ? "Fetching" : "Discover"}
        </button>
      </div>

      <p className="text-[10px] text-gray-400 font-montserrat tracking-[0.2em] uppercase mt-5 text-center">
        Public profile data &middot; No platform API keys required
      </p>
    </form>
  );
}
