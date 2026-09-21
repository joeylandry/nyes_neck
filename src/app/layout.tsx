import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { CartProvider } from "@/components/shop/CartProvider";
import { ANNOUNCEMENT_PREPAINT_SCRIPT } from "@/lib/announcement";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const description =
  "Premium Cape Cod lifestyle apparel rooted in Nyes Neck, North Falmouth, and the Upper Cape.";

export const metadata: Metadata = {
  // Lets every page declare relative canonical and Open Graph image URLs.
  metadataBase: getSiteUrl(),
  title: {
    default: "Nyes Neck Shop",
    template: "%s | Nyes Neck Shop",
  },
  description,
  applicationName: "Nyes Neck Shop",
  openGraph: {
    type: "website",
    siteName: "Nyes Neck Shop",
    title: "Nyes Neck Shop",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nyes Neck Shop",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#183247",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${dmSans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ANNOUNCEMENT_PREPAINT_SCRIPT }} />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
