import telegramApi from '../api/telegramApi';

const ESCAPE_REGEX = /[_*[\]()~>#\+\-=|{}.!]/g;

const telegramCommonAttachment = (err: any, options: any, errorType: string) => {
    const escape = (text: any) => {
        return (text || '').toString().replace(ESCAPE_REGEX, '\\$&');
    };

    let message = `*${escape(err.message)}*\n\n`;
    message += `*Error Type:* ${escape(errorType)}\n`;
    message += `*Environment:* ${escape((options.env != null ? options.env.NODE_ENV : null || process.env.NODE_ENV))}\n`;

    if (err.stack) {
        message += `\n\`\`\`\n${escape(err.stack)}\n\`\`\``;
    }

    telegramApi(options, message);
};

export default telegramCommonAttachment;
