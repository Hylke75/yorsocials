import type { ContentMode } from '@/content/types';

export function getContentMode(): ContentMode {
  return process.env.NEXT_PUBLIC_CONTENT_MODE === 'production' ? 'production' : 'staging';
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
}
