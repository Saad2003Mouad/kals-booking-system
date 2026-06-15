import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wedding Ice Cream Truck Boston MA | Reception Catering | Boston Legend",
  description: "Add a sweet touch to your wedding with Boston Legend's luxury ice cream truck. Serving weddings across Greater Boston & MA. Custom packages available. Book now!",
  alternates: { canonical: "/services/wedding-ice-cream-truck" },
  openGraph: { title: "Wedding Ice Cream Truck Boston MA | Boston Legend", description: "Luxury ice cream truck catering for weddings across Greater Boston. Custom packages. Book now!", url: "/services/wedding-ice-cream-truck" },
};

const schema = { "@context": "https://schema.org", "@type": "Service", name: "Wedding Ice Cream Truck Boston MA", provider: { "@type": "LocalBusiness", name: "Boston Legend Ice Cream Truck", url: "https://www.bostonlegendicecreamtruck.com" }, description: "Luxury ice cream truck catering for weddings and receptions across Greater Boston and Massachusetts.", areaServed: { "@type": "State", name: "Massachusetts" } };

export default function WeddingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #2d0035 60%, #1a000a 100%)", padding: "80px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFA000", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>A Sweet Touch for Your Special Day</div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "20px" }}>Wedding Ice Cream<br /><span style={{ color: "#FFA000" }}>Truck in Boston, MA</span></h1>
          <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.75)", maxWidth: "600px", margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 500 }}>Create a uniquely delightful and Instagram-worthy moment at your wedding reception. Our elegant ice cream service adds a playful, memorable touch that your guests will rave about for years.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)" }}>💍 Book Wedding Service</Link>
            <a href="tel:617-999-3803" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>📞 617-999-3803</a>
          </div>
        </div>
      </section>
      <section style={{ background: "#FAF6EF", padding: "80px 16px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, color: "#000223", marginBottom: "48px" }}>Why Couples Love Boston Legend</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "24px" }}>
            {[
              { icon: "💎", title: "Elegant Presentation", desc: "Our spotless, beautifully presented truck creates stunning photo moments at your reception." },
              { icon: "🎨", title: "Custom Menu", desc: "Curate your wedding ice cream menu from our premium selection to match your theme and flavors." },
              { icon: "📸", title: "Instagram Moments", desc: "Guests love the surprise of an ice cream truck at a wedding — creating magical, shareable memories." },
              { icon: "⏰", title: "Perfectly Timed", desc: "We coordinate with your wedding timeline — arriving, serving, and departing exactly when planned." },
              { icon: "👰", title: "Stress-Free Service", desc: "On your wedding day, you deserve zero stress. We handle everything from arrival to cleanup." },
              { icon: "🌹", title: "Any Venue", desc: "Indoor venues, outdoor gardens, barns, beaches — we work with all wedding venues across Greater Boston." },
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
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #001040 100%)", padding: "80px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>💍</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 900, color: "#fff", marginBottom: "16px" }}>Reserve Your Wedding Date</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "32px", fontSize: "1.05rem", fontWeight: 500 }}>Wedding dates book fast! Call <a href="tel:617-999-3803" style={{ color: "#FFA000", fontWeight: 800, textDecoration: "none" }}>617-999-3803</a> or book online for custom wedding packages</p>
          <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1.1rem", padding: "16px 40px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)", display: "inline-block" }}>View Wedding Packages →</Link>
        </div>
      </section>
    </>
  );
}
