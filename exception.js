const exceptionMiddleware = require('./bin/middleware/exceptionMiddleware')

module.exports = (options) => {
    console.log("[Shazam-Middleware] Exception Activated");
    return exceptionMiddleware.exception;
};