export function getCityContent(slug: string) {
  const cityName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Simple deterministic hash based on slug string
  const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const heroTitles = [
    `Best Ice Cream Truck in {city}`,
    `Premium Ice Cream Truck Catering in {city}`,
    `Make Your {city} Event Sweeter`,
    `{city}'s Favorite Ice Cream Truck`,
    `Legendary Ice Cream Catering in {city}`
  ];

  const metaDescriptions = [
    `Bring the sweet magic of our ice cream truck event rentals to your celebration in {city}! Perfect for parties, gatherings, and celebrations. Reserve today!`,
    `Looking for the best ice cream truck in {city}? Boston Legend delivers premium ice cream and unforgettable memories for your next event.`,
    `Book {city}'s top-rated ice cream truck for your corporate event, birthday party, or wedding. Fully insured and ready to serve!`,
    `Boston Legend Ice Cream Truck is proud to serve {city}. Discover our premium packages and secure your date in under 3 minutes.`,
    `Celebrate your special occasion in {city} with Boston Legend. We bring legendary flavors and joy directly to your venue!`
  ];

  const introParagraphs = [
    `Planning an event in {city} and craving a unique way to sweeten the celebration? The Boston Legend Ice Cream Truck is your go-to for turning any gathering into a delightful and memorable experience, right here in the heart of {city}!`,
    `When it comes to memorable events in {city}, nothing beats the nostalgic joy of a premium ice cream truck. Boston Legend brings legendary flavors directly to your {city} venue.`,
    `Elevate your next {city} celebration with Boston Legend. We provide a full-service, hassle-free ice cream catering experience that your guests in {city} will rave about for years to come.`,
    `Whether you are hosting a block party or a corporate gathering in {city}, our state-of-the-art trucks and vans deliver a premium dessert experience tailored to your exact needs.`,
    `Make your {city} event unforgettable. Our professional, uniformed staff and massive variety of premium ice cream brands guarantee a sweet success for any occasion.`
  ];

  const faqs = [
    [
      { q: `Does Boston Legend serve all areas of {city}?`, a: `Yes, we bring our premium ice cream trucks to all neighborhoods within {city} and the surrounding Greater Boston area.` },
      { q: `How far in advance should I book for a {city} event?`, a: `We recommend booking at least 2-4 weeks in advance, especially for summer weekends in {city}, to guarantee your preferred date and time.` },
      { q: `Are you fully insured for corporate events in {city}?`, a: `Absolutely. We carry comprehensive liability insurance and can provide a Certificate of Insurance (COI) for your {city} venue upon request.` }
    ],
    [
      { q: `Can your truck park anywhere in {city}?`, a: `We can park on most private properties and public streets in {city} where standard parking is allowed. We will work with you to find the best spot for your event.` },
      { q: `What happens if it rains during my {city} event?`, a: `Our trucks are equipped to serve in light rain. If severe weather is expected in {city}, we offer flexible rescheduling options.` },
      { q: `Do you cater to large schools and festivals in {city}?`, a: `Yes! Our high-capacity Sprinter vans are perfect for serving hundreds of guests quickly at large {city} festivals or school events.` }
    ]
  ];

  const h1 = heroTitles[hash % heroTitles.length].replace(/{city}/g, cityName);
  const metaDescription = metaDescriptions[(hash + 1) % metaDescriptions.length].replace(/{city}/g, cityName);
  const intro = introParagraphs[(hash + 2) % introParagraphs.length].replace(/{city}/g, cityName);
  const faqList = faqs[hash % faqs.length].map(f => ({
    q: f.q.replace(/{city}/g, cityName),
    a: f.a.replace(/{city}/g, cityName)
  }));

  const title = `Ice Cream Truck Event Rentals in ${cityName} | Boston Legend`;

  return {
    name: cityName,
    metaTitle: title,
    h1,
    metaDescription,
    introHtml: `<p>${intro}</p>`,
    faq: faqList.map(f => ({ question: f.q, answer: f.a }))
  };
}
