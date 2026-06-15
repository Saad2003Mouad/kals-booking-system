import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ice Cream Truck for Birthday Party Boston MA | Boston Legend",
  description: "Make your birthday party unforgettable with Boston Legend's premium ice cream truck! Boston MA & surrounding areas. Packages from $190. Book online instantly!",
  alternates: { canonical: "/faq/ice-cream-truck-birthday-party-boston" },
  openGraph: { title: "Ice Cream Truck for Birthday Party Boston MA", description: "Make any birthday unforgettable with Boston's #1 ice cream truck! Packages from $190. Book instantly.", url: "/faq/ice-cream-truck-birthday-party-boston" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can I hire an ice cream truck for a birthday party in Boston?", acceptedAnswer: { "@type": "Answer", text: "Yes! Boston Legend is the perfect birthday party ice cream truck for Boston and all of Massachusetts. We serve kids' and adult birthday parties with packages starting at $190 for 30 guests. We come directly to your backyard, park, or venue and create an unforgettable experience for all ages." } },
    { "@type": "Question", name: "How much does an ice cream truck cost for a birthday party in Boston?", acceptedAnswer: { "@type": "Answer", text: "Birthday party ice cream truck packages from Boston Legend start at $190 for the Sprinter Van Starter Party (30 guests, 1 hour) or $250 for the Americano Truck Starter Event. Larger parties of 50–75 guests range from $340–$425. Book instantly online at bostonlegendicecreamtruck.com/packages." } },
  ],
};

export default function BirthdayPartyFAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #3b0764 60%, #1a0000 100%)", padding: "60px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <nav style={{ marginBottom: "20px" }}>
            <span style={{ fontSize: "13px" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>{" › "}
              <Link href="/faq" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>FAQ</Link>{" › "}
              <span style={{ color: "#FFA000" }}>Birthday Party Boston</span>
            </span>
          </nav>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: "16px" }}>
            Ice Cream Truck for<br /><span style={{ color: "#FFA000" }}>Birthday Parties in Boston</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem", maxWidth: "580px", margin: "0 auto", lineHeight: 1.7, fontWeight: 500 }}>
            Boston's favorite birthday party treat — starting at just $190 for 30 guests!
          </p>
        </div>
      </section>

      <section style={{ background: "#FAF6EF", padding: "60px 16px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "36px", border: "2px solid #FFA000", marginBottom: "40px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFA000", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Short Answer</div>
            <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: "1rem", fontWeight: 500, margin: 0 }}>
              <strong style={{ color: "#000223" }}>Absolutely!</strong> Boston Legend is the go-to birthday party ice cream truck in Greater Boston. Packages start at <strong style={{ color: "#FFA000" }}>$190</strong> for 30 guests. We come to your home, park, or venue and create a magical moment that kids and adults absolutely love.
            </p>
          </div>

          <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 900, color: "#000223", marginBottom: "20px" }}>Birthday Party Packages</h2>
          <div style={{ display: "grid", gap: "14px", marginBottom: "40px" }}>
            {[
              { name: "Van — Starter Party", price: "$190", guests: "30 guests", duration: "1 hour", popular: false },
              { name: "Truck — Starter Event", price: "$250", guests: "30 guests", duration: "1 hour", popular: false },
              { name: "Truck — Family Event", price: "$340", guests: "50 guests", duration: "1.5 hours", popular: false },
              { name: "Truck — Celebration Pack", price: "$425", guests: "75 guests", duration: "2 hours", popular: true },
            ].map(p => (
              <div key={p.name} style={{ background: "#fff", borderRadius: "14px", padding: "18px 24px", border: p.popular ? "2px solid #FFA000" : "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", position: "relative" }}>
                {p.popular && <div style={{ position: "absolute", top: "-11px", right: "16px", background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "0.65rem", padding: "3px 12px", borderRadius: "50px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Most Popular</div>}
                <div>
                  <div style={{ fontWeight: 800, color: "#000223" }}>{p.name}</div>
                  <div style={{ fontWeight: 500, fontSize: "0.88rem", color: "#6b7280" }}>👥 {p.guests} · ⏱️ {p.duration}</div>
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#FFA000" }}>{p.price}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 900, color: "#000223", marginBottom: "20px" }}>Why Kids (and Adults!) Love It</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "40px" }}>
            {[
              { icon: "😱", title: "Instant Excitement", desc: "The moment the truck arrives, the party energy goes through the roof!" },
              { icon: "📸", title: "Perfect Photo Ops", desc: "Beautiful, shareable birthday moments everyone will remember." },
              { icon: "🎯", title: "Comes to You", desc: "Backyard, park, community center — we set up wherever you are." },
              { icon: "🍦", title: "Everyone Gets a Treat", desc: "A huge variety of ice cream to satisfy every guest's taste." },
            ].map(f => (
              <div key={f.title} style={{ background: "#fff", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{f.icon}</div>
                <div style={{ fontWeight: 800, color: "#000223", marginBottom: "6px" }}>{f.title}</div>
                <p style={{ color: "#6b7280", fontSize: "0.85rem", lineHeight: 1.6, fontWeight: 500, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "#000223", borderRadius: "20px", padding: "36px", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🎂</div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", marginBottom: "12px" }}>Book the Birthday Truck Now!</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "24px", fontWeight: 500 }}>Book in under 3 minutes or call <a href="tel:617-999-3803" style={{ color: "#FFA000", fontWeight: 800, textDecoration: "none" }}>617-999-3803</a></p>
            <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", display: "inline-block" }}>View Birthday Packages →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
