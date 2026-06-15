import fs from "fs";
import path from "path";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { notFound } from "next/navigation";
import { Metadata } from "next";

/* ─── Per-occasion FAQ data ─── */
const OCCASION_FAQS: Record<string, { q: string; a: string }[]> = {
  "birthday-parties": [
    { q: "How much does an ice cream truck cost for a birthday party in Boston?", a: "Birthday party packages start at $190 for up to 30 guests and go up to $825+ for larger celebrations. Pricing depends on guest count, duration, and location within Greater Boston." },
    { q: "How far in advance should I book for a birthday party?", a: "We recommend booking 2–4 weeks in advance, especially for weekend birthday parties during peak season (May–September). Weekday bookings can often be arranged with 1–2 weeks notice." },
    { q: "Do you serve kids' and adults' birthday parties?", a: "Absolutely! Boston Legend serves birthday parties for all ages — from children's parties with fun novelty bars to elegant adult celebrations with premium selections." },
    { q: "Can I request specific ice cream flavors for my birthday?", a: "Yes! We carry a wide variety of flavors including novelty bars, sandwiches, pops, and more. Contact us at 617-999-3803 to discuss your preferences." },
    { q: "Is there an extra fee for Saturday/Sunday birthday parties?", a: "Yes, weekend bookings (Saturday and Sunday) include a $25 weekend event fee. This is automatically reflected in your booking total." },
  ],
  "corporate-parties": [
    { q: "What is the best ice cream truck package for corporate events in Boston?", a: "For most corporate events, our packages range from $250 for 30 employees up to custom pricing for 200+ attendees. We recommend the Family or Celebration packages for mid-size teams." },
    { q: "Do you offer invoice/billing options for companies?", a: "Yes! We work with corporate clients and can accommodate company billing. Contact us at 617-999-3803 or book online and mention your billing requirements." },
    { q: "Can you serve multiple office locations in one day?", a: "Yes, we offer multi-stop routing. Each additional stop is $50. For simultaneous coverage at multiple locations, we can deploy multiple trucks (additional $200 setup fee per extra truck)." },
    { q: "How far in advance should we book for employee appreciation day?", a: "Corporate events during peak season should be booked 3–4 weeks ahead. For off-peak weekday events, 1–2 weeks is usually sufficient." },
    { q: "Do you provide service for large corporate events of 200+ employees?", a: "Yes! For events over 200 guests, we offer custom pricing. Call us at 617-999-3803 and our team will prepare a tailored quote for your large event." },
  ],
  "block-parties": [
    { q: "How much does an ice cream truck cost for a block party?", a: "Block party packages start at $190 for 30 guests. For larger neighborhood events, we offer packages up to $825+ and custom pricing for 200+ guests." },
    { q: "Do you need a permit to have an ice cream truck at a block party?", a: "Permit requirements vary by city. Our team can advise you based on your location. Call us at 617-999-3803 and we'll help coordinate." },
    { q: "How many people can you serve at a block party?", a: "We can serve any size block party! Our standard packages cover 30–200 guests. For larger neighborhood events, contact us for custom solutions including multiple trucks." },
    { q: "Is there an extra charge for weekend block parties?", a: "Yes, a $25 weekend event fee applies for Saturday and Sunday bookings. This will be shown clearly in your booking summary." },
    { q: "What areas in Greater Boston do you serve for block parties?", a: "We serve 140+ cities across Massachusetts including Boston, Cambridge, Somerville, Quincy, Newton, Lynn, and many more. Confirm your location when booking." },
  ],
  "fundraisers": [
    { q: "Can an ice cream truck help raise money for our cause?", a: "Yes! Many organizations partner with Boston Legend to create a fun fundraiser atmosphere. Contact us to discuss fundraising partnership arrangements." },
    { q: "What packages are best for fundraiser events?", a: "Our Celebration package ($425 for up to 100 guests) is popular for fundraisers. We also offer custom packages for larger events." },
    { q: "Can you serve at outdoor fundraiser events?", a: "Absolutely. Our truck is fully mobile and set up for outdoor events. We just need a flat, accessible surface with reasonable clearance." },
    { q: "How far in advance should we book an ice cream truck for a fundraiser?", a: "We recommend 3–4 weeks in advance for peak season fundraisers. For off-season events, 2 weeks is typically sufficient." },
    { q: "Do you offer special arrangements for non-profit organizations?", a: "Contact us at 617-999-3803 to discuss your non-profit event needs. We're proud to support community causes across Greater Boston." },
  ],
  "wedding-receptions": [
    { q: "How much does an ice cream truck cost for a wedding reception?", a: "Wedding packages start at $340 for 50 guests and scale up for larger weddings. We also offer custom packages for receptions with 200+ guests. Call 617-999-3803 for a custom quote." },
    { q: "Can you coordinate with our wedding venue?", a: "Yes! We work closely with venues to ensure seamless setup. Simply provide your venue contact and we'll coordinate arrival times and location logistics." },
    { q: "Do you offer a wedding-specific ice cream menu?", a: "We offer a premium selection suitable for weddings including novelty bars, pops, and sandwiches. Contact us to discuss flavor options for your special day." },
    { q: "How far in advance should we book for a wedding?", a: "We strongly recommend booking your wedding date 1–3 months in advance, especially for summer and fall weddings. Weekend dates book up fast." },
    { q: "Is there a weekend surcharge for Saturday weddings?", a: "Yes, a $25 weekend event fee applies for Saturday and Sunday bookings — a small addition for your perfect day!" },
  ],
  "school-occasions": [
    { q: "Can you serve ice cream at school events in Massachusetts?", a: "Yes! Boston Legend regularly serves school field days, graduations, end-of-year parties, and fundraisers across Massachusetts. We can accommodate 30–200+ students." },
    { q: "What age groups do you serve for school events?", a: "We serve all ages — from elementary school field days to high school graduation parties. Our selection includes kid-friendly favorites loved by all grades." },
    { q: "Do you have insurance and safety certifications for school events?", a: "Yes, Boston Legend is fully insured and operates safely. Please contact us at 617-999-3803 if your school requires documentation." },
    { q: "How much does an ice cream truck cost for a school event?", a: "School event packages start at $190 for 30 students and scale up based on attendance. Large school events (200+ students) can be quoted with a custom package." },
    { q: "How far in advance should schools book?", a: "For school events, especially end-of-year and graduation parties, we recommend booking 4–6 weeks in advance as these dates fill up very quickly." },
  ],
  "sports-occasions": [
    { q: "Can you serve ice cream at youth sports tournaments?", a: "Yes! Boston Legend is perfect for post-game celebrations, sports tournaments, and team appreciation events. We serve groups of 30 to 200+ athletes and fans." },
    { q: "Can you park at sports fields and parks?", a: "Our truck can park in most sports field parking areas with standard vehicle access. We need a flat accessible surface and reasonable clearance for setup." },
    { q: "What sports events do you typically serve?", a: "We serve soccer tournaments, baseball/softball leagues, basketball events, lacrosse games, track meets, and more across Greater Boston and Massachusetts." },
    { q: "How much does an ice cream truck cost for a sports event?", a: "Sports event packages start at $190 for 30 attendees. Team celebration packages for 50–100 athletes typically range $340–$425. Custom quotes available for larger events." },
    { q: "Can we book recurring service for our sports league?", a: "Contact us at 617-999-3803 to discuss seasonal arrangements for leagues that want recurring service throughout their season." },
  ],
  "reunions": [
    { q: "Is an ice cream truck a good idea for a family reunion?", a: "Absolutely! An ice cream truck creates a fun, nostalgic atmosphere that guests of all ages love. It's a unique, memorable touch for any family or class reunion." },
    { q: "How much does an ice cream truck cost for a reunion?", a: "Reunion packages start at $190 for 30 guests. For larger family or class reunions, packages scale up accordingly. Custom pricing for 200+ guests." },
    { q: "Can you serve at outdoor parks for reunions?", a: "Yes! Boston Legend regularly serves at parks, picnic areas, and outdoor venues across Greater Boston. We just need accessible vehicle entry." },
    { q: "How early should I book for a reunion event?", a: "For summer reunions (June–August), book 4–6 weeks ahead. For spring or fall reunions, 2–3 weeks is usually sufficient." },
    { q: "Can you accommodate dietary restrictions at reunions?", a: "We carry a range of products. Contact us at 617-999-3803 to discuss specific dietary needs and we'll do our best to accommodate your guests." },
  ],
  "launch-parties": [
    { q: "Why should I add an ice cream truck to my product launch?", a: "An ice cream truck creates a memorable, shareable moment that differentiates your launch. Guests remember unique experiences — and sweet treats generate social media buzz." },
    { q: "How much does an ice cream truck cost for a product launch?", a: "Launch party packages start at $250 for 30 guests and scale up based on event size. Custom packages available for large brand activations with 200+ attendees." },
    { q: "Can the truck incorporate branding at our launch event?", a: "For branding and custom activations, contact us at 617-999-3803 to discuss your specific branding needs. Our team loves creative collaborations!" },
    { q: "How far in advance should we book for a launch event?", a: "We recommend booking 3–4 weeks in advance to secure your preferred date. High-demand launch dates (especially weekends) can book up 6+ weeks ahead." },
    { q: "Is there a weekend surcharge for Saturday launch parties?", a: "Yes, a $25 weekend event fee applies for Saturday and Sunday bookings. This is shown in your booking summary before you confirm." },
  ],
  "marketing-events": [
    { q: "How can an ice cream truck boost my marketing event?", a: "Ice cream trucks are a proven crowd magnet. They create foot traffic, extend dwell time, and generate organic social media content — all valuable for brand activations and marketing events." },
    { q: "Can Boston Legend incorporate branded elements at our marketing event?", a: "Contact us at 617-999-3803 to discuss custom branding options for your marketing activation. We love collaborating on creative brand experiences." },
    { q: "How much does an ice cream truck cost for a marketing event?", a: "Marketing event packages start at $250 for 30 guests. Larger brand activations with extended service times are quoted custom. Call 617-999-3803 for details." },
    { q: "Can you serve at trade shows or outdoor expos?", a: "We can serve at outdoor trade shows and expos with vehicle access. Contact us to explore options based on your specific event logistics." },
    { q: "Do you offer extended service hours for all-day marketing events?", a: "Yes! Each 30 minutes of additional service time is $35. We can accommodate all-day brand activations with extended packages." },
  ],
  "movie-rental": [
    { q: "Can you provide ice cream for an outdoor movie night?", a: "Yes! Boston Legend is the perfect complement to any outdoor movie screening. Our truck adds a fun, cinema-style treat experience for your guests." },
    { q: "How much does an ice cream truck cost for a movie night?", a: "Movie night packages start at $190 for 30 guests. Whether it's a backyard screening or a large community movie event, we have packages to fit your needs." },
    { q: "Can you serve during the movie screening?", a: "We typically serve before the movie begins or during intermission to minimize disruption. We can coordinate service timing with your event schedule." },
    { q: "What's the best package for a private movie night?", a: "Our Starter package ($190 for 30 guests, 60 min) is perfect for private movie screenings. For larger events, our Family or Celebration packages work great." },
    { q: "Do you serve at drive-in style movie events?", a: "Absolutely! Boston Legend is a natural fit for drive-in events. Contact us at 617-999-3803 to plan the perfect setup for your screening." },
  ],
  "photo-sessions": [
    { q: "Can an ice cream truck be used as a photo prop?", a: "Yes! The Boston Legend truck is a stunning, photogenic prop that adds character to any photo shoot — from personal branding sessions to editorial and commercial work." },
    { q: "How much does it cost to rent an ice cream truck for a photo shoot?", a: "Photo session packages start at $190. Contact us at 617-999-3803 to discuss your shoot requirements and we'll put together the right package for you." },
    { q: "Can you provide ice cream for talent and crew during a photo shoot?", a: "Absolutely! We can serve the full crew and any on-camera talent with a premium selection of ice cream during your shoot day." },
    { q: "Do you serve at film and commercial productions?", a: "Yes! Boston Legend has experience supporting film sets, TV productions, and commercial shoots. Contact us to discuss production-scale needs." },
    { q: "How much notice do you need for a photo session booking?", a: "We recommend at least 2 weeks notice for photo sessions. For productions with specific time requirements, 3–4 weeks is preferable to ensure availability." },
  ],
};

/* ─── Build FAQ HTML block ─── */
function buildFaqSection(slug: string): string {
  const faqs = OCCASION_FAQS[slug];
  if (!faqs || faqs.length === 0) return "";

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const itemsHtml = faqs
    .map(
      ({ q, a }) => `
      <details class="bl-faq-item">
        <summary>
          <span>${q}</span>
          <span class="bl-faq-icon">+</span>
        </summary>
        <div class="bl-faq-answer"><p>${a}</p></div>
      </details>`
    )
    .join("");

  return `
<section class="bl-faq-section">
  <script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
  <style>
    .bl-faq-section {
      background: #F8FAFC;
      padding: 80px 0;
      border-top: 2px solid rgba(0,2,35,0.06);
    }
    .bl-faq-section .bl-faq-header {
      text-align: center;
      margin-bottom: 48px;
    }
    .bl-faq-section .bl-faq-badge {
      display: inline-block;
      background: rgba(255,160,0,0.12);
      color: #000223;
      font-family: 'Nunito', sans-serif;
      font-weight: 900;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 6px 18px;
      border-radius: 50px;
      border: 1.5px solid rgba(255,160,0,0.4);
      margin-bottom: 16px;
    }
    .bl-faq-section .bl-faq-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 900;
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      color: #000223;
      margin: 0 0 14px;
      line-height: 1.2;
    }
    .bl-faq-section .bl-faq-sub {
      font-family: 'Nunito', sans-serif;
      font-weight: 600;
      font-size: 1.05rem;
      color: #64748B;
      max-width: 580px;
      margin: 0 auto;
    }
    .bl-faq-list {
      max-width: 860px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .bl-faq-item {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,2,35,0.06);
      border: 1.5px solid rgba(0,2,35,0.07);
      transition: box-shadow 0.2s ease;
    }
    .bl-faq-item:hover {
      box-shadow: 0 6px 24px rgba(0,2,35,0.1);
    }
    .bl-faq-item summary {
      cursor: pointer;
      padding: 22px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      list-style: none;
      font-family: 'Nunito', sans-serif;
      font-weight: 800;
      font-size: 1.05rem;
      color: #000223;
      line-height: 1.4;
    }
    .bl-faq-item summary::-webkit-details-marker { display: none; }
    .bl-faq-icon {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #FFA000;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #000223;
      font-size: 20px;
      font-weight: 900;
      font-family: 'Nunito', sans-serif;
      transition: transform 0.3s ease, background 0.2s ease;
      line-height: 1;
    }
    .bl-faq-item[open] .bl-faq-icon {
      transform: rotate(45deg);
      background: #000223;
      color: #FFA000;
    }
    .bl-faq-item[open] summary {
      border-bottom: 1.5px solid rgba(0,2,35,0.06);
    }
    .bl-faq-answer {
      padding: 20px 28px 24px;
      font-family: 'Nunito', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      color: #475569;
      line-height: 1.75;
    }
    .bl-faq-answer p { margin: 0; }
    .bl-faq-cta {
      text-align: center;
      margin-top: 52px;
    }
    .bl-faq-cta p {
      font-family: 'Nunito', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      color: #64748B;
      margin-bottom: 20px;
    }
    .bl-faq-cta-btns {
      display: flex;
      gap: 14px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .bl-faq-btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 15px 36px;
      border-radius: 50px;
      background: #000223;
      color: #FFA000;
      font-family: 'Nunito', sans-serif;
      font-weight: 900;
      font-size: 1rem;
      text-decoration: none;
      box-shadow: 0 8px 24px rgba(0,2,35,0.25);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .bl-faq-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(0,2,35,0.3);
    }
    .bl-faq-btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 15px 36px;
      border-radius: 50px;
      background: white;
      color: #000223;
      font-family: 'Nunito', sans-serif;
      font-weight: 900;
      font-size: 1rem;
      text-decoration: none;
      border: 2px solid rgba(0,2,35,0.15);
      box-shadow: 0 4px 12px rgba(0,2,35,0.08);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .bl-faq-btn-secondary:hover {
      transform: translateY(-2px);
      border-color: #000223;
    }
    @media (max-width: 640px) {
      .bl-faq-section { padding: 56px 0; }
      .bl-faq-item summary { padding: 18px 20px; font-size: 0.95rem; }
      .bl-faq-answer { padding: 16px 20px 20px; }
    }
  </style>
  <div class="w-layout-blockcontainer container w-container">
    <div class="bl-faq-header">
      <div class="bl-faq-badge">Common Questions</div>
      <h2 class="bl-faq-title">Frequently Asked Questions</h2>
      <p class="bl-faq-sub">Everything you need to know before booking Boston Legend for your event</p>
    </div>
    <div class="bl-faq-list">
      ${itemsHtml}
    </div>
    <div class="bl-faq-cta">
      <p>Have more questions? We're happy to help!</p>
      <div class="bl-faq-cta-btns">
        <a href="/packages" class="bl-faq-btn-primary">Book Now 🍦</a>
        <a href="tel:6179993803" class="bl-faq-btn-secondary">📞 617-999-3803</a>
      </div>
    </div>
  </div>
</section>`;
}

/* ─── Resolve HTML file path from slug segments ─── */
function resolveHtmlPath(segments: string[]): string | null {
  // Direct match: /about → public/about.html
  const direct = path.join(process.cwd(), "public", `${segments.join("/")}.html`);
  if (fs.existsSync(direct)) return direct;

  // Occasions: /occasions/birthday-parties → public/birthday-parties.html
  if (segments[0] === "occasions" && segments.length === 2) {
    const occasionPath = path.join(process.cwd(), "public", `${segments[1]}.html`);
    if (fs.existsSync(occasionPath)) return occasionPath;
  }

  return null;
}

/* ─── Metadata ─── */
export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const filePath = resolveHtmlPath(params.slug);
  if (!filePath) return {};
  const html = fs.readFileSync(filePath, "utf-8");
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const desc =
    html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i)?.[1] ||
    html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i)?.[1];
  return { title, description: desc };
}

/* ─── Page ─── */
export default function WebflowPage({ params }: { params: { slug: string[] } }) {
  const filePath = resolveHtmlPath(params.slug);
  if (!filePath) notFound();

  const raw = fs.readFileSync(filePath!, "utf-8");
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : "";

  // Strip Webflow header & footer (we inject our own React ones)
  body = body.replace(/<header[^>]*class="header"[^>]*>[\s\S]*?<\/header>/i, "");
  body = body.replace(/<footer[^>]*class="footer"[^>]*>[\s\S]*?<\/footer>/i, "");

  // Inject FAQ section before closing </main> for occasions pages
  const occasionSlug = params.slug[0] === "occasions" ? params.slug[1] : null;
  if (occasionSlug) {
    const faqHtml = buildFaqSection(occasionSlug);
    if (faqHtml) {
      // Insert just before </main>
      if (body.includes("</main>")) {
        body = body.replace("</main>", `${faqHtml}\n</main>`);
      } else {
        body += faqHtml;
      }
    }
  }

  return (
    <div
      className="page min-h-screen flex flex-col relative"
      style={{ overflowX: "hidden" }}
    >
      <SiteHeader />
      <div className="relative w-full z-10 flex flex-col flex-grow max-w-[100vw]">
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
      <SiteFooter />
    </div>
  );
}
