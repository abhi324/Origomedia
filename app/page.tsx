import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import JourneySection from "@/components/JourneySection";
import MidPageBanner from "@/components/MidPageBanner";
import AsymmetricContent from "@/components/AsymmetricContent";
import Footer from "@/components/Footer";
import FloatingBlobs from "@/components/FloatingBlobs";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FCF9F5] selection:bg-[#5F7F6F]/20 relative">
      <FloatingBlobs />
      <Navbar />
      <div className="relative z-10">
        <Hero />
        <JourneySection />
        <MidPageBanner />
        <AsymmetricContent />
        <Footer />
      </div>
    </main>
  );
}
