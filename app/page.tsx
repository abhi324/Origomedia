import { Metadata } from "next";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import OrigometerSection from "@/components/OrigometerSection";
import JourneySection from "@/components/JourneySection";
import CreatorTiers from "@/components/CreatorTiers";
import FoundingProgram from "@/components/FoundingProgram";

export const metadata: Metadata = {
  title: "ORIGO | Influencer Marketing Agency",
  description:
    "ORIGO connects brands with vetted nano and micro creators across every category. Curated fit over volume — plus the Origometer, our public creator analytics tool.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ORIGO | Turn your content into income.",
    description:
      "A creator-first influencer marketing agency. Nano and micro creators across every category, curated for fit.",
    url: "https://origomedia.co",
    images: ["/logo-v2.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ORIGO | Influencer Marketing Agency",
    description: "We don't chase volume. We curate fit.",
    images: ["/logo-v2.png"],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-[#4A6357]/20">
      <Hero />
      <Problem />
      <Solution />
      <OrigometerSection />
      <JourneySection />
      <CreatorTiers />
      <FoundingProgram />
    </main>
  );
}
