import type { Metadata } from 'next';
import { LegalPageTemplate } from '@/components/LegalPageTemplate';
import { getLegalPage } from '@/content/repository';
import { cmsMetadata, renderCmsPage } from '@/cms/render';
import { buildMetadata } from '@/lib/seo';

const page = getLegalPage('cookies');

const localMetadata: Metadata = buildMetadata({
  title: page.seo.title,
  description: page.seo.description,
  path: '/juridisch/cookies',
  noIndex: page.status !== 'published' || page.seo.noIndex,
});

export async function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('/juridisch/cookies', localMetadata);
}

export default async function CookiesPage() {
  const cmsView = await renderCmsPage('/juridisch/cookies');
  if (cmsView) return cmsView;

  return <LegalPageTemplate page={page} />;
}
