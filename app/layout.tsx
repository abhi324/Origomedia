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
  keywords: "Creator marketing, brand growth, origo, premium brands, marketing network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${instrument.variable} ${mono.variable} ${montserrat.variable} ${robotoFlex.variable} ${arvo.variable} ${cormorant.variable}`}>
      <body className="antialiased selection:bg-origo-peach selection:text-origo-dark">
        {children}
      </body>
    </html>
  );
}
