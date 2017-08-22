const logMiddleware = require('./bin/middleware/logMiddleware.js')

module.exports = (options) => {
    console.log("[Shazam-Middleware] Log Activated");
    return logMiddleware.log;
};