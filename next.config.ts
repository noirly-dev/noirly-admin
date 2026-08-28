import type { NextConfig } from "next";

const r2Host = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2Host
      ? [{ protocol: "https", hostname: r2Host, pathname: "/**" }]
      : [],
  },
};

export default nextConfig;
