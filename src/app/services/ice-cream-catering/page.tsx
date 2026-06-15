import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ice Cream Catering Boston MA | Corporate & Private Events | Boston Legend",
  description: "Professional ice cream catering for corporate events, weddings, parties and more across Boston & Massachusetts. Flexible packages, premium flavors. Book today!",
  alternates: { canonical: "/services/ice-cream-catering" },
  openGraph: { title: "Ice Cream Catering Boston MA | Professional Service", description: "Full-service ice cream catering for any event in Greater Boston & MA.", url: "/services/ice-cream-catering" },
};

const schema = { "@context": "https://schema.org", "@type": "Service", name: "Ice Cream Catering Boston MA", provider: { "@type": "LocalBusiness", name: "Boston Legend Ice Cream Truck", url: "https://www.bostonlegendicecreamtruck.com" }, description: "Professional ice cream catering service for corporate events, weddings, birthday parties and all occasions across Greater Boston and Massachusetts.", areaServed: { "@type": "State", name: "Massachusetts" } };

export default function IceCreamCateringPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #1a0040 60%, #001a00 100%)", padding: "80px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "20px" }}>Ice Cream Catering<br /><span style={{ color: "#FFA000" }}>in Boston, MA</span></h1>
          <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.75)", maxWidth: "600px", margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 500 }}>Full-service, professional ice cream catering for corporate events, weddings, birthday parties, school events, and every occasion across Greater Boston and all of Massachusetts.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)" }}>Book Catering Service</Link>
            <a href="tel:617-999-3803" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>📞 617-999-3803</a>
          </div>
        </div>
      </section>
      <section style={{ background: "#FFA000", padding: "20px 16px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {[{ v: "$190+", l: "Starting Price" },{ v: "30–200+", l: "Guest Capacity" },{ v: "500+", l: "Events Catered" },{ v: "4.9★", l: "Client Rating" }].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}><div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#000223" }}>{s.v}</div><div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#000223", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div></div>
          ))}
        </div>
      </section>
      <section style={{ background: "#FAF6EF", padding: "80px 16px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, color: "#000223", marginBottom: "48px" }}>Complete Catering, Zero Hassle</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "24px" }}>
            {[
              { icon: "🚚", title: "We Come to You", desc: "We drive our fully equipped truck or van directly to your event location anywhere in Greater Boston and Massachusetts." },
              { icon: "🍦", title: "Premium Menu", desc: "Novelty bars, ice cream sandwiches, fruit bars, and soft serve. Custom menu selections available for your event." },
              { icon: "👔", title: "Professional Staff", desc: "Uniformed, friendly staff who represent your event with professionalism and hospitality." },
              { icon: "🧹", title: "Setup & Cleanup", desc: "We handle complete setup and cleanup — leaving your venue spotless after every event." },
              { icon: "📋", title: "Custom Packages", desc: "From intimate gatherings of 30 to large festivals of 500+, we have a package that fits your needs and budget." },
              { icon: "🛡️", title: "Fully Insured", desc: "Comprehensive liability insurance available. Certificate of Insurance provided upon request." },
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
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 900, color: "#fff", marginBottom: "16px" }}>Request a Catering Quote</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "32px", fontSize: "1.05rem", fontWeight: 500 }}>Book online or call <a href="tel:617-999-3803" style={{ color: "#FFA000", fontWeight: 800, textDecoration: "none" }}>617-999-3803</a> for custom quotes on large events</p>
          <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1.1rem", padding: "16px 40px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)", display: "inline-block" }}>View Catering Packages →</Link>
        </div>
      </section>
    </>
  );
}
