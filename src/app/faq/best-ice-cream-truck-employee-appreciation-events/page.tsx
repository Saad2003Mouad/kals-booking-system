import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best Ice Cream Truck for Employee Appreciation Events Boston | Boston Legend",
  description: "Looking for the best ice cream truck for your employee appreciation day in Boston, MA? Boston Legend offers professional service, premium flavors & easy booking.",
  alternates: { canonical: "/faq/best-ice-cream-truck-employee-appreciation-events" },
  openGraph: { title: "Best Ice Cream Truck for Employee Appreciation Events Boston", description: "Boston Legend is Greater Boston's #1 choice for employee appreciation ice cream events. Professional, premium, easy to book.", url: "/faq/best-ice-cream-truck-employee-appreciation-events" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is Boston Legend the best ice cream truck for employee appreciation events?", acceptedAnswer: { "@type": "Answer", text: "Yes! Boston Legend is Greater Boston's #1 choice for corporate employee appreciation events. We offer professional, on-time service with premium ice cream selections, flexible scheduling any day of the week, and packages starting at $250 for up to 30 employees. Our team handles all logistics so you can focus on celebrating your team." } },
    { "@type": "Question", name: "How much does an employee appreciation ice cream event cost?", acceptedAnswer: { "@type": "Answer", text: "Corporate employee appreciation packages start at $250 for up to 30 employees (1 hour). For 50 employees the Family Event package is $340, for 75 employees the Celebration Pack is $425. Large teams of 200+ can request a custom quote. All prices include the truck, staff, and premium ice cream selection." } },
  ],
};

export default function EmployeeAppreciationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #001040 100%)", padding: "60px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <nav style={{ marginBottom: "20px" }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>{" › "}
              <Link href="/faq" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>FAQ</Link>{" › "}
              <span style={{ color: "#FFA000" }}>Employee Appreciation</span>
            </span>
          </nav>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: "16px" }}>
            Best Ice Cream Truck for<br /><span style={{ color: "#FFA000" }}>Employee Appreciation Events</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem", maxWidth: "580px", margin: "0 auto", lineHeight: 1.7, fontWeight: 500 }}>
            Boston Legend is Greater Boston's #1 corporate ice cream service — professional, premium, and stress-free.
          </p>
        </div>
      </section>

      <section style={{ background: "#FAF6EF", padding: "60px 16px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "36px", border: "2px solid #FFA000", marginBottom: "48px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFA000", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>The Short Answer</div>
            <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: "1rem", fontWeight: 500, margin: 0 }}>
              <strong style={{ color: "#000223" }}>Yes — Boston Legend is the best choice</strong> for employee appreciation events in Greater Boston. We've served hundreds of companies with professional, on-time service, premium ice cream, and zero hassle for your HR or event team. Packages start at <strong style={{ color: "#FFA000" }}>$250 for 30 employees</strong>.
            </p>
          </div>

          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 900, color: "#000223", marginBottom: "24px" }}>Why Companies Choose Boston Legend</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px", marginBottom: "48px" }}>
            {[
              { icon: "⏰", title: "On-Time, Every Time", desc: "We arrive early, set up quickly, and serve your team on your schedule — no delays." },
              { icon: "👔", title: "Corporate-Ready", desc: "Professional uniformed staff who represent your company culture with a friendly, polished presence." },
              { icon: "🍦", title: "Premium Selection", desc: "Novelty bars, sandwiches, pops, and soft serve — something for every taste and dietary need." },
              { icon: "📋", title: "Zero Hassle Booking", desc: "Book in under 3 minutes online. We confirm, send reminders, and handle all logistics." },
              { icon: "🛡️", title: "Fully Insured", desc: "COI available for any venue. Reliable, insured, and trusted by Boston's top companies." },
              { icon: "📍", title: "We Come to You", desc: "Office, parking lot, park, rooftop — we set up wherever your team is celebrating." },
            ].map(f => (
              <div key={f.title} style={{ background: "#fff", borderRadius: "14px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{f.icon}</div>
                <div style={{ fontWeight: 800, color: "#000223", marginBottom: "6px", fontSize: "1rem" }}>{f.title}</div>
                <p style={{ color: "#6b7280", fontSize: "0.88rem", lineHeight: 1.6, fontWeight: 500, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", fontWeight: 900, color: "#000223", marginBottom: "12px" }}>Recommended Packages for Corporate Events</h2>
          <div style={{ display: "grid", gap: "16px", marginBottom: "48px" }}>
            {[
              { team: "Small Team (30 employees)", pkg: "Starter Event", price: "$250", duration: "1 hour" },
              { team: "Mid-Size Team (50 employees)", pkg: "Family Event", price: "$340", duration: "1.5 hours" },
              { team: "Larger Team (75 employees)", pkg: "Celebration Pack", price: "$425", duration: "2 hours" },
              { team: "Large Company (200+ employees)", pkg: "Custom Quote", price: "Contact us", duration: "Custom" },
            ].map(r => (
              <div key={r.team} style={{ background: "#fff", borderRadius: "14px", padding: "20px 24px", border: "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#6b7280", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.team}</div>
                  <div style={{ fontWeight: 800, color: "#000223", fontSize: "1.05rem" }}>{r.pkg}</div>
                  <div style={{ color: "#6b7280", fontSize: "0.85rem", fontWeight: 500 }}>⏱️ {r.duration}</div>
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#FFA000" }}>{r.price}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#000223", borderRadius: "20px", padding: "36px", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", marginBottom: "12px" }}>Book Your Employee Appreciation Event</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "24px", fontWeight: 500 }}>Instant online booking or call <a href="tel:617-999-3803" style={{ color: "#FFA000", fontWeight: 800, textDecoration: "none" }}>617-999-3803</a> for custom corporate quotes</p>
            <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)", display: "inline-block" }}>Book Corporate Event →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
