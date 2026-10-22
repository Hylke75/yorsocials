import { describe, expect, it } from 'vitest';
import { fillTemplate, parseAccentText, plainText } from '@/lib/text';

describe('tekst-helpers', () => {
  it('parset accenten en regeleinden', () => {
    expect(parseAccentText('Social die opvalt.\n*Content die blijft.*')).toEqual([
      [{ text: 'Social die opvalt.', accent: false }],
      [{ text: 'Content die blijft.', accent: true }],
    ]);
    expect(parseAccentText('Alles voor jouw *social groei.*')).toEqual([
      [
        { text: 'Alles voor jouw ', accent: false },
        { text: 'social groei.', accent: true },
      ],
    ]);
  });

  it('laat losse sterretjes ongemoeid', () => {
    expect(parseAccentText('Velden met * zijn verplicht.')).toEqual([[{ text: 'Velden met * zijn verplicht.', accent: false }]]);
  });

  it('vult plaatshouders in', () => {
    expect(fillTemplate('Bekijk alle {count} diensten', { count: 6 })).toBe('Bekijk alle 6 diensten');
    expect(fillTemplate('Onbekend {x}', {})).toBe('Onbekend {x}');
  });

  it('maakt platte tekst voor metadata', () => {
    expect(plainText('Meer dan\n*content.*')).toBe('Meer dan content.');
  });
});
