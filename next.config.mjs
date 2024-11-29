/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "p1.hiclipart.com",
      },
      {
        protocol: "https",
        hostname: "idramp.com",
      },
    ],
  },
};

export default nextConfig;
