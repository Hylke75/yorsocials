import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

// Cookieloze analytics (Plausible) alleen als er een domein is ingesteld.
const analyticsEnabled = Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
const analyticsScript = analyticsEnabled ? ' https://plausible.io' : '';
const analyticsConnect = analyticsEnabled ? ' https://plausible.io' : '';

// Mediabibliotheek van het Link & Lead-CMS.
const CMS_MEDIA_HOST = 'mucwwqjctynklovacwbv.supabase.co';

// Nieuwsbriefaanmeldingen gaan vanuit de browser rechtstreeks naar Mailento.
const newsletterConnect = ' https://gfnxbkketubsevavlegj.supabase.co';

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}${analyticsScript}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data: https://${CMS_MEDIA_HOST}`,
  "font-src 'self'",
  `connect-src 'self'${newsletterConnect}${analyticsConnect}`,
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
    remotePatterns: [{ protocol: 'https', hostname: CMS_MEDIA_HOST, pathname: '/storage/v1/object/public/media/**' }],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
