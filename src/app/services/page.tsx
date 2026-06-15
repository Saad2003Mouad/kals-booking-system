import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ice Cream Truck Services Boston MA | Boston Legend",
  description:
    "Boston Legend offers premium ice cream truck services for birthdays, corporate events, weddings, school events & more across Greater Boston, MA. Book online instantly.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Ice Cream Truck Services Boston MA | Boston Legend",
    description:
      "Premium ice cream truck services for every occasion in Greater Boston, MA. Birthdays, corporate events, weddings, school events & more.",
    url: "/services",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Boston Legend Ice Cream Truck Services",
  description:
    "Premium ice cream truck services for all occasions in Greater Boston, Massachusetts.",
  url: "https://www.bostonlegendicecreamtruck.com/services",
  numberOfItems: 6,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Ice Cream Truck Rental Boston",
      url: "https://www.bostonlegendicecreamtruck.com/services/ice-cream-truck-rental",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Ice Cream Catering Boston",
      url: "https://www.bostonlegendicecreamtruck.com/services/ice-cream-catering",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Birthday Party Ice Cream Truck Boston",
      url: "https://www.bostonlegendicecreamtruck.com/services/birthday-party-ice-cream",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Corporate Ice Cream Events Boston",
      url: "https://www.bostonlegendicecreamtruck.com/services/corporate-events",
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Wedding Ice Cream Truck Boston",
      url: "https://www.bostonlegendicecreamtruck.com/services/wedding-ice-cream-truck",
    },
    {
      "@type": "ListItem",
      position: 6,
      name: "School Event Ice Cream Truck Massachusetts",
      url: "https://www.bostonlegendicecreamtruck.com/services/school-events",
    },
  ],
};

const SERVICES = [
  {
    href: "/services/ice-cream-truck-rental",
    icon: "🚚",
    title: "Ice Cream Truck Rental",
    subtitle: "From $190",
    description:
      "Rent Boston's most beloved ice cream truck for any occasion. Classic Americano truck or sleek Sprinter van — we bring the party to you.",
    tags: ["Any Event", "All Ages", "1–3 Hours"],
    color: "from-blue-900 to-[#000223]",
    accentBg: "rgba(255,160,0,0.10)",
  },
  {
    href: "/services/ice-cream-catering",
    icon: "🍨",
    title: "Ice Cream Catering",
    subtitle: "Corporate & Private",
    description:
      "Professional full-service ice cream catering for events of all sizes. Premium flavors, elegant presentation, stress-free execution.",
    tags: ["Full Service", "Premium Flavors", "30–200+ Guests"],
    color: "from-purple-900 to-[#000223]",
    accentBg: "rgba(255,160,0,0.10)",
  },
  {
    href: "/services/birthday-party-ice-cream",
    icon: "🎂",
    title: "Birthday Party",
    subtitle: "Make it Magical",
    description:
      "Turn any birthday into a legendary memory with our fun, festive ice cream truck experience that kids and adults absolutely love.",
    tags: ["Kids & Adults", "Fun & Festive", "Any Age"],
    color: "from-pink-900 to-[#000223]",
    accentBg: "rgba(255,160,0,0.10)",
  },
  {
    href: "/services/corporate-events",
    icon: "🏢",
    title: "Corporate Events",
    subtitle: "Employee Appreciation",
    description:
      "Elevate your team culture with a premium ice cream truck experience. Perfect for employee appreciation, company picnics, and brand activations.",
    tags: ["Professional", "On-Time", "Fully Insured"],
    color: "from-slate-800 to-[#000223]",
    accentBg: "rgba(255,160,0,0.10)",
  },
  {
    href: "/services/wedding-ice-cream-truck",
    icon: "💍",
    title: "Wedding Ice Cream",
    subtitle: "Sweet Celebrations",
    description:
      "Add a uniquely delightful touch to your wedding day. Our elegant ice cream service creates moments your guests will talk about for years.",
    tags: ["Elegant Setup", "Custom Menu", "Romantic Touch"],
    color: "from-rose-900 to-[#000223]",
    accentBg: "rgba(255,160,0,0.10)",
  },
  {
    href: "/services/school-events",
    icon: "🎓",
    title: "School Events",
    subtitle: "Field Days & Fundraisers",
    description:
      "Serving schools, field days, and fundraisers across Massachusetts. Our large-capacity packages handle 200+ students with ease.",
    tags: ["200+ Students", "Fundraiser Ready", "All of MA"],
    color: "from-green-900 to-[#000223]",
    accentBg: "rgba(255,160,0,0.10)",
  },
];

export default function ServicesIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* ── Hero ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #000223 0%, #001040 50%, #1a0a00 100%)",
          position: "relative",
          overflow: "hidden",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,160,0,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            left: "-40px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,160,0,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,160,0,0.15)",
              border: "1px solid rgba(255,160,0,0.3)",
              borderRadius: "50px",
              padding: "6px 18px",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFA000", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Greater Boston &amp; All of Massachusetts
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "20px",
              letterSpacing: "-0.02em",
            }}
          >
            Ice Cream Truck Services<br />
            <span style={{ color: "#FFA000" }}>in Greater Boston, MA</span>
          </h1>

          <p
            style={{
              fontSize: "1.2rem",
              color: "rgba(255,255,255,0.75)",
              maxWidth: "640px",
              margin: "0 auto 36px",
              lineHeight: 1.7,
              fontWeight: 500,
            }}
          >
            From intimate birthday parties to large corporate events — Boston Legend delivers unforgettable ice cream experiences across all of Massachusetts.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/packages"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#FFA000",
                color: "#000223",
                fontWeight: 900,
                fontSize: "1rem",
                padding: "14px 32px",
                borderRadius: "50px",
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(255,160,0,0.35)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              📅 Book Now — View Packages
            </Link>
            <a
              href="tel:617-999-3803"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.1)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "14px 32px",
                borderRadius: "50px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              📞 617-999-3803
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: "#FFA000", padding: "20px 16px" }}>
        <div className="max-w-5xl mx-auto" style={{ display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {[
            { value: "500+", label: "Events Served" },
            { value: "140+", label: "Cities in MA" },
            { value: "4.9★", label: "Average Rating" },
            { value: "$190", label: "Starting Price" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#000223", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#000223", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section style={{ background: "#FAF6EF", padding: "80px 16px" }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 900,
                color: "#000223",
                marginBottom: "12px",
                letterSpacing: "-0.02em",
              }}
            >
              Our Services
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#6b7280", maxWidth: "520px", margin: "0 auto", fontWeight: 500 }}>
              Choose the perfect ice cream truck experience for your event
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "28px",
            }}
          >
            {SERVICES.map((svc) => (
              <Link
                key={svc.href}
                href={svc.href}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
                  }}
                >
                  {/* Card header */}
                  <div
                    style={{
                      background: `linear-gradient(135deg, #000223 0%, #001040 100%)`,
                      padding: "32px 28px 24px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-20px",
                        right: "-20px",
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        background: "rgba(255,160,0,0.08)",
                        pointerEvents: "none",
                      }}
                    />
                    <div style={{ fontSize: "2.8rem", marginBottom: "12px" }}>{svc.icon}</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#ffffff", marginBottom: "4px" }}>
                      {svc.title}
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#FFA000" }}>{svc.subtitle}</div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "24px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <p style={{ fontSize: "0.95rem", color: "#4b5563", lineHeight: 1.7, fontWeight: 500, marginBottom: "20px", flex: 1 }}>
                      {svc.description}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
                      {svc.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: "rgba(255,160,0,0.10)",
                            color: "#92400e",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "4px 12px",
                            borderRadius: "50px",
                            border: "1px solid rgba(255,160,0,0.2)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "#000223",
                        fontWeight: 800,
                        fontSize: "0.9rem",
                      }}
                    >
                      <span>Learn More</span>
                      <span style={{ fontSize: "1.2rem" }}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #000223 0%, #001040 100%)",
          padding: "80px 16px",
          textAlign: "center",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🍦</div>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 900,
              color: "#ffffff",
              marginBottom: "16px",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to Book Your Event?
          </h2>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", marginBottom: "36px", fontWeight: 500 }}>
            Browse packages and book your date instantly online — or call us at{" "}
            <a href="tel:617-999-3803" style={{ color: "#FFA000", textDecoration: "none", fontWeight: 800 }}>
              617-999-3803
            </a>
          </p>
          <Link
            href="/packages"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#FFA000",
              color: "#000223",
              fontWeight: 900,
              fontSize: "1.1rem",
              padding: "16px 40px",
              borderRadius: "50px",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(255,160,0,0.4)",
            }}
          >
            View All Packages &amp; Pricing
          </Link>
        </div>
      </section>
    </>
  );
}
