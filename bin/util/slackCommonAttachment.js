const slackApi = require('../api/slackApi');

module.exports = (err, options, errorType) => {
    let date = new Date();

    let attachments = {
        color: "#ff0000",
        title: err.message,
        ts: Math.round(date.getTime() / 1000),
        mrkdwn_in: ["text", "pretext", "title"],
        fields: [
            {
                "title": "Error Type",
                "value": errorType,
                "short": true
            },
            {
                "title": "Environment",
                "value": (options.env != null ? options.env.NODE_ENV : null || process.env.NODE_ENV),
                "short": true
            }
        ],

    };

    if (err.stack) {
        attachments.pretext = "```" + err.stack + "```";
    }

    return attachments;
};