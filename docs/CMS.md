# CMS-koppeling (Link & Lead)

## Architectuur (volgens het contract van de CMS-bouwer)

- **Eén bron:** `GET https://linkandlead.nl/api/cms/content` met `Authorization: Bearer $CMS_TOKEN`, alleen
  server-side (`src/cms/client.ts`). Eén call voor alle pagina's, gecachet met ISR (60 s, tag `cms`).
- **Defensief lezen:** `src/cms/parse.ts` zet de respons om naar het contract (`src/cms/types.ts`); ontbrekende
  of kapotte velden worden standaardwaarden, nooit een fout.
- **Pagina's = blokken:** `src/cms/blocks/` — één component per bloktype (registry), onbekend type wordt
  overgeslagen, `bg`-token → sectieklasse. Afbeeldingen via `CmsImage` in vaste verhoudingen
  (logo's `contain`, foto's `cover`), want het CMS levert geen afmetingen.
- **Routes:** vaste routes (/, /services, /cases, …) tonen de CMS-versie zodra die renderbare blokken heeft,
  anders de ingebouwde inhoud. Alle andere CMS-pagina's (/diensten/<slug>, /juridisch/<slug>, detailpagina's)
  lopen via `src/app/[...slug]/page.tsx`; onbekende URL's volgen `site.redirects` of geven een 404.
- **Chrome:** menu, footer, juridische links, actieknop, logo, tagline, contact en socials komen uit
  `site.navigatie` / `site.merk` (`src/cms/chrome.ts`), met de ingebouwde inhoud als terugval per onderdeel.
- **Verversen:** `POST /api/revalidate` met HMAC-handtekening (`x-ll-signature`, `CMS_WEBHOOK_SECRET`) ververst
  direct; tot die webhook aanstaat geldt ISR van 60 s.
- **Media:** alleen `mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/**` (image-allowlist + CSP).
- **Geen cookiemelding:** het platform is cookieloos (zie README).

**Status:** de infrastructuur staat; de componenten per bloktype volgen zodra de CMS-bouwer de
veldenschema's levert (zie [CMS-BLOKKEN.md](CMS-BLOKKEN.md)). Tot die tijd, en zolang `CMS_TOKEN` leeg is,
toont de site de ingebouwde inhoud uit `src/content/data/`.

---

## Ingebouwde inhoud (terugval)

## Huidige opzet

De CMS-keuze is nog niet bevestigd (bouwopdracht: “bijv. Sanity/Directus; keuze bevestigen”). Daarom:

1. **Contentmodel** — `src/content/types.ts` volgt het functioneel ontwerp §6 (`siteSettings`, `service`,
   `case`, `teamMember`, `article`, `faq`, `page`) plus een verplicht `MediaAsset`-type met breedte/hoogte,
   alt, focal point, bron/licentie en optioneel transcript.
2. **Seedcontent** — `src/content/data/*.ts`, volledig getypt.
3. **Repository** — `src/content/repository.ts` is de enige plek waar templates content ophalen. Hier wordt
   op `status` gefilterd (`published` / `demo` / `draft`) en worden regels afgedwongen zoals “klantnaam alleen
   met toestemming” en “resultaten alleen met bron, periode en akkoord”.

Omdat navigatie, sitemap, `generateStaticParams`, gerelateerde kaarten en de footer allemaal via de repository
lopen, verdwijnt een verwijderde of gedepubliceerde case automatisch overal (functioneel ontwerp §6).

## Wat is beheerbaar (stand na stap 1)

Alle zichtbare redactionele tekst komt uit `src/content/data/` — er staat geen paginatekst meer in de
paginacode. Een unit-test (`tests/unit/noHardcodedCopy.test.ts`) bewaakt dat dat zo blijft.

| Bestand | Inhoud |
|---|---|
| `pages.ts` | Per pagina/template: SEO-titel en -omschrijving, hero (eyebrow, kop, intro, beeld, handgeschreven accent), alle sectiekoppen en -intro's, knopteksten, demo-/lege-toestandteksten en het afsluitende CTA-blok. |
| `global.ts` | Navigatie, afspraak-/berichtknoppen, ticker, kaartlinks, footer (koppen, links, credit), stagingbalk, cookiemelding en -voorkeuren, nieuwsbrief-pop-up, contactformulier (labels, onderwerpen, succesmelding). |
| `services.ts` | Diensten en de algemene werkwijze. |
| `cases.ts` | Cases en sectoren (filter). |
| `articles.ts` | Artikelen (rich text). |
| `site.ts` | Site-instellingen (contact, socials, afspraaklink, nieuwsbrief, juridische entiteit, standaard-SEO), team, waarden, FAQ, privacy- en cookieteksten. |
| `media.ts` | Beeldbibliotheek met alt-tekst, focal point en bron. |

**Koppen** gebruiken een mini-opmaak: `*tekst*` = groene accentkleur, een regeleinde = nieuwe regel.
Bijvoorbeeld `Social die opvalt.\n*Content die blijft.*`. **Plaatshouders** zoals `{count}`, `{sector}`,
`{name}` worden door de site ingevuld.

**Bewust in de code gebleven:** validatie- en foutmeldingen van formulieren, teksten die alleen voor
schermlezers zijn (bijv. "opent in nieuw venster", skiplink), het "Placeholder"-label op beelden in staging,
de interne styleguide en structurele keuzes (welke secties in welke volgorde staan, kleuren, iconenset).

## Statussen

| Status | Betekenis | Staging | Productie |
|---|---|---|---|
| `published` | Bevestigd en goedgekeurd | zichtbaar | zichtbaar |
| `demo` | Voorbeeld/placeholder | zichtbaar met demolabel | verborgen |
| `draft` | Onvolledig | verborgen (juridische pagina's: getoond met conceptmelding + noindex) | idem |

## Koppelen aan een CMS

1. Maak in het CMS schema's die 1-op-1 overeenkomen met `src/content/types.ts`.
2. Importeer de seedcontent: `npm run content:export` schrijft `content-export/seed.ndjson`
   (één document per regel met `_id` en `_type`, inclusief `pageContent.*` per pagina en `globalContent`). Voor Sanity: `sanity dataset import content-export/seed.ndjson production`.
   Voor Directus: lees het NDJSON-bestand in met een klein importscript per collectie.
3. Vervang de functies in `src/content/repository.ts` door async fetchers die dezelfde types teruggeven, en maak
   de aanroepende pagina's `async` (ze zijn al server components).
4. Gebruik on-demand revalidatie (`revalidateTag`/`revalidatePath`) via een webhook vanuit het CMS, zodat
   publiceren direct zichtbaar is zonder volledige rebuild.
5. Laat mediabestanden vanuit het CMS-assetbeheer komen en voeg het asset-domein toe aan
   `images.remotePatterns` en `img-src` in de CSP (`next.config.ts`).

## Validatieregels voor redacteuren (aan te leggen in het CMS)

- `case.status = published` vereist `permissionGranted = true`.
- `case.results[]` vereist `metric`, `value`, `period`, `source` en `approved`.
- `case.quote` alleen tonen met `approved = true`.
- `teamMember` publiceren vereist `consentConfirmed = true`.
- `article.status = published` vereist `author` en `publishedAt`.
- Elk `MediaAsset` vereist `alt`, `width`, `height` en `source`.

Deze regels worden nu al door `tests/unit/contentIntegrity.test.ts` bewaakt.
