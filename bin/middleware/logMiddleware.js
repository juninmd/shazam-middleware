const onFinished = require('on-finished')
const ipUtil = require('../util/ipUtil');
const browser = require('browser-detect');
const slackAttachment = require('../util/slackAttachment');

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

    return r;
};

const dateDiffString = (r) => {
    return `${r.hour > 0 ? r.hour + " hour(s) " : ""}${r.minute > 0 ? r.minute + " minute(s) " : ""}${r.second > 0 ? r.second + " second(s) " : ""}${r.ms > 0 ? r.ms + " ms" : ""}`;
}

const logRequest = (err, result) => {
    let t1 = process.hrtime(t0);
    let date = dateDiff((t1[0], t1[1] / 1000000).toString());
    let response = dateDiffString(date);
    let browserN = browser(result.req.headers['user-agent']);
    let message = `[ShazaM] ${result.req.method} | ${result.statusCode} | ${result.req.protocol + '://' + result.req.get('host') + result.req.originalUrl} | IP: ${ipUtil.getip(result.req)} | Response: ${response} | ${browserN.name} ${browserN.version}`;
    console.log(`${message}`);

    // Request long
    if (date.second > 2) {
        options.customize = {
            errortype: "lazy Request",
            color: 'yellow'
        }
        slackAttachment(err, result.req, date, options);
    }
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

