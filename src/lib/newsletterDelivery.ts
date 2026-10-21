import 'server-only';
import { createHmac, randomUUID } from 'node:crypto';
import type { NewsletterInput } from './newsletter';

export type NewsletterResult = { ok: true; id: string } | { ok: false; id: string; reason: 'not_configured' | 'failed' };

async function postWithRetry(url: string, init: RequestInit, retries = 2): Promise<boolean> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(8000) });
      if (res.ok) return true;
      // 409 = contact bestaat al: voor de bezoeker is dat gewoon "aangemeld".
      if (res.status === 409) return true;
      if (res.status < 500 && res.status !== 429) return false;
    } catch {
      // netwerkfout: opnieuw proberen
    }
    if (i < retries) await new Promise((r) => setTimeout(r, 400 * 2 ** i));
  }
  return false;
}

function log(event: string, data: Record<string, unknown>) {
  // Nooit het e-mailadres loggen.
  console.info(JSON.stringify({ scope: 'newsletter', event, ...data, at: new Date().toISOString() }));
}

/**
 * Levert een aanmelding af bij de nieuwsbriefdienst. Ondersteund:
 * - NEWSLETTER_WEBHOOK_URL (+ optioneel NEWSLETTER_WEBHOOK_SECRET): POST JSON naar bijv. CRM/automation.
 * - RESEND_API_KEY + RESEND_AUDIENCE_ID: contact toevoegen aan een Resend-audience.
 */
export async function deliverNewsletter(input: NewsletterInput, env: NodeJS.ProcessEnv = process.env): Promise<NewsletterResult> {
  const id = randomUUID();
  if (env.NEWSLETTER_WEBHOOK_URL) {
    const body = JSON.stringify({ id, email: input.email, consent: input.consent, source: 'website-popup', subscribedAt: new Date().toISOString() });
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (env.NEWSLETTER_WEBHOOK_SECRET) headers['x-yorsocials-signature'] = createHmac('sha256', env.NEWSLETTER_WEBHOOK_SECRET).update(body).digest('hex');
    const ok = await postWithRetry(env.NEWSLETTER_WEBHOOK_URL, { method: 'POST', headers, body });
    log(ok ? 'subscribed' : 'failed', { id, channel: 'webhook' });
    return ok ? { ok, id } : { ok, id, reason: 'failed' };
  }
  if (env.RESEND_API_KEY && env.RESEND_AUDIENCE_ID) {
    const ok = await postWithRetry(`https://api.resend.com/audiences/${encodeURIComponent(env.RESEND_AUDIENCE_ID)}/contacts`, {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ email: input.email, unsubscribed: false }),
    });
    log(ok ? 'subscribed' : 'failed', { id, channel: 'resend' });
    return ok ? { ok, id } : { ok, id, reason: 'failed' };
  }
  log('not_configured', { id });
  return { ok: false, id, reason: 'not_configured' };
}
