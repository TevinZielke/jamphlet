/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'skoadbwgytopxdzofxgm.supabase.co',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
