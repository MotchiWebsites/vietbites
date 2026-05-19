// Lightweight rate-limit adapter with memory fallback and hooks for production stores.
// Exports: consumeIp, consumeEmail, consumeBurst, isDuplicate, setDuplicate
// In production replace internal implementations with Redis/Upstash/Vercel KV-backed versions.

type ConsumeResult =
    | { ok: true; remaining: number; resetAt: number }
    | { ok: false; remaining: 0; resetAt: number };

// Memory stores for local development / fallback
const memCounters = new Map<string, { count: number; resetAt: number }>();
const memDups = new Map<string, number>();

const now = () => Date.now();

function memConsume(key: string, windowMs: number, max: number): ConsumeResult {
    const n = now();
    const entry = memCounters.get(key);
    if (!entry || n > entry.resetAt) {
        memCounters.set(key, { count: 1, resetAt: n + windowMs });
        return { ok: true, remaining: max - 1, resetAt: n + windowMs };
    }
    if (entry.count >= max)
        return { ok: false, remaining: 0, resetAt: entry.resetAt };
    entry.count += 1;
    return { ok: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

export async function consumeIp(ip: string): Promise<ConsumeResult> {
    try {
        // In prod, swap this block with a Redis/Upstash atomic increment + TTL logic.
        return memConsume(`ip:${ip}`, 10 * 60 * 1000, 5);
    } catch (err) {
        console.warn(
            "rate-limit: consumeIp failed, falling back to memory",
            err,
        );
        return memConsume(`ip:${ip}`, 10 * 60 * 1000, 5);
    }
}

export async function consumeEmail(email: string): Promise<ConsumeResult> {
    try {
        return memConsume(`email:${email}`, 60 * 60 * 1000, 3);
    } catch (err) {
        console.warn(
            "rate-limit: consumeEmail failed, falling back to memory",
            err,
        );
        return memConsume(`email:${email}`, 60 * 60 * 1000, 3);
    }
}

export async function consumeBurst(
    key: string,
    windowMs: number,
    max: number,
): Promise<ConsumeResult> {
    try {
        return memConsume(`burst:${key}`, windowMs, max);
    } catch (err) {
        console.warn(
            "rate-limit: consumeBurst failed, falling back to memory",
            err,
        );
        return memConsume(`burst:${key}`, windowMs, max);
    }
}

export async function isDuplicate(hash: string): Promise<boolean> {
    try {
        const ver = memDups.get(hash);
        if (!ver) return false;
        if (now() > ver) {
            memDups.delete(hash);
            return false;
        }
        return true;
    } catch (err) {
        console.warn(
            "rate-limit: isDuplicate failed, assuming non-duplicate",
            err,
        );
        return false;
    }
}

export async function setDuplicate(hash: string, ttlMs: number) {
    try {
        const expires = now() + ttlMs;
        memDups.set(hash, expires);
        setTimeout(() => memDups.delete(hash), ttlMs + 1000);
    } catch (err) {
        console.warn("rate-limit: setDuplicate failed", err);
    }
}

export function hasQuotaError(errorCodes: unknown) {
    if (!Array.isArray(errorCodes)) return false;

    return errorCodes
        .map((code) => String(code).toLowerCase())
        .some(
            (code) =>
                code.includes("quota") ||
                code.includes("rate-limit") ||
                code.includes("rate limit"),
        );
}

// NOTE: To add a Redis/Upstash adapter, replace the implementations above with
// atomic INCR/GET/EXPIRE operations for consume* and use SETNX/EXPIRE for dedupe.
// Keep the same exported function signatures so callers don't change.
