/**
 * Logica van het CMS-blok `formulier_bouwer` (gedeeld door client en server, puur en testbaar).
 * Velden: label, type (tekst|tekstvak|telefoon|bedrijf|keuze), opties (komma-gescheiden),
 * verplicht (ja|nee), toon_als ("AnderVeldLabel=Waarde"). Daarnaast altijd een e-mailveld.
 */
export type FieldType = 'tekst' | 'tekstvak' | 'telefoon' | 'bedrijf' | 'keuze';

export interface FieldDef {
  label: string;
  type: FieldType;
  options: string[];
  required: boolean;
  showIf: string;
}

const TYPES: FieldType[] = ['tekst', 'tekstvak', 'telefoon', 'bedrijf', 'keuze'];

export function parseFieldDefs(raw: unknown): FieldDef[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((v): v is Record<string, unknown> => typeof v === 'object' && v !== null)
    .map((v) => ({
      label: typeof v.label === 'string' ? v.label.trim() : '',
      type: TYPES.includes(v.type as FieldType) ? (v.type as FieldType) : 'tekst',
      options: typeof v.opties === 'string' ? v.opties.split(',').map((o) => o.trim()).filter(Boolean) : [],
      required: v.verplicht === 'ja',
      showIf: typeof v.toon_als === 'string' ? v.toon_als.trim() : '',
    }))
    .filter((f) => f.label);
}

export function fieldKey(label: string, i: number): string {
  const s = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return s || `veld_${i}`;
}

/** Faal-open: lege/ongeldige conditie of onbekend bronveld → tonen. */
export function isFieldVisible(field: FieldDef, defs: FieldDef[], values: Record<string, string>): boolean {
  const cond = field.showIf;
  const eq = cond.indexOf('=');
  if (!cond || eq < 0) return true;
  const targetLabel = cond.slice(0, eq).trim().toLowerCase();
  const targetValue = cond.slice(eq + 1).trim().toLowerCase();
  const src = defs.findIndex((d) => d.label.toLowerCase() === targetLabel);
  if (src < 0) return true;
  return (values[fieldKey(defs[src]!.label, src)] ?? '').trim().toLowerCase() === targetValue;
}

/** Zet de ingevulde velden om naar de lead-velden van het CMS. */
export function toLead(defs: FieldDef[], values: Record<string, string>) {
  let naam = '';
  let bedrijf = '';
  let telefoon = '';
  const lines: string[] = [];
  defs.forEach((d, i) => {
    if (!isFieldVisible(d, defs, values)) return;
    const v = (values[fieldKey(d.label, i)] ?? '').trim();
    if (!v) return;
    lines.push(`${d.label}: ${v}`);
    const l = d.label.toLowerCase();
    if (d.type === 'telefoon') telefoon = v;
    else if (d.type === 'bedrijf' || l.includes('bedrijf') || l.includes('organisatie')) bedrijf = v;
    else if (l.includes('naam')) naam = naam || v;
  });
  return { naam, bedrijf, telefoon, vraag: lines.join('\n') };
}

/** Geeft per zichtbaar, verplicht en leeg veld een foutmelding. */
export function missingRequired(defs: FieldDef[], values: Record<string, string>): string[] {
  return defs.filter((d, i) => d.required && isFieldVisible(d, defs, values) && !(values[fieldKey(d.label, i)] ?? '').trim()).map((d) => d.label);
}
