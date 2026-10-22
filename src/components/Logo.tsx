import Image from 'next/image';
import type { MediaAsset } from '@/content/types';

interface LogoProps {
  asset: MediaAsset;
  width?: number;
  priority?: boolean;
  className?: string;
}

/** Toont het aangeleverde logobestand (niet nagebouwd met tekst). */
export function Logo({ asset, width = 200, priority, className }: LogoProps) {
  const height = Math.round((asset.height / asset.width) * width);
  return (
    <Image src={asset.src} alt={asset.alt} width={width} height={height} priority={priority} className={className} sizes={`${width}px`} />
  );
}
