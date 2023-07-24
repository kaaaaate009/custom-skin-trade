const rateLimit = require("express-rate-limit");

exports.logInLimiter = rateLimit({
    windowMs: 60 * 1000, //1 min time window
    max: 50,
    message: 'Too many login request. Try again later',
    handler: (req, res, next) => {
        let err = new Error('Too many login requests. Try again after few minutes');
        err.status = 429;
        return next(err);
    }
});