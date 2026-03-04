import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Commented out to allow API routes to work on Vercel
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
