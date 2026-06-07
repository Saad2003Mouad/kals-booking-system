import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

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

  // Parse Title
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : "Boston Legend Ice Cream Truck Event Rentals";

  // Parse Description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || 
                    html.match(/<meta\s+content="([^"]*)"\s+name="description"/i);
  const description = descMatch ? descMatch[1] : "";

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
    const formReplacementHtml = `
<div class="w-form premium-cta-container" style="display:flex; flex-direction:column; justify-content:center; align-items:center; padding: 60px 20px; background: linear-gradient(135deg, rgba(255, 160, 0, 0.1), rgba(243, 145, 189, 0.1)); border-radius: 24px; border: 1px solid rgba(255,160,0,0.3); min-height: 400px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.05); margin: 40px 0;">
    <img src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif" alt="Boston Legend Logo" style="height: 60px; margin-bottom: 30px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));" />
    <h3 style="font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 2rem; color: #000223; margin-bottom: 10px;">Ready to sweeten your event?</h3>
    <p style="font-family: 'Nunito', sans-serif; font-size: 1.1rem; color: #666; margin-bottom: 30px; max-width: 400px;">Get an instant quote and secure your ice cream truck in under 3 minutes.</p>
    <a href="/packages" class="link-bt w-button hover-cta" style="font-family: 'Nunito', sans-serif; font-size: 1.25rem; padding: 20px 48px; border-radius: 50px; background: #000223; color: #FFA000; box-shadow: 0 10px 30px rgba(0, 2, 35, 0.3); transition: all 0.3s ease; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
        Start Your Booking 🍦
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

  return {
    title,
    description,
    contentHtml,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = getCityData(params.slug);
  if (!data) {
    return {};
  }
  return {
    title: data.title,
    description: data.description,
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

  return (
    <div className="site-wrapper">
      <SiteHeader />
      <div dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
      <SiteFooter />
    </div>
  );
}
