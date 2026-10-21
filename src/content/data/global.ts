import type { GlobalContent } from '../types';

/**
 * Terugkerende interfaceteksten: navigatie, knoppen, footer, nieuwsbrief en
 * contactformulier. Validatie-foutmeldingen en teksten die alleen voor screenreaders zijn
 * (zoals "opent in nieuw venster") staan bewust in de code.
 */
export const globalContent: GlobalContent = {
  navigation: [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/cases', label: 'Cases' },
    { href: '/over-ons', label: 'Over ons' },
    { href: '/artikelen', label: 'Artikelen' },
    { href: '/contact', label: 'Contact' },
  ],
  bookingLabel: 'Plan een kennismaking',
  messageLabel: 'Stuur een bericht',
  ticker: ['Strategie', 'Content', 'Campagnes', 'Community', 'Video', 'Analyse'],
  cardLinks: { service: 'Ontdek de dienst', caseStudy: 'Bekijk case', article: 'Lees artikel' },
  serviceNumberLabel: '{number} / Dienst',
  demoBadge: 'Demo',
  stagingBanner:
    'Staging: deze site bevat voorbeeldcontent (demo-cases en -artikelen) die nog niet geverifieerd is. Niet publiceren zonder akkoord van de opdrachtgever.',
  ctaAnnotation: ['Zelfde energie?', 'Let’s talk.'],
  footer: {
    navigationHeading: 'Navigatie',
    servicesHeading: 'Services',
    ctaHeading: 'Samen iets maken?',
    extraLinks: [{ href: '/faq', label: 'FAQ' }],
    legalLinks: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/cookies', label: 'Cookies' },
    ],
    stagingSuffix: ' — stagingomgeving',
    credit: { prefix: 'Website door', name: 'Link & Lead', url: 'https://linkandlead.nl' },
  },
  newsletter: {
    eyebrow: 'Nieuwsbrief',
    heading: 'Blijf op de *hoogte.*',
    text: 'Wil je praktische tips over social media, content en campagnes in je inbox? Meld je aan voor de nieuwsbrief van YorSocials.',
    emailLabel: 'E-mailadres',
    firstNameLabel: 'Voornaam',
    consentLabel: 'Ja, stuur mij de nieuwsbrief. Afmelden kan altijd. Lees de',
    privacyLinkLabel: 'privacyverklaring',
    submitLabel: 'Aanmelden',
    declineLabel: 'Nee, bedankt',
    successHeading: 'Bijna *klaar!*',
    successText: 'Bevestig je inschrijving via de mail in je inbox. Geen mail gezien? Kijk ook even in je spammap.',
    closeLabel: 'Sluiten',
  },
  contactForm: {
    eyebrow: 'Stuur een bericht',
    heading: 'Laat hier je *gegevens achter.*',
    nameLabel: 'Naam',
    emailLabel: 'E-mailadres',
    companyLabel: 'Bedrijfsnaam',
    topicLabel: 'Waarmee kunnen we helpen?',
    topicPlaceholder: 'Kies een onderwerp',
    topics: [
      'Social strategie',
      'Content creatie',
      'Video & Reels',
      'Paid social',
      'Community management',
      'Analyse & optimalisatie',
      'Anders',
    ],
    messageLabel: 'Vertel kort over je plannen',
    messageHint: 'Minimaal 10 tekens. Deel geen gevoelige persoonsgegevens.',
    privacyLabel: 'Ik ga akkoord met het verwerken van mijn gegevens voor deze aanvraag, zoals beschreven in de',
    privacyLinkLabel: 'privacyverklaring',
    submitLabel: 'Verstuur bericht',
    retryLabel: 'Opnieuw proberen',
    footnote: 'Velden met * zijn verplicht.',
    successTitle: 'Bedankt, je bericht is verzonden.',
    successText: 'We hebben je aanvraag ontvangen en nemen zo snel mogelijk contact met je op via het opgegeven e-mailadres.',
  },
};
