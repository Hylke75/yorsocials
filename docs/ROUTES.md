# Route-overzicht

Alle routes zijn echte, server-gerenderde/statisch gegenereerde URL's (geen hash-routing).
"Staging" = `NEXT_PUBLIC_CONTENT_MODE=staging`, "Productie" = `production`.

| Route | Template | Unieke modules | Doelconversie | Staging | Productie |
|---|---|---|---|---|---|
| `/` | HomePage | Hero, ticker, 3 diensten, aanpak, werkwijze, 2 cases, CTA | Kennismaking | ✓ | ✓ (cases-sectie verborgen zonder cases) |
| `/services` | ServicesIndex | 6 servicekaarten, werkwijze met beelden, CTA | Dienst selecteren | ✓ | ✓ |
| `/services/social-strategie` | ServiceDetail | Herkenning, deliverables, werkwijze, FAQ, artikelen, andere diensten | Kennismaking | ✓ | ✓ |
| `/services/content-creatie` | ServiceDetail | idem | Kennismaking | ✓ | ✓ |
| `/services/video-reels` | ServiceDetail | idem | Kennismaking | ✓ | ✓ |
| `/services/paid-social` | ServiceDetail | idem | Kennismaking | ✓ | ✓ |
| `/services/community-management` | ServiceDetail | idem | Kennismaking | ✓ | ✓ |
| `/services/analyse-optimalisatie` | ServiceDetail | idem | Kennismaking | ✓ | ✓ |
| `/cases` (`?sector=…`) | CasesIndex | Sectorfilter (URL-param), kaarten, lege toestand | Case bekijken | ✓ 4 demo-cases | ✓ lege toestand |
| `/cases/[slug]` | CaseDetail | Context, doel, aanpak, opgeleverd, galerij, geverifieerde resultaten, quote (met akkoord), diensten | Kennismaking | ✓ 4 demo | 404 tot er gepubliceerde cases zijn |
| `/over-ons` | AboutPage | Verhaal, waarden, werkwijze, team (met toestemming) | Vertrouwen | ✓ | ✓ (team verborgen zolang leeg) |
| `/artikelen` | ArticlesIndex | Categorie-navigatie, listing per categorie | Artikel bekijken | ✓ 3 demo | ✓ lege toestand |
| `/artikelen/[slug]` | ArticleDetail | Rich text, auteur/datum, relevante diensten, gerelateerde artikelen, Article-JSON-LD (alleen gepubliceerd) | Kennis + contact | ✓ 3 demo | 404 tot er gepubliceerde artikelen zijn |
| `/contact` (`?onderwerp=…`) | ContactPage | Formulier, afspraakblok, verwachtingen | Aanvraag | ✓ | ✓ |
| `/faq` | FAQPage | Accordeon per categorie | Contact | ✓ | ✓ |
| `/privacy` | PrivacyPage | Conceptmelding, secties | Informatief | ✓ noindex | ✓ noindex tot vastgesteld |
| `/cookies` | CookiesPage | Secties + cookievoorkeuren | Consentbeheer | ✓ noindex | ✓ noindex tot vastgesteld |
| 404 | NotFoundPage | Teruglinks naar Home en Contact | Terugnavigatie | ✓ | ✓ |
| `/styleguide` | — | Componentenbibliotheek | intern | ✓ noindex | 404 |

## Technische routes

| Route | Doel |
|---|---|
| `POST /api/newsletter` | Nieuwsbriefaanmelding: validatie, antispam, rate limit, levering via webhook of Resend-audience |
| `POST /api/contact` | Contactformulier: validatie, antispam, rate limit, levering via webhook of e-mail |
| `/sitemap.xml` | Alleen indexeerbare pagina's |
| `/robots.txt` | Staging: alles geblokkeerd. Productie: alles behalve `/api/` en `/styleguide` |
| `/opengraph-image`, `/services/[slug]/opengraph-image`, `/cases/[slug]/…`, `/artikelen/[slug]/…` | Gegenereerde OG-afbeeldingen (1200×630) met het echte logo |
| `/icon.png`, `/apple-icon.png` | Favicon op basis van de play-O uit het logo |
