import slackApi from '../api/slackApi';
import checkBrowser, { describeBrowser } from '../util/userAgentUtil';
import normalizeError from '../util/normalizeError';

const slackAttachment = (err: any, req: any, date: Date, meta: { errorType?: string; color?: string }, options: any) => {
    let browserN = req._browserInfo || checkBrowser(req.headers['user-agent']);
    const normalized = normalizeError(err);
    const browser = describeBrowser(browserN);

    let attachments: any = {
        color: meta.color || "#ff0000",
        title: normalized.developerMessage,
        title_link: `${req.protocol}://${req.headers['host']}${req.originalUrl}`,
        ts: Math.round(date.getTime() / 1000),
        mrkdwn_in: ["text", "pretext", "title"],
        fields: [
            {
                "title": "Error Type",
                "value": meta.errorType || "Unknown",
                "short": true
            },
            {
                "title": "Environment",
                "value": process.env.NODE_ENV || 'Unknown',
                "short": true
            },
            {
                "title": 'Agent',
                "value": browser.agent,
                "short": true
            },
            {
                "title": 'O.S.',
                "value": browser.os,
                "short": true
            },
            {
                "title": 'Mobile',
                "value": browser.mobile,
                "short": true
            },
            {
                "title": req.method,
                "value": req.originalUrl,
                "short": true
            },
        ],
    };

    if (normalized.stack) {
        attachments.pretext = "```" + normalized.stack + "```";
    }

    slackApi(options, [attachments]);
};

export default slackAttachment;
