import type { CtaContent, PagesContent } from '../types';
import { media } from './media';

/**
 * Teksten per pagina (en per template voor detailpagina's). Koppen: `*accent*` en \n voor een
 * nieuwe regel. Diensten, cases, artikelen, FAQ en team zelf staan in hun eigen bestanden.
 */

const defaultCta: CtaContent = {
  eyebrow: 'Klaar om te groeien?',
  heading: 'Laten we iets *sterks* neerzetten.',
  body: 'Of je nu net begint of al een gevestigd merk bent: we denken graag met je mee. Een helder gesprek is de beste eerste stap.',
};

export const pages: PagesContent = {
  home: {
    seo: {
      title: '',
      description:
        'YorSocials is een social-first creative agency voor strategie, content, video, paid social, community management en analyse.',
    },
    hero: {
      eyebrow: 'Social-first creative agency',
      heading: 'Social die opvalt.\n*Content die blijft.*',
      description: 'Strategie, content en campagnes voor merken die willen opvallen. Persoonlijk, creatief en gericht op wat écht telt.',
      image: media.hero,
      annotation: ['Van idee', 'naar impact.'],
    },
    heroSecondaryCasesLabel: 'Bekijk onze cases',
    heroSecondaryServicesLabel: 'Bekijk onze services',
    services: {
      eyebrow: 'Onze services',
      heading: 'Alles voor jouw *social groei.*',
      description: 'Van het eerste idee tot de laatste optimalisatie: één samenhangende aanpak.',
    },
    allServicesLabel: 'Bekijk alle {count} diensten',
    approach: {
      eyebrow: 'Onze aanpak',
      heading: 'Goede content.\n*Slimme keuzes.*',
      text: 'We verbinden sterke ideeën aan een heldere strategie. Zo werk je aan herkenning, betrokkenheid en groei — stap voor stap en meetbaar.',
      image: media.shoot,
      buttonLabel: 'Leer ons kennen',
    },
    process: { eyebrow: 'Zo werken we', heading: 'Van idee naar *impact.*' },
    cases: { eyebrow: 'Werk dat raakt', heading: 'Resultaten beginnen met *een goed verhaal.*' },
    casesDemoNotice: 'Onderstaande cases zijn demonstratievoorbeelden, geen geverifieerde klantcases.',
    allCasesLabel: 'Bekijk alle cases',
    cta: defaultCta,
  },

  services: {
    seo: {
      title: 'Services',
      description: 'Social strategie, content creatie, video & Reels, paid social, community management en analyse: de services van YorSocials.',
    },
    hero: {
      eyebrow: 'Wat we doen',
      heading: 'Onze *services.*',
      description:
        'Van strategie en productie tot campagnes en optimalisatie. We zetten de juiste disciplines in om jouw merk verder te brengen — alles onder één dak.',
      image: media.hero,
      annotation: ['Strategie. Content.', 'Groei.'],
    },
    overview: {
      eyebrow: 'Onze expertises',
      heading: 'Creatieve oplossingen voor *jouw groei.*',
      description: 'Kies één dienst of combineer er meerdere. Elke dienst is uit te breiden naarmate je merk groeit.',
    },
    process: {
      eyebrow: 'Zo werkt YorSocials',
      heading: 'Van idee naar *impact.*',
      description: 'Een helder proces, een sterk resultaat. Zo gaan we samen aan de slag.',
    },
    cta: {
      eyebrow: 'Klaar om te groeien?',
      heading: 'Plan een *kennismaking.*',
      body: 'Ontdek wat we voor jouw merk kunnen betekenen. In een vrijblijvende kennismaking bespreken we je doelen, kansen en een passende aanpak.',
    },
  },

  serviceDetail: {
    askQuestionLabel: 'Stel een vraag',
    problem: { eyebrow: 'Herken je dit?', heading: 'Waar we je *mee helpen.*' },
    offer: {
      eyebrow: 'Wat je kunt verwachten',
      heading: 'Van plan naar *praktijk.*',
      text: 'Geen standaardpakket. We kijken welke onderdelen aansluiten bij jouw doelen en werken vanuit een herkenbare merkidentiteit. Concreet kun je rekenen op:',
      buttonLabel: 'Bespreek jouw plannen',
    },
    process: { eyebrow: 'Werkwijze', heading: 'Zo pakken we *het aan.*' },
    faq: { eyebrow: 'Veelgestelde vragen', heading: 'Goed om te *weten.*', allQuestionsLabel: 'Alle vragen' },
    articles: { eyebrow: 'Kennis', heading: 'Lees *verder.*' },
    otherServices: { eyebrow: 'Andere expertises', heading: 'Dit kunnen we ook *voor je doen.*' },
    cta: defaultCta,
  },

  cases: {
    seo: { title: 'Cases', description: 'Bekijk hoe YorSocials merken helpt met strategie, content en campagnes. Filter op sector.' },
    hero: {
      eyebrow: 'Ons werk',
      heading: 'Onze *cases.*',
      description:
        'Werk dat het merkverhaal versterkt en de juiste mensen bereikt. We publiceren alleen cases met toestemming van de klant en controleerbare resultaten.',
      image: media.fitness,
      annotation: ['Van content', 'naar resultaat.'],
    },
    demoNotice:
      'Conceptportfolio: dit zijn voorbeeldcases zonder echte klanten of resultaten. Merknamen, cijfers en quotes worden pas toegevoegd na toestemming en verificatie.',
    empty: {
      title: 'Binnenkort: onze cases',
      description:
        'We werken aan een selectie cases die we met toestemming van onze klanten kunnen delen. Benieuwd wat we voor jouw merk kunnen doen?',
    },
    filterLabel: 'Filter op sector',
    filterAllLabel: 'Alle cases',
    filterEmptyTitle: 'Nog geen cases in {sector}',
    filterEmptyDescription:
      'We voegen hier cases toe zodra ze met toestemming van de klant gepubliceerd kunnen worden. Benieuwd wat we voor jouw merk kunnen doen?',
    cta: { ...defaultCta, eyebrow: 'Klaar om jouw verhaal te schrijven?' },
  },

  caseDetail: {
    demoBadge: 'Demonstratiecase — geen echte klantopdracht',
    demoNotice:
      'Deze pagina toont de beoogde opbouw van een case: beginsituatie, doel, aanpak, materiaal en geverifieerde resultaten. Teksten zijn placeholders.',
    contextEyebrow: 'De vraag',
    contextHeading: 'Context',
    objectiveEyebrow: 'Het doel',
    objectiveHeading: 'Doelstelling',
    approach: { eyebrow: 'De aanpak', heading: 'Wat we *deden.*' },
    outputsHeading: 'Opgeleverd',
    gallery: { eyebrow: 'Materiaal', heading: 'Beeld uit het *project.*' },
    results: { eyebrow: 'Het resultaat', heading: 'Wat het *opleverde.*' },
    resultsEmpty:
      'Voor deze case zijn (nog) geen geverifieerde resultaten gepubliceerd. Cijfers worden alleen getoond met bron, meetperiode en akkoord van de klant.',
    relatedServices: { eyebrow: 'Ingezette diensten', heading: 'Hiermee *werkten we.*' },
    backLabel: 'Alle cases',
    cta: defaultCta,
  },

  about: {
    seo: { title: 'Over ons', description: 'Maak kennis met YorSocials: een creatieve partner die strategie en productie samenbrengt.' },
    hero: {
      eyebrow: 'Dit zijn wij',
      heading: 'Meer dan *content.*',
      description:
        'Een betrokken creatieve partner die strategie en productie samenbrengt. We houden van ideeën die niet alleen mooi zijn, maar ook iets teweegbrengen.',
      image: media.creator,
      annotation: ['Creatieve denkers.', 'Doeners.'],
    },
    story: {
      eyebrow: 'Ons verhaal',
      heading: 'Van passie naar *impact.*',
      text: 'We geloven dat goede social media begint met aandacht: voor mensen, voor merken en voor wat een verhaal bijzonder maakt. Daarom combineren we strategie, creatie en data in één team.',
      image: media.shoot,
    },
    storyDraftNotice: 'Conceptcopy. Het echte ontstaansverhaal, de medewerkers en portretten moeten nog door YorSocials worden aangeleverd.',
    values: { eyebrow: 'Waar we voor staan', heading: 'Creatief. Persoonlijk. *Doelgericht.*' },
    process: { eyebrow: 'Werkwijze', heading: 'Van strategie tot shoot. *Alles in-huis.*' },
    team: { eyebrow: 'Het team', heading: 'De mensen achter *YorSocials.*' },
    teamEmptyNotice:
      'Teamleden worden hier getoond zodra er echte portretten, rollen en publicatietoestemming zijn aangeleverd. Er wordt geen fictief team getoond. (Deze melding is alleen zichtbaar in staging.)',
    cta: defaultCta,
  },

  articles: {
    seo: { title: 'Artikelen', description: 'Praktische inzichten over social strategie, content en campagnes van YorSocials.' },
    hero: {
      eyebrow: 'Kennis & inspiratie',
      heading: 'Ideeën die *verder helpen.*',
      description: 'Praktische inzichten over social strategie, content en campagnes.',
      image: media.strategy,
    },
    demoNotice: 'Voorbeeldartikelen: redactioneel nog niet gecontroleerd en zonder auteur of publicatiedatum.',
    empty: {
      title: 'Binnenkort verschijnen hier artikelen',
      description: 'We werken aan praktische artikelen over social strategie, content en campagnes.',
    },
    categoriesLabel: 'Categorieën',
    cta: defaultCta,
  },

  articleDetail: {
    demoBadge: 'Voorbeeldartikel',
    demoNotice: 'Voorbeeldartikel voor de ontwerpfase. Voor publicatie redactioneel beoordelen, auteur en datum toevoegen en bronnen vermelden.',
    byline: 'Door {name}, {role}',
    noAuthor: 'Auteur nog toe te voegen',
    notPublished: 'Nog niet gepubliceerd',
    backLabel: 'Alle artikelen',
    services: { eyebrow: 'Relevante diensten', heading: 'Hulp nodig *hierbij?*' },
    related: { eyebrow: 'Lees ook', heading: 'Meer *inzichten.*' },
    cta: defaultCta,
  },

  contact: {
    seo: { title: 'Contact', description: 'Vertel ons over je merk en plannen. Neem contact op met YorSocials of plan een kennismaking.' },
    hero: {
      eyebrow: 'Samen aan de slag',
      heading: 'Let’s *talk.*',
      description: 'Vertel ons over je merk en je plannen. We denken graag met je mee over strategie, content en campagnes.',
      image: media.hero,
      annotation: ['Jouw merk.', 'Onze missie.'],
    },
    intro: {
      eyebrow: 'Direct contact',
      heading: 'Goed idee? *Laat van je horen.*',
      text: 'Vul het formulier in en we nemen contact met je op. Je kunt ook direct een kennismaking inplannen zodra onze agenda online staat.',
    },
    missingContactNotice:
      'E-mailadres, telefoonnummer, social-profielen en agenda-URL moeten nog door YorSocials worden bevestigd. Tot die tijd tonen we ze niet.',
    emailLabel: 'E-mail',
    phoneLabel: 'Telefoon',
    booking: {
      title: 'Een kennismaking inplannen?',
      textWithUrl: 'Kies zelf een moment dat jou past in onze agenda.',
      textWithoutUrl:
        'Online inplannen is binnenkort mogelijk. Laat via het formulier weten wanneer het je uitkomt, dan stellen we een moment voor.',
      buttonLabel: 'Open de agenda',
    },
    expectations: {
      eyebrow: 'Wat kun je verwachten?',
      heading: 'Van een goed gesprek naar *concrete plannen.*',
      description: 'Een kennismaking is vrijblijvend en bedoeld om elkaar te leren kennen.',
    },
    steps: [
      { icon: 'messages', title: 'Kennismaking', copy: 'We luisteren naar jouw merk, doelen en uitdagingen.' },
      { icon: 'lightbulb', title: 'Een eerste richting', copy: 'We bespreken kansen en aandachtspunten en geven eerlijk advies.' },
      { icon: 'strategy', title: 'Een voorstel', copy: 'Als het past, werken we een concrete aanpak voor je uit.' },
    ],
  },

  faq: {
    seo: { title: 'Veelgestelde vragen', description: 'Antwoorden op praktische vragen over de werkwijze en samenwerking met YorSocials.' },
    hero: {
      eyebrow: 'Goed om te weten',
      heading: 'Veelgestelde *vragen.*',
      description: 'Antwoorden op praktische vragen over onze werkwijze en samenwerking.',
      image: media.strategy,
    },
    empty: { title: 'Nog geen vragen', description: 'Heb je een vraag? Neem gerust contact met ons op.' },
    cta: {
      eyebrow: 'Staat je vraag er niet tussen?',
      heading: 'Vraag het *ons gewoon.*',
      body: 'We denken graag met je mee en geven een eerlijk antwoord, ook als we niet de juiste partij voor je zijn.',
    },
  },

  notFound: {
    title: 'Pagina niet gevonden',
    hero: {
      eyebrow: 'Deze pagina bestaat niet',
      heading: 'Oops. *404.*',
      description: 'De pagina die je zoekt is niet (meer) beschikbaar. Gelukkig is de weg naar een goed idee nooit ver.',
      image: media.hero,
    },
    homeLabel: 'Terug naar home',
    contactLabel: 'Neem contact op',
  },
};
