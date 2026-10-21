import Image from 'next/image';
import type { CSSProperties } from 'react';

interface CmsImageProps {
  src: string;
  alt: string;
  /** logo → nooit bijsnijden (contain); foto → vaste verhouding, gevuld (cover). */
  kind?: 'photo' | 'logo';
  /** CSS aspect-ratio, bijv. "16 / 9". Het CMS levert geen afmetingen, dus de container bepaalt de maat. */
  ratio?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Afbeelding uit de CMS-mediabibliotheek in een container met vaste verhouding (geen layout shift). */
export function CmsImage({ src, alt, kind = 'photo', ratio = kind === 'logo' ? '4 / 1' : '4 / 3', sizes, priority, className }: CmsImageProps) {
  const style: CSSProperties = { position: 'relative', aspectRatio: ratio, width: '100%', overflow: 'hidden' };
  return (
    <div style={style} className={className}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: kind === 'logo' ? 'contain' : 'cover' }} />
    </div>
  );
}
