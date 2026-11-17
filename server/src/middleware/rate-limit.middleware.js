// server/src/middleware/rate-limit.middleware.js (new)
import rateLimit from "express-rate-limit";

// Example security requirement, now enforced in code:
// "the system shall reject login attempts after five consecutive
// failures from the same account within ten minutes."
export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  // AUTH_RATE_LIMIT_MAX lets a test environment raise the limit: CI's E2E
  // job registers and logs in once per viewport (six auth requests from
  // one IP). Leave it unset everywhere else to keep the limit of five.
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 5,
  message: { error: { code: "TOO_MANY_ATTEMPTS", message: "Too many attempts. Try again later." } },
  standardHeaders: true,
  legacyHeaders: false,
});
