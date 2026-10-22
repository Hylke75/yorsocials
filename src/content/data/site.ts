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
  cmsSiteId: '4c6177cb-9c9b-4a18-8e90-4fe29c4410f1',
  newsletter: {
    endpoint: 'https://gfnxbkketubsevavlegj.supabase.co/functions/v1/aanmelden',
    slug: 'yorsocials-nieuwsbrief',
  },
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
    intro: 'Hoe YorSocials omgaat met persoonsgegevens die via deze website binnenkomen.',
    version: '1.0',
    lastReviewed: '22 oktober 2026',
    sections: [
      {
        heading: 'Wie is verantwoordelijk?',
        body: [
          'YorSocials is verantwoordelijk voor de verwerking van persoonsgegevens via deze website (www.yorsocials.nl). Heb je een vraag over je gegevens of wil je een van je rechten uitoefenen? Neem contact met ons op via het contactformulier op /contact. We reageren binnen vier weken.',
        ],
      },
      {
        heading: 'Welke gegevens verwerken we en waarom?',
        body: [
          'Contactformulier. Als je het contactformulier invult, verwerken we je naam, e-mailadres, (optioneel) bedrijfsnaam, het onderwerp van je vraag, je bericht en de pagina waarop je het formulier invulde. We gebruiken dit om je vraag te beantwoorden en, als je dat wilt, een samenwerking voor te bereiden. Grondslag: het nemen van maatregelen op jouw verzoek voorafgaand aan een overeenkomst, en ons gerechtvaardigd belang om vragen te beantwoorden.',
          'Nieuwsbrief. Als je je aanmeldt voor de nieuwsbrief, verwerken we je e-mailadres, optioneel je voornaam, het moment van aanmelden en bevestigen en, als die in de link stond, de campagnebron (utm-gegevens) waarmee je op de site kwam. Je ontvangt eerst een bevestigingsmail; pas na een klik op de bevestigingslink sta je op de lijst (double opt-in). We gebruiken deze gegevens alleen om je de nieuwsbrief te sturen. Grondslag: jouw toestemming. Je kunt je altijd afmelden via de link onderaan elke nieuwsbrief; daarmee trek je je toestemming in.',
          'Websitebezoek. Bij elk bezoek verwerkt onze hostingpartij technische gegevens zoals je IP-adres, het type browser en de opgevraagde pagina. Dat is nodig om de website te kunnen tonen en te beveiligen, bijvoorbeeld tegen misbruik van formulieren. Grondslag: ons gerechtvaardigd belang bij een veilige, goed werkende website.',
          'We gebruiken je gegevens niet voor geautomatiseerde besluitvorming of profilering, en we verkopen ze niet.',
        ],
      },
      {
        heading: 'Cookies en statistieken',
        body: [
          'Deze website plaatst geen tracking-, marketing- of advertentiecookies. We gebruiken alleen een functionele cookie die onthoudt of je de nieuwsbrief-pop-up hebt gesloten. Als we bezoekersstatistieken bijhouden, doen we dat met Plausible Analytics: zonder cookies en zonder persoonsgegevens. Meer hierover lees je in ons cookiebeleid op /juridisch/cookies.',
        ],
      },
      {
        heading: 'Hoe lang bewaren we je gegevens?',
        body: [
          'Berichten via het contactformulier bewaren we tot twee jaar na het laatste contact, tenzij er een samenwerking uit voortkomt; dan gelden de wettelijke bewaartermijnen voor onze administratie (zeven jaar).',
          'Je gegevens voor de nieuwsbrief bewaren we zolang je bent ingeschreven. Meld je je af, dan verwijderen we je gegevens uit de verzendlijst; we bewaren alleen je e-mailadres op een afmeldlijst, zodat je niet per ongeluk opnieuw mail van ons krijgt. Een aanmelding die je niet bevestigt, gebruiken we niet.',
          'Technische gegevens van websitebezoek bewaart onze hostingpartij kort, voor beveiliging en foutopsporing.',
        ],
      },
      {
        heading: 'Met wie delen we je gegevens?',
        body: [
          'We delen je gegevens alleen met partijen die ze in onze opdracht verwerken (verwerkers). Met hen hebben we afspraken gemaakt over beveiliging en geheimhouding, en ze mogen je gegevens niet voor eigen doeleinden gebruiken.',
          'Mailento verzorgt onze nieuwsbrief: de aanmelding, de bevestigingsmail, het versturen van de nieuwsbrief en het afmelden.',
          'Link & Lead beheert het contentmanagementsysteem van deze website, waarin berichten via het contactformulier binnenkomen.',
          'Vercel host deze website.',
          'Supabase levert de database- en opslagdiensten waarop het contentmanagementsysteem en de nieuwsbriefdienst draaien.',
          'Sommige van deze leveranciers zijn gevestigd in de Verenigde Staten of kunnen gegevens daar verwerken. Gebeurt dat, dan alleen met passende waarborgen, zoals het EU-VS Data Privacy Framework of de standaardcontractbepalingen van de Europese Commissie.',
          'Verder geven we je gegevens alleen aan anderen als de wet ons daartoe verplicht.',
        ],
      },
      {
        heading: 'Jouw rechten',
        body: [
          'Je hebt het recht om je gegevens in te zien, te laten corrigeren of te laten verwijderen. Je kunt ook vragen de verwerking te beperken, bezwaar maken tegen verwerking op basis van gerechtvaardigd belang, en je gegevens in een gangbaar formaat ontvangen (overdraagbaarheid). Heb je toestemming gegeven, dan kun je die altijd intrekken.',
          'Een verzoek kun je indienen via het contactformulier op /contact. We kunnen je vragen om je identiteit te bevestigen, zodat we gegevens niet aan de verkeerde persoon geven. We reageren binnen vier weken.',
          'Ben je het niet eens met hoe we met je gegevens omgaan? Laat het ons weten, dan zoeken we samen een oplossing. Je hebt ook altijd het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).',
        ],
      },
      {
        heading: 'Beveiliging',
        body: [
          'We nemen passende technische en organisatorische maatregelen om je gegevens te beschermen. De website gebruikt altijd een versleutelde verbinding (HTTPS), formulieren zijn beveiligd tegen misbruik en spam, en alleen bevoegde personen hebben toegang tot de gegevens.',
        ],
      },
      {
        heading: 'Wijzigingen',
        body: [
          'We kunnen deze privacyverklaring aanpassen, bijvoorbeeld als onze dienstverlening of de wet verandert. De datum bovenaan laat zien wanneer de tekst voor het laatst is bijgewerkt.',
        ],
      },
    ],
    seo: {
      title: 'Privacyverklaring',
      description: 'Lees hoe YorSocials omgaat met je gegevens via het contactformulier, de nieuwsbrief (Mailento) en je websitebezoek.',
    },
    status: 'published',
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
        heading: 'Functionele cookies',
        body: [
          'Als je de nieuwsbrief-pop-up sluit of je aanmeldt, onthouden we dat in een functionele cookie (ys_newsletter), zodat je de pop-up niet steeds opnieuw ziet. Deze cookie bevat geen persoonsgegevens en is 30 dagen (na sluiten) of een jaar (na aanmelden) geldig.',
          'Voor andere pop-ups (bijvoorbeeld een aankondiging) onthouden we in de lokale opslag van je browser hoe vaak en wanneer je ze hebt gezien (ys_popup_sessie, ys_popup_paginas, ys_popup_pauze). Ook dat bevat geen persoonsgegevens en verlaat je browser niet.',
        ],
      },
      {
        heading: 'Statistieken zonder cookies',
        body: [
          'Voor bezoekersstatistieken gebruiken we (indien ingeschakeld) Plausible Analytics. Plausible plaatst geen cookies en verwerkt geen persoonsgegevens; we zien alleen geanonimiseerde totalen.',
        ],
      },
      { heading: 'Marketingcookies', body: ['Er worden geen marketing- of advertentiecookies geplaatst.'] },
    ],
    seo: { title: 'Cookiebeleid (concept)', description: 'Cookiebeleid van YorSocials.', noIndex: true },
    status: 'draft',
  },
];
