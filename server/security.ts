import { Request, Response, NextFunction } from 'express';

// In-memory rate limiting map: IP -> { count, resetTime }
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale rate limit records every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 120000);

/**
 * Creates a rate limiter middleware for preventing abuse on API endpoints
 */
export function rateLimiter(options: { windowMs?: number; maxRequests?: number; message?: string }) {
  const windowMs = options.windowMs || 60000; // 1 minute default
  const maxRequests = options.maxRequests || 45; // 45 req/min default
  const message = options.message || 'Too many requests. Please wait a moment before retrying.';

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = extractClientIp(req);
    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        error: message,
        retryAfterSec,
      });
    }

    record.count++;
    next();
  };
}

/**
 * Extracts and sanitizes client IP from request headers or socket
 */
export function extractClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const firstIp = forwarded.split(',')[0].trim();
    // Validate that it looks like an IPv4 or IPv6
    if (/^[0-9a-fA-F:.]+$/.test(firstIp) && firstIp.length <= 45) {
      return firstIp;
    }
  }
  const socketIp = req.socket.remoteAddress;
  if (socketIp && /^[0-9a-fA-F:.]+$/.test(socketIp) && socketIp.length <= 45) {
    return socketIp;
  }
  return '127.0.0.1';
}

/**
 * Security Headers Middleware
 */
export function applySecurityHeaders(req: Request, res: Response, next: NextFunction) {
  // Remove Express identifier header
  res.removeHeader('X-Powered-By');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS filter in browsers that support it
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Prevent sensitive caching of API endpoints
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
}

/**
 * Sanitizes input text, enforcing max character boundaries and trimming whitespace
 */
export function sanitizeInput(input: any, maxLength = 20000): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input.trim().slice(0, maxLength);
}

/**
 * Simple email validation regex (RFC 5322 standard check)
 */
export function isValidEmail(email: any): boolean {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.length <= 254;
}

/**
 * Validates allowable auth roles
 */
export function isValidRole(role: any): boolean {
  return ['student', 'admin', 'recruiter'].includes(String(role).toLowerCase());
}

/**
 * Validates allowable auth event types
 */
export function isValidEventType(eventType: any): boolean {
  return ['LOGIN', 'LOGOUT', 'ROLE_SWITCH', 'SESSION_REFRESH', 'PASSWORD_RESET'].includes(String(eventType).toUpperCase());
}
