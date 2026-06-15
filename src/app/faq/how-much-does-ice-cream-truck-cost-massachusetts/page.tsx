import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Much Does an Ice Cream Truck Cost in Massachusetts? | Boston Legend",
  description: "Ice cream truck rental in Massachusetts starts at $190 for 30 guests. See complete pricing breakdown for all event sizes. Get an instant quote from Boston Legend.",
  alternates: { canonical: "/faq/how-much-does-ice-cream-truck-cost-massachusetts" },
  openGraph: { title: "How Much Does an Ice Cream Truck Cost in Massachusetts?", description: "Complete pricing guide: Ice cream truck rental in MA starts at $190. See all packages, what's included, and book instantly.", url: "/faq/how-much-does-ice-cream-truck-cost-massachusetts" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How much does an ice cream truck cost in Massachusetts?", acceptedAnswer: { "@type": "Answer", text: "Boston Legend ice cream truck packages start at $190 for a Sprinter van starter party (30 guests, 1 hour) or $250 for the Americano truck Starter Event (30 guests, 1 hour). Packages scale up to $825+ for school festival specials serving 200+ guests over 3 hours. All packages include premium ice cream selection and professional staff." } },
    { "@type": "Question", name: "What affects the cost of an ice cream truck rental?", acceptedAnswer: { "@type": "Answer", text: "The main factors are: (1) Number of guests — more guests means a larger package, (2) Duration — longer service time costs more, (3) Vehicle type — Americano truck vs Sprinter van have different pricing, (4) Location — events very far outside Greater Boston may have travel fees, (5) Event type — standard vs custom packages." } },
    { "@type": "Question", name: "Are there any hidden fees?", acceptedAnswer: { "@type": "Answer", text: "No! Boston Legend offers transparent, all-inclusive pricing. The package price covers the truck, staff, fuel, ice cream up to your included serving count, and setup/breakdown. Extra servings beyond your included count are billed at the per-piece rate shown on each package." } },
  ],
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bostonlegendicecreamtruck.com/" },
    { "@type": "ListItem", position: 2, name: "FAQ", item: "https://www.bostonlegendicecreamtruck.com/faq" },
    { "@type": "ListItem", position: 3, name: "Ice Cream Truck Cost Massachusetts", item: "https://www.bostonlegendicecreamtruck.com/faq/how-much-does-ice-cream-truck-cost-massachusetts" },
  ],
};

const packages = [
  { name: "Sprinter Van — Starter Party", price: "$190", guests: "30 guests", duration: "1 hour", extra: "$4/extra serving" },
  { name: "Americano Truck — Starter Event", price: "$250", guests: "30 guests", duration: "1 hour", extra: "$5/extra serving" },
  { name: "Americano Truck — Family Event", price: "$340", guests: "50 guests", duration: "1.5 hours", extra: "$5/extra serving" },
  { name: "Sprinter Van — Celebration Pack", price: "$365", guests: "75 guests", duration: "2 hours", extra: "$4/extra serving" },
  { name: "Americano Truck — Celebration Pack", price: "$425", guests: "75 guests", duration: "2 hours", extra: "$5/extra serving" },
  { name: "School Festival Special (Van)", price: "$825", guests: "200 guests", duration: "3 hours", extra: "$4/extra serving" },
  { name: "Custom Event Package", price: "Custom Quote", guests: "200+ guests", duration: "Custom", extra: "Inquire" },
];

export default function IceCreamCostPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #001040 100%)", padding: "60px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <nav style={{ marginBottom: "20px" }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
              {" › "}
              <Link href="/faq" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>FAQ</Link>
              {" › "}
              <span style={{ color: "#FFA000" }}>Pricing in Massachusetts</span>
            </span>
          </nav>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: "16px" }}>
            How Much Does an Ice Cream Truck<br /><span style={{ color: "#FFA000" }}>Cost in Massachusetts?</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem", maxWidth: "580px", margin: "0 auto", lineHeight: 1.7, fontWeight: 500 }}>
            Complete 2025 pricing guide. Packages start at $190. No hidden fees, instant online booking.
          </p>
        </div>
      </section>

      {/* Quick Answer Box */}
      <section style={{ background: "#FAF6EF", padding: "60px 16px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "36px", border: "2px solid #FFA000", boxShadow: "0 8px 32px rgba(255,160,0,0.10)", marginBottom: "48px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFA000", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Quick Answer</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#000223", marginBottom: "16px" }}>Boston Legend Pricing at a Glance</h2>
            <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: "1rem", fontWeight: 500, margin: 0 }}>
              Ice cream truck rental in Massachusetts with Boston Legend ranges from <strong style={{ color: "#000223" }}>$190 to $825+</strong> depending on guest count, duration, and vehicle type. All packages include premium ice cream, professional staff, and full setup. For 200+ guests, custom quotes are available. <Link href="/packages" style={{ color: "#FFA000", fontWeight: 700, textDecoration: "none" }}>See all packages →</Link>
            </p>
          </div>

          {/* Pricing Table */}
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 900, color: "#000223", marginBottom: "24px" }}>Complete Pricing Breakdown 2025</h2>
          <div style={{ overflowX: "auto", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
              <thead>
                <tr style={{ background: "#000223" }}>
                  {["Package", "Price", "Guests", "Duration", "Extra Servings"].map(h => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#FFA000", fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg, i) => (
                  <tr key={pkg.name} style={{ borderBottom: "1px solid #f0e8df", background: i % 2 === 0 ? "#fff" : "#FAF6EF" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#000223", fontSize: "0.88rem" }}>{pkg.name}</td>
                    <td style={{ padding: "14px 16px", fontWeight: 900, color: "#FFA000", fontSize: "1rem" }}>{pkg.price}</td>
                    <td style={{ padding: "14px 16px", color: "#4b5563", fontSize: "0.88rem", fontWeight: 500 }}>{pkg.guests}</td>
                    <td style={{ padding: "14px 16px", color: "#4b5563", fontSize: "0.88rem", fontWeight: 500 }}>{pkg.duration}</td>
                    <td style={{ padding: "14px 16px", color: "#4b5563", fontSize: "0.88rem", fontWeight: 500 }}>{pkg.extra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* What Affects Price */}
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 900, color: "#000223", marginTop: "56px", marginBottom: "24px" }}>What Affects the Price?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
            {[
              { icon: "👥", title: "Guest Count", desc: "The main driver — more guests require a larger package with more included servings." },
              { icon: "⏱️", title: "Duration", desc: "Longer events cost more. Most packages range from 1 to 3 hours of active service." },
              { icon: "🚚", title: "Vehicle Type", desc: "Sprinter vans start at $190; Americano trucks start at $250 and can serve more guests." },
              { icon: "📍", title: "Location", desc: "Events in Greater Boston have no travel fees. Distant locations may have small fuel surcharges." },
            ].map(f => (
              <div key={f.title} style={{ background: "#fff", borderRadius: "14px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{f.icon}</div>
                <div style={{ fontWeight: 800, color: "#000223", marginBottom: "6px", fontSize: "1rem" }}>{f.title}</div>
                <p style={{ color: "#6b7280", fontSize: "0.88rem", lineHeight: 1.6, fontWeight: 500, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 900, color: "#000223", marginTop: "56px", marginBottom: "24px" }}>Frequently Asked Pricing Questions</h2>
          {[
            { q: "Are there any hidden fees?", a: "No! Boston Legend offers 100% transparent pricing. Your package price covers the truck, staff, fuel, ice cream up to your included serving count, and setup/breakdown. Extra servings are billed at the per-piece rate shown on each package." },
            { q: "Can I get a discount for weekday events?", a: "Pricing is consistent across days, but booking early ensures you get the date and package you want. For recurring corporate clients, ask about our loyalty discounts." },
            { q: "What is included in the price?", a: "Every package includes: the truck/van, professional uniformed staff, premium ice cream selection up to your included serving count, setup and breakdown, and liability coverage." },
          ].map(faq => (
            <details key={faq.q} style={{ background: "#fff", borderRadius: "14px", border: "1.5px solid #e8e0d5", marginBottom: "14px", overflow: "hidden" }}>
              <summary style={{ padding: "20px 22px", cursor: "pointer", fontWeight: 800, color: "#000223", fontSize: "1rem", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {faq.q}<span style={{ color: "#FFA000", fontSize: "1.4rem", flexShrink: 0 }}>+</span>
              </summary>
              <div style={{ padding: "0 22px 20px", color: "#4b5563", lineHeight: 1.7, fontSize: "0.95rem", fontWeight: 500, borderTop: "1px solid #f0e8df" }}>
                <p style={{ margin: "12px 0 0" }}>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #001040 100%)", padding: "64px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🍦</div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, color: "#fff", marginBottom: "14px" }}>Get Your Instant Quote Now</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "28px", fontSize: "1rem", fontWeight: 500 }}>See real-time pricing and book in under 3 minutes</p>
          <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1.05rem", padding: "14px 36px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)", display: "inline-block" }}>View All Packages & Pricing →</Link>
        </div>
      </section>
    </>
  );
}
