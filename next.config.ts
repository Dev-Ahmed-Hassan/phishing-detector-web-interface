import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "https://phishing-detector-self-five.vercel.app";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`
      },
    ];
  },
};

export default nextConfig;
