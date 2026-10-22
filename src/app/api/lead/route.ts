import { NextResponse, type NextRequest } from 'next/server';
import { getSiteSettings } from '@/content/repository';
import { sendCmsLead } from '@/lib/cmsLead';
import { createRateLimiter } from '@/lib/rateLimit';
import { isLikelySpam, isValidEmail } from '@/lib/validation';

export const runtime = 'nodejs';

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Inzendingen van het CMS-blok `formulier_bouwer` → leads in het Link & Lead-CMS. */
export async function POST(req: NextRequest) {
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ ok: false, melding: 'Ongeldige aanvraag.' }, { status: 415 });
  }
  const origin = req.headers.get('origin');
  if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ ok: false, melding: 'Niet toegestaan.' }, { status: 403 });
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rate = limiter(ip);
  if (!rate.allowed) {
    return NextResponse.json({ ok: false, melding: 'Te veel aanvragen. Probeer het later opnieuw.' }, { status: 429, headers: { 'retry-after': String(rate.retryAfterSeconds) } });
  }
  const text = await req.text();
  if (text.length > 16 * 1024) return NextResponse.json({ ok: false, melding: 'Te groot.' }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(text) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, melding: 'Ongeldige aanvraag.' }, { status: 400 });
  }

  const email = clip(body.email, 254).toLowerCase();
  if (!isValidEmail(email)) return NextResponse.json({ ok: false, melding: 'Vul een geldig e-mailadres in.' }, { status: 422 });
  if (isLikelySpam({ website: body._website, startedAt: body._ts })) {
    return NextResponse.json({ ok: false, melding: 'Je aanvraag kon niet worden verwerkt.' }, { status: 400 });
  }

  const siteId = process.env.CMS_LEADS_DISABLED === '1' ? null : getSiteSettings().cmsSiteId;
  if (!siteId) {
    return NextResponse.json({ ok: false, melding: 'Het formulier is nog niet gekoppeld. Je aanvraag is níet verzonden.' }, { status: 503 });
  }
  const res = await sendCmsLead(
    siteId,
    {
      soort: 'contact',
      email,
      naam: clip(body.naam, 200) || undefined,
      bedrijf: clip(body.bedrijf, 200) || undefined,
      telefoon: clip(body.telefoon, 50) || undefined,
      vraag: clip(body.vraag, 4000) || undefined,
      bron_pagina: clip(body.bron_pagina, 200) || undefined,
    },
    Number(body._ts) || Date.now() - 60_000,
  );
  console.info(JSON.stringify({ scope: 'lead', event: res.ok ? 'delivered' : 'delivery_failed', at: new Date().toISOString() }));
  return res.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, melding: res.message }, { status: res.status >= 400 ? res.status : 502 });
}
