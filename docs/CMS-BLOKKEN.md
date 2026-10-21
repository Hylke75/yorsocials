# Blokken die de YorSocials-site gebruikt — verzoek om veldenschema's

Aan: CMS-bouwer Link & Lead (via Hylke)

De site bouwt tegen het responscontract (§8) met één server-side fetch, ISR van 60 s en een
blokkenrenderer (onbekend type → overslaan). Graag per blok hieronder de **content-sleutels** (naam,
type, verplicht/optioneel, en voor lijsten de velden per item). Dan bouwen we per blok één component.

| Bloktype | Waarvoor op YorSocials | Huidig equivalent op de site |
|---|---|---|
| `header` | Hero bovenaan elke pagina (eyebrow, kop met accentdeel, intro, achtergrondbeeld, 1–2 knoppen) | `HeroEditorial` |
| `tekst` | Losse tekstsecties (verhaal, juridische teksten) | Over ons-verhaal, privacy/cookies |
| `mediatekst` | Tekst naast beeld (aanpak, "wat je kunt verwachten" + deliverables-lijst) | Aanpak-sectie, `ServiceDetailIntro` |
| `kaarten` | Grid van kaarten: diensten, waarden, werkwijzestappen, herkenningspunten; met filter (sector) voor cases | `ServiceCard`, `ValuesGrid`, `ProcessTimeline`, casefilter |
| `linkkaarten` | Dienstenoverzicht op /diensten (kaart → /diensten/<slug>) | Services-overzicht |
| `feiten` | Resultaten met bron en meetperiode op een case | `CaseResults` |
| `faq` | Veelgestelde vragen (`content.items: [{vraag, antwoord}]`) | FAQ-pagina, FAQ per dienst |
| `cta` | Afsluitend blok "Laten we iets sterks neerzetten" | `CTASection` |
| `leadcta` | Kennismaking plannen (knop naar agenda of formulier) | Afspraakblok op /contact |
| `galerij` | Beeld uit een case | `PortfolioGallery` |
| `logostrook` | Klantlogo's — **alleen met toestemming**; nu niet in gebruik | — |
| `formulier_bouwer` | Contactformulier (inzendingen naar `/api/cms/lead`) | `ContactForm` |
| `nieuwsbrief` | Nieuwsbriefaanmelding (pop-up en/of inline) | `NewsletterPopup` (Mailento) |
| `flexibel` | Vrije sectie (bijv. lopende balk met woorden, "wat kun je verwachten"-stappen) | `MarqueeTicker`, stappenblok |
| `mensen` | Team op Over ons (records.teamleden) | `TeamCard` |
| `cases_grid` | Casesoverzicht (records.cases) | Cases-pagina |
| `artikelen_grid` | Artikelenoverzicht (records.artikelen) | Artikelen-pagina |

## Specifieke vragen per blok

1. **`header`**: is er een veld voor een accentdeel van de kop (groene tekst), of mag de redacteur `*tekst*`
   in de kop gebruiken? Zijn er velden voor 1–2 knoppen (tekst + link) en een kort handgeschreven accent?
2. **`kaarten`**: welk veld bevat de filterwaarde (sector-tag) en welke iconen zijn kiesbaar?
3. **`formulier_bouwer`**: hoe ziet de veldendefinitie eruit (type, label, verplicht, opties) en wat is het
   request/response-formaat van `POST /api/cms/lead` (incl. foutmeldingen en antispam)?
4. **`nieuwsbrief`**: levert het blok de Mailento-slug (`yorsocials-nieuwsbrief`) of gaat aanmelden via het CMS?
5. **`records`** (cases, artikelen, teamleden): welke velden heeft een record? Voor cases graag ook
   toestemming-klant, sector-tag en resultaten (metriek, waarde, periode, bron, goedgekeurd).
6. **`bg`**: welke tokens bestaan er naast `mist` en `nacht`?

## Voorkeur preview

Graag de `?preview`-modus achter hetzelfde token: onze staging-omgeving toont dan concepten, productie niet.
