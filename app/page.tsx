import { Metadata } from "next";
import Hero from "@/components/Hero";
import JourneySection from "@/components/JourneySection";
import AsymmetricContent from "@/components/AsymmetricContent";
import FinalCTA from "@/components/FinalCTA";

export const metadata: Metadata = {
  title: "ORIGO | Beauty & Skincare Influencer Marketing Agency",
  description: "ORIGO is a premier influencer marketing agency specializing in beauty and skincare. We connect authentic nano and micro creators with visionary brands through intentional, high-impact partnerships.",
  openGraph: {
    title: "ORIGO | The Genesis of Intentional Influence",
    description: "Specialized influencer marketing for the beauty and skincare industry. Connecting authentic voices with visionary brands.",
    url: "https://origomedia.co",
  }
};

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-[#4A6357]/20">
      <Hero />
      <JourneySection />
      <AsymmetricContent />
      <FinalCTA />
    </main>
  );
}
