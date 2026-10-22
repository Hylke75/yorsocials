import type { CmsBlock, CmsPage } from '../types';

export interface BlockProps {
  block: CmsBlock;
  /** De pagina waar het blok op staat (voor kruimelpad en context). */
  page: CmsPage;
  /** Index op de pagina. */
  index: number;
  /** true voor het eerste header-blok: dat levert de enige H1. */
  isFirstHeader: boolean;
}
