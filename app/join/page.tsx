import JoinContent from "@/components/JoinContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join as a Creator | ORIGO",
  description:
    "Apply to the ORIGO creator network. Nano and micro creators across every category — curated by fit, not follower count.",
  alternates: { canonical: "/join" },
  openGraph: {
    title: "Join ORIGO | Influencer Marketing Agency",
    description:
      "Apply to the ORIGO creator network. Curated brand collaborations for nano and micro creators across every category.",
    url: "https://origomedia.co/join",
    images: ["/logo-v2.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join ORIGO",
    description: "Apply to the creator network.",
    images: ["/logo-v2.png"],
  },
};

export default function JoinPage() {
  return <JoinContent />;
}
