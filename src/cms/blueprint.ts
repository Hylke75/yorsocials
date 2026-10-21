/**
 * Blauwdruk van de hele YorSocials-site voor het Link & Lead-CMS (`POST /api/cms/sync`).
 * Zet de ingebouwde inhoud (src/content/data) om naar pagina's met blokken, met precies de velden
 * uit de blokregistry van het CMS. Daarna beheert de redacteur alles in het CMS; de ingebouwde
 * inhoud blijft alleen terugval.
 *
 * Niet in de blauwdruk (want niet via sync te beheren of bewust weggelaten):
 * - demo-cases en -artikelen (geen echte klanten/content; komen als records in het CMS);
 * - navigatie, merk, contactgegevens (site-instellingen in het CMS-beheer).
 */
import type { IconName, MediaAsset, ProcessStep, SectionContent } from '@/content/types';
import { getFaqs, getGlobalContent, getLegalPage, getPages, getServices, getValues, getWorkProcess } from '@/content/repository';

export interface BlueprintBlock {
  type: string;
  bg?: string | null;
  content: Record<string, unknown>;
}

export interface BlueprintPage {
  slug: string;
  titel: string;
  beschrijving: string;
  published: boolean;
  page_type?: string;
  blokken: BlueprintBlock[];
}

export interface Blueprint {
  paginas: BlueprintPage[];
}

/** Ons icoon → kiesbaar icoon in het CMS-blok `kaarten`. */
const CMS_ICON: Partial<Record<IconName, string>> = {
  strategy: 'doel',
  camera: 'vonk',
  play: 'vonk',
  megaphone: 'post',
  community: 'gesprek',
  trend: 'groei',
  sparkles: 'vonk',
  handshake: 'schakel',
  lightbulb: 'vonk',
  target: 'doel',
  compass: 'kompas',
  messages: 'gesprek',
};

const BOOKING = '/contact#formulier';

export function buildBlueprint(siteUrl: string): Blueprint {
  const base = siteUrl.replace(/\/+$/, '');
  const img = (a?: MediaAsset) => (a ? { url: `${base}${a.src}`, alt: a.alt } : null);
  const pages = getPages();
  const g = getGlobalContent();

  const header = (h: { eyebrow: string; heading: string; description?: string; image?: MediaAsset }, extra: Record<string, unknown> = {}): BlueprintBlock => {
    const image = img(h.image);
    return {
      type: 'header',
      bg: null,
      content: {
        layout: 'achtergrond',
        hoogte: 'normaal',
        eyebrow: h.eyebrow,
        heading: h.heading,
        subheading: h.description ?? '',
        media_type: image ? 'afbeelding' : 'geen',
        ...(image ? { media_afbeelding: image.url, media_alt: image.alt, overlay: 'donker' } : {}),
        auto_kruimelpad: 'aan',
        ...extra,
      },
    };
  };
  const cta = (c: { eyebrow: string; heading: string; body: string }): BlueprintBlock => ({
    type: 'cta',
    bg: null,
    content: { eyebrow: c.eyebrow, titel: c.heading, tekst: c.body, knoptekst: g.bookingLabel, knop: BOOKING },
  });
  const steps = (s: SectionContent, list: ProcessStep[], withImages: boolean): BlueprintBlock => ({
    type: 'flexibel',
    bg: 'mist',
    content: {
      eyebrow: s.eyebrow,
      titel: s.heading,
      intro: s.description ?? '',
      kolommen: '3',
      items: list.map((p, i) => ({
        kop: `${String(i + 1).padStart(2, '0')} · ${p.title}`,
        tekst: p.copy,
        ...(withImages && p.image ? { beeld: img(p.image)?.url, beeld_alt: p.image.alt } : {}),
      })),
    },
  });
  const serviceCards = (s: SectionContent, limit?: number): BlueprintBlock => ({
    type: 'kaarten',
    bg: null,
    content: {
      eyebrow: s.eyebrow,
      titel: s.heading,
      intro: s.description ?? '',
      kolommen: '3',
      items: getServices()
        .slice(0, limit)
        .map((sv) => ({ icoon: CMS_ICON[sv.icon] ?? 'geen', titel: sv.title, tekst: sv.summary, link: `/diensten/${sv.slug}`, knoptekst: g.cardLinks.service })),
    },
  });

  const home = pages.home;
  const paginas: BlueprintPage[] = [
    {
      slug: '/',
      titel: 'Home',
      beschrijving: home.seo.description,
      published: true,
      page_type: 'home',
      blokken: [
        header(home.hero, {
          hoogte: 'fullscreen',
          cta_primair_label: g.bookingLabel,
          cta_primair_link: BOOKING,
          cta_secundair_label: home.heroSecondaryServicesLabel,
          cta_secundair_link: '/diensten',
        }),
        { type: 'marquee', bg: null, content: { stijl: 'limoen', items: g.ticker.map((t) => ({ tekst: t })) } },
        serviceCards(home.services, 3),
        {
          type: 'mediatekst',
          bg: 'mist',
          content: {
            eyebrow: home.approach.eyebrow,
            titel: home.approach.heading,
            alineas: [{ tekst: home.approach.text }],
            beeld: img(home.approach.image)?.url,
            beeld_alt: home.approach.image.alt,
            beeldzijde: 'rechts',
            knop: '/over-ons',
            knoptekst: home.approach.buttonLabel,
          },
        },
        steps(home.process, getWorkProcess(), false),
        { type: 'cases_grid', bg: 'mist', content: { eyebrow: home.cases.eyebrow, titel: home.cases.heading, maximaal: 2, link_naar_overzicht: '/cases' } },
        cta(home.cta),
      ],
    },
    {
      slug: '/diensten',
      titel: pages.services.seo.title,
      beschrijving: pages.services.seo.description,
      published: true,
      blokken: [
        header(pages.services.hero, { cta_primair_label: g.bookingLabel, cta_primair_link: BOOKING }),
        serviceCards(pages.services.overview),
        steps(pages.services.process, getWorkProcess(), true),
        cta(pages.services.cta),
      ],
    },
    ...getServices().map((sv): BlueprintPage => {
      const t = pages.serviceDetail;
      const [first, ...rest] = sv.title.split(' ');
      const heading = rest.length ? `${first} *${rest.join(' ')}.*` : `*${sv.title}.*`;
      const contact = `/contact?onderwerp=${encodeURIComponent(sv.title)}#formulier`;
      return {
        slug: `/diensten/${sv.slug}`,
        titel: sv.seo.title,
        beschrijving: sv.seo.description,
        published: true,
        page_type: 'dienst',
        blokken: [
          header(
            { eyebrow: sv.eyebrow, heading, description: sv.summary, image: sv.heroImage },
            { hoogte: 'compact', cta_primair_label: g.bookingLabel, cta_primair_link: BOOKING, cta_secundair_label: t.askQuestionLabel, cta_secundair_link: contact },
          ),
          {
            type: 'mediatekst',
            bg: null,
            content: { eyebrow: t.problem.eyebrow, titel: t.problem.heading, alineas: [{ tekst: sv.intro }], punten: sv.problem.map((p) => ({ tekst: p })) },
          },
          {
            type: 'mediatekst',
            bg: 'mist',
            content: {
              eyebrow: t.offer.eyebrow,
              titel: t.offer.heading,
              alineas: [{ tekst: t.offer.text }],
              punten: sv.deliverables.map((d) => ({ tekst: d })),
              beeld: img(sv.heroImage)?.url,
              beeld_alt: sv.heroImage.alt,
              beeldzijde: 'rechts',
              knop: contact,
              knoptekst: t.offer.buttonLabel,
            },
          },
          steps(t.process, sv.process, false),
          ...(sv.faqs.length ? [{ type: 'faq', bg: 'mist', content: { titel: t.faq.heading, vragen: sv.faqs.map((f) => ({ vraag: f.question, antwoord: f.answer })) } }] : []),
          cta(t.cta),
        ],
      };
    }),
    {
      slug: '/cases',
      titel: pages.cases.seo.title,
      beschrijving: pages.cases.seo.description,
      published: true,
      blokken: [header(pages.cases.hero, { hoogte: 'compact' }), { type: 'cases_grid', bg: null, content: { titel: '', maximaal: 99 } }, cta(pages.cases.cta)],
    },
    {
      slug: '/over-ons',
      titel: pages.about.seo.title,
      beschrijving: pages.about.seo.description,
      published: true,
      blokken: [
        header(pages.about.hero, { cta_primair_label: g.bookingLabel, cta_primair_link: BOOKING }),
        {
          type: 'mediatekst',
          bg: null,
          content: {
            eyebrow: pages.about.story.eyebrow,
            titel: pages.about.story.heading,
            alineas: [{ tekst: pages.about.story.text }],
            beeld: img(pages.about.story.image)?.url,
            beeld_alt: pages.about.story.image.alt,
            beeldzijde: 'links',
          },
        },
        {
          type: 'kaarten',
          bg: 'mist',
          content: {
            eyebrow: pages.about.values.eyebrow,
            titel: pages.about.values.heading,
            kolommen: '3',
            items: getValues().map((v) => ({ icoon: CMS_ICON[v.icon] ?? 'geen', titel: v.title, tekst: v.description })),
          },
        },
        steps(pages.about.process, getWorkProcess(), false),
        { type: 'mensen', bg: 'mist', content: { titel: pages.about.team.heading, intro: '' } },
        cta(pages.about.cta),
      ],
    },
    {
      slug: '/artikelen',
      titel: pages.articles.seo.title,
      beschrijving: pages.articles.seo.description,
      published: true,
      blokken: [header(pages.articles.hero, { hoogte: 'compact' }), { type: 'artikelen_grid', bg: null, content: { titel: '', maximaal: 99 } }, cta(pages.articles.cta)],
    },
    {
      slug: '/contact',
      titel: pages.contact.seo.title,
      beschrijving: pages.contact.seo.description,
      published: true,
      page_type: 'contact',
      blokken: [
        header(pages.contact.hero, { hoogte: 'compact' }),
        {
          type: 'formulier_bouwer',
          bg: null,
          content: {
            eyebrow: pages.contact.intro.eyebrow,
            titel: pages.contact.intro.heading,
            intro: pages.contact.intro.text,
            velden: [
              { label: g.contactForm.nameLabel, type: 'tekst', verplicht: 'ja' },
              { label: g.contactForm.companyLabel, type: 'bedrijf', verplicht: 'nee' },
              { label: g.contactForm.topicLabel, type: 'keuze', opties: g.contactForm.topics.join(', '), verplicht: 'ja' },
              { label: g.contactForm.messageLabel, type: 'tekstvak', verplicht: 'ja' },
            ],
            knoptekst: g.contactForm.submitLabel,
            bevestigingstekst: g.contactForm.successText,
            voetnoot: `${g.contactForm.privacyLabel} [${g.contactForm.privacyLinkLabel}](/juridisch/privacy).`,
          },
        },
        {
          type: 'kaarten',
          bg: 'mist',
          content: {
            eyebrow: pages.contact.expectations.eyebrow,
            titel: pages.contact.expectations.heading,
            intro: pages.contact.expectations.description ?? '',
            kolommen: '3',
            items: pages.contact.steps.map((s) => ({ icoon: CMS_ICON[s.icon] ?? 'geen', titel: s.title, tekst: s.copy })),
          },
        },
      ],
    },
    {
      slug: '/faq',
      titel: pages.faq.seo.title,
      beschrijving: pages.faq.seo.description,
      published: true,
      blokken: [
        header(pages.faq.hero, { hoogte: 'compact' }),
        { type: 'faq', bg: null, content: { titel: '', vragen: getFaqs().map((f) => ({ vraag: f.question, antwoord: f.answer })) } },
        cta(pages.faq.cta),
      ],
    },
    ...(['privacy', 'cookies'] as const).map((slug): BlueprintPage => {
      const p = getLegalPage(slug);
      return {
        slug: `/juridisch/${slug}`,
        titel: p.title,
        beschrijving: p.seo.description,
        published: true,
        page_type: 'juridisch',
        blokken: [
          header({ eyebrow: p.eyebrow, heading: p.title }, { hoogte: 'compact' }),
          ...p.sections.map((s) => ({ type: 'tekst', bg: null, content: { titel: s.heading, tekst: s.body.join('\n\n'), ...(p.lastReviewed ? { bijgewerkt: p.lastReviewed } : {}) } })),
        ],
      };
    }),
  ];
  return { paginas };
}
