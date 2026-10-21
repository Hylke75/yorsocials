import type { Metadata } from 'next';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { CmsBlocks, hasRenderableBlocks } from '@/cms/blocks/CmsBlocks';
import { getCmsContent, getCmsPage } from '@/cms/client';
import { cmsMetadata } from '@/cms/render';
import { normalizeSlug } from '@/cms/parse';
import { STATIC_ROUTES } from '@/lib/routes';

/**
 * Pagina's die alleen in het CMS bestaan (bijv. /diensten/<slug>, /juridisch/<slug>, case- en
 * artikeldetails). Vaste routes van deze site gaan voor; die tonen zelf de CMS-versie als die er is.
 */
type Props = { params: Promise<{ slug: string[] }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const content = await getCmsContent();
  const own = new Set<string>(STATIC_ROUTES);
  return (content?.paginas ?? [])
    .filter((p) => p.slug !== '/' && !own.has(p.slug) && hasRenderableBlocks(p))
    .map((p) => ({ slug: p.slug.slice(1).split('/') }));
}

const slugOf = async (params: Props['params']) => normalizeSlug((await params).slug.join('/'));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return cmsMetadata(await slugOf(params), {});
}

export default async function CmsPageRoute({ params }: Props) {
  const slug = await slugOf(params);
  const page = await getCmsPage(slug);
  if (hasRenderableBlocks(page)) return <CmsBlocks page={page} />;

  const redirectRule = (await getCmsContent())?.site.redirects.find((r) => r.van === slug);
  if (redirectRule) {
    if (redirectRule.status === 301 || redirectRule.status === 308) permanentRedirect(redirectRule.naar);
    redirect(redirectRule.naar);
  }
  notFound();
}
