import { getGlobalContent } from '@/content/repository';
import { getContentMode } from '@/lib/env';

/** Zichtbare markering dat de site demo-/placeholdercontent bevat (alleen staging). */
export function StagingBanner() {
  if (getContentMode() !== 'staging') return null;
  return (
    <div
      role="note"
      style={{
        background: '#2b2410',
        color: 'var(--color-demo)',
        fontSize: 13,
        lineHeight: 1.4,
        padding: '8px var(--gutter)',
        textAlign: 'center',
        borderBottom: '1px solid #4a3d18',
      }}
    >
      {getGlobalContent().stagingBanner}
    </div>
  );
}
