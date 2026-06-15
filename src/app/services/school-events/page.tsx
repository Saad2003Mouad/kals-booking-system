import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "School Event Ice Cream Truck MA | Fundraisers | Boston Legend",
  description: "Ice cream truck for school events, field days & fundraisers across Massachusetts. Large capacity packages up to 200+ students. Book online today!",
  alternates: { canonical: "/services/school-events" },
  openGraph: { title: "School Event Ice Cream Truck Massachusetts | Boston Legend", description: "Ice cream truck for school field days, fundraisers & events. 200+ student capacity. Book online!", url: "/services/school-events" },
};

const schema = { "@context": "https://schema.org", "@type": "Service", name: "School Event Ice Cream Truck Massachusetts", provider: { "@type": "LocalBusiness", name: "Boston Legend Ice Cream Truck", url: "https://www.bostonlegendicecreamtruck.com" }, description: "Ice cream truck service for school events, field days, and fundraisers across Massachusetts. Packages for 200+ students.", areaServed: { "@type": "State", name: "Massachusetts" } };

export default function SchoolEventsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #003300 60%, #001a00 100%)", padding: "80px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFA000", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Serving Schools Across Massachusetts</div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "20px" }}>School Event<br /><span style={{ color: "#FFA000" }}>Ice Cream Truck MA</span></h1>
          <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.75)", maxWidth: "600px", margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 500 }}>Field days, end-of-year celebrations, fundraisers, and school picnics — Boston Legend handles events of all sizes, from 30 to 200+ students, across all of Massachusetts.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)" }}>🎓 Book School Event</Link>
            <a href="tel:617-999-3803" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>📞 617-999-3803</a>
          </div>
        </div>
      </section>
      <section style={{ background: "#FFA000", padding: "20px 16px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {[{ v: "$825", l: "200-Student Pkg" },{ v: "All MA", l: "Service Area" },{ v: "200+", l: "Max Students" },{ v: "4.9★", l: "Rating" }].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}><div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#000223" }}>{s.v}</div><div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#000223", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div></div>
          ))}
        </div>
      </section>
      <section style={{ background: "#FAF6EF", padding: "80px 16px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, color: "#000223", marginBottom: "48px" }}>Perfect for Every School Occasion</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginBottom: "56px" }}>
            {["Field Day","End-of-Year Party","School Fundraiser","Teacher Appreciation","Back to School","Graduation Party","Science Fair","Sports Day","School Picnic","Honor Roll Celebration","Parent-Teacher Event","School Festival"].map(tag => (
              <span key={tag} style={{ background: "#fff", color: "#000223", fontWeight: 700, fontSize: "0.88rem", padding: "8px 18px", borderRadius: "50px", border: "1px solid rgba(0,2,35,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "24px" }}>
            {[
              { icon: "🏫", title: "All School Sizes", desc: "From small private schools to large public schools, we have packages that scale to your student count." },
              { icon: "⚡", title: "Fast Service Lines", desc: "Our experienced team serves students quickly and efficiently, minimizing wait times during your event." },
              { icon: "💰", title: "Fundraiser Friendly", desc: "We offer flexible arrangements that can support school fundraising goals. Ask us about revenue-sharing options." },
              { icon: "🌳", title: "Outdoor Ready", desc: "Fully self-contained truck — no power hookup needed. Ready for playgrounds, fields, and parking lots." },
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
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎓</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 900, color: "#fff", marginBottom: "16px" }}>Book Your School's Ice Cream Event</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "32px", fontSize: "1.05rem", fontWeight: 500 }}>Book online or call <a href="tel:617-999-3803" style={{ color: "#FFA000", fontWeight: 800, textDecoration: "none" }}>617-999-3803</a> for large school event quotes</p>
          <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1.1rem", padding: "16px 40px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 8px 24px rgba(255,160,0,0.4)", display: "inline-block" }}>View School Packages →</Link>
        </div>
      </section>
    </>
  );
}
