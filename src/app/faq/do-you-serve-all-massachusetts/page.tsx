import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Do You Serve All of Massachusetts? | Boston Legend Ice Cream Truck",
  description: "Boston Legend Ice Cream Truck serves 140+ cities across Massachusetts including Boston, Cambridge, Somerville, Newton, Quincy & more. Check if we serve your area!",
  alternates: { canonical: "/faq/do-you-serve-all-massachusetts" },
  openGraph: { title: "Do You Serve All of Massachusetts? | Boston Legend", description: "140+ cities served across Massachusetts. Check if Boston Legend covers your city and book online.", url: "/faq/do-you-serve-all-massachusetts" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Do you serve all of Massachusetts?", acceptedAnswer: { "@type": "Answer", text: "Yes! Boston Legend Ice Cream Truck serves 140+ cities and towns across Massachusetts. Our primary service area is Greater Boston, but we travel throughout the state. Cities served include Boston, Cambridge, Somerville, Newton, Quincy, Lynn, Waltham, Medford, Revere, Brookline, Malden, Everett, Chelsea, Woburn, Watertown, Needham, Dedham, Milton, Braintree, Weymouth, Framingham, Natick, Lexington, Concord, Burlington, Billerica, Lowell, Lawrence, Haverhill, Gloucester, Salem, Beverly, Peabody, Danvers, and many more." } },
    { "@type": "Question", name: "Is there a travel fee for events outside Boston?", acceptedAnswer: { "@type": "Answer", text: "Events within Greater Boston have no travel fee. For events farther from our base in Revere, MA, a small travel surcharge may apply. Contact us at 617-999-3803 or book online to see pricing for your specific location." } },
  ],
};

const cities = [
  "Abington","Allston","Andover","Arlington","Avon","Bedford","Belmont","Beverly","Boston","Braintree","Brighton","Brockton","Brookline","Burlington","Cambridge","Canton","Chelsea","Chestnut Hill","Cohasset","Concord","Danvers","Dedham","Dorchester","Duxbury","East Boston","Easton","Everett","Foxboro","Framingham","Georgetown","Gloucester","Hanover","Haverhill","Hingham","Hull","Hyde Park","Jamaica Plain","Kingston","Lawrence","Lexington","Lincoln","Lynn","Lynnfield","Malden","Marblehead","Marshfield","Medfield","Medford","Medway","Melrose","Milford","Milton","Natick","Needham","Newton","North End","Norwood","Peabody","Plymouth","Quincy","Randolph","Reading","Revere","Rockland","Roxbury","Salem","Saugus","Scituate","Sharon","Somerville","South Boston","South End","Stoneham","Stoughton","Swampscott","Taunton","Waltham","Watertown","Wayland","Wellesley","West Roxbury","Westwood","Weymouth","Winchester","Winthrop","Woburn","Wrentham"
];

export default function ServiceAreaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section style={{ background: "linear-gradient(135deg, #000223 0%, #001040 100%)", padding: "60px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <nav style={{ marginBottom: "20px" }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>{" › "}
              <Link href="/faq" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>FAQ</Link>{" › "}
              <span style={{ color: "#FFA000" }}>Service Area</span>
            </span>
          </nav>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: "16px" }}>
            Do You Serve All of<br /><span style={{ color: "#FFA000" }}>Massachusetts?</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem", maxWidth: "580px", margin: "0 auto", lineHeight: 1.7, fontWeight: 500 }}>
            Yes! Boston Legend serves <strong style={{ color: "#FFA000" }}>140+ cities</strong> across Massachusetts. Based in Revere, MA — we travel anywhere!
          </p>
        </div>
      </section>

      <section style={{ background: "#FAF6EF", padding: "60px 16px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "36px", border: "2px solid #FFA000", boxShadow: "0 8px 32px rgba(255,160,0,0.10)", marginBottom: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFA000", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Quick Answer</div>
            <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: "1rem", fontWeight: 500, margin: 0, maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
              <strong style={{ color: "#000223" }}>Yes!</strong> Boston Legend Ice Cream Truck serves all of Greater Boston and beyond — covering <strong style={{ color: "#000223" }}>140+ cities and towns</strong> across Massachusetts. Our home base is Revere, MA. Events within Greater Boston have <strong style={{ color: "#000223" }}>no travel fee</strong>.
            </p>
          </div>

          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 900, color: "#000223", marginBottom: "12px", textAlign: "center" }}>Cities We Serve in Massachusetts</h2>
          <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "32px", fontWeight: 500 }}>Including but not limited to:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {cities.map(city => (
              <Link key={city} href={`/cities/${city.toLowerCase().replace(/\s+/g, "-")}`} style={{ background: "#fff", color: "#000223", fontWeight: 700, fontSize: "0.85rem", padding: "7px 16px", borderRadius: "50px", border: "1px solid rgba(0,2,35,0.1)", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", textDecoration: "none" }}>
                {city}, MA
              </Link>
            ))}
          </div>

          <div style={{ background: "#000223", borderRadius: "20px", padding: "36px", marginTop: "48px", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", marginBottom: "12px" }}>Don't see your city?</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "24px", fontWeight: 500 }}>Call us! We serve many more locations and will do our best to accommodate your event.</p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:617-999-3803" style={{ background: "#FFA000", color: "#000223", fontWeight: 900, fontSize: "1rem", padding: "12px 28px", borderRadius: "50px", textDecoration: "none" }}>📞 617-999-3803</a>
              <Link href="/packages" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "12px 28px", borderRadius: "50px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>Book Online →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
