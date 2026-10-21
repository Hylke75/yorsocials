import { getSiteSettings } from '@/content/repository';
import { ogContentType, ogSize, renderOgImage } from '@/lib/og';

export const alt = 'YorSocials — Social die opvalt. Content die blijft.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: 'Social-first creative agency', title: getSiteSettings().tagline });
}
