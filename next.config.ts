import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  experimental: {
    proxyTimeout: 120_000, // 2 minutos: da tiempo a que Render despierte
  },
  async rewrites() {
    const backend = process.env.BACKEND_URL;

    if (!backend) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
