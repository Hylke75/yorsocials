/**
 * Eenvoudige sliding-window rate limiter in geheugen. Voldoende voor één serverinstantie;
 * bij meerdere instanties/serverless vervangen door een gedeelde store (bijv. Upstash Redis).
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return function check(key: string, now = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      const oldest = recent[0] ?? now;
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)) };
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 10_000) {
      for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
    return { allowed: true, retryAfterSeconds: 0 };
  };
}
