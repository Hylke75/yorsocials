import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

// Analytics-domeinen worden alleen toegestaan wanneer er een meet-ID is geconfigureerd.
// De scripts zelf laden pas ná toestemming (zie src/components/consent).
const analyticsEnabled = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
const analyticsScript = analyticsEnabled ? ' https://www.googletagmanager.com' : '';
const analyticsConnect = analyticsEnabled
  ? ' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com'
  : '';

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}${analyticsScript}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data:${analyticsEnabled ? ' https://www.google-analytics.com https://www.googletagmanager.com' : ''}`,
  "font-src 'self'",
  `connect-src 'self'${analyticsConnect}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
