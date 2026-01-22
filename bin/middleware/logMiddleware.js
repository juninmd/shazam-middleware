const onFinished = require('on-finished');
const ipUtil = require('../util/ipUtil');
const checkBrowser = require('../util/userAgentUtil');

const dateDiff = (ms) => {
    // Optimization: fast path for sub-second responses
    if (ms < 1000) return `${Math.floor(ms)} ms`;

    let seconds = Math.floor(ms / 1000);
    let milliseconds = Math.floor(ms % 1000);

    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;

    let parts = [];
    if (hours > 0) parts.push(`${hours} hour(s)`);
    if (minutes > 0) parts.push(`${minutes} minute(s)`);
    if (seconds > 0) parts.push(`${seconds} second(s)`);
    if (milliseconds > 0) parts.push(`${milliseconds} ms`);

    if (parts.length === 0) return "0 ms";

    return parts.join(' ');
};

const logRequest = (err, result) => {
    const startTime = result._shazamStartTime;
    // Fallback if startTime is missing (should not happen)
    if (!startTime) return;

    let t1 = process.hrtime(startTime);
    // Calculate ms: (seconds * 1000) + (nanoseconds / 1e6)
    let ms = (t1[0] * 1000) + (t1[1] / 1e6);

    let data = dateDiff(ms);
    let browserN = result.req._browserInfo || checkBrowser(result.req.headers['user-agent']);
    let message = `[ShazaM] ${result.req.method} | ${result.statusCode} | ${result.req.protocol + '://' + result.req.get('host') + result.req.originalUrl} | IP: ${ipUtil.getip(result.req)} | Response: ${data} | Browser: ${browserN.name} ${browserN.version}`;
    console.log(`${message}`);
}

module.exports = (options) => {
    return {
        log: (req, res, next) => {
            res._shazamStartTime = process.hrtime();
            onFinished(res, logRequest)
            next();
        }
    }
}
