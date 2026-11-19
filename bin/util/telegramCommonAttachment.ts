import telegramApi from '../api/telegramApi';
import { TELEGRAM_MAX_MESSAGE, truncate, truncateEscaped } from './truncate';

const ESCAPE_REGEX = /[_*[\]()~>#\+\-=|{}.!]/g;

const telegramCommonAttachment = (err: any, options: any, errorType: string) => {
    const escape = (text: any) => {
        return (text || '').toString().replace(ESCAPE_REGEX, '\\$&');
    };

    let message = `*${escape(truncate(String(err.message), 500))}*\n\n`;
    message += `*Error Type:* ${escape(errorType)}\n`;
    message += `*Environment:* ${escape((options.env != null ? options.env.NODE_ENV : null || process.env.NODE_ENV))}\n`;

    if (err.stack) {
        const open = '\n```\n';
        const close = '\n```';
        const budget = TELEGRAM_MAX_MESSAGE - message.length - open.length - close.length;
        if (budget > 0) message += open + truncateEscaped(escape(err.stack), budget) + close;
    }

    telegramApi(options, message);
};

export default telegramCommonAttachment;
