import type { MediaAsset } from '../types';

/**
 * Mediabibliotheek.
 *
 * De foto's zijn bijgesneden zodat de in de mockups ingebakken (verzonnen) statistieken,
 * UI-kaarten en handgeschreven teksten wegvallen; een merklogo van derden is geblurd.
 * strategy.jpg en analytics.jpg zijn neutrale gegenereerde illustraties zonder cijfers.
 * Originele uitsneden: design/placeholder-bronnen/ (niet publiceren).
 * Alle huidige beelden zijn uitsneden uit eerdere AI-mockups en dus
 * PLACEHOLDERS (zie design/handover/02_DESIGNSYSTEEM_EN_COMPONENTEN.md). Vervang ze door
 * eigen of gelicentieerde fotografie vóór livegang; `isPlaceholder` stuurt het demolabel.
 */
const placeholder = (
  file: string,
  width: number,
  height: number,
  alt: string,
  focalPoint = '50% 50%',
  source = 'Uitsnede uit AI-gegenereerde designmockup (placeholder, geen licentie voor publicatie)',
): MediaAsset => ({
  src: `/images/demo/placeholder-${file}`,
  width,
  height,
  alt,
  focalPoint,
  source,
  isPlaceholder: true,
});

export const media = {
  hero: placeholder('hero.jpg', 340, 373, 'Contentmaker met camera-gimbal tijdens een opname in een donkere studio', '50% 30%'),
  shoot: placeholder('shoot.jpg', 325, 373, 'Videomaker met camera-gimbal op een set met studiolampen', '50% 30%'),
  creator: placeholder('creator.jpg', 285, 194, 'Creatieve maker in een hoodie op een kantoor met beeldschermen', '40% 40%'),
  strategy: placeholder('strategy.jpg', 1200, 800, 'Abstracte illustratie van een plan op papier', '50% 50%', 'Gegenereerde neutrale placeholder (geen fotografie)'),
  analytics: placeholder('analytics.jpg', 1200, 800, 'Abstracte illustratie van een staafdiagram zonder cijfers', '50% 50%', 'Gegenereerde neutrale placeholder (geen fotografie)'),
  fitness: placeholder('fitness.jpg', 236, 238, 'Sporter in een donkere sportschool tijdens een fotoshoot'),
} satisfies Record<string, MediaAsset>;

export const logo = {
  onDark: {
    src: '/brand/logo-on-dark.png',
    width: 1710,
    height: 196,
    alt: 'YorSocials',
    source:
      'Afgeleid van het aangeleverde logo: alleen de zwarte letters “YOR” en de punt zijn naar gebroken wit gezet voor contrast op donkere achtergrond. Ter goedkeuring bij de merkeigenaar.',
    isPlaceholder: false,
  },
  original: {
    src: '/brand/logo-original.png',
    width: 1710,
    height: 196,
    alt: 'YorSocials',
    source: 'Aangeleverd logo (vrijgemaakte export, prototypegebruik)',
    isPlaceholder: false,
  },
} satisfies Record<string, MediaAsset>;
