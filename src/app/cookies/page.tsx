import type { Metadata } from 'next';
import { LegalPageTemplate } from '@/components/LegalPageTemplate';
import { getLegalPage } from '@/content/repository';
import { cmsMetadata, renderCmsPage } from '@/cms/render';
import { buildMetadata } from '@/lib/seo';

const page = getLegalPage('cookies');

const localMetadata: Metadata = buildMetadata({
  title: page.seo.title,
  description: page.seo.description,
  path: '/cookies',
  noIndex: page.status !== 'published' || page.seo.noIndex,
});

export async function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('/cookies', localMetadata);
}

export default async function CookiesPage() {
  const cmsView = await renderCmsPage('/cookies');
  if (cmsView) return cmsView;

  return <LegalPageTemplate page={page} />;
}
