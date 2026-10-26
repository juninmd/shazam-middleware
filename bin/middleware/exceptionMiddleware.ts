import slackAttachment from '../util/slackAttachment';
import telegramAttachment from '../util/telegramAttachment';
import discordAttachment from '../util/discordAttachment';
import checkBrowser from '../util/userAgentUtil';
import normalizeError from '../util/normalizeError';
import { Response, NextFunction } from 'express';

const sendResult = (err: any, req: any, res: Response, next: NextFunction) => {
    const normalized = normalizeError(err);
    res.status(normalized.statusCode).send({
        message: {
            developerMessage: normalized.developerMessage,
            userMessage: normalized.userMessage,
        },
        details: {
            stack: normalized.stack || undefined,
            route: `${req.method} - ${req.protocol + '://' + req.headers['host'] + req.originalUrl}`,
            date: new Date()
        },
        statusCode: normalized.statusCode,
    });
};

const exceptionMiddleware = (options: any) => {
    return {
        exception: (err: any, req: any, res: Response, next: NextFunction) => {
            const normalized = normalizeError(err);
            const date = new Date();
            console.error(`[ShazaM] Common Error: ${normalized.developerMessage}`);

            if (req && req.headers && !req._browserInfo) {
                req._browserInfo = checkBrowser(req.headers['user-agent']);
            }

            if ((options.slack || options.telegram || options.discord) && (normalized.statusCode >= 500 && normalized.statusCode <= 599)) {
                const meta = { errorType: 'Route', color: '#FFFF00' };

                if (options.slack)
                    slackAttachment(err, req, date, meta, options);

                if (options.telegram)
                    telegramAttachment(err, req, date, meta, options);

                if (options.discord)
                    discordAttachment(err, req, date, meta, options);
            }

            if (res.headersSent) {
                return next(err);
            }

            sendResult(err, req, res, next);
        }
    };
};

export default exceptionMiddleware;
