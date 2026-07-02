import onFinished from 'on-finished';
import * as ipUtil from '../util/ipUtil';
import checkBrowser from '../util/userAgentUtil';
import { NextFunction } from 'express';

const dateDiff = (ms: number): string => {
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

const logRequest = (err: any, result: any) => {
    const startTime = result._shazamStartTime;
    if (!startTime) return;

    let t1 = process.hrtime(startTime);
    let ms = (t1[0] * 1000) + (t1[1] / 1e6);

    let data = dateDiff(ms);
    let browserN = result.req._browserInfo || checkBrowser(result.req.headers['user-agent']);
    let message = `[ShazaM] ${result.req.method} | ${result.statusCode} | ${result.req.protocol + '://' + result.req.headers['host'] + result.req.originalUrl} | IP: ${ipUtil.getip(result.req)} | Response: ${data} | Browser: ${browserN.name} ${browserN.version}`;
    console.log(`${message}`);
};

const logMiddleware = (options: any) => {
    return {
        log: (req: any, res: any, next: NextFunction) => {
            res._shazamStartTime = process.hrtime();
            onFinished(res, logRequest);
            next();
        }
    };
};

export default logMiddleware;
