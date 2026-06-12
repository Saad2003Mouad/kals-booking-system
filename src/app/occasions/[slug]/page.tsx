import { notFound } from "next/navigation";
import { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FaqAccordion from "@/components/FaqAccordion";
import Link from "next/link";
import { CheckCircle2, Star, ShieldCheck } from "lucide-react";
import { OCCASIONS, getOccasionBySlug } from "@/lib/occasions";
import { FadeInUp, FadeIn } from "@/components/MotionWrapper";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const occasion = getOccasionBySlug(params.slug);
  if (!occasion) return {};
  
  return {
    title: occasion.title,
    description: occasion.metaDescription,
    alternates: {
      canonical: `https://www.bostonlegendicecreamtruck.com/occasions/${occasion.slug}`
    }
  };
}

export function generateStaticParams() {
  return OCCASIONS.map((o) => ({
    slug: o.slug,
  }));
}

export default function OccasionPage({ params }: { params: { slug: string } }) {
  const occasion = getOccasionBySlug(params.slug);
  
  if (!occasion) {
    notFound();
  }

  // Generate Service JSON-LD Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": occasion.title,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Boston Legend Ice Cream Truck",
      "image": "https://www.bostonlegendicecreamtruck.com/images/og-image.jpg",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "84 Fernwood Ave",
        "addressLocality": "Revere",
        "addressRegion": "MA",
        "addressCountry": "US"
      }
    },
    "areaServed": {
      "@type": "State",
      "name": "Massachusetts"
    },
    "description": occasion.metaDescription
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.bostonlegendicecreamtruck.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Occasions",
        "item": "https://www.bostonlegendicecreamtruck.com/#occasions"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": occasion.title,
        "item": `https://www.bostonlegendicecreamtruck.com/occasions/${occasion.slug}`
      }
    ]
  };

  return (
    <div className="page min-h-screen bg-amber-50 relative overflow-hidden flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <div style={{ position: "relative", zIndex: 25 }}>
        <SiteHeader />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src={occasion.image} 
            alt={occasion.h1}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-amber-50/95 to-amber-50"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <FadeInUp delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-bold text-sm mb-6 shadow-sm border border-blue-200">
              <ShieldCheck className="w-4 h-4" />
              The World's First AI-Powered Ice Cream Truck Reservation Platform
            </div>
          </FadeInUp>
          
          <FadeInUp delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#000223] mb-8 font-playfair">
              {occasion.h1}
            </h1>
          </FadeInUp>
          
          <FadeInUp delay={0.3}>
            <p className="text-xl text-slate-700 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
              {occasion.metaDescription}
            </p>
          </FadeInUp>
          
          <FadeInUp delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/packages" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FFA000] text-[#000223] font-black text-lg hover:bg-[#ffaa1a] active:scale-[0.98] transition-all shadow-lg"
              >
                Get Instant AI Quote & Book
              </Link>
              <Link 
                href="/contact-us" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-[#000223] border-2 border-slate-200 font-black text-lg hover:border-slate-300 active:scale-[0.98] transition-all"
              >
                Contact Our Specialists
              </Link>
            </div>
          </FadeInUp>
          
          <FadeInUp delay={0.5}>
            <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-slate-600">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Fully Licensed & Insured</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Since 1999</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Serving All Massachusetts</span>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Trust & FAQ Section */}
      <section className="py-24 bg-white relative z-10 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <FadeInUp>
              <div>
                <h2 className="text-4xl font-black text-[#000223] mb-6">Why Choose Boston Legend for your {occasion.h1.replace(" Ice Cream Truck", "")}?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <Star className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#000223] mb-2">Premium Experience</h3>
                      <p className="text-slate-600 font-medium leading-relaxed">Our pristine trucks and vans are fully stocked with a massive variety of premium ice cream. Our professional, uniformed staff handles everything.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#000223] mb-2">Safe, Clean & Insured</h3>
                      <p className="text-slate-600 font-medium leading-relaxed">We are fully health-department inspected and carry complete liability insurance. Certificates of Insurance (COI) available upon request.</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                <img src="/images/og-image.jpg" alt="Boston Legend Ice Cream Truck" className="w-full h-full object-cover" />
              </div>
            </FadeInUp>
          </div>
          
          <FaqAccordion />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
