import type { NextConfig } from "next";
import path from "path";
import bundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 768, 1100, 1440, 1920],
    minimumCacheTTL: 31536000,
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/styles")],
    loadPaths: [path.join(process.cwd(), "src/styles")],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei", "gsap"],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withAnalyzer(config);
