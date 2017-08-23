const slackApi = require('../api/slackApi');

let handlePromises = (options) => {
    process.on('unhandledRejection', (err, p) => {
        let date = new Date();

        console.error(`[ShazaM] Promise Error | ${err.message}\nStack:\n${err.stack}`);

        if (options.slack) {
            let attachments =
                {
                    color: "#ff0000",
                    title: err.message,
                    ts: Math.round(date.getTime() / 1000),
                    mrkdwn_in: ["text", "pretext", "title"],
                    fields: [
                        {
                            "title": "Error Type",
                            "value": "Promise Error",
                            "short": true
                        },
                        {
                            "title": "Environment",
                            "value": (options.env.NODE_ENV || process.env.NODE_ENV),
                            "short": true
                        }
                    ],

                }

            if (err.stack) {
                attachments.pretext = "```" + err.stack + "```";
            }

            slackApi(options, [attachments]);
        }
    });
}
