import type { MediaAsset } from '@/content/types';
import { arr, obj, str } from '../parse';

/** Defensieve veldtoegang voor blok-content (velden kunnen ontbreken of het verkeerde type hebben). */
export const text = (c: Record<string, unknown>, key: string): string => str(c[key]).trim();
export const list = (c: Record<string, unknown>, key: string): Record<string, unknown>[] => arr(c[key]).map(obj);
export const num = (c: Record<string, unknown>, key: string, fallback: number): number => {
  const n = Number(c[key]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const clampPct = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50;
};

/**
 * Zet een CMS-afbeelding (URL + alt, zonder afmetingen) om naar het beeldmodel van de site. De
 * afmetingen zijn een nominale verhouding; de containers bepalen de werkelijke maat (object-fit).
 */
const OWN_HOSTS = ['yorsocials.vercel.app', 'www.yorsocials.nl', 'yorsocials.nl'];

/** Beelden die de site zelf host (absolute URL in het CMS) als lokaal pad gebruiken. */
export function localizeUrl(url: string): string {
  try {
    const u = new URL(url);
    return OWN_HOSTS.includes(u.hostname) && u.pathname.startsWith('/images/') ? u.pathname : url;
  } catch {
    return url;
  }
}

export function cmsAsset(url: string, alt: string, focalX?: unknown, focalY?: unknown): MediaAsset | undefined {
  if (!url) return undefined;
  return {
    src: localizeUrl(url),
    width: 1600,
    height: 1067,
    alt,
    focalPoint: `${clampPct(focalX)}% ${clampPct(focalY)}%`,
    source: 'Link & Lead-CMS',
    isPlaceholder: false,
  };
}

/** Slug-vorm voor ids/filters. */
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
