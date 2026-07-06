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
  // 1. We replace the booking form section with our dynamic React components
  const formStartToken = '<div class="w-layout-blockcontainer container-w book w-container">';
  const formEndToken = 'Thank you! Your submission has been received!</div></div><div class="w-form-fail"><div>Oops! Something went wrong while submitting the form.</div></div></div></div></div></div></div></main>';

  if (contentHtml.includes(formStartToken) && contentHtml.includes(formEndToken)) {
    const startIndex = contentHtml.indexOf(formStartToken);
    const endIndex = contentHtml.indexOf(formEndToken) + formEndToken.length;

    const uniqueHtmlBlocks = `
<section class="w-full bg-[#000223] py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-[#FFA000]">
    <div class="max-w-[1280px] mx-auto text-center">
        <h2 class="font-sans font-black text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Boston Legend Ice Cream Truck Service For Catering & Events <br/>
            <span class="text-[#FFA000] text-3xl md:text-4xl">in ${seoData.cityName}</span>
        </h2>
        <p class="font-sans font-semibold text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            ${seoData.cityName}'s favorite choice for ice cream truck rentals. Whether you need us for 50 guests or 500, Boston Legend delivers a premium experience that guests rave about long after the last cone.
        </p>
    </div>
</section>

<section class="w-full bg-[#FAF6EF] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute -right-40 -top-40 w-96 h-96 bg-[#FFA000]/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -left-40 -bottom-40 w-96 h-96 bg-[#000223]/5 rounded-full blur-3xl pointer-events-none"></div>
    
    <div class="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
        <!-- Neighborhoods -->
        <div class="w-full lg:w-1/2">
            <div class="flex items-center gap-3 mb-8">
                <span class="text-4xl">🏘️</span>
                <h3 class="font-sans font-black text-3xl text-[#000223] mt-0 mb-0">Neighborhoods We Serve</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${seoData.neighborhoods.map((n: string) => `
                <div class="bg-white rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-l-4 border-[#FFA000] flex items-center gap-3 hover:-translate-y-1 transition-transform">
                    <span class="text-[#000223] font-bold">✓</span>
                    <span class="font-sans font-bold text-[#000223]">${n}</span>
                </div>`).join('')}
            </div>
        </div>
        
        <!-- Locations -->
        <div class="w-full lg:w-1/2">
            <div class="flex items-center gap-3 mb-8">
                <span class="text-4xl">📍</span>
                <h3 class="font-sans font-black text-3xl text-[#000223] mt-0 mb-0">Popular Locations</h3>
            </div>
            <div class="flex flex-col gap-4">
                ${seoData.landmarks.map((loc: string) => `
                <div class="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-start gap-4 hover:-translate-y-1 transition-transform">
                    <span class="text-xl">📌</span>
                    <span class="font-sans font-bold text-lg text-[#000223]">${loc}</span>
                </div>`).join('')}
            </div>
        </div>
    </div>
</section>

<section class="w-full bg-white py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
    <div class="max-w-[1280px] mx-auto text-center mb-16">
        <span class="text-5xl mb-4 block">🎉</span>
        <h3 class="font-sans font-black text-3xl md:text-5xl text-[#000223] mt-0 mb-6">Events We've Served Near <span class="text-[#FFA000]">${seoData.cityName}</span></h3>
        <div class="h-1 w-24 bg-[#FFA000] mx-auto rounded-full"></div>
    </div>
    
    <div class="max-w-[1000px] mx-auto flex flex-wrap justify-center gap-4">
        ${seoData.events.map((evt: string) => `
        <div class="px-8 py-4 bg-[#FAF6EF] rounded-full border border-slate-200 shadow-sm text-center">
            <span class="font-sans font-bold text-lg text-[#000223]">${evt}</span>
        </div>`).join('')}
    </div>
</section>

<section class="w-full bg-[#FAF6EF] py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-[1280px] mx-auto">
        <div class="text-center mb-12">
            <h3 class="font-sans font-black text-3xl md:text-5xl text-[#000223] mt-0 mb-6">🍦 Popular Packages for <span class="text-[#FFA000]">${seoData.cityName}</span></h3>
            <p class="font-sans font-semibold text-lg text-slate-600 max-w-3xl mx-auto">
                ${seoData.cityName} residents know that when it's time for something sweet, Boston Legend delivers. We offer flexible packages designed to fit your budget, your headcount, and your vision.
            </p>
        </div>
        
        <div class="flex flex-wrap justify-center gap-3">
            ${seoData.nearbyCities.map((c: {slug: string; name: string}) => `
            <a href="/cities/${c.slug}" class="px-6 py-3 bg-white border border-slate-200 text-[#000223] rounded-full font-bold text-sm hover:bg-slate-100 transition-colors">Ice Cream Truck in ${c.name}</a>`).join('')}
            <a href="/packages" class="px-6 py-3 bg-[#000223] text-[#FFA000] rounded-full font-bold text-sm hover:bg-[#000445] transition-colors">View Our Packages →</a>
        </div>
    `;

    const formReplacementHtml = uniqueHtmlBlocks + `
<div class="w-full max-w-[1280px] mx-auto my-12 px-4 sm:px-6 lg:px-8">
    <div class="bg-gradient-to-br from-[#000223] to-[#000445] rounded-[40px] py-16 px-8 md:px-14 shadow-2xl relative overflow-hidden text-center">
        <h3 class="font-sans font-black text-3xl md:text-5xl text-white mt-0 mb-6 leading-tight">
            Ready to sweeten your event in <span class="text-[#FFA000]">${seoData.cityName}</span>?
        </h3>
        <p class="font-sans font-semibold text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Get an instant quote and secure your premium ice cream truck in under 3 minutes. We bring the joy directly to you.
        </p>
        
        <a href="/packages" class="inline-block px-12 py-5 rounded-full bg-[#FFA000] text-[#000223] font-sans font-black text-lg no-underline shadow-[0_10px_30px_rgba(255,160,0,0.3)] uppercase tracking-wider hover:scale-105 transition-transform">
            Book Your ${seoData.cityName} Event 🍦
        </a>
    </div>
</div>
</main>
    `;
    contentHtml = contentHtml.substring(0, startIndex) + formReplacementHtml + contentHtml.substring(endIndex);
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

  // 5. Append dynamic FAQ right before closing main or body tag
  const faqHtml = `
  <section class="bl-faq-section" style="background:#F8FAFC; padding:80px 20px; border-top:2px solid rgba(0,2,35,0.06);">
    <div style="max-width:860px; margin:0 auto; font-family:'Nunito', sans-serif;">
      <div style="text-align:center; margin-bottom:48px;">
        <span style="display:inline-block; background:rgba(255,160,0,0.12); color:#000223; font-weight:900; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; padding:6px 18px; border-radius:50px; border:1.5px solid rgba(255,160,0,0.4); margin-bottom:16px;">
          Common Questions
        </span>
        <h2 style="font-family:'Playfair Display', Georgia, serif; font-weight:900; font-size:clamp(1.8rem, 4vw, 2.6rem); color:#000223; margin:0 0 12px; line-height:1.2;">
          Questions about booking in ${seoData.cityName}?
        </h2>
        <p style="font-weight:600; font-size:1.05rem; color:#64748B; max-width:560px; margin:0 auto;">
          Everything you need to know about reserving our premium ice cream truck for your next event.
        </p>
      </div>
      <div style="display:flex; flex-direction:column; gap:14px;">
        ${seoData.faqs.map((faq: {q: string; a: string}) => `
        <div style="background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,2,35,0.06); border:1.5px solid rgba(0,2,35,0.07);">
          <div style="padding:22px 28px; font-weight:800; font-size:1.05rem; color:#000223;">
            ${faq.q}
          </div>
          <div style="padding:0 28px 24px; font-weight:600; font-size:1rem; color:#475569; line-height:1.6;">
            ${faq.a}
          </div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
  
  contentHtml += faqHtml;

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
