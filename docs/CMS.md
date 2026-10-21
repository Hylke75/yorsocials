# Contentmodel, CMS-koppeling en migratie

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

## Statussen

| Status | Betekenis | Staging | Productie |
|---|---|---|---|
| `published` | Bevestigd en goedgekeurd | zichtbaar | zichtbaar |
| `demo` | Voorbeeld/placeholder | zichtbaar met demolabel | verborgen |
| `draft` | Onvolledig | verborgen (juridische pagina's: getoond met conceptmelding + noindex) | idem |

## Koppelen aan een CMS

1. Maak in het CMS schema's die 1-op-1 overeenkomen met `src/content/types.ts`.
2. Importeer de seedcontent: `npm run content:export` schrijft `content-export/seed.ndjson`
   (één document per regel met `_id` en `_type`). Voor Sanity: `sanity dataset import content-export/seed.ndjson production`.
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
