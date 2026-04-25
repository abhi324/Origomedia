import AboutContent from "@/components/AboutContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ORIGO | Fit over volume in influencer marketing",
  description:
    "ORIGO is an influencer marketing agency working with nano and micro creators across every category, curated by niche, audience, and tone.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ORIGO | We don't chase volume. We curate fit.",
    description:
      "An influencer marketing agency built for fit over volume. Nano and micro creators across every category.",
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
