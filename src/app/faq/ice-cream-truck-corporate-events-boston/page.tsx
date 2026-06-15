import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ice Cream Truck for Corporate Events Boston MA | Boston Legend",
  description: "Premium ice cream truck catering for corporate events, team building & employee appreciation in Boston, MA. Professional service. Packages from $250. Book online!",
  alternates: { canonical: "/faq/ice-cream-truck-corporate-events-boston" },
  openGraph: { title: "Ice Cream Truck for Corporate Events Boston MA", description: "Professional ice cream truck for corporate events in Boston. Packages from $250. Book online!", url: "/faq/ice-cream-truck-corporate-events-boston" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can I hire an ice cream truck for a corporate event in Boston?", acceptedAnswer: { "@type": "Answer", text: "Absolutely! Boston Legend specializes in corporate ice cream truck events across Greater Boston. We serve employee appreciation days, company picnics, product launches, team building events, and more. Our corporate packages start at $250 for 30 employees and scale to any size. We provide professional uniformed staff, premium ice cream, and a Certificate of Insurance upon request." } },
    { "@type": "Question", name: "How do I book an ice cream truck for a corporate event in Boston?", acceptedAnswer: { "@type": "Answer", text: "You can book instantly online at bostonlegendicecreamtruck.com/packages — select your package, enter your event details, and receive instant confirmation. For large corporate events requiring custom quotes, call us at 617-999-3803 or email info@bostonlegendicecreamtruck.com." } },
  ],
};

export default function CorporateEventsFAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #001040 100%)", padding: "60px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <nav style={{ marginBottom: "20px" }}>
            <span style={{ fontSize: "13px" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>{" › "}
              <Link href="/faq" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>FAQ</Link>{" › "}
              <span style={{ color: "#FFA000" }}>Corporate Events Boston</span>
            </span>
          </nav>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: "16px" }}>
            Ice Cream Truck for<br /><span style={{ color: "#FFA000" }}>Corporate Events in Boston</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem", maxWidth: "580px", margin: "0 auto", lineHeight: 1.7, fontWeight: 500 }}>
            Boston's #1 corporate ice cream service. Professional, on-time, and loved by teams across Greater Boston.
          </p>
        </div>
      </section>

      <section style={{ background: "#FAF6EF", padding: "60px 16px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "36px", border: "2px solid #FFA000", marginBottom: "40px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFA000", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Short Answer</div>
            <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: "1rem", fontWeight: 500, margin: 0 }}>
              <strong style={{ color: "#000223" }}>Yes!</strong> Boston Legend is the go-to ice cream truck for corporate events in Greater Boston. We serve <strong>employee appreciation days, company picnics, team building events, product launches</strong>, and more. Packages start at <strong style={{ color: "#FFA000" }}>$250 for 30 employees</strong>. Fully insured, professional staff included.
            </p>
          </div>

          <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 900, color: "#000223", marginBottom: "20px" }}>Corporate Event Types We Serve</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "40px" }}>
            {["Employee Appreciation","Company Picnic","Team Building","Product Launch","Brand Activation","Client Appreciation","Holiday Party","Quarterly Celebration","New Employee Welcome","Office Party","Trade Show","Conference Break"].map(t => (
              <span key={t} style={{ background: "#fff", color: "#000223", fontWeight: 700, fontSize: "0.85rem", padding: "7px 16px", borderRadius: "50px", border: "1px solid rgba(0,2,35,0.10)", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>{t}</span>
            ))}
          </div>

          <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 900, color: "#000223", marginBottom: "20px" }}>Corporate Packages</h2>
          <div style={{ display: "grid", gap: "14px", marginBottom: "40px" }}>
            {[
              { size: "30 employees", name: "Starter Event", price: "$250", duration: "1 hour" },
              { size: "50 employees", name: "Family Event", price: "$340", duration: "1.5 hours" },
              { size: "75 employees", name: "Celebration Pack", price: "$425", duration: "2 hours" },
              { size: "200+ employees", name: "Custom Quote", price: "Contact Us", duration: "Custom" },
            ].map(p => (
              <div key={p.size} style={{ background: "#fff", borderRadius: "14px", padding: "18px 24px", border: "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.size}</div>
                  <div style={{ fontWeight: 800, color: "#000223" }}>{p.name} · {p.duration}</div>
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#FFA000" }}>{p.price}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#000223", borderRadius: "20px", padding: "36px", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", marginBottom: "12px" }}>Book Your Corporate Ice Cream Event</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "24px", fontWeight: 500 }}>Online booking or call <a href="tel:617-999-3803" style={{ color: "#FFA000", fontWeight: 800, textDecoration: "none" }}>617-999-3803</a> for custom quotes</p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1rem", padding: "13px 28px", borderRadius: "50px", textDecoration: "none" }}>Book Online →</Link>
              <Link href="/services/corporate-events" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "13px 28px", borderRadius: "50px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
