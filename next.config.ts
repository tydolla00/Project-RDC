import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: { reactCompiler: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "static.wikia.nocookie.net" },
    ],
  },
};

export default nextConfig;
