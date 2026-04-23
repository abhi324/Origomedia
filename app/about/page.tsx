import AboutContent from "@/components/AboutContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | Beauty & Skincare Influencer Agency | ORIGO",
  description: "Discover the genesis of ORIGO. We bridge the gap between beauty brands and authentic creators through intentional, precision-matched influencer marketing strategy.",
  openGraph: {
    title: "The Origo Story | Intentional Influence in Beauty & Skincare",
    description: "Learn how Origo builds the bridge between brand vision and authentic creator voice in the beauty and skincare space.",
    url: "https://origomedia.co/about",
  }
};

export default function AboutPage() {
  return <AboutContent />;
}
