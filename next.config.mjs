/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@vonage/server-sdk", "@vonage/auth", "@vonage/video"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
