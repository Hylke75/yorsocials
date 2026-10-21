import type { FaqItem, LegalPage, SiteSettings, TeamMember } from '../types';
import { logo } from './media';

/**
 * Site-instellingen. Contactgegevens, socials, boekingslink en juridische entiteit zijn
 * NOG NIET aangeleverd en staan daarom op null/leeg. Templates tonen dan geen gegevens
 * in plaats van verzonnen gegevens.
 */
export const siteSettings: SiteSettings = {
  name: 'YorSocials',
  tagline: 'Social die opvalt. Content die blijft.',
  logo,
  socialLinks: [],
  email: null,
  phone: null,
  bookingUrl: null,
  legalEntity: null,
  defaultSeo: {
    title: 'YorSocials — Social die opvalt. Content die blijft.',
    description:
      'YorSocials is een social-first creative agency voor strategie, content, video, paid social, community management en analyse.',
  },
};

/** Teamleden worden pas gepubliceerd met echte portretten én toestemming. Nu: leeg. */
export const team: TeamMember[] = [];

export const values = [
  { icon: 'sparkles' as const, title: 'Creativiteit', description: 'We zoeken ideeën die onderscheid maken en bij je merk passen.' },
  { icon: 'handshake' as const, title: 'Samenwerking', description: 'Korte lijnen, duidelijke afspraken en één gedeelde ambitie.' },
  { icon: 'trend' as const, title: 'Inzicht', description: 'We gebruiken resultaten om samen betere keuzes te maken.' },
];

export const faqs: FaqItem[] = [
  {
    id: 'wat-doet-yorsocials',
    question: 'Wat doet YorSocials precies?',
    answer:
      'YorSocials helpt merken met social strategie, contentproductie, video, advertenties, community management en analyse. Je kunt één onderdeel afnemen of een combinatie.',
    category: 'Algemeen',
    order: 1,
    status: 'published',
  },
  {
    id: 'losse-dienst',
    question: 'Kan ik één dienst afnemen?',
    answer:
      'Ja, je kunt een losse dienst afnemen of meerdere onderdelen combineren. Concrete pakketten en voorwaarden bespreken we in een voorstel op maat.',
    category: 'Samenwerken',
    order: 2,
    status: 'published',
  },
  {
    id: 'kennismaking',
    question: 'Hoe ziet een kennismaking eruit?',
    answer:
      'We bespreken je merk, doelen en uitdagingen. Daarna kijken we samen welke aanpak aansluit. Een kennismaking is vrijblijvend.',
    category: 'Samenwerken',
    order: 3,
    status: 'published',
  },
  {
    id: 'resultaten-meten',
    question: 'Hoe worden resultaten gemeten?',
    answer:
      'Bij de start spreken we samen relevante KPI’s af. De rapportage is afgestemd op je doelstellingen en op de beschikbare platformdata.',
    category: 'Werkwijze',
    order: 4,
    status: 'published',
  },
  {
    id: 'kosten',
    question: 'Wat kost samenwerken?',
    answer:
      'Dat hangt af van je doelen en de onderdelen die je afneemt. Via het contactformulier kun je een voorstel op maat aanvragen.',
    category: 'Samenwerken',
    order: 5,
    status: 'published',
  },
];

const legalDraftNote =
  'Deze tekst is een structuurvoorbeeld en géén juridisch advies. Een bevoegde partij moet de definitieve tekst vaststellen op basis van de werkelijke verwerkingen, leveranciers en bewaartermijnen.';

export const legalPages: LegalPage[] = [
  {
    slug: 'privacy',
    title: 'Privacyverklaring',
    eyebrow: 'Informatie',
    intro: legalDraftNote,
    version: '0.1-concept',
    lastReviewed: null,
    sections: [
      { heading: 'Verwerkingsverantwoordelijke', body: ['[Officiële bedrijfsnaam, KvK-nummer, vestigingsadres en contactgegevens — nog aan te leveren.]'] },
      {
        heading: 'Welke gegevens verwerken we?',
        body: [
          'Via het contactformulier: naam, e-mailadres, (optioneel) bedrijfsnaam, het gekozen onderwerp en je bericht.',
          '[Aanvullen met alle andere daadwerkelijke verwerkingen, zoals analytics na toestemming.]',
        ],
      },
      { heading: 'Doelen en grondslagen', body: ['[Per verwerking: doel, rechtsgrond (bijv. toestemming of gerechtvaardigd belang) en noodzaak.]'] },
      { heading: 'Bewaartermijnen', body: ['[Per categorie gegevens de bewaartermijn vastleggen.]'] },
      { heading: 'Ontvangers en verwerkers', body: ['[Hostingpartij, e-mail-/CRM-leverancier en analyticsleverancier benoemen, inclusief eventuele doorgifte buiten de EER.]'] },
      { heading: 'Jouw rechten', body: ['[Inzage, correctie, verwijdering, beperking, bezwaar, overdraagbaarheid en klachtrecht bij de Autoriteit Persoonsgegevens; met werkend aanvraagproces.]'] },
      { heading: 'Beveiliging', body: ['[Beschrijving van passende technische en organisatorische maatregelen.]'] },
    ],
    seo: { title: 'Privacyverklaring (concept)', description: 'Conceptstructuur van de privacyverklaring van YorSocials.', noIndex: true },
    status: 'draft',
  },
  {
    slug: 'cookies',
    title: 'Cookiebeleid',
    eyebrow: 'Informatie',
    intro: legalDraftNote,
    version: '0.1-concept',
    lastReviewed: null,
    sections: [
      {
        heading: 'Noodzakelijke cookies',
        body: [
          'We slaan je cookievoorkeur op in een functionele cookie (ys_consent), zodat we je keuze kunnen respecteren. Deze cookie bevat geen persoonsgegevens en is 6 maanden geldig.',
        ],
      },
      {
        heading: 'Analytische cookies',
        body: [
          'Alleen na jouw toestemming laden we analytics om te begrijpen hoe de site wordt gebruikt. Zonder toestemming worden er geen analytische scripts geladen.',
          '[Leverancier, doel, bewaartermijn en privacy-instellingen invullen zodra de analyticskeuze definitief is.]',
        ],
      },
      { heading: 'Marketingcookies', body: ['Momenteel worden er geen marketing- of advertentiecookies geplaatst.'] },
      { heading: 'Toestemming wijzigen of intrekken', body: ['Je kunt je voorkeuren hieronder op elk moment aanpassen of intrekken.'] },
    ],
    seo: { title: 'Cookiebeleid (concept)', description: 'Cookiebeleid en cookievoorkeuren van YorSocials.', noIndex: true },
    status: 'draft',
  },
];
