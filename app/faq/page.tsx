import FAQContent from "@/components/FAQContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Influencer Marketing FAQ | Beauty & Skincare Brand Strategy | ORIGO",
  description: "Have questions about how ORIGO connects beauty brands with micro-creators? Explore our FAQ to learn about our intentional selection process and partnership model.",
  openGraph: {
    title: "ORIGO FAQ | Understanding Intentional Influence",
    description: "Find answers to common questions about influencer marketing strategies, creator selection, and beauty brand partnerships at ORIGO.",
    url: "https://origomedia.co/faq",
  }
};

export default function FAQPage() {
  return <FAQContent />;
}
