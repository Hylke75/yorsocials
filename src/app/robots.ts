import type { MetadataRoute } from 'next';
import { getContentMode, getSiteUrl } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  if (getContentMode() !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/styleguide'] },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
