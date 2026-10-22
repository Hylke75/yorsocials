import { Fragment } from 'react';
import { parseAccentText } from '@/lib/text';

/** Rendert een kop uit de contentlaag: `*accent*` krijgt de groene accentkleur, \n wordt een regeleinde. */
export function AccentText({ text }: { text: string }) {
  const lines = parseAccentText(text);
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line.map((seg, j) =>
            seg.accent ? (
              <span key={j} className="accent-green">
                {seg.text}
              </span>
            ) : (
              <Fragment key={j}>{seg.text}</Fragment>
            ),
          )}
        </Fragment>
      ))}
    </>
  );
}
