import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  const isDevelopment = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    ...(isDevelopment
      ? {
          skipTrailingSlashRedirect: true,
          async rewrites() {
            return [
              {
                source: "/api/:path*",
                destination: "https://checkin-api.ject.kr/:path*",
              },
            ];
          },
        }
      : { output: "export" }),
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
    reactCompiler: true,
  };
}
