import type { Metadata } from 'next';
import { ConsentPreferences } from '@/components/consent/ConsentPreferences';
import { LegalPageTemplate } from '@/components/LegalPageTemplate';
import { getGlobalContent, getLegalPage } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

const page = getLegalPage('cookies');

export const metadata: Metadata = buildMetadata({
  title: page.seo.title,
  description: page.seo.description,
  path: '/cookies',
  noIndex: page.status !== 'published' || page.seo.noIndex,
});

export default function CookiesPage() {
  return (
    <LegalPageTemplate page={page}>
      <h2 id="voorkeuren">{getGlobalContent().consentPreferences.pageHeading}</h2>
      <ConsentPreferences variant="inline" />
    </LegalPageTemplate>
  );
}
