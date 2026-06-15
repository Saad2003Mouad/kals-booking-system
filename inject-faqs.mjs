/**
 * inject-faqs.mjs
 * Injects a tailored FAQ section into each occasions HTML file,
 * placed just before <footer class="footer">
 * Run with: node inject-faqs.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "public");

/* ─── FAQ data per occasions file ─── */
const FAQS = {
  "birthday-parties": {
    title: "Birthday Party Ice Cream Truck FAQ",
    items: [
      { q: "How much does an ice cream truck cost for a birthday party in Boston?", a: "Birthday party packages start at $190 for up to 30 guests and go up to $825+ for larger celebrations. Pricing depends on guest count, duration, and your location within Greater Boston." },
      { q: "How far in advance should I book for a birthday party?", a: "We recommend booking 2–4 weeks in advance, especially for weekend birthday parties during peak season (May–September). Weekday bookings can often be arranged with 1–2 weeks notice." },
      { q: "Do you serve kids' and adults' birthday parties?", a: "Absolutely! Boston Legend serves birthday parties for all ages — from children's parties with fun novelty bars to elegant adult celebrations with premium selections." },
      { q: "Can I request specific ice cream flavors for my birthday?", a: "Yes! We carry a wide variety of flavors including novelty bars, sandwiches, pops, and more. Contact us at 617-999-3803 to discuss your preferences." },
      { q: "Is there an extra fee for Saturday or Sunday birthday parties?", a: "Yes, weekend bookings include a $25 weekend event fee. This is automatically reflected in your booking total before you confirm." },
    ]
  },
  "corporate-parties": {
    title: "Corporate Ice Cream Truck Event FAQ",
    items: [
      { q: "What is the best ice cream truck package for corporate events in Boston?", a: "For most corporate events, our packages range from $250 for 30 employees up to custom pricing for 200+ attendees. We recommend the Family or Celebration packages for mid-size teams." },
      { q: "Do you offer invoice or billing options for companies?", a: "Yes! We work with corporate clients and can accommodate company billing. Contact us at 617-999-3803 or book online and mention your billing requirements." },
      { q: "Can you serve multiple office locations in one day?", a: "Yes, we offer multi-stop routing. Each additional stop is $50. For simultaneous coverage at multiple locations, we can deploy multiple trucks — with an additional $200 setup fee per extra truck." },
      { q: "How far in advance should we book for employee appreciation day?", a: "Corporate events during peak season should be booked 3–4 weeks ahead. For off-peak weekday events, 1–2 weeks is usually sufficient." },
      { q: "Do you provide service for large corporate events of 200+ employees?", a: "Yes! For events over 200 guests, we offer custom pricing. Call us at 617-999-3803 and our team will prepare a tailored quote for your event." },
    ]
  },
  "block-parties": {
    title: "Block Party Ice Cream Truck FAQ",
    items: [
      { q: "How much does an ice cream truck cost for a block party?", a: "Block party packages start at $190 for 30 guests. For larger neighborhood events, we offer packages up to $825+ and custom pricing for 200+ guests." },
      { q: "Do you need a permit to have an ice cream truck at a block party?", a: "Permit requirements vary by city. Our team can advise you based on your location. Call us at 617-999-3803 and we'll help coordinate the details." },
      { q: "How many people can you serve at a block party?", a: "We can serve any size block party! Our standard packages cover 30–200 guests. For larger neighborhood events, contact us for custom solutions including multiple trucks." },
      { q: "Is there an extra charge for weekend block parties?", a: "Yes, a $25 weekend event fee applies for Saturday and Sunday bookings. This will be clearly shown in your booking summary before confirmation." },
      { q: "What areas in Greater Boston do you serve for block parties?", a: "We serve 140+ cities across Massachusetts including Boston, Cambridge, Somerville, Quincy, Newton, Lynn, and many more. Confirm your location when booking." },
    ]
  },
  "fundraisers": {
    title: "Fundraiser Ice Cream Truck FAQ",
    items: [
      { q: "Can an ice cream truck help raise money for our cause?", a: "Yes! Many organizations partner with Boston Legend to create a fun fundraiser atmosphere that attracts more donors. Contact us to discuss fundraising partnership arrangements." },
      { q: "What packages are best for fundraiser events?", a: "Our Celebration package ($425 for up to 100 guests) is popular for fundraisers. We also offer custom packages for larger events and non-profit causes." },
      { q: "Can you serve at outdoor fundraiser events?", a: "Absolutely. Our truck is fully mobile and set up for outdoor events. We just need a flat, accessible surface with reasonable clearance." },
      { q: "How far in advance should we book for a fundraiser?", a: "We recommend 3–4 weeks in advance for peak season fundraisers. For off-season events, 2 weeks is typically sufficient." },
      { q: "Do you offer arrangements for non-profit organizations?", a: "Contact us at 617-999-3803 to discuss your non-profit event needs. We're proud to support community causes across Greater Boston." },
    ]
  },
  "wedding-receptions": {
    title: "Wedding Reception Ice Cream Truck FAQ",
    items: [
      { q: "How much does an ice cream truck cost for a wedding reception?", a: "Wedding packages start at $340 for 50 guests and scale up for larger weddings. We also offer custom packages for receptions with 200+ guests. Call 617-999-3803 for your custom quote." },
      { q: "Can you coordinate with our wedding venue?", a: "Yes! We work closely with venues to ensure seamless setup. Simply provide your venue contact and we'll coordinate arrival times and location logistics in advance." },
      { q: "Do you offer a wedding-specific ice cream menu?", a: "We offer a premium selection suitable for weddings including novelty bars, pops, and sandwiches. Contact us to discuss flavor options for your special day." },
      { q: "How far in advance should we book for a wedding?", a: "We strongly recommend booking your wedding date 1–3 months in advance, especially for summer and fall weddings. Weekend dates book up fast!" },
      { q: "Is there a weekend surcharge for Saturday weddings?", a: "Yes, a $25 weekend event fee applies for Saturday and Sunday bookings — a small addition for the sweetest day of your life!" },
    ]
  },
  "school-occasions": {
    title: "School Event Ice Cream Truck FAQ",
    items: [
      { q: "Can you serve ice cream at school events in Massachusetts?", a: "Yes! Boston Legend regularly serves school field days, graduations, end-of-year parties, and fundraisers across Massachusetts. We can accommodate 30–200+ students." },
      { q: "What age groups do you serve for school events?", a: "We serve all ages — from elementary school field days to high school graduation parties. Our selection includes kid-friendly favorites loved by all grades." },
      { q: "Do you have insurance and certifications for school events?", a: "Yes, Boston Legend is fully insured and operates safely. Please contact us at 617-999-3803 if your school requires specific documentation." },
      { q: "How much does an ice cream truck cost for a school event?", a: "School event packages start at $190 for 30 students and scale up based on attendance. Large school events (200+ students) can be accommodated with a custom package." },
      { q: "How far in advance should schools book?", a: "For school events, especially end-of-year and graduation parties, we recommend booking 4–6 weeks in advance as these popular dates fill up very quickly." },
    ]
  },
  "sports-occasions": {
    title: "Sports Event Ice Cream Truck FAQ",
    items: [
      { q: "Can you serve ice cream at youth sports tournaments?", a: "Yes! Boston Legend is perfect for post-game celebrations, sports tournaments, and team appreciation events. We serve groups of 30 to 200+ athletes and fans." },
      { q: "Can you park at sports fields and parks?", a: "Our truck can park in most sports field parking areas with standard vehicle access. We need a flat accessible surface and reasonable clearance for setup." },
      { q: "What sports events do you typically serve?", a: "We serve soccer tournaments, baseball and softball leagues, basketball events, lacrosse games, track meets, and more across Greater Boston and Massachusetts." },
      { q: "How much does an ice cream truck cost for a sports event?", a: "Sports event packages start at $190 for 30 attendees. Team celebration packages for 50–100 athletes typically range $340–$425. Custom quotes available for larger events." },
      { q: "Can we book recurring service for our sports league?", a: "Contact us at 617-999-3803 to discuss seasonal arrangements for leagues that want recurring service throughout their season." },
    ]
  },
  "reunions": {
    title: "Reunion Ice Cream Truck FAQ",
    items: [
      { q: "Is an ice cream truck a good idea for a family reunion?", a: "Absolutely! An ice cream truck creates a fun, nostalgic atmosphere that guests of all ages love. It's a unique, memorable touch for any family or class reunion." },
      { q: "How much does an ice cream truck cost for a reunion?", a: "Reunion packages start at $190 for 30 guests. For larger family or class reunions, packages scale up accordingly. Custom pricing available for 200+ guests." },
      { q: "Can you serve at outdoor parks for reunions?", a: "Yes! Boston Legend regularly serves at parks, picnic areas, and outdoor venues across Greater Boston. We just need accessible vehicle entry to the location." },
      { q: "How early should I book for a reunion event?", a: "For summer reunions (June–August), book 4–6 weeks ahead. For spring or fall reunions, 2–3 weeks is usually sufficient to secure your date." },
      { q: "Can you accommodate dietary restrictions at reunions?", a: "We carry a range of products. Contact us at 617-999-3803 to discuss specific dietary needs and we'll do our best to accommodate all your guests." },
    ]
  },
  "launch-parties": {
    title: "Launch Party Ice Cream Truck FAQ",
    items: [
      { q: "Why should I add an ice cream truck to my product launch?", a: "An ice cream truck creates a memorable, shareable moment that differentiates your launch. Guests remember unique experiences — and sweet treats naturally generate social media buzz and word-of-mouth." },
      { q: "How much does an ice cream truck cost for a product launch?", a: "Launch party packages start at $250 for 30 guests and scale up based on event size. Custom packages are available for large brand activations with 200+ attendees." },
      { q: "Can the truck incorporate branding at our launch event?", a: "For branding and custom activations, contact us at 617-999-3803 to discuss your specific needs. Our team loves collaborating on creative brand experiences!" },
      { q: "How far in advance should we book for a launch event?", a: "We recommend booking 3–4 weeks in advance to secure your preferred date. High-demand launch dates, especially on weekends, can book up 6+ weeks ahead." },
      { q: "Is there a weekend surcharge for Saturday launch parties?", a: "Yes, a $25 weekend event fee applies for Saturday and Sunday bookings. This is shown clearly in your booking summary before you confirm." },
    ]
  },
  "marketing-events": {
    title: "Marketing Event Ice Cream Truck FAQ",
    items: [
      { q: "How can an ice cream truck boost my marketing event?", a: "Ice cream trucks are a proven crowd magnet. They create foot traffic, extend dwell time, and generate organic social media content — all valuable for brand activations and marketing events." },
      { q: "Can Boston Legend incorporate branded elements at our marketing event?", a: "Contact us at 617-999-3803 to discuss custom branding options for your marketing activation. We love collaborating on creative and memorable brand experiences." },
      { q: "How much does an ice cream truck cost for a marketing event?", a: "Marketing event packages start at $250 for 30 guests. Larger brand activations with extended service times are quoted custom. Call 617-999-3803 for details." },
      { q: "Can you serve at trade shows or outdoor expos?", a: "We can serve at outdoor trade shows and expos with vehicle access. Contact us to explore options based on your specific event logistics and venue." },
      { q: "Do you offer extended service hours for all-day marketing events?", a: "Yes! Each additional 30 minutes beyond your package's included service time is just $35. We can accommodate all-day brand activations with extended packages." },
    ]
  },
  "movie-rental": {
    title: "Movie Night Ice Cream Truck FAQ",
    items: [
      { q: "Can you provide ice cream for an outdoor movie night?", a: "Yes! Boston Legend is the perfect complement to any outdoor movie screening. Our truck adds a fun, classic cinema-style treat experience your guests will love." },
      { q: "How much does an ice cream truck cost for a movie night?", a: "Movie night packages start at $190 for 30 guests. Whether it's a backyard screening or a large community movie event, we have packages to fit any need." },
      { q: "Can you serve during the movie screening?", a: "We typically serve before the movie begins or during intermission to minimize disruption. We can coordinate our service timing with your event schedule." },
      { q: "What's the best package for a private movie night?", a: "Our Starter package ($190 for 30 guests, 60 min service) is perfect for private movie screenings. For larger events, our Family or Celebration packages work great." },
      { q: "Do you serve at drive-in style movie events?", a: "Absolutely! Boston Legend is a natural fit for drive-in events. Contact us at 617-999-3803 to plan the perfect setup for your outdoor screening." },
    ]
  },
  "photo-sessions": {
    title: "Photo Session Ice Cream Truck FAQ",
    items: [
      { q: "Can an ice cream truck be used as a photo prop?", a: "Yes! The Boston Legend truck is a stunning, photogenic prop that adds character to any photo shoot — from personal branding sessions to editorial and commercial productions." },
      { q: "How much does it cost to rent an ice cream truck for a photo shoot?", a: "Photo session packages start at $190. Contact us at 617-999-3803 to discuss your shoot requirements and we'll put together the right package for you." },
      { q: "Can you provide ice cream for talent and crew during a photo shoot?", a: "Absolutely! We can serve the full crew and any on-camera talent with a premium selection of ice cream products during your shoot day." },
      { q: "Do you serve at film and commercial productions?", a: "Yes! Boston Legend has experience supporting film sets, TV productions, and commercial shoots across Greater Boston. Contact us to discuss production-scale needs." },
      { q: "How much notice do you need for a photo session booking?", a: "We recommend at least 2 weeks notice for photo sessions. For larger productions with specific timing requirements, 3–4 weeks is preferable to ensure full availability." },
    ]
  },
  "general": {
    title: "Boston Legend General FAQ",
    items: [
      { q: "How much does it cost to rent an ice cream truck in Massachusetts?", a: "Our packages start at $190 for up to 30 guests. Pricing depends on your guest count, event location, and duration. For large events of 200+ guests, we provide custom quotes." },
      { q: "What areas in Massachusetts do you serve?", a: "We serve 140+ cities across Greater Boston and Massachusetts, including Boston, Cambridge, Somerville, Newton, Brookline, Revere, Quincy, Lynn, and many more." },
      { q: "What types of events do you cater?", a: "We cater all types of occasions! Birthdays, corporate events, weddings, school field days, block parties, fundraisers, sports tournaments, and photo shoots." },
      { q: "What ice cream flavors do you serve?", a: "We offer a premium selection of classic and seasonal flavors. Our menu includes novelty bars, ice cream sandwiches, fruit pops, and soft serve options that guests of all ages love." },
      { q: "How far in advance should I book my event?", a: "For peak season (May to September), we highly recommend booking 2-4 weeks in advance, especially for weekends. Weekday events can usually be accommodated with 1-2 weeks notice." },
    ]
  }
};

/* ─── Build FAQ HTML block ─── */
function buildFaqHtml(slug) {
  const data = FAQS[slug];
  if (!data) return "";

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  });

  const itemsHtml = data.items.map(({ q, a }) => `
      <details class="bl-faq-item">
        <summary class="bl-faq-summary">
          <span>${q}</span>
          <span class="bl-faq-icon">+</span>
        </summary>
        <div class="bl-faq-body"><p>${a}</p></div>
      </details>`).join("\n");

  return `
<!-- BL-FAQ-SECTION-START -->
<section class="bl-faq-section">
  <script type="application/ld+json">${faqJsonLd}<\/script>
  <style>
    .bl-faq-section{background:#F8FAFC;padding:80px 20px;border-top:2px solid rgba(0,2,35,0.06);}
    .bl-faq-inner{max-width:860px;margin:0 auto;}
    .bl-faq-hdr{text-align:center;margin-bottom:48px;}
    .bl-faq-badge{display:inline-block;background:rgba(255,160,0,0.12);color:#000223;font-family:'Nunito',sans-serif;font-weight:900;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;padding:6px 18px;border-radius:50px;border:1.5px solid rgba(255,160,0,0.4);margin-bottom:16px;}
    .bl-faq-title{font-family:'Playfair Display',Georgia,serif;font-weight:900;font-size:clamp(1.8rem,4vw,2.6rem);color:#000223;margin:0 0 12px;line-height:1.2;}
    .bl-faq-sub{font-family:'Nunito',sans-serif;font-weight:600;font-size:1.05rem;color:#64748B;max-width:560px;margin:0 auto;}
    .bl-faq-list{display:flex;flex-direction:column;gap:14px;}
    .bl-faq-item{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,2,35,0.06);border:1.5px solid rgba(0,2,35,0.07);transition:box-shadow .2s;}
    .bl-faq-item:hover{box-shadow:0 6px 24px rgba(0,2,35,0.1);}
    .bl-faq-summary{cursor:pointer;padding:22px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;list-style:none;font-family:'Nunito',sans-serif;font-weight:800;font-size:1.05rem;color:#000223;line-height:1.4;}
    .bl-faq-summary::-webkit-details-marker{display:none;}
    .bl-faq-icon{flex-shrink:0;width:32px;height:32px;border-radius:50%;background:#FFA000;display:inline-flex;align-items:center;justify-content:center;color:#000223;font-size:20px;font-weight:900;font-family:'Nunito',sans-serif;transition:transform .3s,background .2s;line-height:1;}
    .bl-faq-item[open] .bl-faq-icon{transform:rotate(45deg);background:#000223;color:#FFA000;}
    .bl-faq-item[open] .bl-faq-summary{border-bottom:1.5px solid rgba(0,2,35,0.06);}
    .bl-faq-body{padding:20px 28px 24px;font-family:'Nunito',sans-serif;font-weight:600;font-size:1rem;color:#475569;line-height:1.75;}
    .bl-faq-body p{margin:0;}
    .bl-faq-cta{text-align:center;margin-top:52px;}
    .bl-faq-cta p{font-family:'Nunito',sans-serif;font-weight:700;font-size:1rem;color:#64748B;margin-bottom:20px;}
    .bl-faq-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
    .bl-faq-btn-p{display:inline-flex;align-items:center;gap:8px;padding:15px 36px;border-radius:50px;background:#000223;color:#FFA000;font-family:'Nunito',sans-serif;font-weight:900;font-size:1rem;text-decoration:none;box-shadow:0 8px 24px rgba(0,2,35,0.25);transition:transform .2s;}
    .bl-faq-btn-p:hover{transform:translateY(-2px);}
    .bl-faq-btn-s{display:inline-flex;align-items:center;gap:8px;padding:15px 36px;border-radius:50px;background:#fff;color:#000223;font-family:'Nunito',sans-serif;font-weight:900;font-size:1rem;text-decoration:none;border:2px solid rgba(0,2,35,0.15);box-shadow:0 4px 12px rgba(0,2,35,0.08);transition:transform .2s,border-color .2s;}
    .bl-faq-btn-s:hover{transform:translateY(-2px);border-color:#000223;}
    @media(max-width:640px){.bl-faq-section{padding:56px 16px;}.bl-faq-summary{padding:18px 20px;font-size:.95rem;}.bl-faq-body{padding:16px 20px 20px;}}
  </style>
  <div class="bl-faq-inner">
    <div class="bl-faq-hdr">
      <div class="bl-faq-badge">Common Questions</div>
      <h2 class="bl-faq-title">${data.title}</h2>
      <p class="bl-faq-sub">Everything you need to know before booking Boston Legend for your event</p>
    </div>
    <div class="bl-faq-list">
      ${itemsHtml}
    </div>
    <div class="bl-faq-cta">
      <p>Have more questions? We&rsquo;re happy to help!</p>
      <div class="bl-faq-btns">
        <a href="/booking" class="bl-faq-btn-p">Book Now &#127846;</a>
        <a href="tel:6179993803" class="bl-faq-btn-s">&#128222; 617-999-3803</a>
      </div>
    </div>
  </div>
</section>
<!-- BL-FAQ-SECTION-END -->`;
}

/* ─── Inject into each file ─── */
const FILES = {
  "index.html":              "general",
  "about.html":              "general",
  "menu.html":               "general",
  "packages.html":           "general",
  "birthday-parties.html":   "birthday-parties",
  "block-parties.html":      "block-parties",
  "corporate-parties.html":  "corporate-parties",
  "fundraisers.html":        "fundraisers",
  "launch-parties.html":     "launch-parties",
  "marketing-events.html":   "marketing-events",
  "movie-rental.html":       "movie-rental",
  "photo-sessions.html":     "photo-sessions",
  "reunions.html":            "reunions",
  "school-occasions.html":   "school-occasions",
  "sports-occasions.html":   "sports-occasions",
  "wedding-receptions.html": "wedding-receptions",
};

let injected = 0;
let skipped = 0;

for (const [filename, slug] of Object.entries(FILES)) {
  const filePath = path.join(PUBLIC, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Not found: ${filename}`);
    continue;
  }

  let html = fs.readFileSync(filePath, "utf-8");

  // Skip if already injected
  if (html.includes("BL-FAQ-SECTION-START")) {
    console.log(`⏩ Already has FAQ: ${filename}`);
    skipped++;
    continue;
  }

  const faqHtml = buildFaqHtml(slug);
  const footerPattern = /<footer\s+class="footer"/i;

  if (!footerPattern.test(html)) {
    console.warn(`⚠️  No <footer class="footer"> found in: ${filename}`);
    continue;
  }

  // Inject before the footer
  html = html.replace(footerPattern, `${faqHtml}\n<footer class="footer"`);
  fs.writeFileSync(filePath, html, "utf-8");
  console.log(`✅ FAQ injected into: ${filename}`);
  injected++;
}

console.log(`\n🎉 Done! Injected: ${injected} | Skipped: ${skipped}`);
