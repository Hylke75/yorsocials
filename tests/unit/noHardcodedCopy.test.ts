import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Bewaakt dat redactionele tekst in de contentlaag blijft (src/content/data) en niet
 * terugsluipt in pagina's of componenten. Zoekt naar JSX-tekstnodes van drie of meer woorden.
 * Uitzonderingen: systeem-/foutmeldingen, schermlezerteksten en de interne styleguide.
 */
const ROOTS = ['src/app', 'src/components'];
const IGNORE_FILES = [/styleguide/, /ContactForm\.tsx$/, /NewsletterPopup\.tsx$/, /ErrorState|EmptyState|LoadingIndicator|Toast/];
// Schermlezer-/toetsenbordteksten (skiplink, visueel verborgen koppen) mogen in de code blijven.
const ALLOWED = [/opent in nieuw venster/, /Bezig met/, /Stap \d/, /Je ingevulde gegevens/, /^Direct naar inhoud$/, /^Wat je krijgt$/];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? files(p) : p.endsWith('.tsx') ? [p] : [];
  });
}

describe('geen vaste redactionele tekst in pagina’s en componenten', () => {
  it('alle zichtbare tekst komt uit de contentlaag', () => {
    const offenders: string[] = [];
    for (const file of ROOTS.flatMap(files)) {
      if (IGNORE_FILES.some((re) => re.test(file))) continue;
      const src = readFileSync(file, 'utf8');
      // Tekst tussen > en < die uit minstens drie woorden met letters bestaat.
      for (const m of src.matchAll(/>\s*([A-Za-zÀ-ÿ’'][^<>{}]*?)\s*</g)) {
        const text = m[1]!.trim();
        if (text.split(/\s+/).length < 3) continue;
        if (/[=();?:&|`$]|=>/.test(text)) continue; // code, geen tekst
        if (ALLOWED.some((re) => re.test(text))) continue;
        offenders.push(`${file}: "${text}"`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
