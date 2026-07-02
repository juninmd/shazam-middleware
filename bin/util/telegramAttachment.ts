import telegramApi from '../api/telegramApi';
import checkBrowser from '../util/userAgentUtil';

const ESCAPE_REGEX = /[_*[\]()~>#\+\-=|{}.!]/g;

const telegramAttachment = (err: any, req: any, date: Date, options: any) => {
    let browserN = req._browserInfo || checkBrowser(req.headers['user-agent']);

    const escape = (text: any) => {
        return (text || '').toString().replace(ESCAPE_REGEX, '\\$&');
    };

    let message = `*${escape(err.message.developerMessage || err.message)}*\n\n`;
    message += `*Link:* ${escape(`${req.protocol}://${req.headers['host']}${req.originalUrl}`)}\n`;
    message += `*Error Type:* ${escape(options.errorType)}\n`;
    message += `*Environment:* ${escape(process.env.NODE_ENV || 'Unknown')}\n`;
    message += `*Agent:* ${escape(`${browserN.name} ${browserN.version || 'Unknown'}`)}\n`;
    message += `*O.S.:* ${escape(browserN.os || 'Unknown')}\n`;
    message += `*Mobile:* ${escape(browserN.mobile ? 'YES' : 'NO' || 'Unknown')}\n`;
    message += `*Method:* ${escape(req.method)}\n`;
    message += `*Url:* ${escape(req.originalUrl)}\n`;

    if (err.stack) {
        message += `\n\`\`\`\n${escape(err.stack)}\n\`\`\``;
    }

    telegramApi(options, message);
};

export default telegramAttachment;
