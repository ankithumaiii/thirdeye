// Simple token-bucket / sliding window in-memory rate limiter

const requestCounts = new Map();

export function rateLimiter({ max = 30, windowMs = 60000, message = 'Too many requests, please slow down.' } = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const now = Date.now();

    const record = requestCounts.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }

    requestCounts.set(ip, record);

    if (record.count > max) {
      return res.status(429).json({
        error: 'RATE_LIMIT_EXCEEDED',
        message,
        retryAfterMs: Math.max(0, record.resetTime - now)
      });
    }

    next();
  };
}
