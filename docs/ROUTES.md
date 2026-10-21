# Route-overzicht

Alle routes zijn echte, server-gerenderde/statisch gegenereerde URL's (geen hash-routing). Met `CMS_TOKEN`
komt de inhoud van elke route uit het Link & Lead-CMS (ISR 60 s), anders uit de ingebouwde inhoud — zie [CMS.md](CMS.md).
Oude URL's (`/services/*`, `/privacy`, `/cookies`) worden permanent doorgestuurd.
"Staging" = `NEXT_PUBLIC_CONTENT_MODE=staging`, "Productie" = `production`.

| Route | Template | Unieke modules | Doelconversie | Staging | Productie |
|---|---|---|---|---|---|
| `/` | HomePage | Hero, ticker, 3 diensten, aanpak, werkwijze, 2 cases, CTA | Kennismaking | ✓ | ✓ (cases-sectie verborgen zonder cases) |
| `/diensten` | ServicesIndex | 6 servicekaarten, werkwijze met beelden, CTA | Dienst selecteren | ✓ | ✓ |
| `/diensten/social-strategie` | ServiceDetail | Herkenning, deliverables, werkwijze, FAQ, artikelen, andere diensten | Kennismaking | ✓ | ✓ |
| `/diensten/content-creatie` | ServiceDetail | idem | Kennismaking | ✓ | ✓ |
| `/diensten/video-reels` | ServiceDetail | idem | Kennismaking | ✓ | ✓ |
| `/diensten/paid-social` | ServiceDetail | idem | Kennismaking | ✓ | ✓ |
| `/diensten/community-management` | ServiceDetail | idem | Kennismaking | ✓ | ✓ |
| `/diensten/analyse-optimalisatie` | ServiceDetail | idem | Kennismaking | ✓ | ✓ |
| `/cases` (`?sector=…`) | CasesIndex | Sectorfilter (URL-param), kaarten, lege toestand | Case bekijken | ✓ 4 demo-cases | ✓ lege toestand |
| `/cases/[slug]` | CaseDetail | Context, doel, aanpak, opgeleverd, galerij, geverifieerde resultaten, quote (met akkoord), diensten | Kennismaking | ✓ 4 demo | 404 tot er gepubliceerde cases zijn |
| `/over-ons` | AboutPage | Verhaal, waarden, werkwijze, team (met toestemming) | Vertrouwen | ✓ | ✓ (team verborgen zolang leeg) |
| `/artikelen` | ArticlesIndex | Categorie-navigatie, listing per categorie | Artikel bekijken | ✓ 3 demo | ✓ lege toestand |
| `/artikelen/[slug]` | ArticleDetail | Rich text, auteur/datum, relevante diensten, gerelateerde artikelen, Article-JSON-LD (alleen gepubliceerd) | Kennis + contact | ✓ 3 demo | 404 tot er gepubliceerde artikelen zijn |
| `/contact` (`?onderwerp=…`) | ContactPage | Formulier, afspraakblok, verwachtingen | Aanvraag | ✓ | ✓ |
| `/faq` | FAQPage | Accordeon per categorie | Contact | ✓ | ✓ |
| `/juridisch/privacy` | PrivacyPage | Secties | Informatief | ✓ noindex | ✓ noindex tot vastgesteld |
| `/juridisch/cookies` | CookiesPage | Secties (cookieloos platform, geen cookiemelding) | Informatief | ✓ noindex | ✓ noindex tot vastgesteld |
| `/[...slug]` | CMS-pagina | Elke extra pagina die in het CMS wordt aangemaakt; anders CMS-redirect of 404 | — | ✓ | ✓ |
| 404 | NotFoundPage | Teruglinks naar Home en Contact | Terugnavigatie | ✓ | ✓ |
| `/styleguide` | — | Componentenbibliotheek | intern | ✓ noindex | 404 |

## Technische routes

| Route | Doel |
|---|---|
| `POST /api/contact` | Vast contactformulier: validatie, antispam, rate limit, levering als CMS-lead, webhook of e-mail |
| `POST /api/lead` | Formulieren uit het CMS-blok `formulier_bouwer` → server-side naar `/api/cms/lead` |
| `POST /api/revalidate` | CMS-webhook (HMAC `x-ll-signature`): ververst alle CMS-inhoud direct |
| `/sitemap.xml` | Alleen indexeerbare pagina's |
| `/robots.txt` | Staging: alles geblokkeerd. Productie: alles behalve `/api/` en `/styleguide` |
| `/opengraph-image`, `/diensten/[slug]/opengraph-image`, `/cases/[slug]/…`, `/artikelen/[slug]/…` | Gegenereerde OG-afbeeldingen (1200×630) met het echte logo |
| `/icon.png`, `/apple-icon.png` | Favicon op basis van de play-O uit het logo |
