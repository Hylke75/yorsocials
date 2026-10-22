import type { ComponentType } from 'react';
import type { CmsBlock } from '../types';
import type { BlockProps } from './props';
import { ArtikelenGridBlock } from './ArtikelenGrid';
import { CasesGridBlock } from './CasesGrid';
import { CtaBlock } from './Cta';
import { FaqBlock } from './Faq';
import { FeitenBlock } from './Feiten';
import { FlexibelBlock } from './Flexibel';
import { FormulierBouwerBlock } from './FormulierBouwer';
import { HeaderBlock } from './Header';
import { KaartenBlock } from './Kaarten';
import { MarqueeBlock } from './Marquee';
import { MediatekstBlock } from './Mediatekst';
import { MensenBlock } from './Mensen';
import { TekstBlock } from './Tekst';


/**
 * Bloktype → component (velden volgens de blokregistry van het Link & Lead-CMS). Bloktypes zonder
 * component worden overgeslagen (nooit crashen). Verouderde CMS-blokken (linkkaarten, leadcta,
 * galerij, nieuwsbrief) worden bewust niet ondersteund; gebruik kaarten, cta en flexibel.
 */
export const BLOCK_COMPONENTS: Partial<Record<string, ComponentType<BlockProps>>> = {
  header: HeaderBlock,
  tekst: TekstBlock,
  mediatekst: MediatekstBlock,
  kaarten: KaartenBlock,
  feiten: FeitenBlock,
  faq: FaqBlock,
  cta: CtaBlock,
  flexibel: FlexibelBlock,
  marquee: MarqueeBlock,
  formulier_bouwer: FormulierBouwerBlock,
  mensen: MensenBlock,
  cases_grid: CasesGridBlock,
  artikelen_grid: ArtikelenGridBlock,
};


export type { BlockProps } from './props';
export { backgroundClass } from './background';

export function isRenderable(block: CmsBlock): boolean {
  return Boolean(BLOCK_COMPONENTS[block.type]);
}

