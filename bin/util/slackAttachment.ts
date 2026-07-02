import slackApi from '../api/slackApi';
import checkBrowser from '../util/userAgentUtil';

const slackAttachment = (err: any, req: any, date: Date, options: any) => {
    let browserN = req._browserInfo || checkBrowser(req.headers['user-agent']);

    let attachments: any = {
        color: options.customize.color || "#ff0000",
        title: (err.message.developerMessage || err.message),
        title_link: `${req.protocol}://${req.headers['host']}${req.originalUrl}`,
        ts: Math.round(date.getTime() / 1000),
        mrkdwn_in: ["text", "pretext", "title"],
        fields: [
            {
                "title": "Error Type",
                "value": options.errorType,
                "short": true
            },
            {
                "title": "Environment",
                "value": process.env.NODE_ENV || 'Unknown',
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
    };

    if (err.stack) {
        attachments.pretext = "```" + err.stack + "```";
    }

    slackApi(options, [attachments]);
};

export default slackAttachment;