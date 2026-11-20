import telegramApi from '../api/telegramApi';
import checkBrowser from '../util/userAgentUtil';
import normalizeError from '../util/normalizeError';
import environmentName from './environment';
import { TELEGRAM_MAX_MESSAGE, truncate, truncateEscaped } from './truncate';

const ESCAPE_REGEX = /[_*[\]()~>#\+\-=|{}.!]/g;

const telegramAttachment = (err: any, req: any, date: Date, meta: { errorType?: string; color?: string }, options: any) => {
    let browserN = req._browserInfo || checkBrowser(req.headers['user-agent']);
    const normalized = normalizeError(err);

    const escape = (text: any) => {
        return (text || '').toString().replace(ESCAPE_REGEX, '\\$&');
    };

    let message = `*${escape(truncate(normalized.developerMessage, 500))}*\n\n`;
    message += `*Link:* ${escape(`${req.protocol}://${req.headers['host']}${req.originalUrl}`)}\n`;
    message += `*Error Type:* ${escape(meta.errorType || 'Unknown')}\n`;
    message += `*Environment:* ${escape(environmentName(options))}\n`;
    message += `*Agent:* ${escape(`${browserN.name} ${browserN.version || 'Unknown'}`)}\n`;
    message += `*O.S.:* ${escape(browserN.os || 'Unknown')}\n`;
    message += `*Mobile:* ${escape(browserN.mobile ? 'YES' : 'NO' || 'Unknown')}\n`;
    message += `*Method:* ${escape(req.method)}\n`;
    message += `*Url:* ${escape(req.originalUrl)}\n`;

    if (normalized.stack) {
        const open = '\n```\n';
        const close = '\n```';
        const budget = TELEGRAM_MAX_MESSAGE - message.length - open.length - close.length;
        if (budget > 0) message += open + truncateEscaped(escape(normalized.stack), budget) + close;
    }

    telegramApi(options, message);
};

export default telegramAttachment;
