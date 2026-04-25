import { Inter, Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap"
});

export const metadata = {
  metadataBase: new URL("https://origomedia.co"),
  title: {
    default: "ORIGO | Influencer Marketing Agency",
    template: "%s | ORIGO"
  },
  description: "ORIGO is an influencer marketing agency for beauty and skincare. We connect brands with vetted nano and micro creators, curated by fit.",
  keywords: [
    "beauty influencer agency",
    "skincare marketing agency",
    "nano influencer agency India",
    "micro creator agency",
    "beauty creator network",
    "skincare influencer marketing",
    "dermacosmetics creators",
    "makeup creators",
    "ORIGO Media",
    "origomedia",
  ],
  authors: [{ name: "ORIGO MEDIA GROUP" }],
  creator: "ORIGO MEDIA GROUP",
  publisher: "ORIGO MEDIA GROUP",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "ORIGO | Turn your content into income.",
    description: "A creator-first agency for beauty and skincare. Nano and micro creators, curated for fit.",
    url: "https://origomedia.co",
    siteName: "ORIGO",
    images: [
      {
        url: "/logo-v2.png",
        width: 1200,
        height: 630,
        alt: "ORIGO — Beauty & skincare influencer marketing agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ORIGO | Growth starts with the right origin.",
    description: "We don't chase volume. We curate fit.",
    images: ["/logo-v2.png"],
  },
  icons: {
    icon: "/logo-v2.png",
    apple: "/logo-v2.png",
  },
  verification: {
    // Add Google Search Console / Bing Webmaster tokens here when available.
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${cormorant.variable}`}>
      <body className="antialiased selection:bg-origo-peach selection:text-origo-dark overflow-x-hidden w-full">
        <div className="relative w-full flex flex-col min-h-screen">
          <Navbar />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://origomedia.co/#organization",
                "name": "ORIGO",
                "legalName": "ORIGO MEDIA GROUP",
                "alternateName": "Origo Media",
                "url": "https://origomedia.co",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://origomedia.co/logo-v2.png",
                  "width": 512,
                  "height": 512
                },
                "description": "An influencer marketing agency for beauty and skincare, connecting brands with vetted nano and micro creators.",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "origomedia.co@gmail.com",
                  "contactType": "customer service",
                  "areaServed": "IN",
                  "availableLanguage": ["en", "hi"]
                },
                "sameAs": [
                  "https://www.instagram.com/origomedia.co"
                ]
              })
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://origomedia.co/#website",
                "url": "https://origomedia.co",
                "name": "ORIGO",
                "description": "Beauty & skincare influencer marketing agency connecting brands with nano and micro creators.",
                "publisher": { "@id": "https://origomedia.co/#organization" },
                "inLanguage": "en-US"
              })
            }}
          />
          <main className="flex-grow w-full max-w-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
