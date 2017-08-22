const slackApi = require('../api/slackApi');

const getip = (req) => {
    return req.ip ||
        req._remoteAddress ||
        (req.connection && req.connection.remoteAddress) ||
        undefined
}

module.exports = (options) => {
    return {
        exception: (err, req, res, next) => {
            const date = new Date();
            console.error(`[Shazam-Middleware] ${req.method} ${req.protocol + '://' + req.get('host') + req.originalUrl} | Error: ${(err.message.developerMessage || err.message)} | Date: ${date.toLocaleString()} | IP: ${getip(req)}`);


            if (options.slack && (err.statusCode == null || err.statusCode === 500)) {
                let attachments =
                    {
                        color: "#ff0000",
                        title: (err.message.developerMessage || err.message),
                        title_link: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
                        ts: Math.round(date.getTime() / 1000),
                        mrkdwn_in: ["text", "pretext", "title"],
                        fields: [
                            {
                                "title": "Error Type",
                                "value": "Global",
                                "short": true
                            },
                            {
                                "title": "Environment",
                                "value": process.env.NODE_ENV,
                                "short": true
                            },
                            {
                                "title": 'Agente',
                                "value": req.header('user-agent') || 'Desconhecido',
                                "short": true
                            },
                            {
                                "title": req.method,
                                "value": req.originalUrl,
                                "short": true
                            },
                        ],
                    }

                if (err.stack) {
                    attachments.pretext = "```" + err.stack + "```";
                }

                slackApi(options, [attachments]);
            }


            if (res.headersSent || res.finished)
                return;


            res.status(err.statusCode || 500).send({
                message: {
                    developerMessage: (err.message.developerMessage || err.message),
                    userMessage: (err.message.userMessage || `An unexpected crash occurred by the application, but do not worry, it has already been automatically reported to developers.`),
                },
                isSuccess: false,
                details: {
                    stack: err.stack || (err.message && err.message.developerMessage || '-- Sem Stack --'),
                    isUnexpectedError: (!err.message.developerMessage),
                    route: `${req.method} - ${req.protocol + '://' + req.get('host') + req.originalUrl}`,
                    date: new Date()
                },
                statusCode: (err.statusCode || 500),
            });
        }
    }
}