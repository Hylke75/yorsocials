# Deployment

## Vereisten

- Node.js ≥ 20.9 (getest met 22)
- Een host die Next.js met een Node-server draait (Vercel, Netlify, een container/VM met `npm start`, …).
  De pagina's worden statisch gegenereerd en elke 60 s ververst met de CMS-inhoud (ISR); de API-routes draaien server-side.

## Omgevingsvariabelen

Zie [`.env.example`](../.env.example).

| Variabele | Verplicht | Toelichting |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | aanbevolen | Basis-URL voor canonicals, sitemap en OG. Leeg op Vercel → het productiedomein van het project (`VERCEL_PROJECT_PRODUCTION_URL`). Zet hem zodra www.yorsocials.nl gekoppeld is. |
| `NEXT_PUBLIC_CONTENT_MODE` | ja | `staging` of `production` (build-time). |
| `CONTACT_WEBHOOK_URL` | één van beide | POST JSON naar CRM/automation. Verwacht 2xx. Retry bij 5xx/429/netwerkfout. |
| `CONTACT_WEBHOOK_SECRET` | aanbevolen | HMAC-SHA256 van de body in header `x-yorsocials-signature`. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | één van beide | E-maillevering via Resend; afzenderdomein moet geverifieerd zijn. |
| `CMS_TOKEN` | ja (voor CMS) | API-token van de YorSocials-site in het Link & Lead-CMS (`cms_…`). **Geheim: alleen als Vercel-variabele, nooit committen.** Leeg → ingebouwde inhoud. |
| `CMS_URL` | nee | Standaard `https://linkandlead.nl`. |
| `CMS_WEBHOOK_SECRET` | aanbevolen | Geheim van de CMS-webhook naar `/api/revalidate`; zonder dit is een wijziging binnen 60 s zichtbaar. |
| `CMS_LEADS_DISABLED` | nee | `1` = geen leads naar het CMS sturen (tests/lokaal). |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | nee | Cookieloze statistieken via Plausible. |

Leads gaan eerst naar het CMS (site-id in `src/content/data/site.ts`), daarna naar webhook/Resend als die zijn ingesteld.
Zonder enige bestemming retourneert `/api/contact` een 503 en ziet de bezoeker dat het bericht **niet** is verzonden.

## Stappen

```bash
npm ci
npm run check          # typecheck, lint, unit-tests, build
npm run test:e2e       # tegen de productiebuild
npm start              # of deploy naar je platform
```

Aanbevolen: een staging-omgeving (`NEXT_PUBLIC_CONTENT_MODE=staging`, eigen domein, eventueel achter
wachtwoordbeveiliging) en een productie-omgeving (`production`).

## Beveiliging

`next.config.ts` zet op alle routes: Content-Security-Policy, HSTS (`max-age=2 jaar; preload`),
`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy` en `Permissions-Policy`.
De CSP gebruikt `'unsafe-inline'` voor scripts (nodig voor Next.js zonder nonces, zodat pagina's statisch
kunnen blijven). Wil je strikter: schakel over op nonces via `src/proxy.ts` (maakt pagina's dynamisch).

De rate limiter (`src/lib/rateLimit.ts`, 5 verzoeken per 10 minuten per IP) staat in geheugen. Bij meerdere
serverinstanties of serverless: vervang door een gedeelde store (bijv. Upstash Redis) of gebruik de
rate limiting / WAF van het hostingplatform.

## Performance

- Alle pagina's worden statisch gegenereerd; fonts lokaal (woff2, `font-display: swap`), afbeeldingen via
  `next/image` (AVIF/WebP, `srcset`, lazy loading buiten de viewport, expliciete afmetingen).
- Meet echte Core Web Vitals na livegang (LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms). De huidige placeholderbeelden
  zijn laag van resolutie; met echte fotografie opnieuw meten.

## Livegang-checklist

- [ ] Alle blokkerende punten uit [ONTBREKENDE_CONTENT.md](ONTBREKENDE_CONTENT.md) opgelost
- [ ] Contactbestemming geconfigureerd en end-to-end getest (echte e-mail/CRM-ontvangst)
- [ ] Juridische pagina's vastgesteld en op `published` gezet
- [ ] `NEXT_PUBLIC_CONTENT_MODE=production` en juiste `NEXT_PUBLIC_SITE_URL`
- [ ] Sitemap ingediend in Google Search Console
- [ ] Lighthouse/PageSpeed en security headers gecontroleerd op productie
- [ ] Expliciet akkoord opdrachtgever
