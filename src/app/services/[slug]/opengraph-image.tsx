import { getService, getServices } from '@/content/repository';
import { ogContentType, ogSize, renderOgImage } from '@/lib/og';

export const alt = 'YorSocials dienst';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const service = getService((await params).slug);
  return renderOgImage({ eyebrow: 'Services', title: service?.title ?? 'Services' });
}
