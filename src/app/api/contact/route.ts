import { NextResponse, type NextRequest } from 'next/server';
import { deliverContact } from '@/lib/contactDelivery';
import { createRateLimiter } from '@/lib/rateLimit';
import { hasErrors, isLikelySpam, normalizeContactInput, validateContact } from '@/lib/validation';

export const runtime = 'nodejs';

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
const MAX_BODY_BYTES = 16 * 1024;

function clientKey(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ status: 'error', code: 'unsupported_media_type' }, { status: 415 });
  }

  // Alleen verzoeken vanaf de eigen site accepteren.
  const origin = req.headers.get('origin');
  if (origin && origin !== req.nextUrl.origin) {
    return NextResponse.json({ status: 'error', code: 'forbidden' }, { status: 403 });
  }

  const rate = limiter(clientKey(req));
  if (!rate.allowed) {
    return NextResponse.json(
      { status: 'error', code: 'rate_limited', message: 'Je hebt te veel berichten verstuurd. Probeer het later opnieuw.' },
      { status: 429, headers: { 'retry-after': String(rate.retryAfterSeconds) } },
    );
  }

  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) {
    return NextResponse.json({ status: 'error', code: 'too_large' }, { status: 413 });
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json({ status: 'error', code: 'invalid_json' }, { status: 400 });
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return NextResponse.json({ status: 'error', code: 'invalid_json' }, { status: 400 });
  }
  const body = raw as Record<string, unknown>;

  const input = normalizeContactInput(body);
  const errors = validateContact(input);
  if (hasErrors(errors)) {
    return NextResponse.json({ status: 'invalid', errors }, { status: 422 });
  }

  if (isLikelySpam(body)) {
    // Geen hint geven aan bots; wel niets doorsturen.
    console.info(JSON.stringify({ scope: 'contact', event: 'spam_blocked', at: new Date().toISOString() }));
    return NextResponse.json({ status: 'error', code: 'rejected', message: 'Je bericht kon niet worden verwerkt.' }, { status: 400 });
  }

  const result = await deliverContact(input);
  if (result.ok) {
    return NextResponse.json({ status: 'sent', reference: result.id }, { status: 200 });
  }
  if (result.reason === 'not_configured') {
    return NextResponse.json(
      {
        status: 'error',
        code: 'not_configured',
        message: 'Het contactformulier is nog niet gekoppeld. Je bericht is níet verzonden.',
      },
      { status: 503 },
    );
  }
  return NextResponse.json(
    { status: 'error', code: 'delivery_failed', message: 'Je bericht kon niet worden verzonden. Probeer het opnieuw.' },
    { status: 502 },
  );
}
