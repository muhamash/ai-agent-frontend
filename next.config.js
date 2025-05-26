/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Disable webpack caching to resolve ENOENT error
  webpack: (config) => {
    config.cache = false;
    return config;
  }
};

module.exports = nextConfig;