import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb', // or "unlimited"
    },
  },
  generateEtags: false,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
