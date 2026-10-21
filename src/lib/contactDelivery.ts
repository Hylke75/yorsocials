import 'server-only';
import { createHmac, randomUUID } from 'node:crypto';
import { getSiteSettings } from '@/content/repository';
import { sendCmsLead } from './cmsLead';
import { escapeHtml, type ContactInput } from './validation';

export type DeliveryResult =
  | { ok: true; id: string; channel: 'cms' | 'webhook' | 'email' }
  | { ok: false; id: string; reason: 'not_configured' | 'failed' };

interface Attempt {
  (): Promise<Response>;
}

async function withRetry(attempt: Attempt, { retries = 2, baseDelayMs = 400 } = {}): Promise<boolean> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await attempt();
      if (res.ok) return true;
      // 4xx (behalve 429) is niet herstelbaar door opnieuw te proberen.
      if (res.status < 500 && res.status !== 429) return false;
    } catch {
      // netwerkfout: opnieuw proberen
    }
    if (i < retries) await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** i));
  }
  return false;
}

function log(event: string, data: Record<string, unknown>) {
  // Bewust géén naam, e-mail of bericht loggen (functioneel ontwerp §10).
  console.info(JSON.stringify({ scope: 'contact', event, ...data, at: new Date().toISOString() }));
}

export function isDeliveryConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean((env.CMS_LEADS_DISABLED !== '1' && getSiteSettings().cmsSiteId) || env.CONTACT_WEBHOOK_URL || (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL));
}

/**
 * Levert een aanvraag af. Volgorde: CMS-leads (als de site een CMS-site-ID heeft) → webhook → e-mail.
 */
export async function deliverContact(
  input: ContactInput,
  env: NodeJS.ProcessEnv = process.env,
  meta: { startedAt?: number; page?: string } = {},
): Promise<DeliveryResult> {
  const id = randomUUID();

  // CMS_LEADS_DISABLED=1 (tests) voorkomt dat er echte leads in het CMS terechtkomen.
  const siteId = env.CMS_LEADS_DISABLED === '1' ? null : getSiteSettings().cmsSiteId;
  if (siteId) {
    const res = await sendCmsLead(
      siteId,
      {
        soort: 'contact',
        naam: input.name,
        bedrijf: input.company || undefined,
        email: input.email,
        vraag: `Onderwerp: ${input.topic}\n\n${input.message}`,
        bron_pagina: meta.page ?? '/contact',
      },
      meta.startedAt ?? Date.now() - 60_000,
    );
    log(res.ok ? 'delivered' : 'delivery_failed', { id, channel: 'cms', topic: input.topic, ...(res.ok ? {} : { status: res.status }) });
    return res.ok ? { ok: true, id, channel: 'cms' } : { ok: false, id, reason: 'failed' };
  }
  const payload = {
    id,
    receivedAt: new Date().toISOString(),
    source: 'website-contactformulier',
    name: input.name,
    email: input.email,
    company: input.company || null,
    topic: input.topic,
    message: input.message,
    privacyConsent: input.privacy,
  };

  if (env.CONTACT_WEBHOOK_URL) {
    const body = JSON.stringify(payload);
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (env.CONTACT_WEBHOOK_SECRET) {
      headers['x-yorsocials-signature'] = createHmac('sha256', env.CONTACT_WEBHOOK_SECRET).update(body).digest('hex');
    }
    const ok = await withRetry(() =>
      fetch(env.CONTACT_WEBHOOK_URL as string, { method: 'POST', headers, body, signal: AbortSignal.timeout(8000) }),
    );
    log(ok ? 'delivered' : 'delivery_failed', { id, channel: 'webhook', topic: input.topic });
    return ok ? { ok, id, channel: 'webhook' } : { ok, id, reason: 'failed' };
  }

  if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL) {
    const rows: [string, string][] = [
      ['Naam', input.name],
      ['E-mail', input.email],
      ['Bedrijf', input.company || '—'],
      ['Onderwerp', input.topic],
    ];
    const html = `<h2>Nieuwe aanvraag via yorsocials.nl</h2><table>${rows
      .map(([k, v]) => `<tr><th align="left">${k}</th><td>${escapeHtml(v)}</td></tr>`)
      .join('')}</table><p style="white-space:pre-wrap">${escapeHtml(input.message)}</p><p>Referentie: ${id}</p>`;
    const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${input.message}\n\nReferentie: ${id}`;
    const ok = await withRetry(() =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env.RESEND_API_KEY}`,
          'content-type': 'application/json',
          'idempotency-key': id,
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL,
          to: [env.CONTACT_TO_EMAIL],
          reply_to: input.email,
          subject: `Website-aanvraag: ${input.topic}`,
          html,
          text,
        }),
        signal: AbortSignal.timeout(8000),
      }),
    );
    log(ok ? 'delivered' : 'delivery_failed', { id, channel: 'email', topic: input.topic });
    return ok ? { ok, id, channel: 'email' } : { ok, id, reason: 'failed' };
  }

  log('not_configured', { id });
  return { ok: false, id, reason: 'not_configured' };
}
