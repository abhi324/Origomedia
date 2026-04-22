import { Inter, Playfair_Display, Instrument_Serif, JetBrains_Mono, Montserrat, Roboto_Flex, Arvo, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap"
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap"
});

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  display: "swap"
});

const arvo = Arvo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-arvo",
  display: "swap"
});

export const metadata = {
  title: "ORIGO | Growth Starts from the Right Origin",
  description: "ORIGO connects premium brands with the right Creators. Minimal, high-end editorial brand presence and Creator networking.",
  keywords: ["Creator marketing", "brand growth", "origo", "premium brands", "marketing network", "beauty niche", "creator agency"],
  authors: [{ name: "ORIGO MEDIA GROUP" }],
  openGraph: {
    title: "ORIGO | Growth Starts from the Right Origin",
    description: "Connecting premium brands with elite Creators through niche expertise.",
    url: "https://origomedia.co",
    siteName: "ORIGO",
    images: [
      {
        url: "/logo-v2.png",
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
    images: ["/logo-v2.png"],
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
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${instrument.variable} ${mono.variable} ${montserrat.variable} ${robotoFlex.variable} ${arvo.variable} ${cormorant.variable}`}>
      <body className="antialiased selection:bg-origo-peach selection:text-origo-dark overflow-x-hidden w-full">
        <div className="relative w-full flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow w-full max-w-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
