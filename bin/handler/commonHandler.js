const slackApi = require('../api/slackApi');
const funcAttachments = require('../util/slackCommonAttachment');
const telegramCommonAttachment = require('../util/telegramCommonAttachment');
const discordCommonAttachment = require('../util/discordCommonAttachment');

module.exports = (options, typeError, processName) => {

    process.on(processName, (err) => {

        console.error(`[ShazaM] ${typeError} | ${err.message}\nStack:\n${err.stack}`);

        if (options.slack) {
            let attachments = funcAttachments(err, options, typeError);

            slackApi(options, [attachments]);
        }

        if (options.telegram) {
            telegramCommonAttachment(err, options, typeError);
        }

        if (options.discord) {
            discordCommonAttachment(err, options, typeError);
        }
    });
};