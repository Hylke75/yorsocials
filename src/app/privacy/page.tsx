import type { Metadata } from 'next';
import { LegalPageTemplate } from '@/components/LegalPageTemplate';
import { getLegalPage } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

const page = getLegalPage('privacy');

export const metadata: Metadata = buildMetadata({
  title: page.seo.title,
  description: page.seo.description,
  path: '/privacy',
  noIndex: page.status !== 'published' || page.seo.noIndex,
});

export default function PrivacyPage() {
  return <LegalPageTemplate page={page} />;
}
