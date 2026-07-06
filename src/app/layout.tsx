import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import Providers from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
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
    "ice cream truck rental Boston MA",
    "ice cream catering Massachusetts",
    "Boston ice cream truck rental",
    "ice cream truck party Boston",
    "corporate ice cream truck Boston",
    "birthday ice cream truck Greater Boston",
    "Boston Legend ice cream",
    "ice cream truck for hire Boston",
    "mobile ice cream catering Boston",
    "ice cream truck birthday party Massachusetts",
    "ice cream truck corporate events Boston",
    "ice cream truck wedding Boston",
    "ice cream truck school events Massachusetts",
    "how much does an ice cream truck cost Massachusetts",
    "book ice cream truck Boston",
    "ice cream truck near me Boston",
    "ice cream truck fundraiser Massachusetts",
    "Revere MA ice cream truck",
    "Greater Boston event catering ice cream",
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
  alternates: {},
  verification: {
    google: "AOQxUMJbpioWMH3CUbkkCBM5_j-CFhDFurpxaxJKOl4",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "FoodTruck", "Caterer"],
  "@id": `${SITE_URL}/#localbusiness`,
  name: "Boston Legend Ice Cream Truck",
  alternateName: "Boston Legend Ice Cream",
  url: SITE_URL,
  description:
    "Boston's premier luxury ice cream truck booking and dispatch service. Available for birthdays, corporate events, school parties, weddings, and community gatherings across Greater Boston and all of Massachusetts.",
  telephone: ["617-999-3803", "617-866-2727"],
  email: "info@bostonlegendicecreamtruck.com",
  image: [
    `${SITE_URL}/images/og-image.jpg`,
    "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif",
  ],
  logo: "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "84 Fernwood Ave",
    addressLocality: "Revere",
    addressRegion: "MA",
    postalCode: "02151",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 42.4084,
    longitude: -71.0120,
  },
  areaServed: [
    { "@type": "City", name: "Boston", containedIn: { "@type": "State", name: "Massachusetts" } },
    { "@type": "City", name: "Cambridge", containedIn: { "@type": "State", name: "Massachusetts" } },
    { "@type": "City", name: "Somerville", containedIn: { "@type": "State", name: "Massachusetts" } },
    { "@type": "City", name: "Brookline", containedIn: { "@type": "State", name: "Massachusetts" } },
    { "@type": "City", name: "Newton", containedIn: { "@type": "State", name: "Massachusetts" } },
    { "@type": "City", name: "Quincy", containedIn: { "@type": "State", name: "Massachusetts" } },
    { "@type": "City", name: "Lynn", containedIn: { "@type": "State", name: "Massachusetts" } },
    { "@type": "City", name: "Waltham", containedIn: { "@type": "State", name: "Massachusetts" } },
    { "@type": "City", name: "Medford", containedIn: { "@type": "State", name: "Massachusetts" } },
    { "@type": "City", name: "Revere", containedIn: { "@type": "State", name: "Massachusetts" } },
    { "@type": "State", name: "Massachusetts" },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    description: "Available by reservation 7 days a week",
    opens: "08:00",
    closes: "22:00",
    dayOfWeek: [
      "Monday", "Tuesday", "Wednesday", "Thursday",
      "Friday", "Saturday", "Sunday",
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "127",
    bestRating: "5",
    worstRating: "1",
  },
  makesOffer: [
    {
      "@type": "Offer",
      name: "Ice Cream Truck Rental — Starter Event",
      description: "Perfect for small events up to 30 guests. 1 hour service with premium ice cream selection.",
      price: "250",
      priceCurrency: "USD",
      url: `${SITE_URL}/packages`,
    },
    {
      "@type": "Offer",
      name: "Ice Cream Truck Rental — Celebration Pack",
      description: "Most popular package for events up to 75 guests. 2 hour service.",
      price: "425",
      priceCurrency: "USD",
      url: `${SITE_URL}/packages`,
    },
    {
      "@type": "Offer",
      name: "Corporate Ice Cream Catering Boston",
      description: "Professional ice cream catering for corporate events, employee appreciation days, and company picnics across Greater Boston.",
      price: "250",
      priceCurrency: "USD",
      url: `${SITE_URL}/services/corporate-events`,
    },
    {
      "@type": "Offer",
      name: "Birthday Party Ice Cream Truck",
      description: "Make your child's birthday unforgettable with a premium ice cream truck experience.",
      price: "250",
      priceCurrency: "USD",
      url: `${SITE_URL}/services/birthday-party-ice-cream`,
    },
  ],
  hasMap: `https://www.google.com/maps/search/?api=1&query=Boston+Legend+Ice+Cream+Truck+Revere+MA`,
  servesCuisine: ["Ice Cream", "Frozen Desserts", "Soft Serve"],
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card, Debit Card, Check, Online Payment",
  sameAs: [
    "https://www.bostonlegendicecreamtruck.com",
  ],
  potentialAction: {
    "@type": "ReserveAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/packages`,
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: {
      "@type": "Reservation",
      name: "Ice Cream Truck Booking",
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Boston Legend Ice Cream Truck",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif",
    width: 400,
    height: 100,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "617-999-3803",
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: ["English", "Spanish", "Arabic"],
    },
    {
      "@type": "ContactPoint",
      telephone: "617-866-2727",
      contactType: "reservations",
      areaServed: "US",
    },
  ],
  sameAs: [
    "https://www.bostonlegendicecreamtruck.com",
    "https://www.facebook.com/bostonlegendicecream",
    "https://www.instagram.com/bostonlegendicecream",
    "https://www.tiktok.com/@bostonlegendicecream",
  ],
};

const globalFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does an ice cream truck cost in Massachusetts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Boston Legend Ice Cream Truck packages start at $190 for small events (up to 30 guests) and range up to $825+ for large school or corporate events. Pricing depends on the number of guests, duration, and package type. Custom quotes are available for events with 200+ guests. Book online at bostonlegendicecreamtruck.com/packages for instant pricing.",
      },
    },
    {
      "@type": "Question",
      name: "Do you serve all of Massachusetts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Boston Legend Ice Cream Truck serves all of Greater Boston and the surrounding Massachusetts area including Boston, Cambridge, Somerville, Newton, Quincy, Lynn, Waltham, Medford, Revere, Brookline, and over 140 additional cities and towns across Massachusetts.",
      },
    },
    {
      "@type": "Question",
      name: "How far in advance should I book an ice cream truck?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We recommend booking at least 2–4 weeks in advance for weekend events, and 1–2 weeks for weekday events. During peak season (May–September), popular dates fill up quickly — especially Saturdays. You can book instantly online at bostonlegendicecreamtruck.com/packages.",
      },
    },
    {
      "@type": "Question",
      name: "What types of events does Boston Legend serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We serve all types of events including birthday parties, corporate events, employee appreciation days, school events and fundraisers, weddings and receptions, block parties, community gatherings, marketing activations, photo shoots, sports events, and reunions across Greater Boston, MA.",
      },
    },
    {
      "@type": "Question",
      name: "Is Boston Legend the best ice cream truck for employee appreciation events?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Boston Legend is Greater Boston's #1 choice for corporate employee appreciation events. We offer professional, on-time service with premium ice cream selections, flexible scheduling on any day of the week, and packages starting at $250 for up to 30 employees. Our team handles all logistics so you can focus on your team.",
      },
    },
    {
      "@type": "Question",
      name: "What flavors does Boston Legend Ice Cream Truck serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Boston Legend serves a wide variety of premium ice cream flavors including classic favorites and seasonal specialties. Our menu includes novelty bars, sandwiches, pops, and soft serve options to satisfy every guest. Full menu available at bostonlegendicecreamtruck.com.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
  const AW_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalFaqSchema),
          }}
        />
        {/* Swiper CSS for brand marquee on all pages */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        {/* Webflow Global Shared CSS to fix missing footer and layout styling on Next.js routes */}
        <link rel="stylesheet" href="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/css/boston-legend.webflow.shared.fe0e6a837.min.css" />

        {/* ── Google Analytics 4 + Google Ads ── */}
        {(GA_ID || "AW-18270235015") && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID || "AW-18270235015"}`}
              strategy="afterInteractive"
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  ${GA_ID ? `gtag('config', '${GA_ID}', { page_path: window.location.pathname });` : ""}
                  gtag('config', 'AW-18270235015');
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${sans.variable} ${playfair.variable} antialiased font-sans bg-white page`}
      >
        <Providers>{children}</Providers>
        {/* Unified Chat, Nav Injector & Swiper Init */}
        <Script src="/bl-widgets.js?v=8" strategy="afterInteractive" />
        {/* Swiper JS for React-rendered pages (cities, booking, etc.) */}
        <Script
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
          strategy="afterInteractive"
        />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}