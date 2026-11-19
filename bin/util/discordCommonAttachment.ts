import discordApi from '../api/discordApi';
import { DISCORD_MAX_DESCRIPTION, DISCORD_MAX_TITLE, truncate } from './truncate';

const discordCommonAttachment = (err: any, options: any, errorType: string) => {
    let date = new Date();

    let embed: any = {
        title: truncate(String(err.message), DISCORD_MAX_TITLE),
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
        embed.description = "```" + truncate(String(err.stack), DISCORD_MAX_DESCRIPTION - 6) + "```";
    }

    discordApi(options, { embeds: [embed] });
};

export default discordCommonAttachment;
