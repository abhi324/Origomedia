/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Static export: produces an `out/` folder that drops straight into
  // GoDaddy cPanel (public_html). No Node runtime needed at the edge.
  output: "export",
  trailingSlash: true,

  images: {
    // Image Optimizer needs a Node runtime; static export skips it.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "**.ytimg.com" },
      { protocol: "https", hostname: "**.ggpht.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
};

module.exports = nextConfig;
