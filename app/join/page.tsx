import JoinContent from "@/components/JoinContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner With Us | Beauty & Skincare Creator Network | ORIGO",
  description: "Join ORIGO's exclusive network. We connect nano and micro creators in the beauty and skincare space with high-value brand opportunities and paid campaigns.",
  openGraph: {
    title: "Join the ORIGO Network | Elevate Your Creator Career",
    description: "Apply to join ORIGO and gain access to intentional beauty and skincare brand collaborations designed for growth.",
    url: "https://origomedia.co/join",
  }
};

export default function JoinPage() {
  return <JoinContent />;
}
