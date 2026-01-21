const discordApi = require('../api/discordApi');
const checkBrowser = require('../util/userAgentUtil');

module.exports = (err, req, date, options) => {
    let browserN = checkBrowser(req.headers['user-agent']);

    let embed = {
        title: err.message.developerMessage || err.message,
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
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
}
