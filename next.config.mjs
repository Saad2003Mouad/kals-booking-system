/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [],
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
      ],
      fallback: [
        { source: "/:path*", destination: "/:path*.html" },
      ]
    };
  },
  async redirects() {
    return [
      // Legacy routes
      { source: '/products', destination: '/packages', permanent: true },
      { source: '/reserve', destination: '/packages', permanent: true },
      { source: '/book-now', destination: '/packages', permanent: true },
      
      // Explicit .html to clean routes based on requests
      { source: '/boston.html', destination: '/cities/boston', permanent: true },
      { source: '/abington.html', destination: '/cities/abington', permanent: true },
      { source: '/school-occasions.html', destination: '/occasions/school-occasions', permanent: true },

      // Singular /occasion/ routes with optional city suffixes mapping to correct plural occasions
      { source: '/occasion/birthday-parties:path*', destination: '/occasions/birthday-parties', permanent: true },
      { source: '/occasion/block-parties:path*', destination: '/occasions/block-parties', permanent: true },
      { source: '/occasion/corporate-parties:path*', destination: '/occasions/corporate-parties', permanent: true },
      { source: '/occasion/fundraisers:path*', destination: '/occasions/fundraisers', permanent: true },
      { source: '/occasion/launch-parties:path*', destination: '/occasions/launch-parties', permanent: true },
      { source: '/occasion/marketing-events:path*', destination: '/occasions/marketing-events', permanent: true },
      { source: '/occasion/movie-rental:path*', destination: '/occasions/movie-rental', permanent: true },
      { source: '/occasion/photo-shoots:path*', destination: '/occasions/photo-sessions', permanent: true },
      { source: '/occasion/reunions:path*', destination: '/occasions/reunions', permanent: true },
      { source: '/occasion/school-events:path*', destination: '/occasions/school-occasions', permanent: true },
      { source: '/occasion/sporting-events:path*', destination: '/occasions/sports-occasions', permanent: true },
      { source: '/occasion/wedding-receptions:path*', destination: '/occasions/wedding-receptions', permanent: true },
      
      // Fallback for any unknown /occasion/* -> /packages
      { source: '/occasion/:path*', destination: '/packages', permanent: true },
    ];
  },
};

export default nextConfig;
