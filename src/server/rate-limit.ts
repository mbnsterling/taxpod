const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 20;

type Key = string;

const hits = new Map<Key, { count: number; windowStart: number }>();

export function rateLimit(key: Key, options?: { windowMs?: number; max?: number }) {
  const windowMs = options?.windowMs ?? WINDOW_MS;
  const max = options?.max ?? MAX_REQUESTS;

  const now = Date.now();
  const existing = hits.get(key);

  if (!existing || now - existing.windowStart > windowMs) {
    hits.set(key, { count: 1, windowStart: now });
    return { ok: true };
  }

  if (existing.count >= max) {
    return { ok: false };
  }

  existing.count += 1;
  hits.set(key, existing);

  return { ok: true };
}

