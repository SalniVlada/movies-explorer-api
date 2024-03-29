const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 1000, // до 100 запросов с одного IP (за 15 минут)
});

module.exports = { limiter };
