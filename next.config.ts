import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 🚀 skip ESLint errors during Vercel build
  },
  // Optional: if type errors are breaking your build, you can also add:
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  webpack: (config) => {
    // avoid bundling optional pg-native (not available in Vercel)
    config.externals.push({ "pg-native": "commonjs pg-native" });
    return config;
  },
};

export default nextConfig;
