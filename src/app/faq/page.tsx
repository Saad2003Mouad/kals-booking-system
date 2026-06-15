import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ice Cream Truck FAQ Boston MA | Common Questions Answered | Boston Legend",
  description:
    "Find answers to common questions about renting an ice cream truck in Boston, MA. Pricing, booking, service area, flavors & more. Book online at Boston Legend.",
};

const faqs = [
  {
    question: "How much does an ice cream truck cost in Massachusetts?",
    answer:
      "Our packages start at $190 for up to 30 guests and go up to $825+ for 200+ guests. We have tiered pricing to fit every event size and budget. Visit our packages page for a full pricing breakdown and instant online booking.",
    slug: "how-much-does-ice-cream-truck-cost-massachusetts",
  },
  {
    question: "Do you serve all of Massachusetts?",
    answer:
      "Yes! Boston Legend serves 140+ cities and towns across Massachusetts including Boston, Cambridge, Somerville, Newton, Quincy, Lynn, Waltham, Medford, Revere, Brookline, and many more. Contact us to confirm availability in your area.",
    slug: "do-you-serve-all-massachusetts",
  },
  {
    question: "How far in advance should I book an ice cream truck?",
    answer:
      "We recommend booking 2–4 weeks in advance for weekend events and 1–2 weeks for weekdays. Our peak season runs May through September and dates fill up fast — the earlier you book, the better! You can check availability and book instantly online.",
    slug: "how-far-in-advance-book-ice-cream-truck",
  },
  {
    question: "What types of events do you serve?",
    answer:
      "Boston Legend serves all kinds of events: birthday parties, corporate events, school celebrations, weddings, block parties, fundraisers, reunions, sports events, marketing events, and photo shoots. No event is too big or too small!",
    slug: null,
  },
  {
    question: "Is Boston Legend the best ice cream truck for employee appreciation events?",
    answer:
      "Absolutely! Boston Legend is the #1 choice in Greater Boston for employee appreciation events. We offer professional, on-time service with a premium ice cream selection. Our corporate packages start at $250 for 30 employees and scale to any size.",
    slug: "best-ice-cream-truck-employee-appreciation-events",
  },
  {
    question: "What flavors does Boston Legend serve?",
    answer:
      "We carry a wide variety of premium ice cream options including novelty bars, ice cream sandwiches, popsicles, soft serve, and both classic and seasonal flavors. We stock something for every taste and dietary preference.",
    slug: "what-flavors-does-boston-legend-serve",
  },
  {
    question: "How does booking an ice cream truck work?",
    answer:
      "It's easy! Visit our packages page, choose the package that fits your guest count, enter your event details (date, time, location), and receive instant confirmation. No phone calls required — 100% online booking.",
    slug: null,
  },
  {
    question: "Do you offer custom packages for large events?",
    answer:
      "Yes! For events with 200+ guests we offer fully custom quotes tailored to your needs. Call or text us at 617-999-3803 or fill out our contact form and we'll build the perfect package for your event.",
    slug: null,
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://bostonlegend.com/" },
    { "@type": "ListItem", position: 2, name: "FAQ", item: "https://bostonlegend.com/faq" },
  ],
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main style={{ background: "#FAF6EF", minHeight: "100vh" }}>
        {/* ── Hero Banner ── */}
        <section
          style={{
            background: "linear-gradient(135deg, #000223 0%, #000c5a 60%, #001080 100%)",
            padding: "80px 24px 64px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative amber blob */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(255,160,0,0.18) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: "24px" }}>
            <ol
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                listStyle: "none",
                padding: 0,
                margin: 0,
                flexWrap: "wrap",
              }}
            >
              <li>
                <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>
                  Home
                </Link>
              </li>
              <li style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>›</li>
              <li style={{ color: "#FFA000", fontSize: "14px", fontWeight: 700 }}>FAQ</li>
            </ol>
          </nav>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,160,0,0.15)", border: "1px solid rgba(255,160,0,0.3)", borderRadius: "50px", padding: "6px 16px", marginBottom: "20px" }}>
            <span style={{ fontSize: "18px" }}>🍦</span>
            <span style={{ color: "#FFA000", fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Frequently Asked Questions</span>
          </div>

          <h1
            style={{
              color: "#ffffff",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900,
              margin: "0 auto 16px",
              maxWidth: "760px",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Ice Cream Truck FAQ{" "}
            <span style={{ color: "#FFA000" }}>Boston, MA</span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "clamp(16px, 2vw, 20px)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Everything you need to know about booking Boston Legend's premium ice cream truck for your next event.
          </p>
        </section>

        {/* ── FAQ Accordion ── */}
        <section style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px 80px" }}>
          <style>{`
            .faq-details {
              background: #ffffff;
              border-radius: 16px;
              border: 1.5px solid #e8e0d5;
              margin-bottom: 16px;
              overflow: hidden;
              transition: box-shadow 0.25s ease, border-color 0.25s ease;
              box-shadow: 0 2px 8px rgba(0,2,35,0.04);
            }
            .faq-details[open] {
              border-color: #FFA000;
              box-shadow: 0 6px 24px rgba(255,160,0,0.12);
            }
            .faq-summary {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              padding: 22px 24px;
              cursor: pointer;
              list-style: none;
              font-size: 17px;
              font-weight: 800;
              color: #000223;
              line-height: 1.4;
              user-select: none;
            }
            .faq-summary::-webkit-details-marker { display: none; }
            .faq-summary::marker { display: none; }
            .faq-icon {
              flex-shrink: 0;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: #FFA000;
              color: #000223;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              font-weight: 900;
              line-height: 1;
              transition: transform 0.25s ease, background 0.2s;
            }
            .faq-details[open] .faq-icon {
              transform: rotate(45deg);
              background: #000223;
              color: #FFA000;
            }
            .faq-body {
              padding: 0 24px 22px;
              color: #4a3728;
              font-size: 16px;
              line-height: 1.7;
              border-top: 1px solid #f0e8df;
            }
            .faq-body p { margin: 12px 0 0; }
            .faq-read-more {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              margin-top: 14px;
              color: #FFA000;
              font-weight: 700;
              font-size: 14px;
              text-decoration: none;
              transition: gap 0.2s;
            }
            .faq-read-more:hover { gap: 10px; }
          `}</style>

          {faqs.map((faq, i) => (
            <details key={i} className="faq-details">
              <summary className="faq-summary">
                <span>{faq.question}</span>
                <span className="faq-icon" aria-hidden="true">+</span>
              </summary>
              <div className="faq-body">
                <p>{faq.answer}</p>
                {faq.slug && (
                  <Link href={`/faq/${faq.slug}`} className="faq-read-more">
                    Read full answer →
                  </Link>
                )}
              </div>
            </details>
          ))}

          {/* ── CTA ── */}
          <div
            style={{
              marginTop: "56px",
              background: "linear-gradient(135deg, #000223 0%, #000c5a 100%)",
              borderRadius: "24px",
              padding: "48px 32px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "200px",
                height: "200px",
                background: "radial-gradient(circle, rgba(255,160,0,0.2) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🍦</div>
            <h2 style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
              Ready to Book Your Ice Cream Truck?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", margin: "0 0 28px", lineHeight: 1.6 }}>
              Instant confirmation · Packages from $190 · 140+ cities in Massachusetts
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <Link
                href="/packages"
                style={{
                  display: "inline-block",
                  background: "#FFA000",
                  color: "#000223",
                  fontWeight: 900,
                  fontSize: "17px",
                  padding: "16px 40px",
                  borderRadius: "50px",
                  textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(255,160,0,0.4)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                Book Your Ice Cream Truck →
              </Link>
              <a
                href="tel:6179993803"
                style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", textDecoration: "none" }}
              >
                Or call us: 617-999-3803
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
