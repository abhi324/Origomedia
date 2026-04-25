/** @type {import('next').NextConfig} */

// In production (docker-compose) the backend is reachable as the `backend`
// service hostname. In local dev it's reachable at 127.0.0.1:8000.
const ORIGOMETER_BACKEND_URL =
  process.env.ORIGOMETER_BACKEND_URL || "http://127.0.0.1:8000";

const nextConfig = {
  reactStrictMode: true,
  // standalone output → small Docker image with everything bundled.
  output: "standalone",
  images: {
    // Allow Instagram CDN images and the avatars fallback.
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "**.ytimg.com" },
      { protocol: "https", hostname: "**.ggpht.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
  trailingSlash: true,
  async rewrites() {
    // Proxy origometer API calls to the FastAPI backend so the browser only
    // ever talks to origomedia.co — no separate backend domain or CORS.
    return [
      {
        source: "/api/v1/:path*",
        destination: `${ORIGOMETER_BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
