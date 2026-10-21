import type { Article } from '../types';
import { media } from './media';

/**
 * VOORBEELDARTIKELEN — redactioneel nog niet gecontroleerd, zonder auteur en publicatiedatum.
 * Status `demo`: alleen zichtbaar in staging, met demolabel en noindex.
 */
export const articles: Article[] = [
  {
    slug: 'waarom-social-first-content',
    title: 'Waarom social-first content begint bij je doelgroep',
    category: 'Strategie',
    excerpt: 'Niet eerst een mooi plaatje, maar een scherp idee van wie je wilt bereiken.',
    heroImage: media.strategy,
    body: [
      {
        type: 'paragraph',
        content: [
          'Een sterke social aanpak begint met een duidelijk doel. Wie wil je bereiken, wat hebben deze mensen nodig en hoe kan jouw merk daarin iets betekenen?',
        ],
      },
      { type: 'heading', level: 2, text: 'Begin bij de mensen' },
      {
        type: 'paragraph',
        content: [
          'Het helpt om eerst te luisteren, vervolgens een herkenbaar format te ontwikkelen en daarna consequent te meten welke inhoud aanspreekt. Zo ontstaat een aanpak die niet alleen creatief, maar ook leerzaam is.',
        ],
      },
      {
        type: 'list',
        items: ['Wat vraagt je doelgroep al aan je?', 'Welke content bewaren of delen ze?', 'Waar haken ze juist af?'],
      },
      { type: 'heading', level: 2, text: 'Van inzicht naar format' },
      {
        type: 'paragraph',
        content: [
          'Vertaal wat je leert naar een paar vaste contentpijlers. Lees ook hoe je ',
          { text: 'een herkenbaar Reels-format bouwt', href: '/artikelen/zo-bouw-je-een-reels-format' },
          '.',
        ],
      },
      { type: 'image', image: { ...media.strategy, caption: 'Placeholderbeeld — vervangen door eigen fotografie.' } },
    ],
    author: null,
    publishedAt: null,
    relatedServices: ['social-strategie', 'analyse-optimalisatie'],
    seo: {
      title: 'Waarom social-first content begint bij je doelgroep',
      description: 'Waarom een scherp beeld van je doelgroep de basis is van social-first content.',
      noIndex: true,
    },
    status: 'demo',
  },
  {
    slug: 'zo-bouw-je-een-reels-format',
    title: 'Zo bouw je een herkenbaar Reels-format',
    category: 'Content',
    excerpt: 'Een vast format geeft ritme en maakt creativiteit schaalbaar.',
    heroImage: media.shoot,
    body: [
      {
        type: 'paragraph',
        content: ['Een format is een terugkerende vorm: dezelfde opbouw, een herkenbare opening en een vaste lengte. Dat geeft je kijker houvast en jou productiegemak.'],
      },
      { type: 'heading', level: 2, text: 'Kies een vaste opening' },
      {
        type: 'paragraph',
        content: ['De eerste seconden bepalen of iemand blijft kijken. Een herkenbare opening helpt je publiek om je content direct te plaatsen.'],
      },
      { type: 'heading', level: 2, text: 'Maak ruimte om te testen' },
      {
        type: 'paragraph',
        content: ['Test ideeën in kleine stappen, kijk verder dan alleen weergaven en leer van vragen en reacties.'],
      },
      { type: 'quote', text: 'Een goed format is een belofte aan je kijker: dit krijg je elke keer.' },
    ],
    author: null,
    publishedAt: null,
    relatedServices: ['video-reels', 'content-creatie'],
    seo: {
      title: 'Zo bouw je een herkenbaar Reels-format',
      description: 'Hoe een vast Reels-format ritme geeft aan je content en creativiteit schaalbaar maakt.',
      noIndex: true,
    },
    status: 'demo',
  },
  {
    slug: 'creatief-testen-met-paid-social',
    title: 'Creatief testen met paid social',
    category: 'Campagnes',
    excerpt: 'Met verschillende concepten leer je sneller wat je publiek in beweging brengt.',
    heroImage: media.analytics,
    body: [
      {
        type: 'paragraph',
        content: ['In advertenties is de creatie vaak de grootste hefboom. Door bewust varianten te testen, leer je wat werkt in plaats van te gokken.'],
      },
      { type: 'heading', level: 2, text: 'Test één ding tegelijk' },
      {
        type: 'paragraph',
        content: ['Verander per test één variabele — de hook, het beeld of de call-to-action — zodat je weet waar een verschil vandaan komt.'],
      },
      { type: 'heading', level: 2, text: 'Leg je lessen vast' },
      {
        type: 'paragraph',
        content: ['Houd een eenvoudig testlogboek bij. Zo bouw je kennis op die ook je organische content beter maakt.'],
      },
    ],
    author: null,
    publishedAt: null,
    relatedServices: ['paid-social', 'analyse-optimalisatie'],
    seo: {
      title: 'Creatief testen met paid social',
      description: 'Waarom en hoe je creatieve varianten test in social advertising.',
      noIndex: true,
    },
    status: 'demo',
  },
];
