import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
        ? new Redis({
              url: process.env.UPSTASH_REDIS_REST_URL,
              token: process.env.UPSTASH_REDIS_REST_TOKEN,
          })
        : null

if (!redis) {
    console.warn(
        "[rateLimit] UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN are not set — rate limiting is disabled."
    )
}

// Magic-link login: blocks email-bombing an arbitrary address via repeated sign-in requests.
export const authLimiter = redis
    ? new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(5, "5 m"),
          prefix: "rl:auth",
          analytics: false,
      })
    : null

// Any mutating API call (POST/PUT/PATCH/DELETE) — body-log, checkout, account changes, etc.
export const writeLimiter = redis
    ? new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(30, "1 m"),
          prefix: "rl:write",
          analytics: false,
      })
    : null

// Baseline for everything else under /api (GET reads, admin sync, etc.).
export const readLimiter = redis
    ? new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(60, "1 m"),
          prefix: "rl:read",
          analytics: false,
      })
    : null

export async function checkRateLimit(limiter: Ratelimit | null, identifier: string) {
    if (!limiter) return { success: true, reset: 0 }
    const { success, reset } = await limiter.limit(identifier)
    return { success, reset }
}
