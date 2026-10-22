import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { CMS_CACHE_TAG } from '@/cms/client';
import { verifySignature } from '@/lib/webhook';

export const runtime = 'nodejs';

/**
 * Publish-webhook van het Link & Lead-CMS. Header `x-ll-signature` = hex SHA-256-HMAC van de ruwe body
 * met CMS_WEBHOOK_SECRET; `x-ll-event` = gebeurtenis. Payload: { gebeurtenis, tijdstip, data }.
 * Zonder geheim staat het endpoint uit (ISR van 60 s blijft gelden).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CMS_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });

  const body = await req.text();
  if (body.length > 64 * 1024) return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 });
  if (!verifySignature(body, req.headers.get('x-ll-signature'), secret)) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
  }

  let event = req.headers.get('x-ll-event') ?? '';
  try {
    const payload = JSON.parse(body) as { gebeurtenis?: unknown };
    if (typeof payload.gebeurtenis === 'string') event = payload.gebeurtenis;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // Elke publicatie kan menu, footer en meerdere pagina's raken: alles uit het CMS direct verversen.
  revalidateTag(CMS_CACHE_TAG, { expire: 0 });
  revalidatePath('/', 'layout');
  console.info(JSON.stringify({ scope: 'cms', event: 'revalidated', trigger: event || 'onbekend', at: new Date().toISOString() }));
  return NextResponse.json({ ok: true, revalidated: true, event });
}
