import { afterEach, describe, expect, it, vi } from 'vitest';
import { sanitizeParams, track } from '@/lib/analytics';

describe('analytics (cookieloos)', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('verwijdert onbekende sleutels en persoonsgegevens', () => {
    expect(sanitizeParams({ placement: 'hero', destination: 'sam@voorbeeld.nl', ...({ name: 'Sam' } as object) })).toEqual({ placement: 'hero' });
  });

  it('verzamelt events lokaal zonder Plausible (er wordt niets verstuurd)', () => {
    const win: Record<string, unknown> = {};
    vi.stubGlobal('window', win);
    track('cta_click', { placement: 'hero' });
    expect(win.__ysAnalyticsLog).toEqual([{ event: 'cta_click', params: { placement: 'hero' } }]);
  });

  it('stuurt naar Plausible als die geladen is', () => {
    const plausible = vi.fn();
    vi.stubGlobal('window', { plausible });
    track('booking_click', { placement: 'header' });
    expect(plausible).toHaveBeenCalledWith('booking_click', { props: { placement: 'header' } });
  });
});
