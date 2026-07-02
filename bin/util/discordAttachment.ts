import discordApi from '../api/discordApi';
import checkBrowser from '../util/userAgentUtil';

const discordAttachment = (err: any, req: any, date: Date, options: any) => {
    let browserN = req._browserInfo || checkBrowser(req.headers['user-agent']);

    let embed: any = {
        title: err.message.developerMessage || err.message,
        url: `${req.protocol}://${req.headers['host']}${req.originalUrl}`,
        color: parseInt((options.customize.color || "#ff0000").replace('#', ''), 16),
        timestamp: date.toISOString(),
        fields: [
            {
                name: "Error Type",
                value: options.errorType || "Unknown",
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

    if (err.stack) {
        embed.description = "```" + err.stack + "```";
    }

    discordApi(options, { embeds: [embed] });
};

export default discordAttachment;
