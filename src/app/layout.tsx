import type { Metadata } from "next";
import { Manrope, Montserrat } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NYES NECK",
  description:
    "Premium Cape Cod lifestyle apparel rooted in Nyes Neck, North Falmouth, and the Upper Cape.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${montserrat.variable}`}>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
