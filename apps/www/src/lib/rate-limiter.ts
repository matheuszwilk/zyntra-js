import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash Redis is configured
const hasUpstashConfig = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
);

// Only create ratelimit if Upstash is configured
let ratelimit: Ratelimit | null = null;

if (hasUpstashConfig) {
  try {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.fixedWindow(20, "1h"), // 20 requests per hour
    });
  } catch (error) {
    console.warn('Failed to initialize rate limiter:', error);
  }
}

export async function checkRateLimit(identifier: string) {
  // Disable rate limiting in development or if Upstash is not configured
  if (process.env.NODE_ENV === "development" || !ratelimit) {
    return {
      success: true,
      limit: 20,
      remaining: 20,
      reset: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
  }

  return await ratelimit.limit(identifier);
}

export function getClientIP(request: Request): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(",")[0].trim();

  // Fallback to a default identifier
  return "unknown";
}




