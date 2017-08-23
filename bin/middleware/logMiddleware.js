const onFinished = require('on-finished')
const ipUtil = require('../util/ipUtil');

let mensagem = "";

const logRequest = () => {
    console.log(`${mensagem} | End: ${new Date().toLocaleString()}`);
}

module.exports = (options) => {
    return {
        log: (req, res, next) => {
            mensagem = `[Shazam-Middleware] ${req.method} ${req.protocol + '://' + req.get('host') + req.originalUrl} | IP: ${ipUtil.getip(req)} | Start: ${new Date().toLocaleString()}`;
            onFinished(res, logRequest)
            next();
        }
    }
}