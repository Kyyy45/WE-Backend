import rateLimit from 'express-rate-limit';

const points = Number(process.env.RATE_LIMIT_POINTS ?? 100);
const duration = Number(process.env.RATE_LIMIT_DURATION ?? 60);

const limiter = rateLimit({
  windowMs: duration * 1000,
  max: points,
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
