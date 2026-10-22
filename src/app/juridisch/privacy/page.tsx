import type { Metadata } from 'next';
import { LegalPageTemplate } from '@/components/LegalPageTemplate';
import { getLegalPage } from '@/content/repository';
import { cmsMetadata, renderCmsPage } from '@/cms/render';
import { buildMetadata } from '@/lib/seo';

const page = getLegalPage('privacy');

const localMetadata: Metadata = buildMetadata({
  title: page.seo.title,
  description: page.seo.description,
  path: '/juridisch/privacy',
  noIndex: page.status !== 'published' || page.seo.noIndex,
});

export async function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('/juridisch/privacy', localMetadata);
}

export default async function PrivacyPage() {
  const cmsView = await renderCmsPage('/juridisch/privacy');
  if (cmsView) return cmsView;

  return <LegalPageTemplate page={page} />;
}
