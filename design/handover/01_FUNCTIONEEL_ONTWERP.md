# YorSocials — functioneel ontwerp publieke website
Versie 1.0 · 19 oktober 2026 · status: overdrachtsconcept

## 1. Doel en afbakening
Een uitgesproken publieke agency-website voor YorSocials, bedoeld om merkvertrouwen op te bouwen, het dienstenaanbod begrijpelijk te maken, relevante opdrachten te laten zien en aanvragen te genereren. Dit is NIET het CRM uit de aangeleverde CRM V3-feedback. De CRM-briefing beschrijft een interne applicatie; de publieke website vraagt om een afzonderlijke scope.

**Bronnen en zekerheidsniveau**
- Bevestigd: aangeleverde YorSocials-logo's; door de gebruiker goedgekeurde donkergroene/cyaan visuele richting; Jungle Creations services als inspiratie; vraag om alle pagina's en bouwbare overdracht.
- Ontwerpvoorstel: sitestructuur, diensten, contentblokken, formulieren en technologie hieronder; klant dient definitieve commerciële propositie te bevestigen.
- Niet bevestigd: echte klanten, cases, resultaten, bedrijfsgeschiedenis, teamleden, contactgegevens, kantooradres, prijzen, juridische entiteit, social-profielen en afspraaklink. Geen verzonnen claims live zetten.

## 2. Gebruikers en conversies
1. Beslisser bij een MKB-merk: wil snel zien wat YorSocials levert, cases bekijken en een kennismaking plannen.
2. Marketingmanager: wil diensten, werkwijze, concrete aanpak en bewijs kunnen beoordelen.
3. Potentiële samenwerkingspartner: wil team, cultuur en contactmogelijkheden vinden.
4. Redacteur/beheerder: wil pagina's, cases, team en artikelen beheren zonder code.

Primaire conversie: kwalitatieve kennismakingsaanvraag. Secundair: contactbericht. Ondersteunend: klik naar specifieke dienst, case en artikel.

## 3. Definitieve informatiearchitectuur (16 templates / routes)
- `/` — Homepage: merkbelofte, service-overzicht, aanpak, uitgelichte cases, CTA.
- `/services` — Services overzicht; 6 gekoppelde dienstkaarten.
- `/services/social-strategie` — Dienstdetail.
- `/services/content-creatie` — Dienstdetail.
- `/services/video-reels` — Dienstdetail.
- `/services/paid-social` — Dienstdetail.
- `/services/community-management` — Dienstdetail.
- `/services/analyse-optimalisatie` — Dienstdetail.
- `/cases` — Portfolio met filters op sector en geverifieerde projecten.
- `/cases/[slug]` — Case-template; probleem, aanpak, bewijs, media, CTA.
- `/over-ons` — Positionering, verhaal, waarden, werkwijze, team.
- `/artikelen` — Kennisbank met categorieën en listing.
- `/artikelen/[slug]` — Artikeltemplate met relevante diensten en CTA.
- `/contact` — Contactopties, formulier, afspraakroute en verwachtingen.
- `/faq` — Vragen en antwoorden; accordeon.
- `/privacy` — Juridische privacyverklaring, door bevoegde partij aan te leveren.
- `/cookies` — Cookiebeleid en voorkeuren, op werkelijke tracking afgestemd.
- `404` — Onbekende URL en nuttige teruglink.

NB: In de interactieve demo zijn client-side `#/`-routes gebruikt voor makkelijke offline weergave. In productie echte server-side URL's zoals hierboven gebruiken. Een `sitemap.xml`, `robots.txt` en indien noodzakelijk aanvullende wettelijke pagina's toevoegen.

## 4. Header, navigatie, footer
Header op desktop sticky, achtergrond donker met fijne onderrand. Links origineel logo; primaire menulinks Home, Services, Cases, Over ons, Artikelen, Contact; rechts opvallende cyaan CTA. Mobiel: toegankelijk uitklapmenu, zichtbare focus en escape/close-gedrag. Footer: merk, tagline, belangrijkste links, privacy/cookies, social-profielen zodra geverifieerd en CTA.

## 5. Functionele specificaties per template
### Homepage
Hero met één H1, merkintroductie, foto/video-placeholder en twee CTA's. Horizontale merk-ticker, compacte services, methode, geselecteerde cases, CTA. Alle kaarten klikken door. Geen gefingeerde logo's, statistieken of klantnamen.
### Services en detail
Servicekaarten dragen icoon, titel, omschrijving, beeld, CTA. Elke detailpagina bevat probleem/herkenning, aanbod, concrete deliverables, werkwijze, bewijs of FAQ en aanvraag-CTA. Geen lege links.
### Cases en case-detail
Sectorfilters veranderen direct het raster en tonen een lege toestand. Case-detail ondersteunt klant (alleen na goedkeuring), context, doel, interventie, materiaal (met toestemming), gemeten resultaten, bron/meetperiode en quote (met toestemming). Geen claims zonder verifieerbare bron. Voorbeeldcontent blijft als demo herkenbaar.
### Over ons
Echt merkverhaal, echte portretten, rollen, waarden en werkwijze. Teamdata eenvoudig te beheren; geen nepteam.
### Artikelen
Listing met categorieën, titel, samenvatting en cover. Detail met auteur, publicatiedatum, inhoud, gerelateerde artikelen, metadata en CTA. Ondersteun rich text, alt-tekst, externe links en captions.
### Contact
Formuliervelden: naam*, e-mail*, bedrijf, dienst/onderwerp*, bericht*, privacy-akkoord*. Client- en servervalidatie; veldspecifieke foutmeldingen; honeypot of server-side antispam en rate limiting; bescherming tegen scriptinjectie; bij succes een echte bevestigingsstatus; bij fout herstelactie. Lever e-mail aan bestemming of CRM via beveiligde server-side route met logging en retry. Verstuur geen persoonsgegevens in analytics-events. Afspraakknop pas activeren met bevestigde boekingslink.
### FAQ
Uitklapbare antwoorden met `<button>`, `aria-expanded`, toetsenbordbediening. Optioneel FAQ structured data alleen als richtlijnen dit toestaan.
### Privacy/cookies
Geen tracking vóór geldige toestemming voor niet-noodzakelijke cookies; opt-in en intrekken/wijzigen; registreer versies van teksten en consent. Laat inhoud juridisch toetsen.
### 404
Duidelijke foutmelding en links naar Home en Contact.

## 6. CMS / contentmodel
`siteSettings`: logo, socialLinks, email, phone, bookingUrl, defaultSEO.
`service`: slug, title, eyebrow, summary, intro, heroImage, icon, bulletPoints[], process[], seo, status.
`case`: slug, clientName, permissionGranted, title, sector, context, objective, approach, outputs[], results[{metric, value, unit, period, source, approved}], quote?, gallery[], seo, published.
`teamMember`: name, role, portrait, bio, links, consentConfirmed, sortOrder, published.
`article`: slug, title, category, excerpt, heroImage, bodyRichText, author, publishedAt, relatedServices[], seo, status.
`faq`: question, answer, category, published, order.
`page`: template, title, sections[], seo, status.

Media asset verplicht: breedte/hoogte, alt, focal point, bron/licentie, optioneel transcript. Verwijderen van een case moet de navigatie, sitemap en gerelateerde kaarten automatisch actualiseren.

## 7. Interacties / toestanden
- Navigatie: hover, keyboard-focus, active en mobiel open/gesloten.
- Paginaovergang: geen dode CTA; toon waar nodig laadstatus.
- Sectorfilter: actieve knop, live resultaten en leeg-resultaatstate.
- Formulier: leeg, focus, fout, verzenden, succesvol, serverfout; dubbele inzending voorkomen.
- FAQ: dicht, open en keyboard-focus.
- Kaarten: klikbaar oppervlak, focus zichtbaar, subtiele hover, reduced-motion respecteren.
- Media: video met expliciete play, poster, captions en geen autoplay met geluid.
- Cookievoorkeuren: onbekend, geaccepteerd, geweigerd, aangepast, opnieuw openen.

## 8. Responsive ontwerp
Desktop vanaf 1200px: max-content 1280px, drie kolommen services, brede hero.
Tablet 741–1199px: twee kolommen kaarten, kleinere typografie en ruime touch targets.
Mobiel tot 740px: één kolom, header met menu, beeld achter of onder de hero, CTA's direct zichtbaar, formulieren verticaal. Minimaal 44 × 44px voor tappable elementen. Test op 320px, 375px, 768px, 1024px en 1440px.

## 9. SEO, performance, toegankelijkheid
- Semantische HTML, één H1 per pagina, titel en unieke meta description.
- Canonicals, Open Graph/Twitter metadata, XML-sitemap, robotsregels en passende structured data (`Organization`, `BreadcrumbList`, `Article`).
- Content en metadata server-renderen of statisch genereren; hash-routing demo niet overnemen.
- Afbeeldingen AVIF/WebP met srcset, lazy loading buiten viewport, explicit width/height.
- Richtwaarden Core Web Vitals: LCP <= 2,5 s, CLS <= 0,1 en INP <= 200 ms bij praktijkmetingen.
- WCAG 2.2 AA als acceptatiedoel: contrast, toetsenbord, skiplink, focus, labels, foutmeldingen, alt-tekst, reduced motion, visuele hiërarchie.
- Controleer vooral de donkere letters van het logo op zwarte achtergrond: gebruik geschikte contrastvariant; merkassets niet zomaar wijzigen.

## 10. Privacy en beveiliging
HTTPS, CSP, HSTS, secure cookies, beperkte toegangsrechten voor CMS. Formulier server-side valideren; log geen volledige contactberichten. AVG: doelbinding, bewaartermijn en verwerkersovereenkomsten afstemmen op werkelijke leveranciers. Cookies alleen op basis van daadwerkelijke scripts.

## 11. Analytics en conversiemeting
Events (zonder persoonsgegevens): `page_view`, `cta_click` met destination/placement, `service_view`, `case_filter`, `case_view`, `form_start`, `form_submit_success`, `form_submit_error`, `booking_click`. Alleen activeren binnen geldige toestemmingsinstellingen. Dashboards meten kwalitatieve aanvragen en marketingfunnels; geen fictieve resultaten tonen op de site.

## 12. Acceptatiecriteria en definitie van gereed
1. Alle routes bestaan in productie als echte pagina's zonder 404's; interne links werken.
2. Geen placeholdermerknamen, klantclaims, quotes of telefoonnummer zichtbaar als echt.
3. Klant kan via CMS diensten, cases, teksten en artikelen wijzigen zonder code.
4. Contactformulier slaagt bij geldig verzoek, blokkeert ongeldige input en geeft expliciete fout-/succesmeldingen.
5. Responsief en bediening met toetsenbord, screenreader en touch getest.
6. Aantoonbare consentflow vóór advertentie-/analytics-scripts.
7. SEO metadata en crawlbaarheid gecontroleerd.
8. Alle afbeeldingen zijn gelicenseerd of eigendom en geoptimaliseerd.
9. Cypress/Playwright end-to-end tests voor navigatie, formulier, filter, accordions, mobiel menu en 404.
10. Performance en security checks uitgevoerd op staging; opdrachtgever geeft expliciet akkoord voor livegang.

## 13. Nog aan te leveren / te beslissen
Echte teamleden en foto's; definitief aanbod; 3–6 cases met toestemming, bron en resultaten; gevalideerde social links; email/telefoon; afspraakplatform; juridische organisatiegegevens; privacypolicy/cookies; CMS-keuze; hosting, analytics, CRM-koppeling; contentredacteur en beheerproces.

## 14. Bouwfasering
Fase 1: design tokens + componentbibliotheek + routing + responsive layout.
Fase 2: alle templates + CMS + contentstructuur.
Fase 3: formulieren, consent, analytics, SEO en media.
Fase 4: QA, performance, security, acceptatie en productie.
