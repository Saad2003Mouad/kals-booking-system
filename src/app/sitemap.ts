import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.bostonlegendicecreamtruck.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const baseRoutes: MetadataRoute.Sitemap = [
    // Core Pages — Highest Priority
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/packages`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/booking`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },

    // Occasions Pages
    { url: `${SITE_URL}/occasions/birthday-parties`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/occasions/corporate-parties`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/occasions/block-parties`, lastModified: now, changeFrequency: "monthly", priority: 0.82 },
    { url: `${SITE_URL}/occasions/fundraisers`, lastModified: now, changeFrequency: "monthly", priority: 0.82 },
    { url: `${SITE_URL}/occasions/launch-parties`, lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${SITE_URL}/occasions/marketing-events`, lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${SITE_URL}/occasions/movie-rental`, lastModified: now, changeFrequency: "monthly", priority: 0.78 },
    { url: `${SITE_URL}/occasions/photo-sessions`, lastModified: now, changeFrequency: "monthly", priority: 0.78 },
    { url: `${SITE_URL}/occasions/reunions`, lastModified: now, changeFrequency: "monthly", priority: 0.78 },
    { url: `${SITE_URL}/occasions/school-occasions`, lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${SITE_URL}/occasions/sports-occasions`, lastModified: now, changeFrequency: "monthly", priority: 0.78 },
    { url: `${SITE_URL}/occasions/wedding-receptions`, lastModified: now, changeFrequency: "monthly", priority: 0.82 },

    // Support Pages
    { url: `${SITE_URL}/manage-booking`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Dynamic City Pages
  const cityRoutes: MetadataRoute.Sitemap = [];
  try {
    const citiesDir = path.join(process.cwd(), "cities");
    if (fs.existsSync(citiesDir)) {
      const files = fs.readdirSync(citiesDir);
      files
        .filter((file) => file.endsWith(".html"))
        .forEach((file) => {
          const slug = file.replace(".html", "").toLowerCase();
          cityRoutes.push({
            url: `${SITE_URL}/cities/${slug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
          });
        });
    }
  } catch (error) {
    console.error("Error reading cities directory for sitemap:", error);
  }

  return [...baseRoutes, ...cityRoutes];
}
