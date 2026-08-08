/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // ganti dengan domain CDN aset lo di production
    ],
  },
};

module.exports = nextConfig;
