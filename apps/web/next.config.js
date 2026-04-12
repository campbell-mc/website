import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: resolve(__dirname, "../../"),
  transpilePackages: ["@chris/db", "@chris/shared", "@chris/connectors", "@chris/engines"],
  experimental: {
    optimizePackageImports: ["recharts", "lucide-react"],
  },
  // Skip static prerendering — all pages render on request
  // Required because many pages use useSearchParams/useParams
  // and the app has no database connection yet for build-time data
  output: undefined,
  // Treat prerender errors as warnings, not build failures
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
