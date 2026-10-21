import { NextResponse, type NextRequest } from 'next/server';
import { NEWSLETTER_MIN_FILL_MS, normalizeNewsletterInput, validateNewsletter } from '@/lib/newsletter';
import { deliverNewsletter } from '@/lib/newsletterDelivery';
import { createRateLimiter } from '@/lib/rateLimit';
import { isLikelySpam } from '@/lib/validation';

export const runtime = 'nodejs';

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

export async function POST(req: NextRequest) {
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ status: 'error', code: 'unsupported_media_type' }, { status: 415 });
  }
  const origin = req.headers.get('origin');
  if (origin && origin !== req.nextUrl.origin) {
    return NextResponse.json({ status: 'error', code: 'forbidden' }, { status: 403 });
  }
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rate = limiter(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { status: 'error', code: 'rate_limited', message: 'Te veel aanmeldingen. Probeer het later opnieuw.' },
      { status: 429, headers: { 'retry-after': String(rate.retryAfterSeconds) } },
    );
  }

  const text = await req.text();
  if (text.length > 4096) return NextResponse.json({ status: 'error', code: 'too_large' }, { status: 413 });
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

  const input = normalizeNewsletterInput(body);
  const errors = validateNewsletter(input);
  if (Object.keys(errors).length > 0) return NextResponse.json({ status: 'invalid', errors }, { status: 422 });

  if (isLikelySpam(body, Date.now(), NEWSLETTER_MIN_FILL_MS)) {
    return NextResponse.json({ status: 'error', code: 'rejected', message: 'Je aanmelding kon niet worden verwerkt.' }, { status: 400 });
  }

  const result = await deliverNewsletter(input);
  if (result.ok) return NextResponse.json({ status: 'subscribed' }, { status: 200 });
  if (result.reason === 'not_configured') {
    return NextResponse.json(
      { status: 'error', code: 'not_configured', message: 'Aanmelden voor de nieuwsbrief is nog niet mogelijk. Je bent níet aangemeld.' },
      { status: 503 },
    );
  }
  return NextResponse.json(
    { status: 'error', code: 'delivery_failed', message: 'Aanmelden is niet gelukt. Probeer het later opnieuw.' },
    { status: 502 },
  );
}
