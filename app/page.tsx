import Hero from "@/components/Hero";
import JourneySection from "@/components/JourneySection";
import AsymmetricContent from "@/components/AsymmetricContent";
import FinalCTA from "@/components/FinalCTA";

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
