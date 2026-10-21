import { getArticle, getArticles } from '@/content/repository';
import { ogContentType, ogSize, renderOgImage } from '@/lib/og';

export const alt = 'YorSocials artikel';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug);
  return renderOgImage({ eyebrow: article?.category ?? 'Artikelen', title: article?.title ?? 'Artikelen' });
}
