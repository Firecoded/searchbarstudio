import type { NextConfig } from "next";

// Pin the workspace root so a lockfile elsewhere in the tree can't move it.
const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
