const slackCommonAttachment = (err: any, options: any, errorType: string) => {
    let date = new Date();

    let attachments: any = {
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

export default slackCommonAttachment;