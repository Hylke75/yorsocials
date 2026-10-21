/**
 * Rijke tekst zoals het Link & Lead-CMS die opslaat: platte tekst met een klein, veilig
 * Markdown-deel. Elke niet-lege regel = alinea, regels die met "- " beginnen = opsomming,
 * inline **vet**, *cursief* en [tekst](url). Nooit HTML; alleen veilige links.
 */
export type RichToken =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'italic'; text: string }
  | { kind: 'link'; text: string; url: string; external: boolean };

export type RichBlock = { kind: 'paragraph'; parts: RichToken[] } | { kind: 'list'; items: RichToken[][] };

const SAFE_LINK = /^(https?:\/\/|mailto:|\/|#)/i;

export function parseInline(input: string): RichToken[] {
  const tokens: RichToken[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  const pushText = (s: string) => {
    if (s) tokens.push({ kind: 'text', text: s });
  };
  while ((m = re.exec(input)) !== null) {
    if (m.index > last) pushText(input.slice(last, m.index));
    if (m[1] !== undefined) {
      const url = (m[2] ?? '').trim();
      if (SAFE_LINK.test(url)) tokens.push({ kind: 'link', text: m[1], url, external: /^https?:\/\//i.test(url) });
      else pushText(m[1]);
    } else if (m[3] !== undefined) tokens.push({ kind: 'bold', text: m[3] });
    else if (m[4] !== undefined) tokens.push({ kind: 'italic', text: m[4] });
    last = re.lastIndex;
  }
  if (last < input.length) pushText(input.slice(last));
  return tokens;
}

export function parseRichText(input: unknown): RichBlock[] {
  if (typeof input !== 'string' || !input.trim()) return [];
  const blocks: RichBlock[] = [];
  let list: RichToken[][] = [];
  const flush = () => {
    if (list.length) blocks.push({ kind: 'list', items: list });
    list = [];
  };
  for (const raw of input.split('\n')) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith('- ')) {
      list.push(parseInline(line.slice(2)));
      continue;
    }
    flush();
    blocks.push({ kind: 'paragraph', parts: parseInline(line) });
  }
  flush();
  return blocks;
}
