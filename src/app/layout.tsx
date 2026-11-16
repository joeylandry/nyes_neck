import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { CartProvider } from "@/components/shop/CartProvider";
import { ANNOUNCEMENT_PREPAINT_SCRIPT } from "@/lib/announcement";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

// The fonts ship with the site (variable fonts, Latin subset, weights
// 400–700) instead of being downloaded from Google Fonts on every build, so a
// slow or failed font download can no longer break a deploy.
const cormorantGaramond = localFont({
  src: [{ path: "./fonts/CormorantGaramond-latin.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

const dmSans = localFont({
  src: [{ path: "./fonts/DMSans-latin.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-dm-sans",
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
    // Shown when the homepage or any page without its own image is shared;
    // product pages override it with the product photo.
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Nyes Neck at sunset, North Falmouth, Cape Cod" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nyes Neck Shop",
    description,
    images: ["/images/og-image.jpg"],
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
