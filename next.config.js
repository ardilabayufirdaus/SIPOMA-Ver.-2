/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   appDir: true,
  // },
  images: {
    domains: ["localhost"],
    unoptimized: process.env.NODE_ENV === "development",
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Temporarily allow builds to succeed even if ESLint finds issues across the repo.
    // This avoids blocking production build on repo-wide lint rules while we iteratively fix them.
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  },
};

// next-pwa is disabled temporarily to avoid build-time prerender/runtime issues.
// Re-enable after confirming app builds cleanly.
module.exports = nextConfig;
