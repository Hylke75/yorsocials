/**
 * Exporteert de seedcontent als CMS-documenten (NDJSON, één document per regel) naar
 * content-export/seed.ndjson. Bruikbaar als contentmigratie bij de keuze voor een
 * headless CMS (bijv. `sanity dataset import`, of een Directus-importscript).
 *
 *   npm run content:export
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { articles } from '../src/content/data/articles';
import { cases, sectors } from '../src/content/data/cases';
import { services } from '../src/content/data/services';
import { faqs, legalPages, siteSettings, team } from '../src/content/data/site';

type Doc = { _id: string; _type: string } & Record<string, unknown>;

const docs: Doc[] = [
  { _id: 'siteSettings', _type: 'siteSettings', ...siteSettings },
  ...sectors.map((s) => ({ _id: `sector.${s.id}`, _type: 'sector', ...s })),
  ...services.map((s) => ({ _id: `service.${s.slug}`, _type: 'service', ...s })),
  ...cases.map((c) => ({ _id: `case.${c.slug}`, _type: 'case', ...c })),
  ...articles.map((a) => ({ _id: `article.${a.slug}`, _type: 'article', ...a })),
  ...faqs.map((f) => ({ _id: `faq.${f.id}`, _type: 'faq', ...f })),
  ...team.map((m, i) => ({ _id: `teamMember.${i}`, _type: 'teamMember', ...m })),
  ...legalPages.map((p) => ({ _id: `page.${p.slug}`, _type: 'page', template: 'legal', ...p })),
];

mkdirSync('content-export', { recursive: true });
writeFileSync('content-export/seed.ndjson', docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`Geëxporteerd: ${docs.length} documenten → content-export/seed.ndjson`);
