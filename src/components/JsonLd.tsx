import { serializeJsonLd } from '@/lib/seo';

/** Structured data (SeoMeta-onderdeel). Metadata zelf loopt via Next `generateMetadata`. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
