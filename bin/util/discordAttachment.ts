import discordApi from '../api/discordApi';
import checkBrowser, { describeBrowser } from '../util/userAgentUtil';
import normalizeError from '../util/normalizeError';
import environmentName from './environment';
import { DISCORD_MAX_DESCRIPTION, DISCORD_MAX_TITLE, truncate } from './truncate';

const discordAttachment = (err: any, req: any, date: Date, meta: { errorType?: string; color?: string }, options: any) => {
    let browserN = req._browserInfo || checkBrowser(req.headers['user-agent']);
    const normalized = normalizeError(err);
    const browser = describeBrowser(browserN);

    let embed: any = {
        title: truncate(normalized.developerMessage, DISCORD_MAX_TITLE),
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
                value: environmentName(options),
                inline: true
            },
            {
                name: 'Agent',
                value: browser.agent,
                inline: true
            },
            {
                name: 'O.S.',
                value: browser.os,
                inline: true
            },
            {
                name: 'Mobile',
                value: browser.mobile,
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
        embed.description = "```" + truncate(normalized.stack, DISCORD_MAX_DESCRIPTION - 6) + "```";
    }

    discordApi(options, { embeds: [embed] });
};

export default discordAttachment;
