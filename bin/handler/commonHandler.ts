import slackApi from '../api/slackApi';
import funcAttachments from '../util/slackCommonAttachment';
import telegramCommonAttachment from '../util/telegramCommonAttachment';
import discordCommonAttachment from '../util/discordCommonAttachment';

const commonHandler = (options: any, typeError: string, processName: any) => {
    process.on(processName, (err: any) => {
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

export default commonHandler;