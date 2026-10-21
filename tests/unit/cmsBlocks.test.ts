import { describe, expect, it } from 'vitest';
import { buildBlueprint } from '@/cms/blueprint';
import { BLOCK_COMPONENTS } from '@/cms/blocks/registry';
import { parseInline, parseRichText } from '@/cms/richtext';
import { fieldKey, isFieldVisible, missingRequired, parseFieldDefs, toLead } from '@/lib/formBuilder';

describe('CMS-rijke tekst', () => {
  it('parset alinea’s, lijsten en inline opmaak', () => {
    expect(parseRichText('Eerste **vet**\n- een\n- twee\n\nLaatste')).toEqual([
      { kind: 'paragraph', parts: [{ kind: 'text', text: 'Eerste ' }, { kind: 'bold', text: 'vet' }] },
      { kind: 'list', items: [[{ kind: 'text', text: 'een' }], [{ kind: 'text', text: 'twee' }]] },
      { kind: 'paragraph', parts: [{ kind: 'text', text: 'Laatste' }] },
    ]);
  });

  it('staat alleen veilige links toe', () => {
    expect(parseInline('[ok](/contact)')).toEqual([{ kind: 'link', text: 'ok', url: '/contact', external: false }]);
    expect(parseInline('[x](javascript:alert(1))')[0]).toMatchObject({ kind: 'text' });
  });
});

describe('formulierbouwer', () => {
  const defs = parseFieldDefs([
    { label: 'Naam', type: 'tekst', verplicht: 'ja' },
    { label: 'Onderwerp', type: 'keuze', opties: 'Video, Anders', verplicht: 'ja' },
    { label: 'Toelichting', type: 'tekstvak', verplicht: 'ja', toon_als: 'Onderwerp=Anders' },
    { label: 'Bedrijf', type: 'bedrijf' },
    { label: '', type: 'tekst' },
  ]);

  it('leest velddefinities defensief', () => {
    expect(defs.map((d) => d.label)).toEqual(['Naam', 'Onderwerp', 'Toelichting', 'Bedrijf']);
    expect(defs[1]?.options).toEqual(['Video', 'Anders']);
  });

  it('toont conditionele velden alleen bij de juiste waarde', () => {
    expect(isFieldVisible(defs[2]!, defs, { [fieldKey('Onderwerp', 1)]: 'Video' })).toBe(false);
    expect(isFieldVisible(defs[2]!, defs, { [fieldKey('Onderwerp', 1)]: 'anders' })).toBe(true);
  });

  it('controleert verplichte zichtbare velden en bouwt de lead', () => {
    const values = { naam: 'Sam', onderwerp: 'Video', bedrijf: 'Voorbeeld BV' };
    expect(missingRequired(defs, values)).toEqual([]);
    expect(missingRequired(defs, { onderwerp: 'Anders' })).toEqual(['Naam', 'Toelichting']);
    expect(toLead(defs, values)).toEqual({ naam: 'Sam', bedrijf: 'Voorbeeld BV', telefoon: '', vraag: 'Naam: Sam\nOnderwerp: Video\nBedrijf: Voorbeeld BV' });
  });
});

describe('CMS-blauwdruk', () => {
  const bp = buildBlueprint('https://yorsocials.vercel.app');

  it('dekt alle pagina’s met unieke slugs binnen de sync-limieten', () => {
    const slugs = bp.paginas.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toEqual(expect.arrayContaining(['/', '/diensten', '/cases', '/over-ons', '/artikelen', '/contact', '/faq', '/juridisch/privacy', '/juridisch/cookies']));
    expect(slugs.filter((s) => s.startsWith('/diensten/'))).toHaveLength(6);
    expect(bp.paginas.length).toBeLessThanOrEqual(50);
    for (const p of bp.paginas) expect(p.blokken.length).toBeLessThanOrEqual(30);
  });

  it('gebruikt alleen bloktypes die de site kan renderen', () => {
    for (const p of bp.paginas) for (const b of p.blokken) expect(BLOCK_COMPONENTS[b.type], `${p.slug}: ${b.type}`).toBeDefined();
  });

  it('elke pagina begint met precies één header (de H1)', () => {
    for (const p of bp.paginas) {
      expect(p.blokken[0]?.type, p.slug).toBe('header');
      expect(p.blokken.filter((b) => b.type === 'header'), p.slug).toHaveLength(1);
    }
  });

  it('gebruikt absolute beeld-URL’s', () => {
    const json = JSON.stringify(bp);
    expect(json).not.toMatch(/"(media_afbeelding|beeld)":"\/images/);
  });
});
