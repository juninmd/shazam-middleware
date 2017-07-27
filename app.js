const apiRequest = require('./apiRequest');

module.exports = (options) => {
    handlePromises(options);
    handleGlobal(options);
    console.log(`[Shazam-Middleware] Activated`);
    return {
        log: (req, res, next) => {
            console.log(`[Shazam-Middleware] ${req.method} ${req.protocol + '://' + req.get('host') + req.originalUrl} | Date: ${new Date().toLocaleString()} | IP: ${getip(req)}`);
            next();
        },
        exception: (err, req, res, next) => {
            let date = new Date();
            console.error(`[Shazam-Middleware] ${req.method} ${req.protocol + '://' + req.get('host') + req.originalUrl} | Error: ${(err.message.developerMessage || err.message)} | Date: ${date.toLocaleString()} | IP: ${getip(req)}`);


            if (options.slack && (err.statusCode == null || err.statusCode === 500)) {
                let attachments = [
                    {
                        color: "#ff0000",
                        title: (err.message.developerMessage || err.message),
                        title_link: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
                        footer: `[${req.method}] - ${req.originalUrl}`,
                        ts: Math.round(date.getTime() / 1000),
                        pretext: "```" + err.stack + "```",
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
                            }
                        ],
                    }
                ];
                sendSlack(options, attachments);
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
                    stack: err.stack || '-- Sem Stack --',
                    isUnexpectedError: (!err.message.developerMessage),
                    route: `${req.method} - ${req.protocol + '://' + req.get('host') + req.originalUrl}`,
                    date: new Date()
                },
                statusCode: (err.statusCode || 500),
            });
        }
    }
};


function sendSlack(options, attachments) {
    let paramters = {
        url: options.slack.urlHook,
        method: 'POST',
        body: {
            text: "*" + options.api.name + " - " + options.api.version + "*",
            username: (options.slack.botusername || "Shazam"),
            channel: options.slack.channel,
            icon_url: (options.slack.iconUrl || "http://dclegends.wiki/images/d/d9/Shazam_Billy_Batson_Portrait.png"),
            attachments: attachments
        },
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        json: true
    };

    apiRequest.requestApi(paramters)
        .then(q => {
            console.log(`[Shazam-Middleware] Notified on #channel ${options.slack.channel}`);
        })
        .catch(err => {
            console.log(`[Shazam-Middleware] ${err}`);
        });

}
function getip(req) {
    return req.ip ||
        req._remoteAddress ||
        (req.connection && req.connection.remoteAddress) ||
        undefined
}

let handleGlobal = (options) => {
    process.on('uncaughtException', (err) => {
        let date = new Date();

        console.error(`[Shazam-Middleware] Global Error | ${err.message}\nStack:\n${err.stack}`);

        if (options.slack) {
            let attachments = [
                {
                    color: "#ff0000",
                    title: err.message,
                    ts: Math.round(date.getTime() / 1000),
                    pretext: "```" + err.stack + "```",
                    mrkdwn_in: ["text", "pretext", "title"],
                    fields: [
                        {
                            "title": "Error Type",
                            "value": "Global Error",
                            "short": true
                        },
                        {
                            "title": "Environment",
                            "value": (options.env.NODE_ENV || process.env.NODE_ENV),
                            "short": true
                        }
                    ],

                }
            ];
            sendSlack(options, attachments);
        }
    });
}
let handlePromises = (options) => {
    process.on('unhandledRejection', (err, p) => {
        let date = new Date();

        console.error(`[Shazam-Middleware] Promise Error | ${err.message}\nStack:\n${err.stack}`);

        if (options.slack) {
            let attachments = [
                {
                    color: "#ff0000",
                    title: err.message,
                    ts: Math.round(date.getTime() / 1000),
                    pretext: "```" + err.stack + "```",
                    mrkdwn_in: ["text", "pretext", "title"],
                    fields: [
                        {
                            "title": "Error Type",
                            "value": "Global Error",
                            "short": true
                        },
                        {
                            "title": "Environment",
                            "value": (options.env.NODE_ENV || process.env.NODE_ENV),
                            "short": true
                        }
                    ],

                }
            ];
            sendSlack(options, attachments);
        }
    });
}