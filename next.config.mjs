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
        { source: "/birthday-parties", destination: "/birthday-parties.html" },
        { source: "/occasions/birthday-parties", destination: "/birthday-parties.html" },
        { source: "/block-parties", destination: "/block-parties.html" },
        { source: "/occasions/block-parties", destination: "/block-parties.html" },
        { source: "/corporate-parties", destination: "/corporate-parties.html" },
        { source: "/occasions/corporate-parties", destination: "/corporate-parties.html" },
        { source: "/fundraisers", destination: "/fundraisers.html" },
        { source: "/occasions/fundraisers", destination: "/fundraisers.html" },
        { source: "/launch-parties", destination: "/launch-parties.html" },
        { source: "/occasions/launch-parties", destination: "/launch-parties.html" },
        { source: "/marketing-events", destination: "/marketing-events.html" },
        { source: "/occasions/marketing-events", destination: "/marketing-events.html" },
        { source: "/movie-rental", destination: "/movie-rental.html" },
        { source: "/occasions/movie-rental", destination: "/movie-rental.html" },
        { source: "/photo-sessions", destination: "/photo-sessions.html" },
        { source: "/occasions/photo-sessions", destination: "/photo-sessions.html" },
        { source: "/reunions", destination: "/reunions.html" },
        { source: "/occasions/reunions", destination: "/reunions.html" },
        { source: "/school-occasions", destination: "/school-occasions.html" },
        { source: "/occasions/school-occasions", destination: "/school-occasions.html" },
        { source: "/sports-occasions", destination: "/sports-occasions.html" },
        { source: "/occasions/sports-occasions", destination: "/sports-occasions.html" },
        { source: "/wedding-receptions", destination: "/wedding-receptions.html" },
        { source: "/occasions/wedding-receptions", destination: "/wedding-receptions.html" },
        { source: "/contact-us", destination: "/contact-us.html" },
        { source: "/blog", destination: "/blog.html" },
        { source: "/blog/:slug*", destination: "/:slug*.html" },
      ],
      fallback: [
        { source: "/:path*", destination: "/:path*.html" },
      ]
    };
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;
