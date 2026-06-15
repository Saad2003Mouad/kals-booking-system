import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Far in Advance to Book an Ice Cream Truck? | Boston Legend",
  description: "Wondering when to book your ice cream truck in Boston, MA? We recommend 2-4 weeks ahead for weekends. Learn why and book instantly online at Boston Legend.",
  alternates: { canonical: "/faq/how-far-in-advance-book-ice-cream-truck" },
  openGraph: { title: "How Far in Advance to Book an Ice Cream Truck?", description: "Book your Boston ice cream truck 2-4 weeks ahead for weekends. Tips to secure your date.", url: "/faq/how-far-in-advance-book-ice-cream-truck" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How far in advance should I book an ice cream truck?", acceptedAnswer: { "@type": "Answer", text: "We recommend booking 2–4 weeks in advance for weekend events and 1–2 weeks for weekdays. During peak season (May–September), popular Saturday dates can fill up 6–8 weeks in advance. You can check real-time availability and book instantly at bostonlegendicecreamtruck.com/packages." } },
    { "@type": "Question", name: "Can I book an ice cream truck last minute?", acceptedAnswer: { "@type": "Answer", text: "Sometimes! We do accommodate last-minute bookings when availability permits. For same-week or next-day bookings, call us directly at 617-999-3803 to check availability. Weekday events have more last-minute flexibility than weekends." } },
  ],
};

export default function HowFarAdvancePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #001040 100%)", padding: "60px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <nav style={{ marginBottom: "20px" }}>
            <span style={{ fontSize: "13px" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>{" › "}
              <Link href="/faq" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>FAQ</Link>{" › "}
              <span style={{ color: "#FFA000" }}>How Far in Advance to Book</span>
            </span>
          </nav>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: "16px" }}>
            How Far in Advance Should<br /><span style={{ color: "#FFA000" }}>I Book an Ice Cream Truck?</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem", maxWidth: "580px", margin: "0 auto", lineHeight: 1.7, fontWeight: 500 }}>
            Quick answer: 2–4 weeks for weekends, 1–2 weeks for weekdays. Peak season books fast!
          </p>
        </div>
      </section>

      <section style={{ background: "#FAF6EF", padding: "60px 16px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "36px", border: "2px solid #FFA000", marginBottom: "48px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFA000", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Our Recommendation</div>
            <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: "1rem", fontWeight: 500, margin: 0 }}>
              Book <strong style={{ color: "#000223" }}>2–4 weeks in advance</strong> for weekend events, and <strong style={{ color: "#000223" }}>1–2 weeks</strong> for weekday events. During peak season (May–September), popular Saturday dates fill up <strong style={{ color: "#000223" }}>6–8 weeks in advance</strong>. The earlier you book, the better your chances of getting your preferred date and time.
            </p>
          </div>

          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 900, color: "#000223", marginBottom: "24px" }}>Booking Timeline Guide</h2>
          <div style={{ display: "grid", gap: "16px", marginBottom: "48px" }}>
            {[
              { time: "6–8 Weeks Before", color: "#ef4444", dot: "#ef4444", label: "Peak Season Weekends", desc: "May through September Saturdays and Sundays book up fast. Reserve early!" },
              { time: "3–4 Weeks Before", color: "#f59e0b", dot: "#f59e0b", label: "Regular Weekends (Year-Round)", desc: "Most weekend events can be secured comfortably with 3–4 weeks notice." },
              { time: "1–2 Weeks Before", color: "#10b981", dot: "#10b981", label: "Weekday Events", desc: "Weekdays have more flexibility. 1–2 weeks is usually sufficient." },
              { time: "Same Week", color: "#6b7280", dot: "#6b7280", label: "Last-Minute Booking", desc: "Sometimes possible! Call 617-999-3803 directly to check same-week availability." },
            ].map(r => (
              <div key={r.time} style={{ background: "#fff", borderRadius: "14px", padding: "20px 24px", border: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: r.dot, flexShrink: 0, marginTop: "4px" }} />
                <div>
                  <div style={{ fontWeight: 700, color: "#6b7280", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.time}</div>
                  <div style={{ fontWeight: 800, color: "#000223", fontSize: "1.05rem", marginBottom: "4px" }}>{r.label}</div>
                  <p style={{ color: "#6b7280", fontSize: "0.9rem", fontWeight: 500, margin: 0, lineHeight: 1.6 }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {[{ q: "Can I book last minute?", a: "Yes — sometimes! We do our best to accommodate last-minute requests when availability allows. Your best bet is to call us directly at 617-999-3803 for same-week bookings." },
            { q: "What if my date is taken?", a: "We'll let you know immediately and suggest the closest available date and time. You can also check real-time availability when you click 'Book Now' on our packages page." },
            { q: "Do I need to pay upfront?", a: "Yes, a deposit is required to hold your date at the time of booking. This secures your truck, date, and time slot." },
          ].map(faq => (
            <details key={faq.q} style={{ background: "#fff", borderRadius: "14px", border: "1.5px solid #e8e0d5", marginBottom: "14px", overflow: "hidden" }}>
              <summary style={{ padding: "20px 22px", cursor: "pointer", fontWeight: 800, color: "#000223", fontSize: "1rem", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {faq.q}<span style={{ color: "#FFA000", fontSize: "1.4rem", flexShrink: 0 }}>+</span>
              </summary>
              <div style={{ padding: "0 22px 20px", color: "#4b5563", lineHeight: 1.7, fontSize: "0.95rem", fontWeight: 500, borderTop: "1px solid #f0e8df" }}>
                <p style={{ margin: "12px 0 0" }}>{faq.a}</p>
              </div>
            </details>
          ))}

          <div style={{ background: "#000223", borderRadius: "20px", padding: "36px", marginTop: "32px", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", marginBottom: "12px" }}>Check Availability & Book Now</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "24px", fontWeight: 500 }}>Don't wait — secure your date today in under 3 minutes</p>
            <Link href="/packages" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1rem", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", display: "inline-block" }}>Check Availability →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
