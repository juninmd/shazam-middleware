const slackApi = require('../api/slackApi');
const browser = require('browser-detect');

module.exports = (err, req, date) => {
    let browserN = browser(req.headers['user-agent']);

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
                    "title": 'Agent',
                    "value": `${browserN.name} ${browserN.version}` || 'Unknown',
                    "short": true
                },
                {
                    "title": 'O.S.',
                    "value": `${browserN.os}` || 'Unknown',
                    "short": true
                },
                {
                    "title": 'Mobile',
                    "value": `${browserN.mobile ? 'YES' : 'NO'}` || 'Unknown',
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