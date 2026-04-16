import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking — page cannot be embedded in iframes
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send referrer for same-origin requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable access to camera/mic/geolocation by default
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Force HTTPS for 1 year (only active on production with real HTTPS)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Basic XSS protection for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Supabase Storage for user-uploaded listing photos
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
