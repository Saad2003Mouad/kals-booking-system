import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Corporate Ice Cream Truck Boston | Employee Events | Boston Legend",
  description: "Premium ice cream truck catering for corporate events, employee appreciation days & company picnics across Greater Boston, MA. Professional service. Book now!",
  alternates: { canonical: "/services/corporate-events" },
  openGraph: { title: "Corporate Ice Cream Truck Boston | Employee Events", description: "Elevate your team with Boston's #1 corporate ice cream truck service. Employee appreciation, company picnics & brand activations.", url: "/services/corporate-events" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Corporate Ice Cream Truck Events Boston",
  provider: { "@type": "LocalBusiness", name: "Boston Legend Ice Cream Truck", url: "https://www.bostonlegendicecreamtruck.com" },
  description: "Professional ice cream truck catering for corporate events, employee appreciation days, and company picnics across Greater Boston, MA.",
  areaServed: { "@type": "State", name: "Massachusetts" },
};

export default function CorporateEventsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section style={{ background: "linear-gradient(135deg, #000223 0%, #0a1628 60%, #1a0a00 100%)", padding: "80px 16px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: "rgba(255,160,0,0.15)", border: "1px solid rgba(255,160,0,0.3)", borderRadius: "50px", padding: "6px 18px", marginBottom: "20px", fontSize: "13px", fontWeight: 700, color: "#FFA000", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Greater Boston's #1 Corporate Ice Cream Service
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "20px" }}>
            Corporate Ice Cream<br /><span style={{ color: "#FFA000" }}>Events in Boston, MA</span>
          </h1>
          <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.75)", maxWidth: "600px", margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 500 }}>
            Boost morale and show your team you care. Boston Legend delivers a premium, fully managed ice cream experience to your office, parking lot, or event venue — anywhere in Greater Boston.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)" }}>Book Corporate Event</Link>
            <a href="tel:617-999-3803" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>📞 617-999-3803</a>
          </div>
        </div>
      </section>

      <section style={{ background: "#FFA000", padding: "20px 16px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {[{ v: "$250", l: "Starting Price" },{ v: "500+", l: "Corporate Events" },{ v: "30–200+", l: "Guest Capacity" },{ v: "4.9★", l: "Client Rating" }].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#000223" }}>{s.v}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#000223", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#FAF6EF", padding: "80px 16px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, color: "#000223", marginBottom: "48px" }}>Why Companies Choose Boston Legend</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              { icon: "⏰", title: "Always On Time", desc: "We arrive early, set up fast, and serve efficiently — so your event runs on schedule without stress." },
              { icon: "🏆", title: "Professional Service", desc: "Our uniformed team is trained to handle corporate events with professionalism and a smile." },
              { icon: "🍦", title: "Premium Selection", desc: "Novelty bars, sandwiches, pops, and soft serve — something for every taste and dietary preference." },
              { icon: "📋", title: "Easy Booking", desc: "Book in under 3 minutes online. We handle all logistics from start to finish." },
              { icon: "🛡️", title: "Fully Insured", desc: "Certificate of Insurance available for venues that require it. Peace of mind guaranteed." },
              { icon: "📍", title: "We Come to You", desc: "Office parking lot, rooftop, park, or event venue — we serve anywhere in Greater Boston." },
            ].map(f => (
              <div key={f.title} style={{ background: "#fff", borderRadius: "16px", padding: "28px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{f.icon}</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#000223", marginBottom: "8px" }}>{f.title}</div>
                <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.7, fontWeight: 500, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "80px 16px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, color: "#000223", marginBottom: "12px" }}>Perfect for Any Corporate Occasion</h2>
          <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "36px", fontWeight: 500 }}>We've served hundreds of companies across Greater Boston</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {["Employee Appreciation Day","Company Picnic","Team Building Event","Office Party","Product Launch","Brand Activation","Summer Celebration","Quarterly Meeting Reward","Client Appreciation","Holiday Party","New Employee Welcome","Milestone Celebration"].map(tag => (
              <span key={tag} style={{ background: "rgba(0,2,35,0.05)", color: "#000223", fontWeight: 700, fontSize: "0.85rem", padding: "8px 18px", borderRadius: "50px", border: "1px solid rgba(0,2,35,0.08)" }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "linear-gradient(135deg, #000223 0%, #001040 100%)", padding: "80px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏢</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 900, color: "#fff", marginBottom: "16px" }}>Book Your Corporate Event Today</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "32px", fontSize: "1.05rem", fontWeight: 500 }}>Instant online booking or call us at <a href="tel:617-999-3803" style={{ color: "#FFA000", fontWeight: 800, textDecoration: "none" }}>617-999-3803</a> for custom quotes</p>
          <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1.1rem", padding: "16px 40px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)", display: "inline-block" }}>View Packages & Book Now →</Link>
        </div>
      </section>
    </>
  );
}
