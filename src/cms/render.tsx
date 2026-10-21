import 'server-only';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { CmsBlocks, hasRenderableBlocks } from './blocks/CmsBlocks';
import { getCmsPage } from './client';

/**
 * Geeft de CMS-versie van een pagina terug als die bestaat én renderbare blokken heeft;
 * anders null, zodat de route zijn ingebouwde inhoud toont.
 */
export async function renderCmsPage(slug: string) {
  const page = await getCmsPage(slug);
  return hasRenderableBlocks(page) ? <CmsBlocks page={page} /> : null;
}

/** Metadata uit het CMS (titel, beschrijving, og_beeld) als de pagina daar bestaat; anders de lokale. */
export async function cmsMetadata(slug: string, fallback: Metadata): Promise<Metadata> {
  const page = await getCmsPage(slug);
  if (!hasRenderableBlocks(page)) return fallback;
  const meta = buildMetadata({ title: page.titel || undefined, description: page.beschrijving, path: page.slug });
  if (page.og_beeld) {
    meta.openGraph = { ...meta.openGraph, images: [{ url: page.og_beeld }] };
    meta.twitter = { ...meta.twitter, images: [page.og_beeld] };
  }
  return meta;
}
