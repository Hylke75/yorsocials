import { describe, expect, it } from 'vitest';
import { getGlobalContent } from '@/content/repository';
import { fromCmsPopup, localNewsletterPopup, popupsFromCms, scopeMatches } from '@/lib/popups';

const cmsPopup = (over: Record<string, unknown> = {}, inhoud: Record<string, unknown> = {}) => ({
  id: 'p1',
  vorm: 'modal',
  positie: 'onder',
  trigger: { type: 'scroll', waarde: 50 },
  inhoud: { soort: 'nieuwsbrief', kop: 'Blijf *scherp.*', tekst: 'Tips in je inbox.', ...inhoud },
  scope: { modus: 'behalve', paden: ['/contact'] },
  herhaling: { max_per_sessie: 2, cooldown_dagen: 14 },
  ...over,
});

describe('CMS-pop-ups', () => {
  it('zet een nieuwsbrief-pop-up uit het CMS om', () => {
    const p = fromCmsPopup(cmsPopup());
    expect(p).toMatchObject({ id: 'p1', kind: 'nieuwsbrief', layout: 'modal', trigger: { type: 'scroll', value: 50 }, cooldownDays: 14, maxPerSession: 2 });
    expect(p?.content.heading).toBe('Blijf *scherp.*');
  });

  it('knop-pop-ups vereisen een veilige link; leadmagnet en kapotte invoer vallen af', () => {
    expect(fromCmsPopup(cmsPopup({ vorm: 'slidein' }, { soort: 'aankondiging', knop: '/cases', knoptekst: 'Bekijk' }))).toMatchObject({ kind: 'aankondiging', layout: 'slidein' });
    expect(fromCmsPopup(cmsPopup({}, { soort: 'afspraak', knop: 'javascript:alert(1)' }))).toBeNull();
    expect(fromCmsPopup(cmsPopup({}, { soort: 'leadmagnet' }))).toBeNull();
    expect(popupsFromCms([null, 'x', cmsPopup()])).toHaveLength(1);
  });

  it('paginascope: alle, alleen, behalve en wildcards; juridische pagina’s nooit', () => {
    expect(scopeMatches({ mode: 'alle', paths: [] }, '/')).toBe(true);
    expect(scopeMatches({ mode: 'alle', paths: [] }, '/juridisch/privacy')).toBe(false);
    expect(scopeMatches({ mode: 'alleen', paths: ['/diensten/*'] }, '/diensten/paid-social')).toBe(true);
    expect(scopeMatches({ mode: 'alleen', paths: ['/diensten/*'] }, '/cases')).toBe(false);
    expect(scopeMatches({ mode: 'behalve', paths: ['/contact/'] }, '/contact')).toBe(false);
  });

  it('lokale terugval: nieuwsbrief na 3 seconden, 30 dagen pauze', () => {
    const p = localNewsletterPopup(getGlobalContent().newsletter);
    expect(p).toMatchObject({ kind: 'nieuwsbrief', trigger: { type: 'tijd', value: 3 }, cooldownDays: 30 });
  });
});
