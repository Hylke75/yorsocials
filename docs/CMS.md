# CMS-koppeling (Link & Lead)

De YorSocials-site is een **headless frontend** op het centrale Link & Lead-CMS. Alle content wordt in
`linkandlead.nl/admin` beheerd; de site haalt die op met één token en rendert hem in het eigen ontwerp.

## Wat beheer je waar in het CMS

| Onderdeel op de site | Beheer in het CMS | Hoe de site het gebruikt |
|---|---|---|
| Alle pagina's (home, diensten + 6 dienstpagina's, cases, over ons, artikelen, contact, FAQ, privacy, cookies) | **Pagina's** → blokken | Elk bloktype heeft een eigen component in het YorSocials-ontwerp (tabel hieronder). |
| Nieuwe pagina's (bijv. `/acties/zomer`, `/juridisch/voorwaarden`, `/cases/<klant>`) | **Pagina's** → nieuwe pagina | Verschijnt automatisch op die URL en in de sitemap. |
| SEO-titel, -omschrijving en deelafbeelding per pagina | Pagina-instellingen (`titel`, `beschrijving`, `og_beeld`) | `<title>`, meta description, Open Graph. |
| Hoofdmenu, footerkolommen, juridische links, actieknop | **Navigatie** (`hoofd`, `footer`, `juridisch`, `actie`) | Header, mobiel menu en footer. Submenu's worden plat getoond. |
| Logo, tagline, contactgegevens, adres, KvK, LinkedIn | **Merk** (`merk.logo`, `tagline`, `contact.*`, `socials`) | Header, footer. |
| Doorverwijzingen | **Redirects** (`van`, `naar`, `status`) | 301/308 = permanent, anders tijdelijk. |
| Team | **Records → teamleden** | Blok `mensen`. |
| Cases | **Records → cases** | Blok `cases_grid` (met sectorfilter bij ≥ 2 sectoren). |
| Artikelen | **Records → artikelen** | Blok `artikelen_grid` + detailpagina `/artikelen/<slug>`. |
| Pop-ups (nieuwsbrief, aankondiging, afspraak-CTA) | **Pop-ups** | Soort, tekst, trigger (tijd/scroll/exit/inactief/pagina's), pagina-scope en frequentie komen uit het CMS. Nieuwsbriefaanmeldingen gaan naar Mailento (`yorsocials-nieuwsbrief`). `leadmagnet` wordt nog niet getoond. |
| Formulierinzendingen | **Leads** | Blok `formulier_bouwer` én het vaste contactformulier sturen leads server-side naar `/api/cms/lead` (site-id in `src/content/data/site.ts`). |

### Bloktypes

| Bloktype | Component | Opmerkingen |
|---|---|---|
| `header` | Hero | Eerste header op een pagina = H1. `*tekst*` in de kop = groene accentkleur, regeleinde = nieuwe regel. Kruimelpad automatisch (incl. bovenliggende pagina's) of handmatig; USP's, kerncijfers, 2 knoppen, beeld met focuspunt. |
| `tekst` | Tekstsectie | Rich text: alinea per regel, `- ` lijst, `**vet**`, `*cursief*`, `[link](/pad)`. |
| `mediatekst` | Tekst naast beeld | Alinea's, opsommingspunten, beeldzijde, knop. |
| `kaarten` | Kaartenraster | 3/4 kolommen, iconen, link per kaart (achtergrondbeeld = headerbeeld van de gelinkte pagina). |
| `feiten` | Feiten/resultaten | |
| `faq` | Veelgestelde vragen | |
| `cta` | Afsluitend CTA-blok | |
| `flexibel` | Vrije kolommen (bijv. werkwijze-stappen) | |
| `marquee` | Lopende woordenbalk | Staat stil bij `prefers-reduced-motion`. |
| `formulier_bouwer` | Formulier | Velden uit het CMS, e-mail altijd aanwezig; veldfouten + foutoverzicht; `?onderwerp=…` vult een keuzeveld voor. |
| `mensen` | Team | |
| `cases_grid` | Casesoverzicht | `maximaal`, `filter_sector`, `link_naar_overzicht`. |
| `artikelen_grid` | Artikelenoverzicht | `maximaal`, `filter_rubriek`. |

Onbekende of verouderde types (`linkkaarten`, `leadcta`, `galerij`, `nieuwsbrief`) worden overgeslagen.
`bg`: `mist`, `mistdof`, `limoenlicht`, `wit`, `steen` → lichte sectie; overige → standaard.

## Architectuur

- **Eén bron:** `GET https://linkandlead.nl/api/cms/content` met `Authorization: Bearer $CMS_TOKEN`, alleen
  server-side (`src/cms/client.ts`). Eén call per render, gecachet met ISR (60 s, tag `cms`). Geen directe
  database- of Supabase-toegang.
- **Defensief lezen:** `src/cms/parse.ts` zet de respons om naar het contract (`src/cms/types.ts`); ontbrekende
  of kapotte velden worden standaardwaarden, nooit een fout. Is het CMS onbereikbaar, dan blijft de laatst
  gecachete versie staan.
- **Routes:** vaste routes tonen de CMS-pagina zodra die renderbare blokken heeft. Alle andere CMS-pagina's
  lopen via `src/app/[...slug]/page.tsx`; onbekende URL's volgen `site.redirects` of geven een 404.
- **Chrome:** `src/cms/chrome.ts` (menu, footer, merk), per onderdeel met de ingebouwde inhoud als terugval.
- **Pop-ups:** `src/lib/popups.ts` (omzetting + pagina-scope) en `src/components/SitePopup.tsx`
  (triggers, frequentie via first-party opslag, Mailento-aanmelding).
- **Verversen:** `POST /api/revalidate` met HMAC-SHA256-handtekening (`x-ll-signature`, `CMS_WEBHOOK_SECRET`)
  ververst direct; zonder webhook is een wijziging binnen 60 s zichtbaar.
- **Media:** `mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/**` (image-allowlist + CSP).
  Beeld-URL's naar het eigen domein (`yorsocials.vercel.app`, `www.yorsocials.nl`) worden lokale paden.
- **Geen cookiemelding:** het platform is cookieloos (zie README).

## Ingebouwde inhoud (terugval)

Wat het CMS (nog) niet levert, vult de site aan met de ingebouwde inhoud: menu en footer (de huidige
CMS-versie levert nog geen `navigatie`), cases, artikelen en team (nog geen `records`) en de
nieuwsbrief-pop-up (als er in het CMS geen pop-up actief staat). Zodra het CMS ze levert, nemen ze het over.

Zonder `CMS_TOKEN`, of voor een pagina die in het CMS (nog) geen blokken heeft, toont de site de ingebouwde
inhoud uit `src/content/data/`. Daardoor staat de site nooit leeg, ook niet tijdens de overstap.

## Eerste vulling van het CMS

`npm run cms:push` zet alle ingebouwde inhoud als **15 pagina's met 77 blokken** in het CMS
(`POST /api/cms/sync`, idempotent per slug). Beeld-URL's wijzen naar de live site.

```bash
npm run cms:push -- --dry-run                    # alleen content-export/cms-blauwdruk.json schrijven
CMS_TOKEN=cms_... npm run cms:push              # echt pushen
```

Let op: opnieuw pushen overschrijft wijzigingen die in het CMS aan dezelfde pagina's zijn gedaan. Gebruik
het dus alleen voor de eerste vulling. Navigatie, merk, records en pop-ups gaan niet via de sync: die stel
je in `/admin` in (zie checklist in [ONTBREKENDE_CONTENT.md](ONTBREKENDE_CONTENT.md)). Demo-cases en
-artikelen worden bewust niet gepusht.

## Testen zonder het echte CMS

```bash
npm run cms:mock           # nep-CMS op :4010 (token "mock") met alle pagina's, records, pop-ups en een redirect
npm run test:e2e:cms       # bouwt de site tegen het nep-CMS en draait tests/e2e/cms.spec.ts
```

## Bewust in de code gebleven

Validatie- en foutmeldingen van formulieren, veldlabels van de nieuwsbrief-pop-up, teksten die alleen voor
schermlezers zijn, de 404-pagina, de credit "Website door Link & Lead", de interne styleguide en het
ontwerp zelf (kleuren, typografie, iconenset). Wil je hier iets van beheerbaar maken: graag via Hylke bij
de CMS-bouwer.

## Statussen (alleen ingebouwde inhoud)

| Status | Betekenis | Staging | Productie |
|---|---|---|---|
| `published` | Bevestigd en goedgekeurd | zichtbaar | zichtbaar |
| `demo` | Voorbeeld/placeholder | zichtbaar met demolabel | verborgen |
| `draft` | Onvolledig | verborgen (juridische pagina's: getoond met conceptmelding + noindex) | idem |

In het CMS bepaalt het vinkje *gepubliceerd* wat zichtbaar is.

## Afspraken voor redacteuren

- Cases met klantnaam, citaat of resultaten alleen publiceren met schriftelijke toestemming van de klant;
  resultaten altijd met periode en bron.
- Teamleden alleen met toestemming van de persoon (foto en naam).
- Elke afbeelding krijgt een alt-tekst die beschrijft wat er te zien is.
