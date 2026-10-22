# Definitieve opdracht aan Claude Code — YorSocials publieke website

Je bent een senior frontend engineer, UX engineer en accessibility specialist. Bouw de COMPLETE publieke YorSocials-website op basis van dit pakket. Het eerdere CRM-project hoort niet bij deze opdracht.

## Lees eerst verplicht
1. `documentatie/01_FUNCTIONEEL_ONTWERP.md` als bron voor scope en acceptatie.
2. `documentatie/02_DESIGNSYSTEEM_EN_COMPONENTEN.md` voor alle designkeuzes.
3. `documentatie/04_PAGINAMATRIX.md` voor paginadekking.
4. `componenten/design-tokens.json` en `componenten/component-inventory.json`.
5. `website/index.html`, `website/style.css`, `website/app.js`, `website/content.js` als klikbaar prototype.
6. `design-referenties/*.png` uitsluitend als visuele referentie, NIET als finale, gecodeerde pagina of als vervanging voor echte fotografie.

## Stack en architectuur
Aanbevolen: Next.js (App Router) + TypeScript + CSS modules of Tailwind + headless CMS (bijv. Sanity/Directus; keuze bevestigen). Gebruik echte leesbare routes zonder hash, server-rendering/SSG, modulair componentensysteem, data-gedreven templates en afbeeldingen met responsive bronnen. Zet geen bedrijfsinhoud hardcoded in tientallen componenten.

## Bouw ALLE pagina's
Home; Services-overzicht; 6 services-details; Cases-overzicht; Case-detailtemplate; Over ons; Artikelen-overzicht; Artikeldetail; Contact; FAQ; Privacy; Cookies; 404. Voeg waar relevant breadcrumbs, gerelateerde content en consistente CTA's toe.

## Afzonderlijke componenten
Bouw elk component uit de inventory als los bestand met typed props, ARIA waar nodig, responsive states, hover/focus/loading/error states en Storybook of equivalent voorbeelden. Bouw een tokensbestand voor kleuren, spacing, typografie, radii, elevation en breakpoints. Maak iconen los als SVG of icons via een consistente library. Gebruik het aangeleverde logo; niet namaken met tekst.

## Interactie
Werkende casefilters met URL-queryparameters; toegankelijke FAQ; mobiel menu; contactformulieren met server-side validatie, antispam en e-mail/CRM-koppeling na bevestiging van bestemming; consentmanager die tracking blokkeert tot geldige toestemming; geplande afspraak-CTA alleen activeren wanneer echte URL bekend is. Gebruik nooit een demo-'succes'-melding die suggereert dat gegevens echt verstuurd zijn. Zorg voor analytics events na consent.

## Contentintegriteit
Nooit verzonnen klanten, werkelijke omzetgroei, campagnes, testimonials, teamleden, prijzen, e-mails, telefoonnummers of referentielogo's presenteren als feiten. Demo-assets en dummyteksten expliciet markeren in staging. Als benodigde data ontbreken: maak CMS velden met `draft`/`unpublished` en een overzicht van ontbrekende input. Publiceer géén juridische placeholderpagina als definitief.

## Quality gates
- TypeScript strict, linting, tests en succesrijke build.
- Unit-tests voor formuliervalidatie, filterlogica en routing.
- E2E (Playwright) voor belangrijkste conversieroutes, toetsenbordnavigatie, contactformulier en mobiel menu.
- WCAG 2.2 AA; aanwijsbare focus, alt-teksten, correcte heading-hiërarchie en reduced motion.
- SEO per route, metadata, sitemap, robots, OG-afbeeldingen, structured data.
- PageSpeed en echte Core Web Vitals optimaliseren; media comprimeren en fonts lokaal hosten.
- Controleer visuele overeenkomst met referentiebeelden op 375, 768, 1440 breedte.
- Voeg README, `.env.example`, seed-content, contentmigraties en deploymentinstructies toe.

## Werkvolgorde en oplevering
(1) Verifieer alle bronbestanden en markeer ontbrekende gegevens. (2) Initialiseer project, tokens en componentbibliotheek. (3) Bouw routing en layout. (4) Implementeer alle templates en CMS schema's. (5) Voeg interacties, contact-endpoint en consent toe. (6) Voeg SEO en performance toe. (7) Test. (8) Lever werkende productie-build met screenshots, route-overzicht, testresultaten en resterende contentvragen. Stop niet na alleen de homepage of vijf mockuppagina's.
