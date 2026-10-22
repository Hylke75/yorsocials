import { getCase, getCases } from '@/content/repository';
import { ogContentType, ogSize, renderOgImage } from '@/lib/og';

export const alt = 'YorSocials case';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getCases().map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = getCase((await params).slug);
  return renderOgImage({ eyebrow: 'Cases', title: item?.title ?? 'Cases' });
}
