# Ontbrekende content en open beslissingen

Overzicht van alles wat nog door YorSocials (of een bevoegde partij) moet worden aangeleverd of besloten.
**Blokkerend** = nodig vóór livegang (`NEXT_PUBLIC_CONTENT_MODE=production`).

## Content

| Onderdeel | Wat ontbreekt | Waar invullen | Blokkerend |
|---|---|---|---|
| Fotografie | Nu Pexels-stockfoto's (gelicentieerd, zie [BEELDCREDITS.md](BEELDCREDITS.md)). Eigen fotografie van team, werk en studio maakt de site geloofwaardiger; stockfoto's mogen niet als team- of klantbeeld worden gebruikt. | `src/content/data/media.ts`, `public/images/` | Nee (aanbevolen) |
| Logo | Akkoord op de contrastvariant `logo-on-dark.png`, of een officiële lichte logo-export. Liefst ook een SVG-versie. | `public/brand/` | **Ja** |
| Dienstenaanbod | De zes diensten en hun teksten zijn een ontwerpvoorstel. Definitieve propositie, deliverables en werkwijze per dienst bevestigen. | `src/content/data/services.ts` | **Ja** |
| Cases | 3–6 echte cases met schriftelijke toestemming, context, doel, aanpak, beeldmateriaal met toestemming, resultaten met bron + meetperiode, eventueel quote met akkoord. Huidige 4 cases zijn demo. | `src/content/data/cases.ts` | Nee (pagina toont een nette lege toestand) |
| Artikelen | Redactioneel gecontroleerde artikelen met auteur en publicatiedatum. Huidige 3 zijn voorbeelden. | `src/content/data/articles.ts` | Nee |
| Team | Echte teamleden: naam, rol, portret, bio, publicatietoestemming. | `team` in `src/content/data/site.ts` | Nee (sectie verborgen zonder team) |
| Merkverhaal | Echte ontstaansgeschiedenis voor Over ons (nu conceptcopy). | `about.story` in `src/content/data/pages.ts` | Aanbevolen |
| FAQ | Antwoorden zijn neutraal geformuleerd; laten bevestigen. | `faqs` in `src/content/data/site.ts` | Aanbevolen |

## Bedrijfsgegevens

| Onderdeel | Status | Waar invullen | Blokkerend |
|---|---|---|---|
| E-mailadres | `null` | `siteSettings.email` | Aanbevolen |
| Telefoonnummer | `null` | `siteSettings.phone` | Nee |
| Social-profielen | leeg; alleen `verified: true` wordt getoond | `siteSettings.socialLinks` | Nee |
| Afspraaklink (Calendly/Cal.com e.d.) | `null` → CTA verwijst naar formulier | `siteSettings.bookingUrl` | Nee |
| Juridische entiteit (naam, KvK, adres) | `null` | `siteSettings.legalEntity` | **Ja** (privacyverklaring) |

## Juridisch

| Onderdeel | Status | Blokkerend |
|---|---|---|
| Privacyverklaring | Conceptstructuur, gemarkeerd als niet definitief, `noindex`. Tekst laten vaststellen op basis van werkelijke verwerkingen, leveranciers en bewaartermijnen. | **Ja** |
| Cookiebeleid | Conceptstructuur; werkelijke cookies (consentcookie, evt. GA4) staan beschreven. Laten toetsen. | **Ja** |
| Verwerkersovereenkomsten | Met hosting, e-mail/CRM- en analyticsleverancier. | **Ja** |

Na vaststelling: in `legalPages` (`src/content/data/site.ts`) `status: 'published'`, `lastReviewed` en `version` invullen.

## Technische beslissingen

| Beslissing | Huidige stand | Actie |
|---|---|---|
| CMS | Link & Lead-CMS (headless) aangemaakt; read-API werkt maar is nog leeg. Alle sitetekst staat gestructureerd in `src/content/data/` (zie [CMS.md](CMS.md)). | Contentmodel in het CMS inrichten en `src/content/repository.ts` laten lezen uit `linkandlead.nl/api/cms/content`. |
| Bestemming contactformulier | Ondersteund: webhook (CRM/automation, met HMAC-handtekening) of e-mail via Resend. Niet geconfigureerd. | Bestemming kiezen en env-variabelen zetten. **Blokkerend.** |
| Nieuwsbriefdienst | Gekoppeld aan Mailento (lijst `yorsocials-nieuwsbrief`, double opt-in). | Mailento opnemen in de privacyverklaring als verwerker (verwerkersovereenkomst). |
| Analytics | GA4 ondersteund, laadt alleen na toestemming. Niet geconfigureerd. | Leverancier kiezen (of geen). Bij een andere leverancier: loader + CSP aanpassen. |
| Hosting | Nog niet gekozen; zie [DEPLOYMENT.md](DEPLOYMENT.md). | Kiezen. Bij meerdere serverinstanties: gedeelde rate-limitstore. |
| Domein | `NEXT_PUBLIC_SITE_URL` voorbeeld `https://www.yorsocials.nl` (niet bevestigd). | Bevestigen. |
| Contentredacteur en beheerproces | Onbekend. | Beleggen. |
