import type { MediaAsset } from '../types';

/**
 * Mediabibliotheek. Alle foto's zijn stockfoto's van Pexels onder de Pexels-licentie
 * (https://www.pexels.com/license/): gratis te gebruiken, ook commercieel, naamsvermelding
 * niet verplicht. Niet toegestaan: suggereren dat herkenbare personen YorSocials aanbevelen
 * of bij YorSocials werken — gebruik ze dus alleen als sfeerbeeld, nooit bij team of cases
 * als "onze klant". Credits staan in `source` en in docs/BEELDCREDITS.md.
 *
 * Eigen fotografie van YorSocials kan deze beelden later één-op-één vervangen.
 */
const pexels = (
  id: number,
  width: number,
  height: number,
  alt: string,
  photographer: string,
  focalPoint = '50% 50%',
): MediaAsset => ({
  src: `/images/stock/pexels-${id}.jpg`,
  width,
  height,
  alt,
  focalPoint,
  source: `Pexels-licentie — foto: ${photographer} (https://www.pexels.com/photo/${id}/)`,
  isPlaceholder: false,
});

export const media = {
  hero: pexels(4914352, 1600, 1066, 'Cameraman filmt met een professionele camera in een studio met softboxen', 'Kyle Loftus', '70% 40%'),
  shoot: pexels(30878455, 1600, 1067, 'Filmcrew aan het werk op een sfeervol verlichte set', 'Javo Films', '50% 50%'),
  onSet: pexels(30878454, 1600, 1067, 'Filmset met neonverlichting en een cameracrew', 'Javo Films', '50% 50%'),
  creator: pexels(8303436, 1600, 2400, 'Lachende maker die zichzelf filmt met een smartphone en ringlamp', 'ANTONI SHKRABA production', '50% 30%'),
  gimbal: pexels(20151432, 1600, 2400, 'Smartphone op een gimbal die een video opneemt in een woonkamer', 'Kenneth Surillo', '50% 35%'),
  strategy: pexels(4623462, 1600, 1065, 'Twee collega’s bespreken een contentplanning op een wand vol sticky notes', 'Ketut Subiyanto', '60% 40%'),
  analytics: pexels(7109291, 922, 875, 'Laptop met een grafiek op het scherm', 'Tiger Lily', '50% 40%'),
  fitness: pexels(17210051, 1600, 1067, 'Sporter die even rust neemt in een donkere sportschool', 'Doğu Tuncer', '45% 40%'),
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
