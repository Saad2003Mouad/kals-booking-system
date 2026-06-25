import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { generateCitySEOData } from "@/lib/seo-generator";

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = false;

function getCityData(slug: string) {
  // Enforce lowercase slug matching to prevent duplicate routing issues
  const cleanSlug = slug.toLowerCase();
  const filePath = path.join(process.cwd(), "cities", `${cleanSlug}.html`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  let html = fs.readFileSync(filePath, "utf-8");

  const seoData = generateCitySEOData(cleanSlug);

  // Use the unique generated description instead of the static one
  const cleanTitle = `Ice Cream Truck Rental in ${seoData.cityName} | Boston Legend`;
  const cleanDesc = seoData.description;

  // Extract content between </header> and the start of the footer
  const contentStart = html.indexOf("</header>");
  const contentEnd = html.indexOf("<footer");
  
  if (contentStart === -1 || contentEnd === -1) {
    return null;
  }

  // Adding length of "</header>" (9) to start extracting after it
  let contentHtml = html.substring(contentStart + 9, contentEnd);

  // Clean up content:
  // 1. Remove the old booking form block and replace it with the new premium CTA banner
  const formStartToken = '<div class="w-form">';
  const formEndToken = 'Thank you! Your submission has been received!</div></div><div class="w-form-fail"><div>Oops! Something went wrong while submitting the form.</div></div></div>';

  const startIndex = contentHtml.indexOf(formStartToken);
  const endIndex = contentHtml.indexOf(formEndToken);

  if (startIndex !== -1 && endIndex !== -1) {
    // Inject our unique SEO content blocks right before the CTA
    const uniqueHtmlBlocks = `
<div class="seo-unique-content" style="padding: 40px 20px; font-family: 'Nunito', sans-serif; max-width: 1200px; margin: 0 auto;">

    <!-- Intro -->
    <h2 style="font-size: 2rem; font-weight: 900; color: #000223; margin-bottom: 16px; line-height: 1.3;">${seoData.intro}</h2>

    <!-- Neighborhoods + Landmarks -->
    <div style="display: flex; flex-wrap: wrap; gap: 32px; margin-top: 40px;">
        <div style="flex: 1; min-width: 280px;">
            <h3 style="font-size: 1.4rem; color: #FFA000; font-weight: 800; margin-bottom: 12px;">🏘️ Neighborhoods We Serve in ${seoData.cityName}</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${seoData.neighborhoods.map((n: string) => `<li style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; color: #374151; font-weight: 600;">✓ ${n}</li>`).join('')}
            </ul>
        </div>
        <div style="flex: 1; min-width: 280px;">
            <h3 style="font-size: 1.4rem; color: #FFA000; font-weight: 800; margin-bottom: 12px;">📍 Popular Locations We Serve</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${seoData.landmarks.map((lm: string) => `<li style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; color: #374151; font-weight: 600;">📌 ${lm}</li>`).join('')}
            </ul>
        </div>
    </div>

    <!-- Events -->
    <div style="margin-top: 40px;">
        <h3 style="font-size: 1.4rem; color: #FFA000; font-weight: 800; margin-bottom: 16px;">🎉 Events We've Served Near ${seoData.cityName}</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
            ${seoData.events.map((ev: string) => `<span style="display: inline-block; background: #FFFBEB; border: 1px solid #FFA000; color: #000223; padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: 700;">${ev}</span>`).join('')}
        </div>
    </div>

    <!-- Packages -->
    <div style="margin-top: 48px;">
        <h3 style="font-size: 1.4rem; color: #FFA000; font-weight: 800; margin-bottom: 16px;">🍦 Popular Packages for ${seoData.cityName} Events</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
            ${seoData.packages.map((pkg: {name: string; desc: string}) => `
            <div style="flex: 1; min-width: 200px; background: #F8F9FC; border-radius: 16px; padding: 20px; border-top: 3px solid #FFA000;">
                <p style="font-weight: 900; color: #000223; font-size: 16px; margin: 0 0 8px;">${pkg.name}</p>
                <p style="color: #6B7280; font-size: 14px; font-weight: 600; margin: 0;">${pkg.desc}</p>
            </div>`).join('')}
        </div>
        <div style="text-align: center; margin-top: 24px;">
            <a href="/packages" style="display: inline-block; background: #FFA000; color: #000223; padding: 14px 36px; border-radius: 50px; font-weight: 900; font-size: 15px; text-decoration: none;">View All Packages →</a>
        </div>
    </div>

    <!-- Testimonials -->
    <div style="margin-top: 48px;">
        <h3 style="font-size: 1.4rem; color: #FFA000; font-weight: 800; margin-bottom: 16px;">⭐ What ${seoData.cityName} Customers Say</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 20px;">
            ${seoData.testimonials.map((t: {name: string; text: string}) => `
            <div style="flex: 1; min-width: 260px; background: #FFFBEB; padding: 24px; border-radius: 16px; border-left: 4px solid #FFA000;">
                <p style="font-style: italic; color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 12px;">&quot;${t.text}&quot;</p>
                <p style="font-weight: 900; margin: 0; color: #000223; font-size: 14px;">— ${t.name}</p>
                <div style="color: #FFA000; font-size: 16px; margin-top: 6px;">★★★★★</div>
            </div>`).join('')}
        </div>
    </div>

    <!-- FAQ -->
    <div style="margin-top: 48px;">
        <h3 style="font-size: 1.4rem; color: #FFA000; font-weight: 800; margin-bottom: 20px;">❓ Frequently Asked Questions — ${seoData.cityName}</h3>
        ${seoData.faqs.map((faq: {q: string; a: string}) => `
        <div style="margin-bottom: 20px; background: #F8F9FC; border-radius: 12px; padding: 20px;">
            <h4 style="font-weight: 900; color: #000223; margin: 0 0 8px; font-size: 16px;">${faq.q}</h4>
            <p style="color: #6B7280; margin: 0; font-weight: 600; line-height: 1.6;">${faq.a}</p>
        </div>`).join('')}
    </div>

    <!-- Nearby Cities -->
    <div style="margin-top: 48px; padding: 24px; background: #F8F9FC; border-radius: 16px;">
        <h3 style="font-size: 1.2rem; color: #000223; font-weight: 900; margin-bottom: 12px;">🗺️ We Also Serve These Nearby Cities</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${seoData.nearbyCities.map((c: {slug: string; name: string}) => `<a href="/cities/${c.slug}" style="background: white; border: 1px solid #E5E7EB; color: #000223; padding: 8px 18px; border-radius: 50px; font-weight: 700; font-size: 14px; text-decoration: none; transition: all 0.2s;">Ice Cream Truck in ${c.name}</a>`).join('')}
            <a href="/packages" style="background: #000223; color: #FFA000; padding: 8px 18px; border-radius: 50px; font-weight: 700; font-size: 14px; text-decoration: none;">View Our Packages →</a>
        </div>
    </div>

</div>
    `;

    const formReplacementHtml = uniqueHtmlBlocks + `
<div class="w-form premium-cta-container" style="display:flex; flex-direction:column; justify-content:center; align-items:center; padding: 60px 20px; background: linear-gradient(135deg, rgba(255, 160, 0, 0.1), rgba(243, 145, 189, 0.1)); border-radius: 24px; border: 1px solid rgba(255,160,0,0.3); min-height: 400px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.05); margin: 40px 0;">
    <img src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif" alt="Boston Legend Logo" style="height: 60px; margin-bottom: 30px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));" />
    <h3 style="font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 2rem; color: #000223; margin-bottom: 10px;">Ready to sweeten your event in ${seoData.cityName}?</h3>
    <p style="font-family: 'Nunito', sans-serif; font-size: 1.1rem; color: #666; margin-bottom: 30px; max-width: 400px;">Get an instant quote and secure your ice cream truck in under 3 minutes.</p>
    <a href="/packages" class="link-bt w-button hover-cta" style="font-family: 'Nunito', sans-serif; font-size: 1.25rem; padding: 20px 48px; border-radius: 50px; background: #000223; color: #FFA000; box-shadow: 0 10px 30px rgba(0, 2, 35, 0.3); transition: all 0.3s ease; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
        Book Your ${seoData.cityName} Event 🍦
    </a>
</div>
    `;
    contentHtml = contentHtml.substring(0, startIndex) + formReplacementHtml + contentHtml.substring(endIndex + formEndToken.length);
  }

  // 2. Remove absolute domain references to keep links clean and local
  contentHtml = contentHtml.replace(/href="https?:\/\/(www\.)?bostonlegendicecreamtruck\.com(\/)?/g, 'href="/');

  // 3. Ensure all Reserve CTA/booking links point directly to /packages
  contentHtml = contentHtml.replaceAll('href="/booking"', 'href="/packages"');
  contentHtml = contentHtml.replaceAll('href="/reserve"', 'href="/packages"');
  
  // Replace Webflow hash CTA buttons with packages link
  contentHtml = contentHtml.replace(/href="#"(\s+class="[^"]*link-bt[^"]*")/g, 'href="/packages"$1');

  // 4. Fix broken /occasion/xyz-in-city or /occasion/xyz-city links
  const validOccasions = {
    'birthday-parties': 'birthday-parties',
    'block-parties': 'block-parties',
    'corporate-parties': 'corporate-parties',
    'fundraisers': 'fundraisers',
    'launch-parties': 'launch-parties',
    'marketing-events': 'marketing-events',
    'movie-rental': 'movie-rental',
    'photo-shoots': 'photo-sessions',
    'reunions': 'reunions',
    'school-events': 'school-occasions',
    'sporting-events': 'sports-occasions',
    'wedding-receptions': 'wedding-receptions'
  };

  Object.entries(validOccasions).forEach(([legacySlug, correctSlug]) => {
    // Matches /occasion/legacySlug optionally followed by any -city suffix
    const regex = new RegExp(`href="\\/occasion\\/${legacySlug}(?:-[a-z-]+)?"`, 'g');
    contentHtml = contentHtml.replace(regex, 'href="/packages"');
  });

  return {
    title: cleanTitle,
    description: cleanDesc,
    contentHtml,
    slug: cleanSlug,
    cityName: seoData.cityName,
    schema: seoData.schema,
  };
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = getCityData(params.slug);
  if (!data) {
    return {};
  }
  
  const cityUrl = `https://www.bostonlegendicecreamtruck.com/cities/${data.slug}`;

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: cityUrl,
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: cityUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
    }
  };
}

export async function generateStaticParams() {
  const citiesDir = path.join(process.cwd(), "cities");
  if (!fs.existsSync(citiesDir)) {
    return [];
  }
  
  const files = fs.readdirSync(citiesDir);
  return files
    .filter((file) => file.endsWith(".html"))
    .map((file) => ({
      slug: file.replace(".html", "").toLowerCase(),
    }));
}

export default function CityPage({ params }: PageProps) {
  const data = getCityData(params.slug);
  
  if (!data) {
    notFound();
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.bostonlegendicecreamtruck.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Cities",
        "item": "https://www.bostonlegendicecreamtruck.com/cities"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": data.cityName,
        "item": `https://www.bostonlegendicecreamtruck.com/cities/${data.slug}`
      }
    ]
  };

  return (
    <div className="site-wrapper">
      <SiteHeader />
      {/* Breadcrumb Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* LocalBusiness + FAQPage Schema (generated per city) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data.schema) }} />
      <div dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
      <SiteFooter />
    </div>
  );
}
