const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10000, // 10000 запросов за 15 минут
  message: 'Слишком много запросов с этого IP адреса, пожалуйста, попробуйте позже.',
});

module.exports = limiter;
