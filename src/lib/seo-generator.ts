// ─── PRNG Utilities ──────────────────────────────────────────────
function cyrb128(str: string) {
    let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067); h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213); h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067); h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213); h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function sfc32(a: number, b: number, c: number, d: number) {
    return function() {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
        let t = (a + b) | 0; a = b ^ b >>> 9; b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11); d = d + 1 | 0; t = t + d | 0; c = c + t | 0;
        return (t >>> 0) / 4294967296;
    };
}

// ─── CONTENT POOLS ───────────────────────────────────────────────

const INTROS = (city: string) => [
    `Looking for the perfect sweet treat in ${city}? Boston Legend brings Greater Boston's most celebrated ice cream truck experience directly to your neighborhood, park, or venue.`,
    `Make your next event in ${city} truly unforgettable with a Boston Legend ice cream truck. We serve artisan ice cream, premium soft-serve, and novelty treats at every event type.`,
    `From corporate campuses to backyard birthday parties, Boston Legend Ice Cream Truck has been delighting guests across ${city} and surrounding communities for years.`,
    `Sweetening up ${city} one scoop at a time. Our fleet of gleaming ice cream trucks serves birthday parties, school events, corporate gatherings, and community celebrations throughout the area.`,
    `${city}'s favorite choice for ice cream truck rentals. Whether you need us for 50 guests or 500, Boston Legend delivers a premium experience that guests rave about long after the last cone.`,
    `Planning an event in ${city}? Our professional ice cream truck service brings the fun — we handle logistics, travel, and service so you can enjoy your event stress-free.`,
    `Boston Legend has served hundreds of events across ${city} and Greater Boston. Our trucks arrive spotless, on time, and fully stocked with flavors your guests will love.`,
    `Nothing brings people together quite like an ice cream truck. Boston Legend's professional service in ${city} has been the highlight of countless birthdays, weddings, and community events.`,
    `${city} residents know that when it's time for something sweet, Boston Legend delivers. We offer flexible packages designed to fit your budget, your headcount, and your vision.`,
    `Elevate your ${city} event with a touch of nostalgia and a lot of flavor. Boston Legend's ice cream trucks are fully mobile, professionally staffed, and stocked with premium treats.`,
    `When your ${city} event calls for something extraordinary, Boston Legend answers. Our ice cream trucks have served schools, corporations, municipalities, and families across the region.`,
    `From ${city}'s summer block parties to winter holiday celebrations, Boston Legend keeps the fun rolling year-round with our premium ice cream truck service.`,
];

const NEIGHBORHOODS = (city: string) => [
    `Downtown ${city}`, `${city} Town Center`, `North ${city}`, `South ${city}`, `East ${city}`,
    `West End of ${city}`, `${city} Village`, `${city} Heights`, `${city} Common Area`,
    `Historic District of ${city}`, `${city} Waterfront`, `${city} Business District`,
    `${city} Arts District`, `The ${city} Square`, `Upper ${city}`,
];

const LANDMARKS = (city: string) => [
    `${city} Community Center`, `${city} Town Hall & Civic Green`, `${city} Public Library`,
    `${city} High School Athletic Fields`, `Downtown ${city} Business District`,
    `${city} Parks & Recreation Areas`, `Historic ${city} District`, `${city} Waterfront`,
    `${city} Arts & Cultural Center`, `${city} Sports Complex`, `${city} Farmers Market`,
    `${city} Municipal Park`, `${city} Harbor Walk`, `${city} Main Street`,
];

const EVENTS = (city: string) => [
    `${city} Annual Summer Block Party`, `${city} Fall Family Festival`, `${city} Corporate Field Day`,
    `${city} School Year-End Celebration`, `${city} Neighborhood BBQ`, `${city} Chamber of Commerce Event`,
    `${city} Little League Championship`, `${city} Company Picnic`, `${city} Town Day`,
    `${city} Outdoor Movie Night`, `${city} Cultural Heritage Festival`, `${city} Charity Fundraiser`,
    `${city} Back-to-School Bash`, `${city} Holiday Celebration`, `${city} Youth Sports Tournament`,
];

const TESTIMONIALS_POOL = (city: string) => [
    { name: `Sarah M., ${city}`, text: `We hired Boston Legend for our neighborhood block party in ${city} and it was a massive hit. The truck arrived spotless and early, the crew was incredibly friendly, and the selection was outstanding. Every single guest — from 2-year-olds to grandparents — loved it.` },
    { name: `David L., ${city}`, text: `Best ice cream truck experience we've ever had in ${city}. They arrived ahead of schedule, had a huge variety of flavors, and the kids absolutely went wild. The booking process was seamless from start to finish.` },
    { name: `Emily R., ${city}`, text: `We booked Boston Legend for our corporate summer event in ${city}. Highly professional, the setup was perfect, and employees are still talking about it weeks later. Highly recommend for any company event.` },
    { name: `Michael T., ${city}`, text: `If you are in ${city} and need an ice cream truck, stop searching. Boston Legend is hands-down the best. Fantastic pricing, amazing communication, and the ice cream quality is top tier.` },
    { name: `Jessica K., ${city}`, text: `We had Boston Legend at my daughter's birthday party in ${city}. She was absolutely thrilled. The truck driver was so kind and patient with all the kids. Will absolutely book again next year!` },
    { name: `Robert H., ${city}`, text: `Our school in ${city} hired Boston Legend for our end-of-year celebration. The kids were over the moon. The pricing was fair, the service was impeccable, and the truck was spotlessly clean.` },
    { name: `Amanda S., ${city}`, text: `Boston Legend served our wedding farewell brunch in ${city} with an ice cream sundae bar setup. It was unique, fun, and our guests absolutely adored it. We got so many compliments on the creative idea.` },
    { name: `Thomas W., ${city}`, text: `Hired them for our company's quarterly all-hands event in ${city}. The entire process from quote to service was effortless. The truck was gorgeous and the staff were true professionals.` },
    { name: `Maria G., ${city}`, text: `I've seen ice cream trucks before, but Boston Legend is in a completely different league. Their ${city} service was impeccable, the flavors were incredible, and they stayed right on schedule.` },
    { name: `Chris P., ${city}`, text: `Organized a neighborhood charity event in ${city} and used Boston Legend as our sweet treat partner. They donated a percentage back to our cause AND served everyone with a huge smile. Five stars, no question.` },
];

const FAQS = (city: string) => [
    { q: `Do you serve all neighborhoods in ${city}?`, a: `Yes! We cover all neighborhoods, subdivisions, and surrounding areas of ${city}. We serve locations throughout Greater Boston and all of Massachusetts.` },
    { q: `How far in advance should I book in ${city}?`, a: `We recommend booking 2–4 weeks in advance, especially during peak summer months (June–August) in ${city}. For weekend events, book early as slots fill fast.` },
    { q: `Can you park the ice cream truck at a public park in ${city}?`, a: `Yes, we can set up at most public parks in ${city}. Some locations may require a permit from the local parks department — our team is happy to advise on the process.` },
    { q: `Do you have a minimum guest count for ${city} events?`, a: `Our packages start at 50 guests, but we're happy to discuss options for smaller events in ${city}. Custom packages are available for any size.` },
    { q: `How long does the ice cream truck stay at my ${city} event?`, a: `Service duration depends on your chosen package. We offer 1-hour, 2-hour, and extended time options. You can add extra service time in 30-minute increments.` },
    { q: `What types of events do you serve in ${city}?`, a: `We serve birthdays, corporate events, school events, weddings, graduation parties, block parties, charity fundraisers, community festivals, and more in ${city} and surrounding areas.` },
    { q: `Is there a travel fee for events in ${city}?`, a: `The first 10 miles from our garage in Revere, Boston are always free. Any additional miles beyond 10 are calculated at a per-mile rate. We'll give you the exact fee with your quote.` },
    { q: `What happens if it rains on my ${city} event day?`, a: `Our trucks continue to serve in most weather conditions. For severe weather, we'll work with you to reschedule at no extra cost. We want your ${city} event to be perfect no matter what.` },
    { q: `Do you offer custom flavor selections for ${city} events?`, a: `Absolutely! We carry a rotating selection of premium flavors and novelty items. Let us know your preferences when booking and we'll do our best to accommodate.` },
    { q: `How do I get a quote for my ${city} event?`, a: `Visit our booking page, enter your event details, and you'll receive an instant quote. For custom events in ${city} with 200+ guests, our team will prepare a personalized quote.` },
];

const PACKAGES_SUMMARY = (city: string) => [
    { name: "Classic Birthday Package", desc: `Perfect for birthday parties in ${city} — 50 guests, 60 minutes of service, unlimited smiles.` },
    { name: "Corporate Package", desc: `Ideal for company events and team days in ${city} — 100 guests, 90 minutes, premium setup.` },
    { name: "Community Festival Package", desc: `Built for large outdoor events in ${city} — 150 guests, 2 hours, full novelty menu.` },
    { name: "Custom Event Package", desc: `Planning a major event in ${city} with 200+ guests? We'll build a custom quote around your needs.` },
];

// Massachusetts nearby cities map (city slug → nearby city slugs)
const NEARBY_CITIES: Record<string, string[]> = {
    "boston": ["cambridge", "somerville", "brookline", "newton", "quincy"],
    "cambridge": ["boston", "somerville", "medford", "watertown", "belmont"],
    "somerville": ["cambridge", "boston", "medford", "malden", "everett"],
    "brookline": ["boston", "newton", "needham", "dedham", "wellesley"],
    "newton": ["brookline", "waltham", "watertown", "natick", "wellesley"],
    "quincy": ["boston", "braintree", "weymouth", "milton", "holbrook"],
    "worcester": ["shrewsbury", "auburn", "millbury", "grafton", "northborough"],
    "springfield": ["chicopee", "agawam", "west-springfield", "longmeadow", "ludlow"],
    "lowell": ["chelmsford", "tewksbury", "billerica", "dracut", "methuen"],
    "brockton": ["easton", "stoughton", "canton", "avon", "bridgewater"],
    "lynn": ["salem", "peabody", "saugus", "swampscott", "nahant"],
    "fall-river": ["new-bedford", "taunton", "westport", "somerset", "swansea"],
    "waltham": ["newton", "watertown", "belmont", "lexington", "woburn"],
    "watertown": ["cambridge", "newton", "waltham", "belmont", "brookline"],
    "medford": ["somerville", "malden", "everett", "woburn", "stoneham"],
    "malden": ["medford", "everett", "revere", "saugus", "melrose"],
    "everett": ["malden", "somerville", "medford", "revere", "chelsea"],
    "revere": ["everett", "malden", "saugus", "winthrop", "boston"],
    "salem": ["peabody", "beverly", "marblehead", "swampscott", "lynn"],
    "peabody": ["salem", "danvers", "beverly", "lynnfield", "middleton"],
};

function getNearbyCities(slug: string): string[] {
    const direct = NEARBY_CITIES[slug];
    if (direct) return direct.slice(0, 4);
    // Fallback: generic nearby cities for unlisted slugs
    return ["boston", "cambridge", "somerville", "quincy"];
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────
export function generateCitySEOData(slug: string) {
    const seed = cyrb128(slug);
    const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

    // Format City Name
    const cityName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
    const pickN = <T>(arr: T[], n: number): T[] => [...arr].sort(() => 0.5 - rand()).slice(0, n);

    const intros = INTROS(cityName);
    const landmarks = LANDMARKS(cityName);
    const neighborhoods = NEIGHBORHOODS(cityName);
    const events = EVENTS(cityName);
    const testimonials = TESTIMONIALS_POOL(cityName);
    const faqs = FAQS(cityName);
    const packages = PACKAGES_SUMMARY(cityName);
    const nearbyCitySlugs = getNearbyCities(slug);

    const intro = pick(intros);
    const selectedLandmarks = pickN(landmarks, 5);
    const selectedNeighborhoods = pickN(neighborhoods, 4);
    const selectedEvents = pickN(events, 4);
    const selectedTestimonials = pickN(testimonials, 3);
    const selectedFaqs = pickN(faqs, 5);
    const selectedPackages = packages; // show all 4 package tiers

    const nearbyCities = nearbyCitySlugs.map(s => ({
        slug: s,
        name: s.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    }));

    const description = `Boston Legend Ice Cream Truck in ${cityName}, MA — Premium ice cream truck rentals for birthday parties, corporate events, school celebrations, and community festivals. Serving ${cityName} and all of Greater Boston. Book online instantly.`;

    // Schema.org JSON-LD data
    const schemaFaqs = selectedFaqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }));

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LocalBusiness",
                "name": "Boston Legend Ice Cream Truck",
                "description": `Professional ice cream truck rental service serving ${cityName}, MA and Greater Boston.`,
                "url": `https://www.bostonlegendicecreamtruck.com/cities/${slug}`,
                "telephone": "+16179993803",
                "email": "info@bostonlegendicecreamtruck.com",
                "image": "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif",
                "priceRange": "$$",
                "servesCuisine": "Ice Cream",
                "areaServed": { "@type": "City", "name": cityName, "containedInPlace": { "@type": "State", "name": "Massachusetts" } },
                "address": { "@type": "PostalAddress", "streetAddress": "84 Fernwood Ave", "addressLocality": "Revere", "addressRegion": "MA", "postalCode": "02151", "addressCountry": "US" },
                "geo": { "@type": "GeoCoordinates", "latitude": 42.4084, "longitude": -71.0120 },
                "openingHours": "Mo-Su 09:00-21:00",
                "sameAs": ["https://www.facebook.com/bostonlegendicecream", "https://www.instagram.com/bostonlegendicecream"]
            },
            {
                "@type": "FAQPage",
                "mainEntity": schemaFaqs
            }
        ]
    };

    return {
        cityName, slug, intro, description,
        landmarks: selectedLandmarks,
        neighborhoods: selectedNeighborhoods,
        events: selectedEvents,
        testimonials: selectedTestimonials,
        faqs: selectedFaqs,
        packages: selectedPackages,
        nearbyCities,
        schema,
    };
}
