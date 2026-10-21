# YorSocials — designsysteem en componenten

## Visuele identiteit
Basis uit het goedgekeurde concept: bijna zwart, donkere groentinten, saliegroen uit het aangeleverde logo, gebroken wit en één uitgesproken extra accent: helder cyaan. Cyaan is niet het complement van groen. De exacte groentint van een origineel logo kan per export verschillen; bewaar altijd het originele logo en stem definitieve tokens af op het bronbestand. Foto's dienen donker, filmisch, menselijk en contentgericht te zijn. Grote editorial typografie; kleine handgetekende pijlen en cirkels als spaarzame accenten.

## Design tokens
- `--bg: #090D0D` — globale achtergrond
- `--panel: #111918` — kaarten
- `--panel2: #18211E` — secundaire vlakken
- `--green: #83A987` — merk-/tintreferentie
- `--greenlight: #A1CBA1` — leesbaar groen voor koppen
- `--cyan: #04C8F2` — heldere niet-complementaire accentkleur
- `--white: #F5F5F0` — tekst
- `--muted: #A6B2AE` — secundaire tekst
- `--line: #2B3934` — contouren
- `--radius: 18px` — kaartafronding
- `--wide: 1280px` — maximale tekst-/gridbreedte
- schaduw: `0 26px 80px #0008`
- fonts in prototype: Space Grotesk voor displaykoppen; DM Sans voor broodtekst; in productie lokaal hosten met licentie

## Typografie
H1 desktop 65–126px; mobiel 53–78px; H2 desktop 42–75px; mobiel ~42px; H3 ~25px; broodtekst 16–18px; kleine labels 12–13px. Headline uppercase met strakke letterspatiëring -0.072em. Letterlijke tekst nooit in een afbeelding insluiten als echte websitecontent.

## Spacing
Basis unit 8px. Desktop horizontale marge 46px; mobiel 19px. Sectie verticaal 100px desktop en 65px mobiel. Cards gap 16px. Breekpunten 740px en 1000px in prototype; finaliseren na componenttests.

## Losse componenten / implementatiecontract
`SiteHeader` — logo, navLinks, primaryCTA, mobileMenu, keyboard state.
`SiteFooter` — logoVariant, legalLinks, socials, contactCTA.
`HeroEditorial` — eyebrow, heading, description, image, overlay, ctaPrimary, ctaSecondary, annotation.
`MarqueeTicker` — items[], reducedMotionSupport.
`SectionHeading` — eyebrow, heading, description, alignment.
`ServiceCard` — number, icon, title, summary, image, href.
`ServiceDetailIntro` — heading, text, deliverables[], image.
`CaseCard` — title, sector, image, summary, href, approvedMetrics[].
`CaseFilter` — category options, activeValue, onChange, resultCount, emptyState.
`CaseResults` — metrics[], period, sourceNote; alleen geverifieerde cijfers.
`PortfolioGallery` — images[], captions, alt, mobileOrder.
`ArticleCard` — title, excerpt, category, image, date, href.
`ArticleContent` — richText with semantic headings/images/captions.
`TeamCard` — name, role, portrait, link, publishConsent.
`ValuesGrid` — icon, title, description.
`ProcessTimeline` — steps[] (number, title, copy, optional image).
`AccordionFAQ` — items[], supports aria-expanded and keyboard.
`ContactForm` — fields, error mapping, loading, success, retry, consent checkbox.
`CTASection` — heading, body, primaryCTA, secondaryCTA, visualAccent.
`ConsentBanner` / `ConsentPreferences` — cookie-category state and persistence.
`LoadingIndicator` — async feedback without layout shift.
`EmptyState`, `ErrorState`, `Toast`, `Breadcrumbs`, `SeoMeta`.

## Ontwerpbestanden en losse assets
`website/assets/logo.png`: bij benadering vrijgemaakt gekleurd logo voor donkere achtergrond, prototype-gebruik.
`website/assets/logo-white-original.png`: aangeleverd beeldbestand.
`website/assets/*.jpg`: uitsneden uit eerdere AI-mockups; alleen placeholders. Ze kunnen rastertekst, fictieve kledingmerken of overlays bevatten en zijn NIET bedoeld als publicatieklare fotografische assets.
`design-referenties/*.png`: vijf eerder goedgekeurde/presenteerde pagina-impressies (home, services, cases, over ons, contact), géén los bewerkbare bronbestanden.
`website/style.css`: volledig losse CSS/tokens.
`website/content.js`: tekst- en paginadata als losse objecten.
`website/app.js`: losse componentrendering, navigatie, filters, accordion en demoformulier.
`componenten/design-tokens.json`: tokens in een door code te verwerken formaat.
`componenten/component-inventory.json`: herbruikbare bouwblokken en props.

## Gedrag en nuances
Gelaagdheid wordt bereikt met fotografische overlays, vlakverschillen, positionering en subtiele schaduwen. Vermijd willekeurige 3D-emoji; gebruik consistente pictogrammen. Groen is het identiteitssignaal; cyaan is voor interactie en grafische dynamiek. Kies geen extra opvallende concurrerende accentkleur. Zorg dat de contrastkleur van koppen toegankelijk is. Gebruik geen ongefundeerde cijfers uit referentiebeelden.
