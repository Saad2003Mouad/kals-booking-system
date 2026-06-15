import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ice Cream Truck Rental Boston MA | From $190 | Boston Legend",
  description: "Rent a premium ice cream truck in Boston, MA starting at $190. Serving all of Greater Boston & Massachusetts. Perfect for any event. Book online instantly!",
  alternates: { canonical: "/services/ice-cream-truck-rental" },
  openGraph: { title: "Ice Cream Truck Rental Boston MA | From $190", description: "Rent a premium ice cream truck in Boston, MA starting at $190. Serving Greater Boston & all of MA.", url: "/services/ice-cream-truck-rental" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Ice Cream Truck Rental Boston MA",
  provider: { "@type": "LocalBusiness", name: "Boston Legend Ice Cream Truck", url: "https://www.bostonlegendicecreamtruck.com" },
  areaServed: { "@type": "State", name: "Massachusetts" },
  description: "Premium ice cream truck rental in Greater Boston and all of Massachusetts. Packages from $190 for 30 guests. Book online instantly.",
  offers: [
    { "@type": "Offer", name: "Starter Event Package", price: "250", priceCurrency: "USD", description: "1 hour, up to 30 guests" },
    { "@type": "Offer", name: "Family Event Package", price: "340", priceCurrency: "USD", description: "1.5 hours, up to 50 guests" },
    { "@type": "Offer", name: "Celebration Pack", price: "425", priceCurrency: "USD", description: "2 hours, up to 75 guests" },
    { "@type": "Offer", name: "School Festival Special", price: "825", priceCurrency: "USD", description: "3 hours, up to 200 guests" },
  ],
};

const cities = ["Boston","Cambridge","Somerville","Newton","Quincy","Lynn","Waltham","Medford","Revere","Brookline","Malden","Everett","Chelsea","Woburn","Watertown","Needham","Dedham","Milton","Braintree","Weymouth","Framingham","Natick","Lexington","Concord","Burlington","Billerica","Lowell","Lawrence","Haverhill","Gloucester","Salem","Beverly","Peabody","Danvers","Winthrop","Swampscott","Marblehead","Randolph","Canton","Stoughton"];

export default function IceCreamTruckRentalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #001040 60%, #1a0500 100%)", padding: "80px 16px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,160,0,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFA000", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Greater Boston & All of Massachusetts</div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "20px", letterSpacing: "-0.02em" }}>
            Ice Cream Truck Rental<br /><span style={{ color: "#FFA000" }}>in Boston, MA</span>
          </h1>
          <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.75)", maxWidth: "600px", margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 500 }}>
            Boston's most beloved ice cream truck — available to rent for birthdays, corporate events, school days, and any celebration. Packages start at just $190.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)" }}>📅 View Packages & Book Now</Link>
            <a href="tel:617-999-3803" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>📞 617-999-3803</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#FFA000", padding: "20px 16px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {[{ v: "$190", l: "Starting Price" },{ v: "500+", l: "Events" },{ v: "140+", l: "Cities Served" },{ v: "4.9★", l: "Rating" }].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#000223" }}>{s.v}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#000223", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ background: "#FAF6EF", padding: "80px 16px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 900, color: "#000223", marginBottom: "12px" }}>Rental Packages & Pricing</h2>
          <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "48px", fontSize: "1.05rem", fontWeight: 500 }}>Transparent pricing, no hidden fees. Book instantly online.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
            {[
              { name: "Starter Event", price: "$250", guests: "30 Guests", duration: "1 Hour", vehicle: "Truck or Van", popular: false },
              { name: "Family Event", price: "$340", guests: "50 Guests", duration: "1.5 Hours", vehicle: "Truck", popular: false },
              { name: "Celebration Pack", price: "$425", guests: "75 Guests", duration: "2 Hours", vehicle: "Truck", popular: true },
              { name: "School Festival", price: "$825", guests: "200 Guests", duration: "3 Hours", vehicle: "Truck", popular: false },
            ].map(pkg => (
              <div key={pkg.name} style={{ background: "#fff", borderRadius: "20px", padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: pkg.popular ? "2px solid #FFA000" : "1px solid rgba(0,0,0,0.07)", position: "relative" }}>
                {pkg.popular && <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "0.7rem", padding: "4px 14px", borderRadius: "50px", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>Most Popular</div>}
                <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#000223", marginBottom: "8px" }}>{pkg.name}</div>
                <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#FFA000", marginBottom: "16px", lineHeight: 1 }}>{pkg.price}</div>
                {[`👥 Up to ${pkg.guests}`, `⏱️ ${pkg.duration}`, `🚚 ${pkg.vehicle}`, "✅ Premium Ice Cream Selection", "✅ Professional Staff"].map(f => (
                  <div key={f} style={{ fontSize: "0.88rem", color: "#374151", fontWeight: 500, marginBottom: "8px" }}>{f}</div>
                ))}
                <Link href={`/packages`} style={{ display: "block", marginTop: "20px", background: pkg.popular ? "#FFA000" : "#000223", color: pkg.popular ? "#000223" : "#FFA000", fontWeight: 900, textAlign: "center", padding: "12px", borderRadius: "12px", textDecoration: "none", fontSize: "0.95rem" }}>Book This Package</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section style={{ background: "#fff", padding: "64px 16px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 900, color: "#000223", marginBottom: "12px" }}>We Serve 140+ Cities Across Massachusetts</h2>
          <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "36px", fontWeight: 500 }}>Including but not limited to:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {cities.map(city => (
              <span key={city} style={{ background: "rgba(0,2,35,0.05)", color: "#000223", fontWeight: 700, fontSize: "0.85rem", padding: "6px 16px", borderRadius: "50px", border: "1px solid rgba(0,2,35,0.08)" }}>{city}, MA</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #001040 100%)", padding: "80px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🍦</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 900, color: "#fff", marginBottom: "16px" }}>Ready to Book Your Ice Cream Truck?</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "32px", fontSize: "1.05rem", fontWeight: 500 }}>Book instantly online or call <a href="tel:617-999-3803" style={{ color: "#FFA000", fontWeight: 800, textDecoration: "none" }}>617-999-3803</a></p>
          <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1.1rem", padding: "16px 40px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)", display: "inline-block" }}>View All Packages & Pricing →</Link>
        </div>
      </section>
    </>
  );
}
