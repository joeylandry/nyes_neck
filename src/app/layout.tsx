import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NYES NECK",
  description:
    "Premium Cape Cod lifestyle apparel rooted in Nyes Neck, North Falmouth, and the Upper Cape.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cormorantGaramond.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
