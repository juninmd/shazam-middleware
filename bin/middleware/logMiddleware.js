const onFinished = require('on-finished')

const logRequest = () => {
    console.log(`[Shazam-Middleware] Fim Request | Date: ${new Date().toLocaleString()}`);
}
module.exports = (options) => {
    return {
        log: (req, res, next) => {
            console.log(`[Shazam-Middleware] ${req.method} ${req.protocol + '://' + req.get('host') + req.originalUrl} | Date: ${new Date().toLocaleString()} | IP: ${getip(req)}`);

            onFinished(res, logRequest)
            next();
        }
    }
}