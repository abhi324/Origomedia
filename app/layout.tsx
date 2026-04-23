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
    default: "ORIGO | Beauty & Skincare Influencer Marketing Agency",
    template: "%s | ORIGO"
  },
  description: "ORIGO bridges the gap between visionary creators and institutional excellence in beauty and skincare through precision-matched influencer marketing.",
  keywords: ["Beauty Influencer Agency", "Skincare Marketing Agency", "Nano Influencer Network", "Micro Creator Partnerships", "Beauty Brand Growth", "Intentional Influence"],
  authors: [{ name: "ORIGO MEDIA GROUP" }],
  openGraph: {
    title: "ORIGO | Bridging Vision and Voice",
    description: "Specialized influencer marketing for beauty and skincare. We curate intentional collaborations that resonate.",
    url: "https://origomedia.co",
    siteName: "ORIGO",
    images: [
      {
        url: "https://origomedia.co/logo-v2.png",
        width: 1200,
        height: 630,
        alt: "ORIGO Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ORIGO | Growth Starts from the Right Origin",
    description: "Connecting premium brands with elite Creators.",
    images: ["https://origomedia.co/logo-v2.png"],
  },
  icons: {
    icon: "/logo-v2.png",
    apple: "/logo-v2.png",
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
                "name": "ORIGO MEDIA GROUP",
                "url": "https://origomedia.co",
                "logo": "https://origomedia.co/logo-v2.png",
                "description": "Premium brand and creator networking agency.",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "origomedia.co@gmail.com",
                  "contactType": "customer service"
                },
                "sameAs": [
                  "https://instagram.com/origomedia"
                ]
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
