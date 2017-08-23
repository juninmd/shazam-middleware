const onFinished = require('on-finished')
const ipUtil = require('../util/ipUtil');
const browser = require('browser-detect');

let t0 = undefined;

const dateDiff = (d) => {
    d = d / 1000;
    let r = {};
    let s = {
        hour: 3600,
        minute: 60,
        second: 1,
        ms: 0.001
    };

    Object.keys(s).forEach((key) => {
        r[key] = Math.floor(d / s[key]);
        d -= r[key] * s[key];
    });

    return `${r.hour > 0 ? r.hour + " hour(s) " : ""}${r.minute > 0 ? r.minute + " minute(s) " : ""}${r.second > 0 ? r.second + " second(s) " : ""}${r.ms > 0 ? r.ms + " ms" : ""}`;
};

const logRequest = (err, result) => {
    let t1 = process.hrtime(t0);
    let data = dateDiff((t1[0], t1[1] / 1000000).toString());
    let browserN = browser(result.req.headers['user-agent']);
    let message = `[ShazaM] ${result.req.method} | ${result.statusCode} | ${result.req.protocol + '://' + result.req.get('host') + result.req.originalUrl} | IP: ${ipUtil.getip(result.req)} | Response: ${data} | ${browserN.name} ${browserN.version}`;
    console.log(`${message}`);
}

module.exports = (options) => {
    return {
        log: (req, res, next) => {
            t0 = process.hrtime();
            onFinished(res, logRequest)
            next();
        }
    }
}

