import type { CaseStudy, Sector } from '../types';
import { media } from './media';

/**
 * Sectoren voor het casefilter. "Personal brand" heeft bewust nog geen case, zodat de
 * lege toestand zichtbaar en testbaar is.
 */
export const sectors: Sector[] = [
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'horeca', label: 'Horeca' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'retail', label: 'Retail' },
  { id: 'personal-brand', label: 'Personal brand' },
];

/**
 * DEMONSTRATIECASES — geen echte klanten, opdrachten of resultaten.
 * Ze tonen alleen de structuur van een case. Vervang door 3–6 geverifieerde cases met
 * schriftelijke toestemming, bron en meetperiode (functioneel ontwerp §5 en §13).
 * Status `demo` zorgt dat ze in productie nooit zichtbaar zijn.
 */
const demoSeo = (title: string) => ({
  title: `${title} (voorbeeldcase)`,
  description: 'Voorbeeld van de opbouw van een YorSocials-case. Geen echte klantopdracht.',
  noIndex: true,
});

export const cases: CaseStudy[] = [
  {
    slug: 'voorbeeld-lifestyle-merkverhaal',
    clientName: null,
    permissionGranted: false,
    title: 'Een merk dat mensen raakt',
    sector: 'lifestyle',
    summary: 'Voorbeeld van een merkverhaal en contentaanpak voor een lifestylemerk.',
    context:
      'Hier komt de beginsituatie van de klant: wie is het merk, op welke kanalen is het actief en wat liep er niet zoals gewenst?',
    objective: 'Hier komt de afgesproken doelstelling, zo concreet mogelijk en met de bijbehorende KPI.',
    approach: [
      'Strategische analyse van doelgroep en kanalen',
      'Ontwikkeling van contentpijlers en een herkenbaar format',
      'Productie van foto en short-form video',
    ],
    outputs: ['Contentstrategie', 'Fotoserie', 'Reeks short-form video’s'],
    results: [],
    quote: null,
    heroImage: media.creator,
    gallery: [media.creator, media.shoot],
    relatedServices: ['social-strategie', 'content-creatie'],
    seo: demoSeo('Een merk dat mensen raakt'),
    status: 'demo',
  },
  {
    slug: 'voorbeeld-horeca-lokaal-zichtbaar',
    clientName: null,
    permissionGranted: false,
    title: 'Van lokaal zichtbaar naar geliefd',
    sector: 'horeca',
    summary: 'Voorbeeld van een social aanpak voor een horecazaak.',
    context: 'Hier komt de beginsituatie van de horecaklant, in de woorden van de klant zelf en na goedkeuring.',
    objective: 'Hier komt de doelstelling, bijvoorbeeld meer reserveringen via social — alleen met echte meetgegevens.',
    approach: ['Lokale doelgroepanalyse', 'Contentkalender rond menu en seizoenen', 'Community management'],
    outputs: ['Contentkalender', 'Fotografie van gerechten en interieur', 'Richtlijnen voor reacties'],
    results: [],
    quote: null,
    heroImage: media.shoot,
    gallery: [media.shoot, media.hero],
    relatedServices: ['content-creatie', 'community-management'],
    seo: demoSeo('Van lokaal zichtbaar naar geliefd'),
    status: 'demo',
  },
  {
    slug: 'voorbeeld-fitness-content-in-beweging',
    clientName: null,
    permissionGranted: false,
    title: 'Content in beweging',
    sector: 'fitness',
    summary: 'Voorbeeld van video en communityopbouw voor een fitnessmerk.',
    context: 'Hier komt de beginsituatie van de fitnessklant.',
    objective: 'Hier komt de doelstelling met KPI, meetperiode en bron.',
    approach: ['Reels-format ontwikkelen', 'Creators betrekken', 'Communityactivatie'],
    outputs: ['Reels-format', 'Videoserie', 'Communityplan'],
    results: [],
    quote: null,
    heroImage: media.fitness,
    gallery: [media.fitness, media.creator],
    relatedServices: ['video-reels', 'community-management'],
    seo: demoSeo('Content in beweging'),
    status: 'demo',
  },
  {
    slug: 'voorbeeld-retail-aandacht-voor-aanbod',
    clientName: null,
    permissionGranted: false,
    title: 'Meer aandacht voor je aanbod',
    sector: 'retail',
    summary: 'Voorbeeld van social advertising voor een retailmerk.',
    context: 'Hier komt de beginsituatie van de retailklant.',
    objective: 'Hier komt de doelstelling met KPI, meetperiode en bron.',
    approach: ['Campagnestructuur opzetten', 'Creatieve varianten testen', 'Wekelijks bijsturen'],
    outputs: ['Campagneopzet', 'Advertentievarianten', 'Rapportage'],
    results: [],
    quote: null,
    heroImage: media.strategy,
    gallery: [media.strategy, media.analytics],
    relatedServices: ['paid-social', 'analyse-optimalisatie'],
    seo: demoSeo('Meer aandacht voor je aanbod'),
    status: 'demo',
  },
];
