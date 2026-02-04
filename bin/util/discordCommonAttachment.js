const discordApi = require('../api/discordApi');

module.exports = (err, options, errorType) => {
    let date = new Date();

    let embed = {
        title: err.message,
        color: 16711680, // Red
        timestamp: date.toISOString(),
        fields: [
            {
                name: "Error Type",
                value: errorType,
                inline: true
            },
            {
                name: "Environment",
                value: (options.env != null ? options.env.NODE_ENV : null || process.env.NODE_ENV) || 'Unknown',
                inline: true
            }
        ],

    };

    if (err.stack) {
        embed.description = "```" + err.stack + "```";
    }

    discordApi(options, { embeds: [embed] });
};
