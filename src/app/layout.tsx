import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.bostonlegendicecreamtruck.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e2c72e4fc41adc8f680014_a5a1d669e420812b3a56fb6706e45145_favicon-boston-legend-ice-cream-truck.png",
    shortcut: "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e2c72e4fc41adc8f680014_a5a1d669e420812b3a56fb6706e45145_favicon-boston-legend-ice-cream-truck.png",
    apple: "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e2c731abd6316959c63502_54b03788659eeaac6911fa083e1c20ee_webclip-boston-legend-ice-cream-truck.png",
  },
  title: {
    default: "Boston Legend Ice Cream Truck | Book Now in Greater Boston",
    template: "%s | Boston Legend Ice Cream Truck",
  },
  description:
    "Boston's premier luxury ice cream truck booking and dispatch service. Serving Greater Boston, MA for birthdays, corporate events, school parties & more. Call 617-999-3803.",
  keywords: [
    "ice cream truck Boston",
    "ice cream catering Massachusetts",
    "Boston ice cream truck rental",
    "ice cream truck party Boston",
    "corporate ice cream truck Boston",
    "birthday ice cream truck Greater Boston",
    "Boston Legend ice cream",
  ],
  authors: [{ name: "Boston Legend Ice Cream Truck" }],
  creator: "Boston Legend",
  publisher: "Boston Legend",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Boston Legend Ice Cream Truck",
    title: "Boston Legend Ice Cream Truck | Book Now in Greater Boston",
    description:
      "Boston's premier luxury ice cream truck for birthdays, corporate events, and school parties. Serving Greater Boston, MA. Book online instantly.",
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Boston Legend Ice Cream Truck — Greater Boston",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boston Legend Ice Cream Truck | Book Now in Greater Boston",
    description:
      "Boston's premier luxury ice cream truck for birthdays, corporate events, and school parties. Serving Greater Boston, MA.",
    images: [`${SITE_URL}/images/og-image.jpg`],
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Add Google Search Console verification token here when available:
    // google: "your-verification-token",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "FoodTruck"],
  name: "Boston Legend Ice Cream Truck",
  url: SITE_URL,
  description:
    "Boston's premier luxury ice cream truck booking and dispatch service. Available for birthdays, corporate events, school parties, weddings, and community gatherings across Greater Boston.",
  telephone: ["617-999-3803", "781-921-3233", "617-866-2727"],
  image: `${SITE_URL}/images/og-image.jpg`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "84 Fernwood Ave",
    addressLocality: "Revere",
    addressRegion: "MA",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "State",
    name: "Massachusetts",
    description: "Greater Boston Area",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    description: "Available by reservation 24 hours a day",
    opens: "00:00",
    closes: "23:59",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  sameAs: [],
  hasMap: `https://www.google.com/maps/search/?api=1&query=Boston+Legend+Ice+Cream+Truck`,
  servesCuisine: "Ice Cream",
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card, Debit Card, Check",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        {/* Swiper CSS for brand marquee on all pages */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
      </head>
      <body
        className={`${sans.variable} ${playfair.variable} antialiased font-sans bg-amber-50 page`}
      >
        <Providers>{children}</Providers>
        {/* Unified Chat, Nav Injector & Swiper Init */}
        <Script src="/bl-widgets.js" strategy="afterInteractive" />
        {/* Swiper JS for React-rendered pages (cities, booking, etc.) */}
        <Script
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}