const telegramApi = require('../api/telegramApi');
const checkBrowser = require('../util/userAgentUtil');

const ESCAPE_REGEX = /[_*[\]()~>#\+\-=|{}.!]/g;

module.exports = (err, req, date, options) => {
    let browserN = req._browserInfo || checkBrowser(req.headers['user-agent']);

    const escape = (text) => {
        return (text || '').toString().replace(ESCAPE_REGEX, '\\$&');
    }

    let message = `*${escape(err.message.developerMessage || err.message)}*\n\n`;
    message += `*Link:* ${escape(`${req.protocol}://${req.get('host')}${req.originalUrl}`)}\n`;
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
}
