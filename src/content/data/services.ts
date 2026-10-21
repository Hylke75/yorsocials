import type { ProcessStep, Service } from '../types';
import { media } from './media';

/**
 * Dienstenaanbod. Status: ontwerpvoorstel uit het functioneel ontwerp — de definitieve
 * commerciële propositie moet nog door YorSocials worden bevestigd (zie docs/ONTBREKENDE_CONTENT.md).
 * Teksten bevatten bewust geen cijfers, klantnamen of beloftes over resultaten.
 */

const defaultProcess: ProcessStep[] = [
  { title: 'Kennismaking', copy: 'We leren je merk, doelgroep en ambities kennen.' },
  { title: 'Richting', copy: 'We vertalen doelen naar een concreet plan en afspraken.' },
  { title: 'Uitvoering', copy: 'We maken, plannen en publiceren in een vast ritme.' },
  { title: 'Leren', copy: 'We kijken samen naar de cijfers en sturen bij.' },
];

export const services: Service[] = [
  {
    slug: 'social-strategie',
    number: '01',
    title: 'Social strategie',
    eyebrow: 'Expertise / 01',
    icon: 'strategy',
    summary: 'Van merkverhaal tot contentkalender. Een koers die creativiteit en groeidoelen verbindt.',
    intro:
      'Een sterke social aanpak begint niet bij een post, maar bij keuzes: voor wie maak je content, waarom zou iemand stoppen met scrollen en wat wil je bereiken? Samen leggen we die basis vast.',
    problem: [
      'Je post regelmatig, maar weet niet goed wat het oplevert.',
      'Elk kanaal voelt als een los eiland zonder rode draad.',
      'Ideeën genoeg, maar geen helder plan om op te bouwen.',
    ],
    heroImage: media.strategy,
    deliverables: ['Merkpositionering op social', 'Doelgroep- en kanaalkeuze', 'Contentpijlers en formats', 'Meetplan en doelen'],
    process: [
      { title: 'Analyse', copy: 'We brengen je huidige kanalen, doelgroep en concurrentie in kaart.' },
      { title: 'Positionering', copy: 'We bepalen hoe je merk zich op social onderscheidt.' },
      { title: 'Plan', copy: 'Pijlers, formats en een kalender geven richting aan de uitvoering.' },
      { title: 'Meten', copy: 'We spreken KPI’s af die passen bij je doelen.' },
    ],
    faqs: [
      {
        id: 'strategie-duur',
        question: 'Hoe lang duurt het om een strategie op te stellen?',
        answer: 'Dat hangt af van de omvang van je merk en kanalen. In de kennismaking maken we een realistische planning.',
      },
      {
        id: 'strategie-uitvoering',
        question: 'Kan ik de strategie zelf uitvoeren?',
        answer: 'Ja. De strategie is zo opgezet dat je eigen team ermee aan de slag kan. Uitvoering door YorSocials is optioneel.',
      },
    ],
    seo: {
      title: 'Social strategie',
      description: 'Een social media strategie die merkverhaal, doelgroep, contentpijlers en meetbare doelen verbindt.',
    },
    status: 'published',
  },
  {
    slug: 'content-creatie',
    number: '02',
    title: 'Content creatie',
    eyebrow: 'Expertise / 02',
    icon: 'camera',
    summary: 'Ideeën die opvallen, herkenbaar blijven en passen bij jouw merk.',
    intro:
      'Goede content voelt vanzelfsprekend, maar is het resultaat van een scherp idee en een strakke productie. Van concept tot oplevering zorgen we dat elk stuk content klopt bij je merk en je kanaal.',
    problem: [
      'Je content ziet er netjes uit, maar valt niet op in de feed.',
      'Er is te weinig tijd om consequent nieuwe content te maken.',
      'Elk stuk content voelt anders; de herkenbaarheid ontbreekt.',
    ],
    heroImage: media.shoot,
    deliverables: ['Creatief concept', 'Foto- en videoproductie', 'Productieplanning', 'Social-first uitwerking per kanaal'],
    process: defaultProcess,
    faqs: [
      {
        id: 'content-locatie',
        question: 'Waar vinden de opnames plaats?',
        answer: 'Op locatie bij jou, op een passende externe locatie of in een studio. Dat stemmen we per productie af.',
      },
      {
        id: 'content-rechten',
        question: 'Wie is eigenaar van de gemaakte content?',
        answer: 'Gebruiksrechten worden vooraf schriftelijk vastgelegd in het voorstel.',
      },
    ],
    seo: {
      title: 'Content creatie',
      description: 'Social-first foto- en videocontent: van creatief concept en productieplanning tot uitwerking per kanaal.',
    },
    status: 'published',
  },
  {
    slug: 'video-reels',
    number: '03',
    title: 'Video & Reels',
    eyebrow: 'Expertise / 03',
    icon: 'play',
    summary: 'Video’s die meteen de aandacht pakken en een verhaal vertellen.',
    intro:
      'In de eerste seconden beslist je kijker of hij blijft. We ontwikkelen korte video’s en herkenbare formats die snel to the point komen en je merk laten zien zoals het is.',
    problem: [
      'Je video’s worden weinig uitgekeken.',
      'Je wilt met Reels of TikTok starten, maar weet niet hoe.',
      'Elke video is een los project in plaats van een herkenbaar format.',
    ],
    heroImage: media.creator,
    deliverables: ['Concept en scripts', 'Short-form video', 'Editing en motion', 'Optimalisatie per platform'],
    process: defaultProcess,
    faqs: [
      {
        id: 'video-ondertiteling',
        question: 'Worden video’s ondertiteld?',
        answer: 'Ja, we leveren video’s standaard met ondertiteling aan, zodat ze ook zonder geluid en voor iedereen te volgen zijn.',
      },
      {
        id: 'video-formaat',
        question: 'Voor welke platforms maken jullie video?',
        answer: 'We stemmen formaat, lengte en stijl af op de kanalen die in jouw strategie centraal staan.',
      },
    ],
    seo: {
      title: 'Video & Reels',
      description: 'Short-form video en Reels-formats: concept, script, opname, editing en optimalisatie per platform.',
    },
    status: 'published',
  },
  {
    slug: 'paid-social',
    number: '04',
    title: 'Paid social',
    eyebrow: 'Expertise / 04',
    icon: 'megaphone',
    summary: 'Advertentiecampagnes die bereik vertalen naar waardevolle acties.',
    intro:
      'Met betaalde campagnes bereik je precies de mensen die ertoe doen. We zetten campagnes logisch op, testen creatieve varianten en sturen bij op basis van data.',
    problem: [
      'Je geeft budget uit aan advertenties zonder duidelijk beeld van wat het oplevert.',
      'Je campagnes draaien, maar niemand test welke creatie beter werkt.',
      'Je weet niet welke doelgroepen je moet targeten.',
    ],
    heroImage: media.analytics,
    deliverables: ['Campagnestructuur', 'Doelgroepen en targeting', 'Creatieve varianten', 'Meten en bijsturen'],
    process: defaultProcess,
    faqs: [
      {
        id: 'paid-budget',
        question: 'Welk advertentiebudget heb ik nodig?',
        answer: 'Dat hangt af van je doelen en markt. We adviseren een budget in het voorstel; het mediabudget staat los van onze werkzaamheden.',
      },
      {
        id: 'paid-account',
        question: 'Blijven de advertentieaccounts van mij?',
        answer: 'Ja. Wij werken in jouw accounts, zodat data en historie altijd van jou blijven.',
      },
    ],
    seo: {
      title: 'Paid social',
      description: 'Social advertising met een heldere campagnestructuur, creatieve tests en bijsturing op data.',
    },
    status: 'published',
  },
  {
    slug: 'community-management',
    number: '05',
    title: 'Community management',
    eyebrow: 'Expertise / 05',
    icon: 'community',
    summary: 'Maak van betrokken volgers een levendige community rondom je merk.',
    intro:
      'Social is een gesprek. We zorgen dat reacties en berichten tijdig en in jouw toon beantwoord worden, en halen inzichten uit wat je community vertelt.',
    problem: [
      'Reacties en berichten blijven te lang liggen.',
      'Er is geen vaste toon of richtlijn voor hoe je reageert.',
      'Je mist wat je community eigenlijk tegen je zegt.',
    ],
    heroImage: media.creator,
    deliverables: ['Inbox en reacties', 'Gespreksrichtlijnen en tone of voice', 'Communityactivatie', 'Terugkerende inzichten'],
    process: defaultProcess,
    faqs: [
      {
        id: 'community-tijden',
        question: 'Op welke tijden worden berichten beantwoord?',
        answer: 'Reactietijden en bereikbaarheid leggen we vooraf vast in een serviceafspraak.',
      },
      {
        id: 'community-escalatie',
        question: 'Wat gebeurt er bij lastige of negatieve reacties?',
        answer: 'We stellen samen een escalatieprotocol op, zodat duidelijk is wanneer en hoe jouw team wordt betrokken.',
      },
    ],
    seo: {
      title: 'Community management',
      description: 'Community management: inbox en reacties, gespreksrichtlijnen, activatie en inzichten uit je community.',
    },
    status: 'published',
  },
  {
    slug: 'analyse-optimalisatie',
    number: '06',
    title: 'Analyse & optimalisatie',
    eyebrow: 'Expertise / 06',
    icon: 'trend',
    summary: 'Maak resultaten inzichtelijk en ontdek waar verdere groei zit.',
    intro:
      'Cijfers zijn pas waardevol als je er iets mee doet. We maken inzichtelijk wat werkt, vertalen data naar keuzes en testen gericht verbeteringen.',
    problem: [
      'Je hebt veel data, maar weinig inzicht.',
      'Rapportages zijn een verplichting in plaats van een hulpmiddel.',
      'Je weet niet welke verbeteringen het meest opleveren.',
    ],
    heroImage: media.analytics,
    deliverables: ['KPI-afspraken', 'Campagne- en contentanalyse', 'Heldere rapportage', 'Verbeterexperimenten'],
    process: defaultProcess,
    faqs: [
      {
        id: 'analyse-tools',
        question: 'Met welke tools werken jullie?',
        answer: 'We gebruiken de statistieken van de platforms zelf en sluiten waar nodig aan op jouw bestaande analytics.',
      },
      {
        id: 'analyse-frequentie',
        question: 'Hoe vaak krijg ik een rapportage?',
        answer: 'De frequentie stemmen we af op je doelen; in het voorstel staat wat je wanneer ontvangt.',
      },
    ],
    seo: {
      title: 'Analyse & optimalisatie',
      description: 'Social media analyse en optimalisatie: KPI-afspraken, rapportage en gerichte verbeterexperimenten.',
    },
    status: 'published',
  },
];

/** Algemene werkwijze (services-overzicht en homepage). */
export const workProcess: ProcessStep[] = [
  { title: 'Kennismaking', copy: 'We leren jouw merk, doelen en uitdagingen kennen.', image: media.creator },
  { title: 'Strategie', copy: 'We bepalen richting, doelen en een contentplan op maat.', image: media.strategy },
  { title: 'Creatie', copy: 'We maken content die past bij je merk en kanaal.', image: media.shoot },
  { title: 'Distributie', copy: 'We publiceren organisch en zetten waar zinvol advertenties in.', image: media.hero },
  { title: 'Optimalisatie', copy: 'We meten, leren en verbeteren continu.', image: media.analytics },
];
