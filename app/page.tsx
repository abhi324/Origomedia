import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import JourneySection from "@/components/JourneySection";
import AsymmetricContent from "@/components/AsymmetricContent";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FCF9F5] selection:bg-[#5F7F6F]/20">
      <Navbar />
      <Hero />
      <JourneySection />
      <AsymmetricContent />
      <Footer />
    </main>
  );
}
