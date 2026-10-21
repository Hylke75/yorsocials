import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { tokens } from '@/styles/tokens';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

/** Gedeelde OG-afbeelding: echt logo + paginatitel in de huisstijl. */
export async function renderOgImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  const logo = await readFile(join(process.cwd(), 'public/brand/logo-on-dark.png'), 'base64');
  const { colors } = tokens;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: `radial-gradient(circle at 90% 10%, #4c775766, transparent 45%), ${colors.bg}`,
          color: colors.text,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo}`} width={420} height={48} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: colors.brandSageLight, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase' }}>
            <div style={{ width: 36, height: 4, background: colors.accent }} />
            {eyebrow}
          </div>
          <div style={{ fontSize: title.length > 40 ? 64 : 84, fontWeight: 700, lineHeight: 1, letterSpacing: -3, textTransform: 'uppercase', marginTop: 24, maxWidth: 1000 }}>
            {title}
          </div>
        </div>
        <div style={{ display: 'flex', height: 10, width: '100%', background: colors.brandSage, borderRadius: 6 }} />
      </div>
    ),
    ogSize,
  );
}
