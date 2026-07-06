/**
 * In-memory sliding window rate limiter.
 *
 * Suitable for single-instance deployments (Vercel serverless functions per region).
 * For global multi-instance rate limiting, replace with Upstash Redis.
 *
 * Usage:
 *   const result = rateLimit(req, { limit: 20, windowMs: 60_000 });
 *   if (!result.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface RateLimitOptions {
  /** Max number of requests allowed in the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
  /** Optional key prefix to namespace separate limiters */
  prefix?: string;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number; // Unix timestamp (ms)
}

// Map of key -> sorted array of request timestamps
const store = new Map<string, number[]>();

// Cleanup old keys every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  Array.from(store.entries()).forEach(([key, timestamps]) => {
    if (timestamps.length === 0 || timestamps[timestamps.length - 1] < now - 3_600_000) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach((key) => store.delete(key));
}, 300_000);

function getClientKey(req: NextRequest | Request, prefix = "rl"): string {
  let ip = "unknown";

  if (req instanceof NextRequest) {
    ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
  }

  // Limit key length to avoid memory issues
  const safeIp = ip.replace(/[^a-zA-Z0-9.:_-]/g, "_").substring(0, 64);
  return `${prefix}:${safeIp}`;
}

export function rateLimit(
  req: NextRequest | Request,
  options: RateLimitOptions
): RateLimitResult {
  const { limit, windowMs, prefix = "rl" } = options;
  const now = Date.now();
  const windowStart = now - windowMs;
  const key = getClientKey(req, prefix);

  // Get or create the timestamp array for this key
  let timestamps = store.get(key) || [];

  // Drop timestamps outside the current window
  timestamps = timestamps.filter((t) => t > windowStart);

  const remaining = Math.max(0, limit - timestamps.length);
  const resetAt = timestamps.length > 0 ? timestamps[0] + windowMs : now + windowMs;

  if (timestamps.length >= limit) {
    store.set(key, timestamps);
    return { success: false, limit, remaining: 0, resetAt };
  }

  timestamps.push(now);
  store.set(key, timestamps);

  return { success: true, limit, remaining: remaining - 1, resetAt };
}

/**
 * Returns a 429 NextResponse with standard rate limit headers.
 */
export function rateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    { success: false, error: "Too many requests. Please slow down and try again." },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
        "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
      },
    }
  );
}

/**
 * Convenience: check rate limit and immediately return 429 if exceeded.
 * Returns null if within limit, or a NextResponse to return immediately if exceeded.
 *
 * Usage in API route:
 *   const limited = checkRateLimit(req, { limit: 20, windowMs: 60_000 });
 *   if (limited) return limited;
 */
export function checkRateLimit(
  req: NextRequest | Request,
  options: RateLimitOptions
): NextResponse | null {
  const result = rateLimit(req, options);
  if (!result.success) return rateLimitResponse(result);
  return null;
}
