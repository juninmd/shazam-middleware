const slackAttachment = require('../util/slackAttachment');

const sendResult = (err, req, res, next) => {
    res.status(req.statusCode || err.statusCode || 500).send({
        message: {
            developerMessage: (err.message.developerMessage || err.message),
            userMessage: (err.message.userMessage || `An unexpected crash occurred by the application, but do not worry, it has already been automatically reported to developers.`),
        },
        details: {
            stack: err.stack || undefined,
            route: `${req.method} - ${req.protocol + '://' + req.get('host') + req.originalUrl}`,
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

            if (options.slack && (err.statusCode == null || err.statusCode >= 500 && err.statusCode <= 599)) {
                options.customize = {
                    errortype: "Route",
                    color: 'yellow'
                }
                slackAttachment(err, req, date, options);
            }

            sendResult(err, req, res, next);
        }
    }
}