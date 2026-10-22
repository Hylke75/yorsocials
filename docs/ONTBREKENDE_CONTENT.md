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
| Privacyverklaring | Volledig uitgeschreven (versie 1.0, 22 oktober 2026) op basis van de werkelijke verwerkingen: contactformulier (CMS van Link & Lead), nieuwsbrief (Mailento, double opt-in), hosting (Vercel), Supabase. Nog aanvullen: officiële bedrijfsnaam, KvK-nummer en adres van YorSocials; bewaartermijnen laten bevestigen door YorSocials. | Aanvullen bedrijfsgegevens |
| Cookiebeleid | Conceptstructuur; werkelijke cookies (consentcookie, evt. GA4) staan beschreven. Laten toetsen. | **Ja** |
| Verwerkersovereenkomsten | Met hosting, e-mail/CRM- en analyticsleverancier. | **Ja** |

Na vaststelling: in `legalPages` (`src/content/data/site.ts`) `status: 'published'`, `lastReviewed` en `version` invullen.

## Technische beslissingen

| Beslissing | Huidige stand | Actie |
|---|---|---|
| CMS | Koppeling met het Link & Lead-CMS is af: pagina's, navigatie, merk, records, pop-ups, redirects en leads (zie [CMS.md](CMS.md)). | Zie de CMS-checklist hieronder. |
| Bestemming contactformulier | Leads gaan naar het CMS (Leads); optioneel ook webhook of Resend. | Controleren dat leads in `/admin` binnenkomen. |
| Nieuwsbriefdienst | Gekoppeld aan Mailento (lijst `yorsocials-nieuwsbrief`, double opt-in). | Mailento opnemen in de privacyverklaring als verwerker (verwerkersovereenkomst). |
| Analytics | Cookieloos via Plausible ondersteund (geen cookiemelding nodig). Niet geconfigureerd. | Plausible-domein instellen als `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, of geen analytics. |
| Hosting | Vercel (project `yorsocials`, team Hylke's projects). | Na merge productiebranch op `main` zetten; www.yorsocials.nl koppelen. |
| Domein | `NEXT_PUBLIC_SITE_URL` voorbeeld `https://www.yorsocials.nl` (niet bevestigd). | Bevestigen. |
| Contentredacteur en beheerproces | Onbekend. | Beleggen. |

## CMS-checklist (eenmalig)

1. In `/admin/platform` een **nieuw API-token** voor YorSocials genereren (het eerder gedeelde token is
   ingetrokken) en in Vercel zetten als `CMS_TOKEN` (Production + Preview). Daarna opnieuw deployen.
2. Eerste vulling: `CMS_TOKEN=cms_… npm run cms:push` (15 pagina's, 77 blokken). Daarna alleen nog in `/admin` bewerken.
3. **Navigatie** invullen: hoofdmenu (Home, Services → `/diensten`, Cases, Over ons, Artikelen, Contact),
   footerkolommen, juridische links (Privacy → `/juridisch/privacy`, Cookies → `/juridisch/cookies`) en de
   actieknop (Plan een kennismaking → `/contact`).
4. **Merk** invullen: logo (licht, voor de donkere achtergrond), tagline, contactgegevens, KvK, LinkedIn.
5. **Pop-ups**: een pop-up van soort *Nieuwsbrief* aanmaken (bijv. modal, na 3 seconden, alle pagina's,
   30 dagen pauze). Zolang het CMS gekoppeld is en hier niets actief staat, toont de site géén pop-up.
6. **Records**: echte teamleden, cases en artikelen (met toestemming) toevoegen.
7. Optioneel: webhook naar `https://<domein>/api/revalidate` met een geheim, en dat geheim als `CMS_WEBHOOK_SECRET` in Vercel.
