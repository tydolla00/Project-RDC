const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "assets.xboxservices.com" },
      { protocol: "https", hostname: "static.wikia.nocookie.net" },
    ],
  },
};

export default nextConfig;
