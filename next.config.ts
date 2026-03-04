import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Commented out to allow API routes to work on Vercel
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
