const slackApi = require('../api/slackApi');
const funcAttachments = require('../util/slackCommonAttachment');

module.exports = (options, typeError, processName) => {

    process.on(processName, (err) => {

        console.error(`[ShazaM] ${typeError} | ${err.message}\nStack:\n${err.stack}`);

        if (options.slack) {
            let attachments = funcAttachments(err, options, typeError);

            slackApi(options, [attachments]);
        }
    });
};