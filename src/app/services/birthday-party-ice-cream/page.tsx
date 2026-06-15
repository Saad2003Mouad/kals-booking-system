import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Birthday Party Ice Cream Truck Boston MA | Boston Legend",
  description: "Make your birthday unforgettable with Boston's premier ice cream truck service! Serving Greater Boston & all MA. Packages from $190. Book online instantly!",
  alternates: { canonical: "/services/birthday-party-ice-cream" },
  openGraph: { title: "Birthday Party Ice Cream Truck Boston MA", description: "Make your birthday unforgettable with Boston's premier ice cream truck. Packages from $190. Book instantly!", url: "/services/birthday-party-ice-cream" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Birthday Party Ice Cream Truck Boston MA",
  provider: { "@type": "LocalBusiness", name: "Boston Legend Ice Cream Truck", url: "https://www.bostonlegendicecreamtruck.com" },
  description: "Birthday party ice cream truck service in Greater Boston and all of Massachusetts. Packages from $190.",
  areaServed: { "@type": "State", name: "Massachusetts" },
};

export default function BirthdayPartyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #3b0764 60%, #1a0000 100%)", padding: "80px 16px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: "rgba(255,160,0,0.15)", border: "1px solid rgba(255,160,0,0.3)", borderRadius: "50px", padding: "6px 18px", marginBottom: "20px", fontSize: "13px", fontWeight: 700, color: "#FFA000", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Kids & Adults Love It!
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "20px" }}>
            Birthday Party<br /><span style={{ color: "#FFA000" }}>Ice Cream Truck Boston</span>
          </h1>
          <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.75)", maxWidth: "600px", margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 500 }}>
            Turn any birthday into a legendary celebration! Our premium ice cream truck arrives at your party, ready to serve up smiles and sweet memories for every guest — kids and adults alike.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)" }}>🎂 Book Birthday Truck</Link>
            <a href="tel:617-999-3803" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>📞 617-999-3803</a>
          </div>
        </div>
      </section>

      <section style={{ background: "#FFA000", padding: "20px 16px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {[{ v: "$190", l: "Starting" },{ v: "Any Age", l: "Birthday" },{ v: "30–200+", l: "Guests" },{ v: "4.9★", l: "Rating" }].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#000223" }}>{s.v}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#000223", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#FAF6EF", padding: "80px 16px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, color: "#000223", marginBottom: "48px" }}>Why Boston Legend for Your Birthday?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "24px" }}>
            {[
              { icon: "🎉", title: "Everyone Gets Excited", desc: "Nothing brings instant joy like hearing the ice cream truck arrive. It's the ultimate birthday surprise!" },
              { icon: "🍦", title: "Premium Flavors for All", desc: "Novelty bars, sandwiches, pops, and soft serve. Allergy-friendly options available on request." },
              { icon: "⚡", title: "Fast & Fun Service", desc: "We set up in minutes and serve every guest quickly so the party keeps going." },
              { icon: "📸", title: "Incredible Photo Moments", desc: "The truck creates beautiful, shareable moments that make your birthday unforgettable on social media." },
              { icon: "🎯", title: "Any Location", desc: "Backyard, park, parking lot, or venue — we come to wherever the birthday celebration is happening." },
              { icon: "💰", title: "Great Value", desc: "Starting at $190 for 30 guests, it's an affordable way to make any birthday truly special." },
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
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎂</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 900, color: "#fff", marginBottom: "16px" }}>Book the Birthday Truck Now!</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "32px", fontSize: "1.05rem", fontWeight: 500 }}>Book online in under 3 minutes or call <a href="tel:617-999-3803" style={{ color: "#FFA000", fontWeight: 800, textDecoration: "none" }}>617-999-3803</a></p>
          <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1.1rem", padding: "16px 40px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)", display: "inline-block" }}>View Birthday Packages →</Link>
        </div>
      </section>
    </>
  );
}
