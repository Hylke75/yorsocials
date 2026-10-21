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
  `img-src 'self' blob: data: https://${CMS_MEDIA_HOST} https://yorsocials.vercel.app https://www.yorsocials.nl`,
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
    remotePatterns: [
      { protocol: 'https', hostname: CMS_MEDIA_HOST, pathname: '/storage/v1/object/public/media/**' },
      // Beelden die de site zelf host en die als absolute URL in het CMS staan.
      { protocol: 'https', hostname: 'yorsocials.vercel.app', pathname: '/images/**' },
      { protocol: 'https', hostname: 'www.yorsocials.nl', pathname: '/images/**' },
    ],
  },
  // Oude URL's → de slugs van het CMS-contentmodel (diensten en juridische pagina's).
  async redirects() {
    return [
      { source: '/services', destination: '/diensten', permanent: true },
      { source: '/services/:slug', destination: '/diensten/:slug', permanent: true },
      { source: '/privacy', destination: '/juridisch/privacy', permanent: true },
      { source: '/cookies', destination: '/juridisch/cookies', permanent: true },
    ];
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
