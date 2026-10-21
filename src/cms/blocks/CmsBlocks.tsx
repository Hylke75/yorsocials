import type { CmsPage } from '../types';
import { BLOCK_COMPONENTS, isRenderable } from './registry';

/** Rendert de blokken van een CMS-pagina in volgorde; onbekende bloktypes worden overgeslagen. */
export function CmsBlocks({ page }: { page: CmsPage }) {
  return (
    <>
      {page.blokken.map((block, index) => {
        const Component = BLOCK_COMPONENTS[block.type];
        return Component ? <Component key={`${block.type}-${index}`} block={block} index={index} /> : null;
      })}
    </>
  );
}

/** Een CMS-pagina wordt pas gebruikt als minstens één blok renderbaar is; anders blijft de ingebouwde pagina staan. */
export function hasRenderableBlocks(page: CmsPage | null): page is CmsPage {
  return Boolean(page?.blokken.some(isRenderable));
}
