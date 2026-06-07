import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.bostonlegendicecreamtruck.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const baseRoutes = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/packages`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/booking`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/manage-booking`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  try {
    const citiesDir = path.join(process.cwd(), "cities");
    if (fs.existsSync(citiesDir)) {
      const files = fs.readdirSync(citiesDir);
      const cityRoutes = files
        .filter((file) => file.endsWith(".html"))
        .map((file) => {
          const slug = file.replace(".html", "").toLowerCase();
          return {
            url: `${SITE_URL}/cities/${slug}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          };
        });
      return [...baseRoutes, ...cityRoutes];
    }
  } catch (error) {
    console.error("Error reading cities directory for sitemap:", error);
  }

  return baseRoutes;
}
