import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['10.53.43.153'],
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
