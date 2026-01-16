import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'static.wikia.nocookie.net',
      'upload.wikimedia.org',
    ],
  },
};

export default nextConfig;
