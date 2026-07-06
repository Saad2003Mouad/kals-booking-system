/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://vercel.live https://*.vercel-scripts.com https://d3e54v103j8qbb.cloudfront.net https://cdn.prod.website-files.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.prod.website-files.com",
      "font-src 'self' https://fonts.gstatic.com https://cdn.prod.website-files.com",
      "img-src 'self' data: blob: https://cdn.prod.website-files.com https://www.bostonlegendicecreamtruck.com https://*.googleusercontent.com",
      "connect-src 'self' https://vitals.vercel-insights.com https://www.google-analytics.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'Content-Security-Policy', value: csp },
        ]
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
      },
      {
        protocol: 'https',
        hostname: 'www.bostonlegendicecreamtruck.com',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/index.html" }
      ],
      afterFiles: [
        { source: "/about", destination: "/about.html" },
        { source: "/menu", destination: "/menu.html" },
        { source: "/contact-us", destination: "/contact-us.html" },
        { source: "/blog", destination: "/blog.html" },
        { source: "/occasions/birthday-parties", destination: "/birthday-parties.html" },
        { source: "/occasions/block-parties", destination: "/block-parties.html" },
        { source: "/occasions/corporate-parties", destination: "/corporate-parties.html" },
        { source: "/occasions/fundraisers", destination: "/fundraisers.html" },
        { source: "/occasions/launch-parties", destination: "/launch-parties.html" },
        { source: "/occasions/marketing-events", destination: "/marketing-events.html" },
        { source: "/occasions/movie-rental", destination: "/movie-rental.html" },
        { source: "/occasions/photo-sessions", destination: "/photo-sessions.html" },
        { source: "/occasions/reunions", destination: "/reunions.html" },
        { source: "/occasions/school-occasions", destination: "/school-occasions.html" },
        { source: "/occasions/sports-occasions", destination: "/sports-occasions.html" },
        { source: "/occasions/wedding-receptions", destination: "/wedding-receptions.html" },
        // Blog post rewrites — makes /blog/slug serve the static HTML and be properly indexed
        { source: "/blog/boston-ice-cream-events", destination: "/boston-ice-cream-events.html" },
        { source: "/blog/bringing-an-ice-cream-truck", destination: "/bringing-an-ice-cream-truck.html" },
        { source: "/blog/corporate-ice-cream-boston", destination: "/corporate-ice-cream-boston.html" },
        { source: "/blog/creative-ice-cream-truck-ideas", destination: "/creative-ice-cream-truck-ideas.html" },
        { source: "/blog/guide-to-booking-ice-cream-catering", destination: "/guide-to-booking-ice-cream-catering.html" },
        { source: "/blog/holiday-events-that-shine-brighter", destination: "/holiday-events-that-shine-brighter.html" },
        { source: "/blog/how-to-host-movie-night", destination: "/how-to-host-movie-night.html" },
        { source: "/blog/ice-cream-boston-birthday", destination: "/ice-cream-boston-birthday.html" },
        { source: "/blog/ice-cream-catering-for-winter-fundraiser", destination: "/ice-cream-catering-for-winter-fundraiser.html" },
        { source: "/blog/ice-cream-catering-options-for-indoor-parties", destination: "/ice-cream-catering-options-for-indoor-parties.html" },
        { source: "/blog/ice-cream-catering-teacher-appreciation-events", destination: "/ice-cream-catering-teacher-appreciation-events.html" },
        { source: "/blog/ice-cream-springtime-wedding", destination: "/ice-cream-springtime-wedding.html" },
        { source: "/blog/ice-cream-truck-boston", destination: "/ice-cream-truck-boston.html" },
        { source: "/blog/ice-cream-truck-school-event", destination: "/ice-cream-truck-school-event.html" },
        { source: "/blog/ice-cream-trucks-at-corporate-parties", destination: "/ice-cream-trucks-at-corporate-parties.html" },
        { source: "/blog/ice-cream-trucks-corporate-events", destination: "/ice-cream-trucks-corporate-events.html" },
        { source: "/blog/ice-cream-trucks-for-sports-events", destination: "/ice-cream-trucks-for-sports-events.html" },
        { source: "/blog/ice-cream-trucks-holiday-season-reunions", destination: "/ice-cream-trucks-holiday-season-reunions.html" },
        { source: "/blog/ice-cream-trucks-in-school-events", destination: "/ice-cream-trucks-in-school-events.html" },
        { source: "/blog/ice-cream-trucks-local-marketing-events", destination: "/ice-cream-trucks-local-marketing-events.html" },
        { source: "/blog/ice-cream-trucks-to-draw-crowds-to-a-fundraiser", destination: "/ice-cream-trucks-to-draw-crowds-to-a-fundraiser.html" },
        { source: "/blog/launch-party-needs-visual-hook", destination: "/launch-party-needs-visual-hook.html" },
        { source: "/blog/make-marketing-event-stand-out-ice-cream", destination: "/make-marketing-event-stand-out-ice-cream.html" },
        { source: "/blog/neighborhood-block-party-unforgettable", destination: "/neighborhood-block-party-unforgettable.html" },
        { source: "/blog/photo-shoot-ideas-that-pop", destination: "/photo-shoot-ideas-that-pop.html" },
        { source: "/blog/plan-a-block-party-people-actually-want-to-attend", destination: "/plan-a-block-party-people-actually-want-to-attend.html" },
        { source: "/blog/plan-an-ice-cream-reunion-party", destination: "/plan-an-ice-cream-reunion-party.html" },
        { source: "/blog/renting-an-ice-cream-truck-movie-shoot", destination: "/renting-an-ice-cream-truck-movie-shoot.html" },
        { source: "/blog/renting-ice-cream-truck-for-photo-shoots", destination: "/renting-ice-cream-truck-for-photo-shoots.html" },
        { source: "/blog/wedding-ice-cream-boston", destination: "/wedding-ice-cream-boston.html" },
        { source: "/blog/why-mobile-ice-cream-vendors-are-popular", destination: "/why-mobile-ice-cream-vendors-are-popular.html" },
        { source: "/blog/why-sporting-events-are-cooler", destination: "/why-sporting-events-are-cooler.html" },
        { source: "/blog/winter-wedding-receptions-that-feel-warm", destination: "/winter-wedding-receptions-that-feel-warm.html" },

      ],
      fallback: [
        { source: "/:path*", destination: "/:path*.html" },
      ]
    };
  },
  async redirects() {
    return [
      // Legacy routes
      { source: '/products', destination: '/packages', statusCode: 301 },
      { source: '/reserve', destination: '/packages', statusCode: 301 },
      { source: '/book-now', destination: '/packages', statusCode: 301 },
      
      // Explicit .html to clean routes based on requests
      { source: '/boston.html', destination: '/cities/boston', statusCode: 301 },
      { source: '/abington.html', destination: '/cities/abington', statusCode: 301 },
      { source: '/school-occasions.html', destination: '/occasions/school-occasions', statusCode: 301 },

      // Singular /occasion/ routes with optional city suffixes mapping to correct plural occasions
      { source: '/occasion/birthday-parties:path*', destination: '/occasions/birthday-parties', statusCode: 301 },
      { source: '/occasion/block-parties:path*', destination: '/occasions/block-parties', statusCode: 301 },
      { source: '/occasion/corporate-parties:path*', destination: '/occasions/corporate-parties', statusCode: 301 },
      { source: '/occasion/fundraisers:path*', destination: '/occasions/fundraisers', statusCode: 301 },
      { source: '/occasion/launch-parties:path*', destination: '/occasions/launch-parties', statusCode: 301 },
      { source: '/occasion/marketing-events:path*', destination: '/occasions/marketing-events', statusCode: 301 },
      { source: '/occasion/movie-rental:path*', destination: '/occasions/movie-rental', statusCode: 301 },
      { source: '/occasion/photo-shoots:path*', destination: '/occasions/photo-sessions', statusCode: 301 },
      { source: '/occasion/reunions:path*', destination: '/occasions/reunions', statusCode: 301 },
      { source: '/occasion/school-events:path*', destination: '/occasions/school-occasions', statusCode: 301 },
      { source: '/occasion/sporting-events:path*', destination: '/occasions/sports-occasions', statusCode: 301 },
      { source: '/occasion/wedding-receptions:path*', destination: '/occasions/wedding-receptions', statusCode: 301 },
      
      // Fallback for any unknown /occasion/* -> /packages
      { source: '/occasion/:path*', destination: '/packages', statusCode: 301 },
    ];
  },
};

export default nextConfig;
