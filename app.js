const apiRequest = require('./apiRequest');
module.exports = (options) => {
    return {
        log: (req, res, next) => {
            console.log(`[${req.method}] ${req.protocol + '://' + req.get('host') + req.originalUrl} | Data: ${new Date().toLocaleString()} | IP: ${getip(req)}`);
            next();
        },
        exception: (err, req, res, next) => {
            let date = new Date();
            console.error(`[${req.method}] ${req.protocol + '://' + req.get('host') + req.originalUrl} | Erro: ${err.message} | Data: ${date.toLocaleString()} | IP: ${getip(req)}`);

            let paramters = {
                url: options.slack.urlHook,
                method: 'POST',
                body: {
                    text: "*" + options.api.name + " - " + options.api.version + "*",
                    username: (options.slack.botusername || "Shazam"),
                    channel: options.slack.channel,
                    icon_url: (options.slack.iconUrl || "http://dclegends.wiki/images/d/d9/Shazam_Billy_Batson_Portrait.png"),
                    attachments: [
                        {
                            color: "#ff0000",
                            title: err.message,
                            title_link: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
                            footer: `[${req.method}] - ${req.originalUrl}`,
                            ts: Math.round(date.getTime() / 1000),
                            pretext: "```" + err.stack + "```",
                            mrkdwn_in: ["text", "pretext", "title"]
                        }
                    ]
                },
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                json: true
            };

            apiRequest.requestApi(paramters)
                .then(q => {
                    console.log(`Notificado no #channel ${options.slack.channel}`);
                })
                .catch(err => {
                    console.log(err);
                });

            if (res.headersSent || res.finished)
                return;

            res.status(500).send({
                message: {
                    developerMessage: err.message,
                    userMessage: `Ocorreu uma falha inesperada pela aplicação, mas não se preocupe, ela já foi reportada automaticamente para os desenvolvedores.`,
                },
                isSuccess: false,
                details: {
                    stack: err.stack,
                    isUnexpectedError: true,
                    route: `${req.method} - ${req.protocol + '://' + req.get('host') + req.originalUrl}`,
                    date: new Date()
                },
                statusCode: 500,
            });
        }
    }
};

function getip(req) {
    return req.ip ||
        req._remoteAddress ||
        (req.connection && req.connection.remoteAddress) ||
        undefined
}
