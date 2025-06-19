// lib/rateLimiter.ts

const rateLimitWindow = 60 * 1000; // 1 minute
const maxRequests = 5;

type RateLimitInfo = {
  count: number;
  timestamp: number;
};

const ipRequests = new Map<string, RateLimitInfo>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const info = ipRequests.get(ip);

  if (!info || now - info.timestamp > rateLimitWindow) {
    ipRequests.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (info.count < maxRequests) {
    info.count += 1;
    return false;
  }

  return true;
}
