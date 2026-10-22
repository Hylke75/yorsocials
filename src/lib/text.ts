/** Vervangt `{naam}`-plaatshouders in een tekst uit de contentlaag. */
export function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => (key in vars ? String(vars[key]) : m));
}

export type AccentSegment = { text: string; accent: boolean };

/** Splitst een kop met mini-opmaak in regels met (accent-)segmenten: `*accent*`, \n = nieuwe regel. */
export function parseAccentText(input: string): AccentSegment[][] {
  return input.split('\n').map((line) =>
    line
      .split(/(\*[^*]+\*)/)
      .filter(Boolean)
      .map((part) => (part.startsWith('*') && part.endsWith('*') && part.length > 2 ? { text: part.slice(1, -1), accent: true } : { text: part, accent: false })),
  );
}

/** Platte tekst zonder opmaaktekens (voor metadata, aria-labels). */
export function plainText(input: string): string {
  return input.replace(/\*/g, '').replace(/\n/g, ' ');
}
