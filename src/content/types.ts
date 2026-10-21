/**
 * Contentmodel van de publieke website (functioneel ontwerp §6).
 *
 * Deze types zijn het contract tussen de templates en de contentbron. Vandaag komt de
 * content uit getypte seedbestanden in `src/content/data`; bij de keuze voor een headless
 * CMS (Sanity/Directus, nog te bevestigen) wordt alleen `src/content/repository.ts`
 * vervangen door een fetcher die dezelfde types teruggeeft.
 */

/**
 * - `published`: bevestigde content, zichtbaar in productie.
 * - `demo`: voorbeeld-/placeholdercontent; alleen zichtbaar in staging, altijd met demolabel.
 * - `draft`: onvolledig; nergens zichtbaar behalve waar een template expliciet een concept toont.
 */
export type ContentStatus = 'published' | 'demo' | 'draft';

export type ContentMode = 'staging' | 'production';

export interface MediaAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** CSS object-position, bijv. "50% 30%". */
  focalPoint?: string;
  caption?: string;
  /** Herkomst/licentie. Verplicht voor livegang. */
  source: string;
  /** true = placeholder uit AI-mockup; niet publicatieklaar. */
  isPlaceholder: boolean;
  transcript?: string;
}

export interface Seo {
  title: string;
  description: string;
  noIndex?: boolean;
}

export interface SocialLink {
  platform: 'instagram' | 'tiktok' | 'linkedin' | 'youtube';
  url: string;
  verified: boolean;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  logo: { onDark: MediaAsset; original: MediaAsset };
  socialLinks: SocialLink[];
  email: string | null;
  phone: string | null;
  /** Echte boekingslink (Calendly/Cal.com e.d.). Null = afspraak-CTA verwijst naar het formulier. */
  bookingUrl: string | null;
  legalEntity: { name: string; kvk: string; address: string } | null;
  defaultSeo: Seo;
}

export type IconName =
  | 'strategy'
  | 'camera'
  | 'play'
  | 'megaphone'
  | 'community'
  | 'trend'
  | 'sparkles'
  | 'handshake'
  | 'lightbulb'
  | 'target'
  | 'compass'
  | 'messages';

export interface ProcessStep {
  title: string;
  copy: string;
  image?: MediaAsset;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: ContentStatus;
}

export interface Service {
  slug: string;
  number: string;
  title: string;
  eyebrow: string;
  icon: IconName;
  summary: string;
  intro: string;
  /** Herkenning: welk probleem lost de dienst op. */
  problem: string[];
  heroImage: MediaAsset;
  deliverables: string[];
  process: ProcessStep[];
  faqs: Pick<FaqItem, 'id' | 'question' | 'answer'>[];
  seo: Seo;
  status: ContentStatus;
}

export interface CaseResult {
  metric: string;
  value: string;
  unit?: string;
  period: string;
  source: string;
  /** Alleen goedgekeurde resultaten met bron en periode worden getoond. */
  approved: boolean;
}

export interface CaseQuote {
  text: string;
  author: string;
  role: string;
  approved: boolean;
}

export interface Sector {
  id: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  /** Alleen tonen als permissionGranted true is. */
  clientName: string | null;
  permissionGranted: boolean;
  title: string;
  sector: string;
  summary: string;
  context: string;
  objective: string;
  approach: string[];
  outputs: string[];
  results: CaseResult[];
  quote: CaseQuote | null;
  heroImage: MediaAsset;
  gallery: MediaAsset[];
  relatedServices: string[];
  seo: Seo;
  status: ContentStatus;
}

export interface TeamMember {
  name: string;
  role: string;
  portrait: MediaAsset;
  bio: string;
  links: { label: string; url: string }[];
  consentConfirmed: boolean;
  sortOrder: number;
  status: ContentStatus;
}

export type InlineNode = string | { text: string; href: string };

export type RichTextBlock =
  | { type: 'paragraph'; content: InlineNode[] }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'image'; image: MediaAsset }
  | { type: 'quote'; text: string; cite?: string };

export interface Author {
  name: string;
  role: string;
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  heroImage: MediaAsset;
  body: RichTextBlock[];
  author: Author | null;
  publishedAt: string | null;
  relatedServices: string[];
  seo: Seo;
  status: ContentStatus;
}

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalPage {
  slug: 'privacy' | 'cookies';
  title: string;
  eyebrow: string;
  intro: string;
  version: string;
  lastReviewed: string | null;
  sections: LegalSection[];
  seo: Seo;
  /** Juridische pagina's blijven `draft` tot een bevoegde partij de tekst heeft vastgesteld. */
  status: ContentStatus;
}

export interface MissingContentItem {
  area: string;
  item: string;
  blocking: boolean;
}
