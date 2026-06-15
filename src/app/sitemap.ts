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

    // Static HTML pages served via rewrites
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/menu`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${SITE_URL}/contact-us`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },

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

    // Blog Posts — Long-form content for SEO
    { url: `${SITE_URL}/blog/boston-ice-cream-events`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/bringing-an-ice-cream-truck`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/corporate-ice-cream-boston`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/creative-ice-cream-truck-ideas`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/guide-to-booking-ice-cream-catering`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/holiday-events-that-shine-brighter`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/how-to-host-movie-night`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-boston-birthday`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-catering-for-winter-fundraiser`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-catering-options-for-indoor-parties`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-catering-teacher-appreciation-events`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-springtime-wedding`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-truck-boston`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-truck-school-event`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-trucks-at-corporate-parties`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-trucks-corporate-events`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-trucks-for-sports-events`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-trucks-holiday-season-reunions`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-trucks-in-school-events`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-trucks-local-marketing-events`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/ice-cream-trucks-to-draw-crowds-to-a-fundraiser`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/launch-party-needs-visual-hook`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/make-marketing-event-stand-out-ice-cream`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/neighborhood-block-party-unforgettable`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/photo-shoot-ideas-that-pop`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/plan-a-block-party-people-actually-want-to-attend`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/plan-an-ice-cream-reunion-party`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/renting-an-ice-cream-truck-movie-shoot`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/renting-ice-cream-truck-for-photo-shoots`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/wedding-ice-cream-boston`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/why-mobile-ice-cream-vendors-are-popular`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/why-sporting-events-are-cooler`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/blog/winter-wedding-receptions-that-feel-warm`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },

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
