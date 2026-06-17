import React from 'react';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ice Cream Truck Services | Boston Legend',
  description: 'Explore our premium ice cream truck services for birthdays, corporate events, weddings, and school functions across Greater Boston, MA.',
};

const SERVICES = [
  {
    title: "Birthday Parties",
    desc: "Make their special day unforgettable with a surprise visit from Boston's best ice cream truck.",
    link: "/services/birthday-parties"
  },
  {
    title: "Corporate Events",
    desc: "Boost employee morale and host the perfect team building event with premium ice cream catering.",
    link: "/services/corporate-events"
  },
  {
    title: "Weddings",
    desc: "Add a sweet, nostalgic touch to your reception with our luxury ice cream truck packages.",
    link: "/services/wedding-ice-cream-truck"
  },
  {
    title: "School Events",
    desc: "Perfect for field days, fundraisers, and graduation parties. Large capacity packages available.",
    link: "/services/school-events"
  }
];

export default function ServicesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": SERVICES.map((svc, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://www.bostonlegendicecreamtruck.com${svc.link}`,
      "name": svc.title
    }))
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <SiteHeader />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-[#000223] mb-6">
              Our Ice Cream Services
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From intimate birthday gatherings to massive corporate events, we provide the ultimate ice cream experience across Massachusetts.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {SERVICES.map((svc, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-[#000223] mb-4">{svc.title}</h2>
                <p className="text-gray-600 mb-8 flex-grow">{svc.desc}</p>
                <Link href={svc.link} className="text-[#FFA000] font-bold flex items-center hover:text-yellow-500 transition-colors">
                  Learn More <span className="ml-2">→</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-[#000223] text-white p-12 rounded-3xl">
            <h2 className="text-3xl font-playfair font-bold mb-4">Ready to book your event?</h2>
            <p className="text-gray-300 mb-8">View our packages and get an instant quote online.</p>
            <Link href="/packages" className="inline-block bg-[#FFA000] text-[#000223] font-bold py-4 px-8 rounded-full hover:bg-yellow-400 transition-colors shadow-lg">
              View Packages & Pricing
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
