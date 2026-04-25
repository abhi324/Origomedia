"use client";

const DARK_ITEMS = [
  "Creators first.",
  "Paid in 15 days.",
  "No middlemen.",
  "Curated, not scraped.",
  "Built for craft.",
  "Your voice. Your rules.",
];

const LIGHT_ITEMS = [
  "Skincare",
  "Dermacosmetics",
  "Makeup & Beauty",
  "Ritual",
  "Wellness",
  "Haircare",
  "Body Care",
  "Fragrance",
];

export default function MarqueeTicker({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const items = variant === "dark" ? DARK_ITEMS : LIGHT_ITEMS;
  const doubled = [...items, ...items];

  return (
    <div
      className={`w-full overflow-hidden py-3 ${
        variant === "dark"
          ? "bg-[#3D5449]"
          : "bg-transparent border-y border-gray-100"
      }`}
      aria-hidden="true"
    >
      <div className="flex whitespace-nowrap animate-marquee">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span
              className={`text-[10px] sm:text-[11px] uppercase font-montserrat font-semibold tracking-[0.3em] px-5 sm:px-7 ${
                variant === "dark" ? "text-white/55" : "text-gray-400"
              }`}
            >
              {item}
            </span>
            <span
              className={`w-1 h-1 rounded-full shrink-0 ${
                variant === "dark" ? "bg-[#F5E68E]/50" : "bg-[#4A6357]/30"
              }`}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
