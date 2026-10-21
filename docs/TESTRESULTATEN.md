# Testresultaten

Laatste volledige run: 21 oktober 2026, op de staging-build (`NEXT_PUBLIC_CONTENT_MODE=staging`),
Node 22, Chromium (Playwright 1.56).

| Controle | Commando | Resultaat |
|---|---|---|
| TypeScript strict | `npm run typecheck` | ✅ geen fouten |
| ESLint (Next core-web-vitals + TS) | `npm run lint` | ✅ geen fouten of waarschuwingen |
| Unit-tests (Vitest) | `npm test` | ✅ 49/49 geslaagd (6 bestanden) |
| Productiebuild | `npm run build` | ✅ 44 statische pagina's/assets + 1 API-route |
| E2E desktop (1440×900) + mobiel (Pixel 7) | `npm run test:e2e` | ✅ 92/92 geslaagd |
| Productiemodus-build | `NEXT_PUBLIC_CONTENT_MODE=production npm run build` | ✅ demo-cases/-artikelen en `/styleguide` geven 404, overzichten tonen lege toestand, sitemap bevat alleen indexeerbare pagina's |
| Screenshots 375 / 768 / 1440 | `npm run screenshots` | ✅ 18 screenshots in `docs/screenshots/` |

## Wat de tests dekken

**Unit** (`tests/unit/`)
- Formuliervalidatie: verplichte velden, e-mailformaat, onderwerp-whitelist, lengtegrenzen, privacy-akkoord,
  normalisatie (control/zero-width tekens, header-injectie), honeypot + invultijd, HTML-escaping.
- Filterlogica: URL-parameter parsen, filteren, lege toestand, deelbare URL's.
- Routing: alle verplichte routes, zes dienstdetails, demo-content alleen in staging, geen dubbele routes,
  onbekende slugs → 404, actieve navigatie.
- Consent & analytics: (de)serialisatie, versiebeheer, geen events zonder toestemming, PII-filter.
- Contentintegriteit: toestemming voor cases/team, resultaten met bron+periode, alt-tekst/afmetingen/bron
  voor alle media, geen verzonnen contactgegevens, geen cijfermatige claims in teksten.
- Rate limiting.

**E2E** (`tests/e2e/`)
- Elke route: status 200, precies één H1, titel, meta description, canonical, geen horizontale scroll,
  geen console-/paginafouten (desktop én mobiel).
- 404-pagina en teruglinks; alle interne links op de homepage; sitemap, robots, OG-afbeelding; security headers.
- Hoofdnavigatie + `aria-current`; conversieroute home → dienst → contact met voorgeselecteerd onderwerp;
  skiplink; zichtbare focus; FAQ-accordeon met toetsenbord.
- Casefilter: URL-parameter, `aria-pressed`, resultaatteller, lege toestand, terug naar “Alle cases”, detailpagina.
- Contactformulier: foutoverzicht met focus, veldfouten met `aria-invalid`/`aria-describedby`, ongeldig e-mailadres,
  succes alleen na serverbevestiging, serverfout met behoud van invoer, dubbele inzending voorkomen,
  echte API zonder bestemming → eerlijke 503-melding, server-side validatie (422) en honeypot (400).
- Mobiel menu: openen, Escape + focusherstel, navigeren sluit menu, tap-targets ≥ 44 px, CTA in beeld.
- Consent: banner, geen events vóór toestemming, weigeren blijft bewaard, accepteren → `page_view` + `cta_click`
  zonder persoonsgegevens, wijzigen/intrekken via `/cookies`, dialoog via footer.
- Toegankelijkheid: axe-core (WCAG 2.0/2.1/2.2 A + AA) op alle 17 routes en de consentbanner: 0 overtredingen;
  `prefers-reduced-motion` zet de ticker stil.

## Niet automatisch getest / nog te doen

- **Echte levering** van het contactformulier (webhook/Resend): pas mogelijk na het kiezen van een bestemming.
- **Screenreader-test** (NVDA/VoiceOver) en handmatige toetsenbordronde door een mens: aanbevolen vóór livegang.
- **Lighthouse/PageSpeed en Core Web Vitals**: meten op de staging-/productie-URL met echte fotografie.
- **Visuele vergelijking** met `design/referenties/` gebeurde handmatig via de screenshots; de referenties bevatten
  verzonnen cijfers, klantlogo's en testimonials die bewust níet zijn overgenomen.
- `npm audit` meldt 5 “high” bevindingen in `braces` via `@next/eslint-plugin-next` (alleen dev-tooling, geen fix
  beschikbaar; niet in de productiebundel).
