/**
 * fix-seo.mjs
 * Comprehensive SEO fix for Boston Legend website.
 * 
 * Fixes:
 * 1. Corrects wrong canonical tags in static HTML pages
 * 2. Adds correct canonical tags to pages missing them
 * 3. Updates sitemap.ts to include ALL indexable pages (blog posts, occasions, etc.)
 * 4. Adds og:url meta tags to all static HTML pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');
const SITE_URL = 'https://www.bostonlegendicecreamtruck.com';

// Map each HTML file in /public to its correct canonical URL
const CANONICAL_MAP = {
  'index.html':            '/',
  'about.html':            '/about',
  'menu.html':             '/menu',
  'contact-us.html':       '/contact-us',
  'blog.html':             '/blog',
  'reserve.html':          '/packages', // reserve is redirected to /packages
  'birthday-parties.html': '/occasions/birthday-parties',
  'block-parties.html':    '/occasions/block-parties',
  'corporate-parties.html':'/occasions/corporate-parties',
  'fundraisers.html':      '/occasions/fundraisers',
  'launch-parties.html':   '/occasions/launch-parties',
  'marketing-events.html': '/occasions/marketing-events',
  'movie-rental.html':     '/occasions/movie-rental',
  'photo-sessions.html':   '/occasions/photo-sessions',
  'reunions.html':         '/occasions/reunions',
  'school-occasions.html': '/occasions/school-occasions',
  'sports-occasions.html': '/occasions/sports-occasions',
  'wedding-receptions.html':'/occasions/wedding-receptions',
  // Blog posts
  'boston-ice-cream-events.html':                '/blog/boston-ice-cream-events',
  'bringing-an-ice-cream-truck.html':            '/blog/bringing-an-ice-cream-truck',
  'corporate-ice-cream-boston.html':             '/blog/corporate-ice-cream-boston',
  'creative-ice-cream-truck-ideas.html':         '/blog/creative-ice-cream-truck-ideas',
  'guide-to-booking-ice-cream-catering.html':    '/blog/guide-to-booking-ice-cream-catering',
  'holiday-events-that-shine-brighter.html':     '/blog/holiday-events-that-shine-brighter',
  'how-to-host-movie-night.html':                '/blog/how-to-host-movie-night',
  'ice-cream-boston-birthday.html':              '/blog/ice-cream-boston-birthday',
  'ice-cream-catering-for-winter-fundraiser.html':'/blog/ice-cream-catering-for-winter-fundraiser',
  'ice-cream-catering-options-for-indoor-parties.html':'/blog/ice-cream-catering-options-for-indoor-parties',
  'ice-cream-catering-teacher-appreciation-events.html':'/blog/ice-cream-catering-teacher-appreciation-events',
  'ice-cream-springtime-wedding.html':           '/blog/ice-cream-springtime-wedding',
  'ice-cream-truck-boston.html':                 '/blog/ice-cream-truck-boston',
  'ice-cream-truck-school-event.html':           '/blog/ice-cream-truck-school-event',
  'ice-cream-trucks-at-corporate-parties.html':  '/blog/ice-cream-trucks-at-corporate-parties',
  'ice-cream-trucks-corporate-events.html':      '/blog/ice-cream-trucks-corporate-events',
  'ice-cream-trucks-for-sports-events.html':     '/blog/ice-cream-trucks-for-sports-events',
  'ice-cream-trucks-holiday-season-reunions.html':'/blog/ice-cream-trucks-holiday-season-reunions',
  'ice-cream-trucks-in-school-events.html':      '/blog/ice-cream-trucks-in-school-events',
  'ice-cream-trucks-local-marketing-events.html':'/blog/ice-cream-trucks-local-marketing-events',
  'ice-cream-trucks-to-draw-crowds-to-a-fundraiser.html':'/blog/ice-cream-trucks-to-draw-crowds-to-a-fundraiser',
  'launch-party-needs-visual-hook.html':         '/blog/launch-party-needs-visual-hook',
  'make-marketing-event-stand-out-ice-cream.html':'/blog/make-marketing-event-stand-out-ice-cream',
  'neighborhood-block-party-unforgettable.html': '/blog/neighborhood-block-party-unforgettable',
  'photo-shoot-ideas-that-pop.html':             '/blog/photo-shoot-ideas-that-pop',
  'plan-a-block-party-people-actually-want-to-attend.html':'/blog/plan-a-block-party-people-actually-want-to-attend',
  'plan-an-ice-cream-reunion-party.html':        '/blog/plan-an-ice-cream-reunion-party',
  'renting-an-ice-cream-truck-movie-shoot.html': '/blog/renting-an-ice-cream-truck-movie-shoot',
  'renting-ice-cream-truck-for-photo-shoots.html':'/blog/renting-ice-cream-truck-for-photo-shoots',
  'wedding-ice-cream-boston.html':               '/blog/wedding-ice-cream-boston',
  'why-mobile-ice-cream-vendors-are-popular.html':'/blog/why-mobile-ice-cream-vendors-are-popular',
  'why-sporting-events-are-cooler.html':         '/blog/why-sporting-events-are-cooler',
  'winter-wedding-receptions-that-feel-warm.html':'/blog/winter-wedding-receptions-that-feel-warm',
};

let fixed = 0;
let skipped = 0;
let errors = 0;

for (const [file, canonicalPath] of Object.entries(CANONICAL_MAP)) {
  const filePath = path.join(publicDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Not found: ${file}`);
    skipped++;
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf-8');
  const fullCanonical = `${SITE_URL}${canonicalPath}`;

  // 1. Fix or inject canonical tag
  const canonicalRegex = /<link\s+[^>]*rel=["']canonical["'][^>]*\/?>|<link\s+[^>]*href=["'][^"']*["'][^>]*rel=["']canonical["'][^>]*\/?>/gi;
  const newCanonicalTag = `<link rel="canonical" href="${fullCanonical}"/>`;

  let hasCanonical = canonicalRegex.test(html);
  canonicalRegex.lastIndex = 0; // reset after test

  if (hasCanonical) {
    // Replace existing (potentially wrong) canonical
    const oldHtml = html;
    html = html.replace(canonicalRegex, newCanonicalTag);
    if (oldHtml === html) {
      // Already correct, no change needed
    }
  } else {
    // Inject before </head>
    html = html.replace('</head>', `${newCanonicalTag}\n</head>`);
    if (!html.includes(newCanonicalTag)) {
      // Try before first <link> if </head> not found distinctly
      html = html.replace(/<\/head>/, `${newCanonicalTag}</head>`);
    }
  }

  // 2. Fix or inject og:url meta tag  
  const ogUrlRegex = /<meta\s+property=["']og:url["'][^>]*\/?>|<meta\s+[^>]*content=["'][^"']*["'][^>]*property=["']og:url["'][^>]*\/?>/gi;
  const newOgUrl = `<meta property="og:url" content="${fullCanonical}"/>`;

  const hasOgUrl = ogUrlRegex.test(html);
  ogUrlRegex.lastIndex = 0;

  if (hasOgUrl) {
    html = html.replace(ogUrlRegex, newOgUrl);
  } else {
    // Inject after canonical tag
    html = html.replace(newCanonicalTag, `${newCanonicalTag}\n${newOgUrl}`);
  }

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`✅ Fixed: ${file} → ${fullCanonical}`);
  fixed++;
}

console.log(`\n🎉 Done! Fixed: ${fixed} | Skipped: ${skipped} | Errors: ${errors}`);

// ----------------------------------------------------------------
// Now update sitemap.ts to include ALL pages
// ----------------------------------------------------------------
console.log('\n📋 Updating sitemap.ts...');

const sitemapPath = path.join(__dirname, 'src', 'app', 'sitemap.ts');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');

// Blog post URLs to add
const blogPosts = [
  'boston-ice-cream-events',
  'bringing-an-ice-cream-truck',
  'corporate-ice-cream-boston',
  'creative-ice-cream-truck-ideas',
  'guide-to-booking-ice-cream-catering',
  'holiday-events-that-shine-brighter',
  'how-to-host-movie-night',
  'ice-cream-boston-birthday',
  'ice-cream-catering-for-winter-fundraiser',
  'ice-cream-catering-options-for-indoor-parties',
  'ice-cream-catering-teacher-appreciation-events',
  'ice-cream-springtime-wedding',
  'ice-cream-truck-boston',
  'ice-cream-truck-school-event',
  'ice-cream-trucks-at-corporate-parties',
  'ice-cream-trucks-corporate-events',
  'ice-cream-trucks-for-sports-events',
  'ice-cream-trucks-holiday-season-reunions',
  'ice-cream-trucks-in-school-events',
  'ice-cream-trucks-local-marketing-events',
  'ice-cream-trucks-to-draw-crowds-to-a-fundraiser',
  'launch-party-needs-visual-hook',
  'make-marketing-event-stand-out-ice-cream',
  'neighborhood-block-party-unforgettable',
  'photo-shoot-ideas-that-pop',
  'plan-a-block-party-people-actually-want-to-attend',
  'plan-an-ice-cream-reunion-party',
  'renting-an-ice-cream-truck-movie-shoot',
  'renting-ice-cream-truck-for-photo-shoots',
  'wedding-ice-cream-boston',
  'why-mobile-ice-cream-vendors-are-popular',
  'why-sporting-events-are-cooler',
  'winter-wedding-receptions-that-feel-warm',
];

// Check if blog posts are already in sitemap
if (!sitemapContent.includes('/blog/boston-ice-cream-events')) {
  const blogEntries = blogPosts.map(slug =>
    `    { url: \`\${SITE_URL}/blog/${slug}\`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },`
  ).join('\n');

  // Inject before the "Support Pages" comment
  const insertBefore = '    // Support Pages';
  const blogSection = `    // Blog Posts — Long-form content for SEO\n${blogEntries}\n\n    // Support Pages`;

  sitemapContent = sitemapContent.replace(insertBefore, blogSection);

  // Also add about and contact pages which were missing
  const additionalPages = `    // Static HTML pages served via rewrites
    { url: \`\${SITE_URL}/about\`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: \`\${SITE_URL}/menu\`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: \`\${SITE_URL}/contact-us\`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: \`\${SITE_URL}/blog\`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },\n\n`;

  sitemapContent = sitemapContent.replace('    // Occasions Pages', additionalPages + '    // Occasions Pages');

  fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
  console.log(`✅ sitemap.ts updated with ${blogPosts.length} blog posts + static pages`);
} else {
  console.log('⏩ sitemap.ts already has blog posts');
}

console.log('\n✨ SEO fix complete!');
