import Link from 'next/link';
import { parseRichText, type RichToken } from '../richtext';

function Inline({ tokens }: { tokens: RichToken[] }) {
  return (
    <>
      {tokens.map((t, i) => {
        if (t.kind === 'bold') return <strong key={i}>{t.text}</strong>;
        if (t.kind === 'italic') return <em key={i}>{t.text}</em>;
        if (t.kind === 'link')
          return t.external ? (
            <a key={i} href={t.url} target="_blank" rel="noopener noreferrer">
              {t.text}
              <span className="visually-hidden"> (opent in nieuw venster)</span>
            </a>
          ) : (
            <Link key={i} href={t.url}>
              {t.text}
            </Link>
          );
        return <span key={i}>{t.text}</span>;
      })}
    </>
  );
}

/** Rendert CMS-rijke tekst als alinea's en lijsten (veilig, zonder HTML uit de invoer). */
export function RichText({ value, className }: { value: unknown; className?: string }) {
  const blocks = parseRichText(value);
  if (!blocks.length) return null;
  return (
    <div className={className}>
      {blocks.map((b, i) =>
        b.kind === 'list' ? (
          <ul key={i}>
            {b.items.map((item, j) => (
              <li key={j}>
                <Inline tokens={item} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            <Inline tokens={b.parts} />
          </p>
        ),
      )}
    </div>
  );
}
