import { createHmac, timingSafeEqual } from 'node:crypto';

/** Controleert een hex SHA-256-HMAC van de ruwe body (constant-time). Accepteert optioneel het voorvoegsel "sha256=". */
export function verifySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  const given = signature.trim().replace(/^sha256=/i, '').toLowerCase();
  if (given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given, 'utf8'), Buffer.from(expected, 'utf8'));
}
