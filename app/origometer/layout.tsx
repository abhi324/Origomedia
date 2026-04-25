import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Origometer | Creator Analytics by ORIGO",
    template: "%s | Origometer by ORIGO",
  },
  description:
    "Look up any Instagram creator and pull real engagement, reach, content mix, and a credibility score. The public creator-vetting tool from ORIGO.",
  keywords: [
    "creator analytics",
    "influencer analytics",
    "Instagram creator lookup",
    "engagement rate calculator",
    "creator credibility score",
    "influencer vetting tool",
    "nano influencer analytics",
    "micro creator analytics",
    "ORIGO Origometer",
    "origomedia",
  ],
  alternates: { canonical: "/origometer" },
  openGraph: {
    title: "Origometer | Creator Analytics by ORIGO",
    description:
      "Public Instagram analytics for any creator — followers, engagement, reach, and an ORIGO credibility score.",
    url: "https://origomedia.co/origometer",
    images: [
      {
        url: "/logo-v2.png",
        width: 1200,
        height: 630,
        alt: "Origometer — Creator analytics by ORIGO",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Origometer | Creator Analytics by ORIGO",
    description:
      "Look up any Instagram creator — engagement, reach, credibility score.",
    images: ["/logo-v2.png"],
  },
};

export default function OrigometerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "@id": "https://origomedia.co/origometer#webapp",
            name: "Origometer",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: "https://origomedia.co/origometer",
            description:
              "Public Instagram creator analytics — followers, engagement, reach, content breakdown, and an ORIGO credibility score.",
            publisher: {
              "@type": "Organization",
              name: "ORIGO MEDIA GROUP",
              url: "https://origomedia.co",
              logo: "https://origomedia.co/logo-v2.png",
            },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
