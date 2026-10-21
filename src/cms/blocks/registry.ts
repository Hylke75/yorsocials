import type { ComponentType } from 'react';
import type { CmsBlock } from '../types';

export interface BlockProps {
  block: CmsBlock;
  /** Index op de pagina; het eerste header-blok levert de enige H1. */
  index: number;
}

/**
 * Bloktype → component. Bloktypes zonder component worden overgeslagen (nooit crashen).
 * De componenten worden toegevoegd zodra de CMS-bouwer per blok de content-sleutels heeft geleverd;
 * zie docs/CMS-BLOKKEN.md voor de lijst die we gebruiken.
 */
export const BLOCK_COMPONENTS: Partial<Record<string, ComponentType<BlockProps>>> = {};

/** Blokken die we willen ondersteunen (afgestemd met de CMS-bouwer). */
export const PLANNED_BLOCK_TYPES = [
  'header',
  'tekst',
  'mediatekst',
  'kaarten',
  'linkkaarten',
  'feiten',
  'faq',
  'cta',
  'leadcta',
  'galerij',
  'logostrook',
  'formulier_bouwer',
  'nieuwsbrief',
  'flexibel',
  'mensen',
  'cases_grid',
  'artikelen_grid',
] as const;

export function isRenderable(block: CmsBlock): boolean {
  return Boolean(BLOCK_COMPONENTS[block.type]);
}

/** Achtergrond-token uit het CMS → sectieklasse van deze site. Onbekend/null → standaard. */
export function backgroundClass(bg: string | null): string {
  switch (bg) {
    case 'mist':
    case 'licht':
      return 'section--soft';
    case 'nacht':
    case 'donker':
    default:
      return '';
  }
}
