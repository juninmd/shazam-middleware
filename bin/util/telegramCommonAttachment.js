const telegramApi = require('../api/telegramApi');

const ESCAPE_REGEX = /[_*[\]()~>#\+\-=|{}.!]/g;

module.exports = (err, options, errorType) => {
    const escape = (text) => {
        return (text || '').toString().replace(ESCAPE_REGEX, '\\$&');
    }

    let message = `*${escape(err.message)}*\n\n`;
    message += `*Error Type:* ${escape(errorType)}\n`;
    message += `*Environment:* ${escape((options.env != null ? options.env.NODE_ENV : null || process.env.NODE_ENV))}\n`;

    if (err.stack) {
        message += `\n\`\`\`\n${escape(err.stack)}\n\`\`\``;
    }

    telegramApi(options, message);
};
