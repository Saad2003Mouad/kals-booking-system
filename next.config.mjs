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
      afterFiles: [],
      fallback: []
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
