/**
 * Zet alle website-inhoud als pagina's + blokken in het Link & Lead-CMS (POST /api/cms/sync).
 * Idempotent: opnieuw draaien werkt de pagina's per slug bij (en overschrijft daarbij wijzigingen die
 * in het CMS aan dezelfde pagina's zijn gedaan — draai dit dus alleen voor de eerste vulling).
 *
 *   CMS_TOKEN=cms_... npm run cms:push              # echt pushen
 *   npm run cms:push -- --dry-run                   # alleen content-export/cms-blauwdruk.json schrijven
 *   npm run cms:push -- --only=/juridisch/privacy   # alleen deze pagina('s) bijwerken (komma-gescheiden)
 *
 * Optioneel: CMS_URL (standaard https://linkandlead.nl), SITE_URL (basis voor beeld-URL's,
 * standaard https://yorsocials.vercel.app).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { buildBlueprint } from '../src/cms/blueprint';

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const cmsUrl = (process.env.CMS_URL || 'https://linkandlead.nl').replace(/\/+$/, '');
  const siteUrl = process.env.SITE_URL || 'https://yorsocials.vercel.app';
  const only = process.argv.find((a) => a.startsWith('--only='))?.slice('--only='.length).split(',').filter(Boolean);
  const full = buildBlueprint(siteUrl);
  // Bij --only blijft de volgorde (sort_order) gelijk aan die in de volledige blauwdruk.
  const blueprint = {
    paginas: full.paginas
      .map((p, i) => ({ ...p, sort_order: i }))
      .filter((p) => !only || only.includes(p.slug)),
  };
  if (only && blueprint.paginas.length !== only.length) {
    console.error(`Onbekende pagina in --only: ${only.filter((s) => !blueprint.paginas.some((p) => p.slug === s)).join(', ')}`);
    process.exit(1);
  }
  const blocks = blueprint.paginas.reduce((n, p) => n + p.blokken.length, 0);

  mkdirSync('content-export', { recursive: true });
  writeFileSync('content-export/cms-blauwdruk.json', JSON.stringify(blueprint, null, 2));
  console.log(`Blauwdruk: ${blueprint.paginas.length} pagina's, ${blocks} blokken → content-export/cms-blauwdruk.json`);

  if (dryRun) return;

  const token = process.env.CMS_TOKEN;
  if (!token) {
    console.error('Zet CMS_TOKEN (het API-token van de YorSocials-site) om te pushen, of gebruik --dry-run.');
    process.exit(1);
  }

  const res = await fetch(`${cmsUrl}/api/cms/sync`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify(blueprint),
  });
  const result = (await res.json().catch(() => ({}))) as { ok?: boolean; melding?: string; paginas?: number; blokken?: number; siteId?: string };
  if (!res.ok || !result.ok) {
    console.error(`✗ Mislukt (${res.status}): ${result.melding ?? 'onbekende fout'}`);
    process.exit(1);
  }
  console.log(`✓ Gesynchroniseerd: ${result.paginas} pagina's, ${result.blokken} blokken (site ${result.siteId}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
