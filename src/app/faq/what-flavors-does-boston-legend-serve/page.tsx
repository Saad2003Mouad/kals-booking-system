import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What Flavors Does Boston Legend Ice Cream Truck Serve? | Menu",
  description: "Boston Legend serves premium ice cream flavors including novelty bars, sandwiches, pops, and soft serve. See our full menu and book your event today!",
  alternates: { canonical: "/faq/what-flavors-does-boston-legend-serve" },
  openGraph: { title: "What Flavors Does Boston Legend Ice Cream Truck Serve?", description: "Premium ice cream flavors: novelty bars, sandwiches, pops & soft serve. See the full menu and book your Boston event!", url: "/faq/what-flavors-does-boston-legend-serve" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What flavors does Boston Legend Ice Cream Truck serve?", acceptedAnswer: { "@type": "Answer", text: "Boston Legend serves a wide variety of premium ice cream including novelty bars (chocolate-covered vanilla, strawberry bars), ice cream sandwiches, fruit popsicles, classic pops (creamsicles, fudge bars), and seasonal specialties. We stock a rotating selection of fan favorites to satisfy every guest at your event." } },
    { "@type": "Question", name: "Do you have dairy-free or allergy-friendly options?", acceptedAnswer: { "@type": "Answer", text: "We do carry some dairy-free and allergy-friendly options. Please mention any dietary restrictions at the time of booking and we will do our best to accommodate your guests. Call 617-999-3803 for specific flavor and allergy inquiries." } },
  ],
};

const categories = [
  {
    icon: "🍫",
    name: "Novelty Bars",
    items: ["Chocolate Eclair Bar", "Chocolate Fudge Bar", "Strawberry Shortcake Bar", "Cookies & Cream Bar", "Vanilla Crunch Bar", "Chocolate Taco"],
  },
  {
    icon: "🍪",
    name: "Ice Cream Sandwiches",
    items: ["Classic Vanilla Sandwich", "Chocolate Chip Cookie Sandwich", "Neapolitan Sandwich", "Giant Cookie Sandwich"],
  },
  {
    icon: "🍭",
    name: "Pops & Bars",
    items: ["Creamsicle", "Fudgsicle", "Strawberry Fruit Bar", "Mango Fruit Bar", "Coconut Bar", "Lemon Bar"],
  },
  {
    icon: "🍦",
    name: "Soft Serve & Cones",
    items: ["Vanilla Soft Serve", "Chocolate Soft Serve", "Twist (Vanilla + Chocolate)", "Dipped Cones", "Drumstick Cones"],
  },
];

export default function FlavorsFAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #001040 100%)", padding: "60px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <nav style={{ marginBottom: "20px" }}>
            <span style={{ fontSize: "13px" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>{" › "}
              <Link href="/faq" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>FAQ</Link>{" › "}
              <span style={{ color: "#FFA000" }}>Our Flavors</span>
            </span>
          </nav>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: "16px" }}>
            What Flavors Does<br /><span style={{ color: "#FFA000" }}>Boston Legend Serve?</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem", maxWidth: "580px", margin: "0 auto", lineHeight: 1.7, fontWeight: 500 }}>
            A premium rotating menu of novelty bars, sandwiches, pops, and soft serve — something for every guest!
          </p>
        </div>
      </section>

      <section style={{ background: "#FAF6EF", padding: "60px 16px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "28px 32px", border: "2px solid #FFA000", marginBottom: "48px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFA000", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Our Menu Philosophy</div>
            <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: "1rem", fontWeight: 500, margin: 0 }}>
              Boston Legend curates a <strong style={{ color: "#000223" }}>rotating selection of premium ice cream favorites</strong> to ensure there's something for every guest at your event — from classic favorites loved by kids to indulgent treats for adults. We also carry some dairy-free and allergy-friendly options on request.
            </p>
          </div>

          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 900, color: "#000223", marginBottom: "32px", textAlign: "center" }}>Our Ice Cream Menu</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", marginBottom: "48px" }}>
            {categories.map(cat => (
              <div key={cat.name} style={{ background: "#fff", borderRadius: "18px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ background: "#000223", padding: "20px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.8rem" }}>{cat.icon}</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff" }}>{cat.name}</span>
                </div>
                <div style={{ padding: "20px 24px" }}>
                  {cat.items.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid #f5f0e8" }}>
                      <span style={{ color: "#FFA000", fontWeight: 900, fontSize: "1.1rem", flexShrink: 0 }}>✦</span>
                      <span style={{ color: "#374151", fontWeight: 600, fontSize: "0.9rem" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(255,160,0,0.08)", borderRadius: "16px", padding: "24px 28px", border: "1px solid rgba(255,160,0,0.2)", marginBottom: "40px" }}>
            <div style={{ fontWeight: 800, color: "#000223", marginBottom: "8px", fontSize: "1rem" }}>🌱 Dietary & Allergy Information</div>
            <p style={{ color: "#4b5563", fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 500, margin: 0 }}>
              We carry some dairy-free and nut-free options. Please mention any dietary restrictions when booking, and our team will confirm available options for your event. Call <a href="tel:617-999-3803" style={{ color: "#000223", fontWeight: 700 }}>617-999-3803</a> for specific allergy inquiries.
            </p>
          </div>

          <div style={{ background: "#000223", borderRadius: "20px", padding: "36px", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🍦</div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", marginBottom: "12px" }}>Ready to Bring These Flavors to Your Event?</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "24px", fontWeight: 500 }}>Book online instantly or call <a href="tel:617-999-3803" style={{ color: "#FFA000", fontWeight: 800, textDecoration: "none" }}>617-999-3803</a></p>
            <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", display: "inline-block" }}>View Packages & Book Now →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
