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
  /** true = placeholder zonder publicatielicentie; krijgt in staging een "Placeholder"-label. */
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
  /** Nieuwsbriefdienst (Mailento): openbaar aanmeld-endpoint + lijst-slug. Null = pop-up uit. */
  newsletter: { endpoint: string; slug: string } | null;
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

/* ------------------------------------------------------------------------------------------
 * Paginateksten en terugkerende interfaceteksten.
 *
 * Koppen ondersteunen een mini-opmaak: `*tekst*` = accentkleur (groen), een regeleinde (\n)
 * = nieuwe regel. Zo kan een redacteur de huisstijl-koppen zonder HTML beheren.
 * ---------------------------------------------------------------------------------------- */

export interface HeroContent {
  eyebrow: string;
  heading: string;
  description?: string;
  image?: MediaAsset;
  /** Handgeschreven accent naast de hero (optioneel, puur decoratief). */
  annotation?: string[];
}

export interface SectionContent {
  eyebrow: string;
  heading: string;
  description?: string;
}

export interface CtaContent {
  eyebrow: string;
  heading: string;
  body: string;
}

export interface EmptyStateContent {
  title: string;
  description: string;
}

export interface StepContent {
  icon: IconName;
  title: string;
  copy: string;
}

export interface PagesContent {
  home: {
    seo: Seo;
    hero: HeroContent;
    heroSecondaryCasesLabel: string;
    heroSecondaryServicesLabel: string;
    services: SectionContent;
    /** `{count}` wordt vervangen door het aantal diensten. */
    allServicesLabel: string;
    approach: SectionContent & { text: string; image: MediaAsset; buttonLabel: string };
    process: SectionContent;
    cases: SectionContent;
    casesDemoNotice: string;
    allCasesLabel: string;
    cta: CtaContent;
  };
  services: { seo: Seo; hero: HeroContent; overview: SectionContent; process: SectionContent; cta: CtaContent };
  serviceDetail: {
    askQuestionLabel: string;
    problem: SectionContent;
    offer: SectionContent & { text: string; buttonLabel: string };
    process: SectionContent;
    faq: SectionContent & { allQuestionsLabel: string };
    articles: SectionContent;
    otherServices: SectionContent;
    cta: CtaContent;
  };
  cases: {
    seo: Seo;
    hero: HeroContent;
    demoNotice: string;
    empty: EmptyStateContent;
    filterLabel: string;
    filterAllLabel: string;
    /** `{sector}` wordt vervangen door de sectornaam. */
    filterEmptyTitle: string;
    filterEmptyDescription: string;
    cta: CtaContent;
  };
  caseDetail: {
    demoBadge: string;
    demoNotice: string;
    contextEyebrow: string;
    contextHeading: string;
    objectiveEyebrow: string;
    objectiveHeading: string;
    approach: SectionContent;
    outputsHeading: string;
    gallery: SectionContent;
    results: SectionContent;
    resultsEmpty: string;
    relatedServices: SectionContent;
    backLabel: string;
    cta: CtaContent;
  };
  about: {
    seo: Seo;
    hero: HeroContent;
    story: SectionContent & { text: string; image: MediaAsset };
    storyDraftNotice: string;
    values: SectionContent;
    process: SectionContent;
    team: SectionContent;
    teamEmptyNotice: string;
    cta: CtaContent;
  };
  articles: { seo: Seo; hero: HeroContent; demoNotice: string; empty: EmptyStateContent; categoriesLabel: string; cta: CtaContent };
  articleDetail: {
    demoBadge: string;
    demoNotice: string;
    /** `{name}` en `{role}` worden vervangen. */
    byline: string;
    noAuthor: string;
    notPublished: string;
    backLabel: string;
    services: SectionContent;
    related: SectionContent;
    cta: CtaContent;
  };
  contact: {
    seo: Seo;
    hero: HeroContent;
    intro: SectionContent & { text: string };
    missingContactNotice: string;
    emailLabel: string;
    phoneLabel: string;
    booking: { title: string; textWithUrl: string; textWithoutUrl: string; buttonLabel: string };
    expectations: SectionContent;
    steps: StepContent[];
  };
  faq: { seo: Seo; hero: HeroContent; empty: EmptyStateContent; cta: CtaContent };
  notFound: { title: string; hero: HeroContent; homeLabel: string; contactLabel: string };
}

export interface GlobalContent {
  navigation: { href: string; label: string }[];
  bookingLabel: string;
  messageLabel: string;
  ticker: string[];
  cardLinks: { service: string; caseStudy: string; article: string };
  /** `{number}` wordt vervangen door het dienstnummer. */
  serviceNumberLabel: string;
  demoBadge: string;
  stagingBanner: string;
  ctaAnnotation: string[];
  footer: {
    navigationHeading: string;
    servicesHeading: string;
    ctaHeading: string;
    extraLinks: { href: string; label: string }[];
    legalLinks: { href: string; label: string }[];
    stagingSuffix: string;
    credit: { prefix: string; name: string; url: string } | null;
  };
  newsletter: {
    eyebrow: string;
    heading: string;
    text: string;
    emailLabel: string;
    firstNameLabel: string;
    consentLabel: string;
    privacyLinkLabel: string;
    submitLabel: string;
    declineLabel: string;
    successHeading: string;
    successText: string;
    closeLabel: string;
  };
  contactForm: {
    eyebrow: string;
    heading: string;
    nameLabel: string;
    emailLabel: string;
    companyLabel: string;
    topicLabel: string;
    topicPlaceholder: string;
    topics: string[];
    messageLabel: string;
    messageHint: string;
    privacyLabel: string;
    privacyLinkLabel: string;
    submitLabel: string;
    retryLabel: string;
    footnote: string;
    successTitle: string;
    successText: string;
  };
}
