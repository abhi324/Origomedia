import AboutContent from "@/components/AboutContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ORIGO | Fit over volume in influencer marketing",
  description: "ORIGO is an influencer marketing agency for beauty and skincare. We work with nano and micro creators, curated by niche, audience, and tone.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ORIGO | We don't chase volume. We curate fit.",
    description: "An influencer marketing agency for beauty and skincare, built for fit over volume.",
    url: "https://origomedia.co/about",
    images: ["/logo-v2.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About ORIGO",
    description: "We don't chase volume. We curate fit.",
    images: ["/logo-v2.png"],
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
