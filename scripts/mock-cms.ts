/**
 * Nep-CMS voor tests: serveert GET /api/cms/content in exact het contractformaat, gevuld met de
 * blauwdruk (alle pagina's + blokken) plus voorbeeldnavigatie, -merk, -records en een redirect.
 * Alleen voor lokaal testen — de site praat in productie uitsluitend met het echte CMS.
 *
 *   npx tsx scripts/mock-cms.ts            # luistert op :4010, token "mock"
 */
import { createServer } from 'node:http';
import { buildBlueprint } from '../src/cms/blueprint';

const PORT = Number(process.env.MOCK_CMS_PORT ?? 4010);
const blueprint = buildBlueprint(process.env.SITE_URL || 'https://yorsocials.vercel.app');

const body = {
  ok: true,
  site: {
    naam: 'YorSocials',
    domein: 'www.yorsocials.nl',
    design_tokens: {},
    config: {},
    locale: 'nl',
    merk: {
      naam: 'YorSocials',
      logo: null,
      logo_licht: null,
      logo_kleur: null,
      favicon: null,
      socials: { linkedin: 'https://www.linkedin.com/company/voorbeeld' },
      contact: { email: 'test@voorbeeld.nl', adres: 'Teststraat 1', postcode_plaats: '1234 AB Teststad' },
      tagline: 'MOCK-tagline uit het CMS',
      slogan: null,
      badges: [],
    },
    navigatie: {
      hoofd: [
        { titel: 'Home', href: '/' },
        { titel: 'Diensten', href: '/diensten' },
        { titel: 'Cases', href: '/cases' },
        { titel: 'Over ons', href: '/over-ons' },
        { titel: 'Artikelen', href: '/artikelen' },
        { titel: 'Contact', href: '/contact' },
      ],
      footer: [
        { kop: 'Menu', links: [{ titel: 'Home', href: '/' }, { titel: 'FAQ', href: '/faq' }] },
        { kop: 'MOCK-kolom', links: [{ titel: 'Paid social', href: '/diensten/paid-social' }] },
      ],
      juridisch: [
        { titel: 'Privacy', href: '/juridisch/privacy' },
        { titel: 'Cookies', href: '/juridisch/cookies' },
      ],
      actie: { titel: 'Plan een kennismaking', href: '/contact' },
    },
    redirects: [{ van: '/oud', naar: '/diensten', status: 301 }],
  },
  paginas: blueprint.paginas.map((p) => ({ ...p, og_beeld: null, blokken: p.blokken.map((b) => ({ type: b.type, bg: b.bg ?? null, content: b.content })) })),
  records: {
    artikelen: [
      {
        id: 'a1',
        slug: 'test-artikel',
        titel: 'MOCK: testartikel uit het CMS',
        rubriek: 'Strategie',
        antwoordblok: 'Kort antwoord.',
        samenvatting: 'Samenvatting van het testartikel.',
        hoofdtekst: 'Eerste alinea met **vet** en een [link](/contact).\n- punt een\n- punt twee',
        foto: null,
        gepubliceerd_op: '2026-10-01',
        auteur: 'Redactie',
      },
    ],
    teamleden: [{ id: 't1', naam: 'MOCK Teamlid', functie: 'Strateeg', tekst: 'Testbio.', foto: null, linkedin: null }],
    cases: [
      { id: 'c1', klantnaam: 'MOCK Klant', sector: 'Horeca', uitdaging: 'Meer bereik.', aanpak: 'Reels-format.', resultaat_cijfer: '', resultaat_periode: '', schakels: [], citaat: '', foto: null },
      { id: 'c2', klantnaam: 'MOCK Winkel', sector: 'Retail', uitdaging: 'Meer winkelbezoek.', aanpak: 'Lokale campagne.', resultaat_cijfer: '', resultaat_periode: '', schakels: [], citaat: '', foto: null },
    ],
  },
  popups: [
    {
      id: 'pop-nieuwsbrief',
      vorm: 'modal',
      positie: 'onder',
      trigger: { type: 'tijd', waarde: 2 },
      inhoud: { soort: 'nieuwsbrief', eyebrow: 'Nieuwsbrief', kop: 'MOCK: *nieuwsbrief* uit het CMS', tekst: 'Pop-uptekst uit het CMS.', knoptekst: 'Inschrijven' },
      scope: { modus: 'behalve', paden: ['/faq'] },
      herhaling: { max_per_sessie: 1, cooldown_dagen: 30 },
    },
    {
      id: 'pop-faq',
      vorm: 'slidein',
      positie: 'onder',
      trigger: { type: 'tijd', waarde: 1 },
      inhoud: { soort: 'afspraak', kop: 'MOCK: vraag niet beantwoord?', tekst: 'Plan een kennismaking.', knoptekst: 'Naar contact', knop: '/contact' },
      scope: { modus: 'alleen', paden: ['/faq'] },
      herhaling: { max_per_sessie: 1, cooldown_dagen: 7 },
    },
  ],
};

createServer((req, res) => {
  if (req.url?.startsWith('/api/cms/content') && req.headers.authorization === 'Bearer mock') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(body));
    return;
  }
  res.writeHead(401, { 'content-type': 'application/json' });
  res.end('{"ok":false}');
}).listen(PORT, () => console.log(`Mock-CMS op http://localhost:${PORT} (token: mock)`));
