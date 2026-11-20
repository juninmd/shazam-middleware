import environmentName from './environment';
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
                "value": environmentName(options),
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