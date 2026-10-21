import 'server-only';

export const CMS_LEAD_ENDPOINT = 'https://linkandlead.nl/api/cms/lead';

export interface CmsLead {
  soort: 'contact' | 'nieuwsbrief';
  naam?: string;
  bedrijf?: string;
  email: string;
  telefoon?: string;
  vraag?: string;
  bron_pagina?: string;
}

export type CmsLeadResult = { ok: true } | { ok: false; status: number; message: string };

/**
 * Zet een aanvraag door naar de leads van het Link & Lead-CMS. Server-side (geen Origin-header),
 * omdat het CMS browserverzoeken alleen vanaf het eigen domein van de site accepteert. `_ts` is het
 * moment waarop de bezoeker begon (CMS-antispam: < 2 s = bot).
 */
export async function sendCmsLead(siteId: string, lead: CmsLead, startedAt: number): Promise<CmsLeadResult> {
  try {
    const res = await fetch(CMS_LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ site_id: siteId, herkomst: 'yorsocials-website', _website: '', _ts: startedAt, ...lead }),
      signal: AbortSignal.timeout(10000),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; melding?: string };
    if (res.ok && data.ok) return { ok: true };
    return { ok: false, status: res.status, message: data.melding || 'De aanvraag kon niet worden verwerkt.' };
  } catch {
    return { ok: false, status: 502, message: 'Het CMS is tijdelijk niet bereikbaar.' };
  }
}
