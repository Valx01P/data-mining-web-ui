import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.113.177.18', '10.0.0.82'],
  images: {
    domains: ['github.com', 'm.media-amazon.com'],
  },
}

export default nextConfig
