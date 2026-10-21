# Verzoek aan de CMS-bouwer — contentmodel YorSocials

De YorSocials-website (Next.js, live op https://yorsocials.vercel.app) leest straks al zijn inhoud uit het
Link & Lead-CMS via `GET https://linkandlead.nl/api/cms/content` (Bearer-token, site_id
`4c6177cb-9c9b-4a18-8e90-4fe29c4410f1`). De read-API werkt, maar geeft nu alleen `site`, `paginas: []` en
`popups: []` terug. Om de koppeling te bouwen hebben we antwoord nodig op onderstaande vragen.

## 1. Vragen

1. **Welke contenttypes en bloktypes ondersteunt het CMS?** Graag een voorbeeld-JSON van een gevulde
   pagina met een paar blokken, zoals de read-API die teruggeeft.
2. **Kunnen er eigen collecties komen** (diensten, cases, artikelen, FAQ, team), met vaste velden,
   of moet alles als "pagina met blokken"?
3. **Welke veldtypes zijn er?** Tekst, meerregelige tekst, rich text, afbeelding (met alt), lijst/herhaling,
   relatie/verwijzing, keuzelijst, ja/nee, datum.
4. **Status en concepten:** is er een publicatiestatus per item (concept/gepubliceerd), en levert de API
   alleen gepubliceerde items of ook concepten (bijv. via een parameter voor een staging-omgeving)?
5. **Media:** hoe komen afbeeldingen in de API (absolute URL, breedte/hoogte, alt-tekst, focal point)?
   Van welk domein worden ze geserveerd (nodig voor de CSP en `next/image`)?
6. **Verversen:** kan het CMS na publiceren een webhook sturen (URL + geheim), zodat de site direct
   opnieuw opbouwt? Anders ververst de site elke paar minuten.
7. **Filteren:** kan de API één pagina/collectie-item ophalen (bijv. `?pagina=home`, `?type=dienst&slug=…`),
   of altijd alles in één keer?
8. **Token:** het huidige token is in een chat gedeeld. Graag een nieuw token voor productie en het oude
   intrekken.

## 2. Wat de site nodig heeft

Koppen ondersteunen een mini-opmaak die het CMS als platte tekst mag opslaan: `*tekst*` = accentkleur,
regeleinde = nieuwe regel. Plaatshouders als `{count}` en `{sector}` vult de site zelf in.

### Collecties

| Collectie | Velden |
|---|---|
| **Dienst** (6) | slug, nummer, titel, eyebrow, icoon (keuzelijst), samenvatting, intro, herkenningspunten (lijst), deliverables (lijst), werkwijze (lijst: titel + tekst), FAQ (lijst: vraag + antwoord), hoofdafbeelding, SEO-titel, SEO-omschrijving, status |
| **Case** | slug, titel, sector (relatie), klantnaam, toestemming klant (ja/nee), samenvatting, context, doel, aanpak (lijst), opgeleverd (lijst), resultaten (lijst: metriek, waarde, eenheid, periode, bron, goedgekeurd), quote (tekst, auteur, rol, goedgekeurd), hoofdafbeelding, galerij (afbeeldingen met caption), gerelateerde diensten (relatie), SEO, status |
| **Sector** | id, label |
| **Artikel** | slug, titel, categorie, samenvatting, hoofdafbeelding, inhoud (rich text met koppen, lijsten, citaten, afbeeldingen met caption, links), auteur (naam, rol), publicatiedatum, gerelateerde diensten (relatie), SEO, status |
| **FAQ** | vraag, antwoord, categorie, volgorde, status |
| **Teamlid** | naam, rol, portret, bio, links, publicatietoestemming (ja/nee), volgorde, status |
| **Waarde** | icoon, titel, omschrijving |
| **Werkwijzestap** | titel, tekst, afbeelding |
| **Juridische pagina** (privacy, cookies) | titel, intro, versie, laatst beoordeeld (datum), secties (lijst: kop + alinea's), SEO, status |

### Site-instellingen (één record)

Naam, tagline, logo (lichte en originele variant), e-mail, telefoon, social-links (platform, URL, geverifieerd),
afspraaklink, nieuwsbrief (endpoint + slug), juridische entiteit (naam, KvK, adres), standaard-SEO.

### Paginateksten (één record per pagina)

Home, Services, Dienst-template, Cases, Case-template, Over ons, Artikelen, Artikel-template, Contact, FAQ, 404.
Per pagina: SEO-titel en -omschrijving, hero (eyebrow, kop, intro, afbeelding, handgeschreven accent:
2 korte regels), sectiekoppen (eyebrow, kop, intro), knopteksten, teksten voor lege/demo-toestanden en een
afsluitend CTA-blok (eyebrow, kop, tekst). De exacte velden per pagina staan in `PagesContent` in
`src/content/types.ts`.

### Globale teksten (één record)

Navigatie (label + link), knopteksten, ticker-woorden, footer (koppen, links, credit), cookiemelding en
-voorkeuren, nieuwsbrief-pop-up, contactformulier (labels, onderwerpen, succesmelding). Exacte velden:
`GlobalContent` in `src/content/types.ts`.

## 3. Startinhoud

Alle huidige inhoud is als importbestand beschikbaar: `npm run content:export` →
`content-export/seed.ndjson` (40 documenten, één per regel, met `_id` en `_type`). Die kan het CMS
eenmalig inlezen.

## 4. Hoe de site het gebruikt

- Vervangen door het CMS: alleen `src/content/repository.ts`. De pagina's veranderen niet.
- Valt het CMS uit of ontbreekt een veld, dan toont de site de laatst bekende inhoud of de ingebouwde
  standaardtekst. De site breekt dus nooit.
- Het token staat alleen als omgevingsvariabele in Vercel (`CMS_TOKEN`), nooit in de code.
