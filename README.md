# YorSocials — publieke website

Productieversie van de publieke YorSocials-website, gebouwd volgens het overdrachtspakket in
[`design/handover/`](design/handover/) (functioneel ontwerp, designsysteem, bouwopdracht en paginamatrix).

**Stack:** Next.js 16 (App Router, statische generatie) · TypeScript strict · CSS Modules + design tokens ·
lokaal gehoste fonts · Vitest · Playwright + axe-core.

> **Status: staging.** De site bevat voorbeeldcontent (demo-cases en -artikelen) die nog niet geverifieerd
> is. Beelden zijn stockfoto's van Pexels (zie [`docs/BEELDCREDITS.md`](docs/BEELDCREDITS.md)). Zie [`docs/ONTBREKENDE_CONTENT.md`](docs/ONTBREKENDE_CONTENT.md) voor wat er nog nodig is vóór livegang.

## Snel starten

```bash
npm install
cp .env.example .env.local   # pas waarden aan
npm run dev                  # http://localhost:3000
```

| Script | Doel |
|---|---|
| `npm run dev` | Ontwikkelserver |
| `npm run build` / `npm start` | Productiebuild en -server |
| `npm run typecheck` | TypeScript (strict) |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript) |
| `npm test` | Unit-tests (Vitest): validatie, filterlogica, routing, CMS-parser, webhook, contentintegriteit |
| `npm run test:e2e` | E2E (Playwright, desktop + mobiel, incl. axe WCAG-checks). Vereist eerst `npm run build` |
| `npm run screenshots` | Screenshots op 375/768/1440 px naar `docs/screenshots/` |
| `npm run content:export` | Exporteert seedcontent als CMS-documenten (`content-export/seed.ndjson`) |
| `npm run check` | typecheck + lint + unit-tests + build |

## Contentmodi

`NEXT_PUBLIC_CONTENT_MODE` (build-time):

- **`staging`** (standaard) — toont content met status `demo` (voorbeeldcases, -artikelen) met zichtbare
  demolabels, een stagingbalk, `noindex` op alle pagina's, `robots.txt` blokkeert alles en
  `/styleguide` (componentenbibliotheek) is beschikbaar.
- **`production`** — alleen `published` content. Demo-cases en -artikelen verdwijnen (detail-URL's geven 404,
  overzichten tonen een nette lege toestand), `/styleguide` is weg, en indexering staat aan behalve voor
  concept-juridische pagina's.

Zet `production` pas na expliciet akkoord van de opdrachtgever (functioneel ontwerp §12.10).

## Projectstructuur

```
src/
  app/                    Routes (App Router) + sitemap, robots, OG-afbeeldingen, /api/contact
  components/             Losse componenten met typed props (+ .module.css)
  content/
    types.ts              Contentmodel (= CMS-schema, functioneel ontwerp §6)
    repository.ts         Enige toegang tot content; filtert op status/contentmodus
    data/                 Seedcontent (diensten, cases, artikelen, FAQ, site-instellingen, media)
  cms/                    Link & Lead-CMS: contracttypes, defensieve parser, fetch (ISR 60 s), blokkenrenderer, chrome
  lib/                    Validatie, casefilter, rate limiting, analytics (cookieloos), SEO, webhook, e-mail/CRM-levering
  styles/tokens.css       Design tokens (kleur, typografie, spacing, radii, elevation, breakpoints)
  fonts/                  Space Grotesk + DM Sans (woff2, SIL OFL)
public/brand/             Aangeleverd logo + contrastvariant voor donkere achtergrond
public/images/stock/      Stockfoto's van Pexels (Pexels-licentie, zie docs/BEELDCREDITS.md)
design/                   Overdrachtspakket: referentiebeelden, tokens, componentinventaris, documentatie
docs/                     Ontbrekende content, routes, CMS, deployment, testresultaten, screenshots
tests/unit, tests/e2e     Vitest- en Playwright-tests
```

## Belangrijke ontwerpkeuzes

- **Geen verzonnen feiten.** E-mail, telefoon, socials, boekingslink, team, klantnamen, resultaten en quotes
  staan op `null`/leeg en worden dan simpelweg niet getoond. Een unit-test bewaakt dat er geen cijfermatige
  claims in teksten staan en dat resultaten alleen met bron + periode + akkoord verschijnen.
- **Stockfoto's in plaats van mockup-uitsneden.** De aangeleverde uitsneden bevatten ingebakken verzonnen
  statistieken (“+278% gemiddelde groei bij onze klanten”), UI-kaarten en een merklogo van derden. Ze zijn vervangen
  door Pexels-foto's zonder merken of cijfers in beeld. Originelen staan alleen ter referentie in `design/placeholder-bronnen/`.
- **Logo.** Het aangeleverde logo wordt als afbeelding gebruikt (niet nagebouwd). Omdat “YOR” zwart is en op de
  donkere achtergrond onleesbaar wordt, is `public/brand/logo-on-dark.png` afgeleid: alléén de zwarte delen zijn
  naar gebroken wit gezet. **Ter goedkeuring bij de merkeigenaar.**
- **Afspraak-CTA.** Zolang `siteSettings.bookingUrl` leeg is, verwijst “Plan een kennismaking” naar het
  contactformulier. Zodra een echte agenda-URL is ingevuld, opent de knop die (met `booking_click`-event).
- **Contactformulier.** Client- én servervalidatie met dezelfde regels, honeypot + minimale invultijd,
  rate limiting, origin-check, maximale body-grootte, HTML-escaping en logging zonder persoonsgegevens.
  Zonder geconfigureerde bestemming antwoordt de API eerlijk met 503 (“niet verzonden”) — nooit een nep-succes.
- **Cookieloos.** Er is geen cookiemelding: de site plaatst alleen een functionele cookie (nieuwsbrief-pop-up
  gesloten) en gebruikt optioneel Plausible (zonder cookies) via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
- **Nieuwsbrief-pop-up.** Verschijnt 3 seconden na het laden, niet op
  `/privacy` en `/cookies`, en wordt na sluiten 30 dagen / na aanmelden een jaar niet meer getoond. Aanmeldingen gaan vanuit
  de browser rechtstreeks naar Mailento (`siteSettings.newsletter`: endpoint + slug `yorsocials-nieuwsbrief`), met
  honeypot, invultijd (`duur_ms`) en utm-herkomst. Mailento stuurt een bevestigingsmail (double opt-in).
- **Componentenbibliotheek.** `/styleguide` (alleen staging) toont alle componenten met varianten en toestanden,
  als lichtgewicht equivalent van Storybook.

## Documentatie

- [Ontbrekende content en open beslissingen](docs/ONTBREKENDE_CONTENT.md)
- [Route-overzicht](docs/ROUTES.md)
- [Contentmodel, CMS-koppeling en migratie](docs/CMS.md)
- [Verzoek aan de CMS-bouwer](docs/CMS-VERZOEK.md) en [blokken + veldenschema's](docs/CMS-BLOKKEN.md)
- [Deployment en omgevingsvariabelen](docs/DEPLOYMENT.md)
- [Testresultaten](docs/TESTRESULTATEN.md)
- Screenshots: [`docs/screenshots/`](docs/screenshots/) — vergelijk met [`design/referenties/`](design/referenties/)
