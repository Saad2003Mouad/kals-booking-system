"use client";
import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";

type Package = {
  id: string;
  name: string;
  slug: string;
  serviceType: string;
  description: string;
  servings: number;
  price: number;
  extraPiecePrice: number;
  extraGuestPrice?: number;
  durationMins?: number;
  imageUrl: string;
  badge: string;
  features: string;
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch("/api/packages");
        const json = await res.json();
        if (json.success && json.data) {
          setPackages(json.data);
        } else {
          // Fallback if DB is offline, load the seed data directly as fallback
          loadFallbackPackages();
        }
      } catch (err) {
        console.error("Error fetching packages", err);
        loadFallbackPackages();
      } finally {
        setLoading(false);
      }
    }

    function loadFallbackPackages() {
      // Hardcoded fallback so the page doesn't look empty while DB is paused
      setPackages([
        { id: "1", name: "Starter Event", slug: "starter-event-truck", serviceType: "AMERICANO_TRUCK", description: "", servings: 30, price: 250, extraPiecePrice: 5, durationMins: 60, imageUrl: "/pkg_truck_classic.jpg", badge: "Perfect for Small Events", features: "" },
        { id: "2", name: "Family Event", slug: "family-event-truck", serviceType: "AMERICANO_TRUCK", description: "", servings: 50, price: 340, extraPiecePrice: 5, durationMins: 90, imageUrl: "/pkg_truck_grand.jpg", badge: "", features: "" },
        { id: "3", name: "Celebration Pack", slug: "celebration-pack-truck", serviceType: "AMERICANO_TRUCK", description: "", servings: 75, price: 425, extraPiecePrice: 5, durationMins: 120, imageUrl: "/pkg_truck_legend.jpg", badge: "Most Popular", features: "" },
        { id: "4", name: "Starter Party", slug: "starter-party-van", serviceType: "SPRINTER_VAN", description: "", servings: 30, price: 190, extraPiecePrice: 4, durationMins: 60, imageUrl: "/pkg_van_starter.jpg", badge: "", features: "" },
        { id: "5", name: "Celebration Pack", slug: "celebration-pack-van", serviceType: "SPRINTER_VAN", description: "", servings: 75, price: 365, extraPiecePrice: 4, durationMins: 120, imageUrl: "/pkg_van_gold.jpg", badge: "Most Popular", features: "" },
        { id: "6", name: "School Festival Special", slug: "school-festival-van", serviceType: "SPRINTER_VAN", description: "", servings: 200, price: 825, extraPiecePrice: 4, durationMins: 180, imageUrl: "/pkg_van_school.jpg", badge: "Great for Schools", features: "" },
        { id: "custom", name: "Custom Event Package", slug: "custom-event-package", serviceType: "CUSTOM", description: "Planning a larger celebration? Tell us about your event and our team will prepare a custom package and final quote for you.", servings: 201, price: 0, extraPiecePrice: 0, durationMins: 0, imageUrl: "/images/packages/custom-event.jpg", badge: "For 200+ guests", features: "" }
      ]);
    }

    fetchPackages();
  }, []);

  const trucks = packages.filter(p => p.serviceType === "AMERICANO_TRUCK");
  const vans = packages.filter(p => p.serviceType === "SPRINTER_VAN");
  const customs = packages.filter(p => p.serviceType === "CUSTOM" || p.slug === "custom-event-package");

  return (
    <div className="page min-h-screen bg-transparent relative overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <SiteHeader />

        <section className="page-head">
          <div className="w-layout-blockcontainer container w-container">
            <h1 className="h1-page-hed">
              <span className="page-titel-top">Boston Legend </span>
              <br />
              Catering & Event 
              <br />
              <span className="title-event">Packages</span>
            </h1>
            <img 
              src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681d4ed9eee047f1fa20bfc9_decore-line.avif" 
              loading="lazy" 
              width="426" 
              height="36" 
              alt="" 
              className="h1-page-line" 
            />
          </div>
        </section>

        <main className="pb-20 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mt-6 mb-16 px-4">
              <p className="text-lg text-gray-600 font-medium">
                Choose the perfect ice cream truck or van package for your event. We bring premium flavors and unforgettable memories directly to you.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 animate-spin text-[#FFA000]" />
              </div>
            ) : (
              <>
                {/* Americano Truck Packages */}
                <div className="mb-20">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-3xl font-black text-[#000223]">Americano Ice Cream Truck</h2>
                    <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trucks.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
                  </div>
                </div>

                {/* Sprinter Van Packages */}
                <div className="mb-20">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-3xl font-black text-[#000223]">Sprinter / Dodge Van</h2>
                    <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vans.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
                  </div>
                </div>

                {/* Large Events & Custom Quotes */}
                {customs.length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <h2 className="text-3xl font-black text-[#000223]">Large Events & Custom Quote</h2>
                      <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {customs.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}

function PackageCard({ pkg }: { pkg: Package }) {
  const isCustom = pkg.slug === "custom-event-package";
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col hover:-translate-y-1 relative group w-full mx-auto max-w-[400px] md:max-w-none">
      {pkg.badge && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-[#000223] text-[#FFA000] text-xs font-black uppercase tracking-wider py-1.5 px-3 rounded-full shadow-lg border border-[#FFA000]/20">
            {pkg.badge}
          </span>
        </div>
      )}
      
      <div className="h-56 w-full relative overflow-hidden bg-gray-100">
        {pkg.imageUrl ? (
          <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
        )}
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-black text-[#000223] mb-2">{pkg.name}</h3>
        
        <div className="flex items-end gap-2 mb-6">
          <span className="text-4xl font-black text-[#FFA000] leading-none">
            {isCustom ? "Custom Quote" : `$${pkg.price}`}
          </span>
          {!isCustom && <span className="text-gray-500 font-medium mb-1">base price</span>}
        </div>

        {isCustom ? (
          <div className="flex-1 flex flex-col justify-between">
            <p className="text-gray-600 font-semibold mb-8 text-base leading-relaxed">
              {pkg.description || "Planning a larger celebration? Tell us about your event and our team will prepare a custom package and final quote for you."}
            </p>
            <Link 
              href={`/booking?packageId=${pkg.slug}`}
              className="w-full py-4 rounded-2xl bg-[#000223] text-[#FFA000] font-black text-lg text-center hover:bg-[#FFA000] hover:text-[#000223] active:scale-[0.98] transition-all shadow-md mt-auto"
            >
              Request Custom Quote
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-3 mb-8 flex-1">
              {pkg.durationMins && pkg.durationMins > 0 && (
                <li className="flex items-center gap-3 font-medium">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-black" style={{ background: 'rgba(255,160,0,0.12)', color: '#B45309' }}>
                    ⏱️ {pkg.durationMins < 60
                      ? `${pkg.durationMins} Minute Service`
                      : pkg.durationMins === 60
                      ? '1 Hour Service'
                      : pkg.durationMins % 60 === 0
                      ? `${pkg.durationMins / 60} Hour Service`
                      : `${Math.floor(pkg.durationMins / 60)}h ${pkg.durationMins % 60}m Service`}
                  </span>
                </li>
              )}
              <li className="flex items-center gap-3 text-gray-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>Up to <strong>{pkg.servings} Servings</strong> included</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>Premium Ice Cream Selection</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>Extra guests at <strong>${pkg.extraGuestPrice ?? pkg.extraPiecePrice} each</strong></span>
              </li>
            </ul>

            <Link 
              href={`/booking?packageId=${pkg.slug}`}
              className="w-full py-4 rounded-2xl bg-[#FFA000] text-[#000223] font-black text-lg text-center hover:bg-[#ffaa1a] active:scale-[0.98] transition-all shadow-md"
            >
              Book This Package
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
