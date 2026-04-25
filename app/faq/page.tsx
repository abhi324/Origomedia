import FAQContent from "@/components/FAQContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | ORIGO",
  description:
    "How ORIGO selects creators, what a brand campaign looks like, and how nano and micro creators across every category can join.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ | ORIGO",
    description:
      "Common questions about working with ORIGO as a brand, and applying as a creator.",
    url: "https://origomedia.co/faq",
    images: ["/logo-v2.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ORIGO | FAQ",
    description: "How we work with brands and creators.",
    images: ["/logo-v2.png"],
  },
};

export default function FAQPage() {
  return <FAQContent />;
}
