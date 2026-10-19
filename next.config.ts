import type { NextConfig } from 'next';

const isLanDev = process.env.LAN_DEV === 'true';
const lanDevHost = process.env.LAN_DEV_HOST;

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https://images.microcms-assets.io https://www.google-analytics.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://api.microcms.io https://www.google-analytics.com https://region1.google-analytics.com;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`
  .replaceAll('\n', '')
  .replaceAll(/\s{2,}/g, ' ')
  .trim();

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'X-Robots-Tag',
    value: 'noindex, nofollow',
  },
];

const nextConfig: NextConfig = {
  agentRules: false,
  allowedDevOrigins: isLanDev && lanDevHost ? [lanDevHost] : undefined,

  headers() {
    if (isLanDev) {
      return [];
    }

    return [
      {
        headers: securityHeaders,
        source: '/(.*)',
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        hostname: 'images.microcms-assets.io',
        protocol: 'https',
      },
    ],
  },

  sassOptions: {
    prependData: `@use "@/app/_styles/variables" as *;`,
  },
};

export default nextConfig;
