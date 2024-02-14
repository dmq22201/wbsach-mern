const { rateLimit } = require("express-rate-limit");

function reqLimiter(maxReq, cooldown, msg) {
  const limiter = rateLimit({
    windowMs: cooldown,
    max: maxReq,
    legacyHeaders: false,
    message: msg,
  });

  return limiter;
}

module.exports = reqLimiter;
