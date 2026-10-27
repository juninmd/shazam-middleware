import discordApi from '../api/discordApi';
import checkBrowser from '../util/userAgentUtil';
import normalizeError from '../util/normalizeError';

const discordAttachment = (err: any, req: any, date: Date, meta: { errorType?: string; color?: string }, options: any) => {
    let browserN = req._browserInfo || checkBrowser(req.headers['user-agent']);
    const normalized = normalizeError(err);

    let embed: any = {
        title: normalized.developerMessage,
        url: `${req.protocol}://${req.headers['host']}${req.originalUrl}`,
        color: parseInt((meta.color || "#ff0000").replace('#', ''), 16),
        timestamp: date.toISOString(),
        fields: [
            {
                name: "Error Type",
                value: meta.errorType || "Unknown",
                inline: true
            },
            {
                name: "Environment",
                value: process.env.NODE_ENV || 'Unknown',
                inline: true
            },
            {
                name: 'Agent',
                value: `${browserN.name} ${browserN.version}` || 'Unknown',
                inline: true
            },
            {
                name: 'O.S.',
                value: `${browserN.os}` || 'Unknown',
                inline: true
            },
            {
                name: 'Mobile',
                value: `${browserN.mobile ? 'YES' : 'NO'}` || 'Unknown',
                inline: true
            },
            {
                name: req.method,
                value: req.originalUrl,
                inline: true
            },
        ],
    };

    if (normalized.stack) {
        embed.description = "```" + normalized.stack + "```";
    }

    discordApi(options, { embeds: [embed] });
};

export default discordAttachment;
