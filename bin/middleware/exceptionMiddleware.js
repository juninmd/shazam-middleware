const slackAttachment = require('../util/slackAttachment');
const telegramAttachment = require('../util/telegramAttachment');
const discordAttachment = require('../util/discordAttachment');
const checkBrowser = require('../util/userAgentUtil');

const sendResult = (err, req, res, next) => {
    res.status(req.statusCode || err.statusCode || 500).send({
        message: {
            developerMessage: (err.message.developerMessage || err.message),
            userMessage: (err.message.userMessage || `An unexpected crash occurred by the application, but do not worry, it has already been automatically reported to developers.`),
        },
        details: {
            stack: err.stack || undefined,
            // Optimization: req.headers['host'] is ~20x faster than req.get('host')
            route: `${req.method} - ${req.protocol + '://' + req.headers['host'] + req.originalUrl}`,
            date: new Date()
        },
        statusCode: (req.statusCode || err.statusCode || 500),
    });
}


module.exports = (options) => {
    return {
        exception: (err, req, res, next) => {
            const date = new Date();
            console.error(`[ShazaM] Common Error: ${(err.message.developerMessage || err.message.userMessage || err.message)}`);

            options.typeError = `Common Error`;

            // Optimization: Parse user agent once and cache on request object to avoid redundant calls
            if (req && req.headers && !req._browserInfo) {
                req._browserInfo = checkBrowser(req.headers['user-agent']);
            }

            if ((options.slack || options.telegram || options.discord) && (err.statusCode == null || err.statusCode >= 500 && err.statusCode <= 599)) {
                options.customize = {
                    errortype: "Route",
                    color: '#FFFF00'
                }

                if (options.slack)
                    slackAttachment(err, req, date, options);

                if (options.telegram)
                    telegramAttachment(err, req, date, options);

                if (options.discord)
                    discordAttachment(err, req, date, options);
            }

            sendResult(err, req, res, next);
        }
    }
}