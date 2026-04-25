import { Metadata } from "next";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import JourneySection from "@/components/JourneySection";
import CreatorTiers from "@/components/CreatorTiers";
import FoundingProgram from "@/components/FoundingProgram";

export const metadata: Metadata = {
  title: "ORIGO | Beauty & Skincare Influencer Marketing Agency",
  description: "Origo connects beauty and skincare brands with vetted nano and micro creators. Curated fit over volume.",
  openGraph: {
    title: "ORIGO | Turn your content into income.",
    description: "A creator-first agency for beauty and skincare. Nano and micro creators, curated for fit.",
    url: "https://origomedia.co",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-[#4A6357]/20">
      <Hero />
      <Problem />
      <Solution />
      <JourneySection />
      <CreatorTiers />
      <FoundingProgram />
    </main>
  );
}
