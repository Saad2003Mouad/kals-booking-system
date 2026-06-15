import { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.bostonlegendicecreamtruck.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/driver",
          "/driver/",
          "/customer/",
          "/api/",
          "/login",
          "/checkout",
        ],
      },
      // Allow major search engine crawlers full access
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/driver/", "/customer/", "/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/driver/", "/customer/", "/api/"],
      },
      // Allow AI search engine crawlers (for AI Search Optimization)
      {
        userAgent: "GPTBot",
        allow: ["/", "/packages", "/cities/"],
        disallow: ["/admin/", "/driver/", "/customer/", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/packages", "/cities/"],
        disallow: ["/admin/", "/driver/", "/customer/", "/api/"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/packages", "/cities/"],
        disallow: ["/admin/", "/driver/", "/customer/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
