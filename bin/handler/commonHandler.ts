import slackApi from '../api/slackApi';
import funcAttachments from '../util/slackCommonAttachment';
import telegramCommonAttachment from '../util/telegramCommonAttachment';
import discordCommonAttachment from '../util/discordCommonAttachment';

// Promises can reject with anything (undefined, a string...); the reporters below expect an Error.
export const toError = (reason: any): any => {
    if (reason !== null && typeof reason === 'object' && typeof reason.message === 'string') return reason;
    let text: string;
    try {
        text = typeof reason === 'string' ? reason : JSON.stringify(reason) ?? String(reason);
    } catch {
        text = String(reason);
    }
    return new Error(text);
};

const commonHandler = (options: any, typeError: string, processName: any) => {
    process.on(processName, (reason: any) => {
        const err = toError(reason);
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