import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use static export when building specifically for the Android APK
  ...(process.env.CAPACITOR_BUILD === 'true' ? { output: "export" } : {}),
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
