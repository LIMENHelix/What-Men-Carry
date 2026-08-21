/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    config.externals.push('fsevents');
    return config;
  },
};

module.exports = nextConfig;
