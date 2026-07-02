import slackAttachment from '../util/slackAttachment';
import telegramAttachment from '../util/telegramAttachment';
import discordAttachment from '../util/discordAttachment';
import checkBrowser from '../util/userAgentUtil';
import { Response, NextFunction } from 'express';

const sendResult = (err: any, req: any, res: Response, next: NextFunction) => {
    res.status(req.statusCode || err.statusCode || 500).send({
        message: {
            developerMessage: (err.message.developerMessage || err.message),
            userMessage: (err.message.userMessage || `An unexpected crash occurred by the application, but do not worry, it has already been automatically reported to developers.`),
        },
        details: {
            stack: err.stack || undefined,
            route: `${req.method} - ${req.protocol + '://' + req.headers['host'] + req.originalUrl}`,
            date: new Date()
        },
        statusCode: (req.statusCode || err.statusCode || 500),
    });
};

const exceptionMiddleware = (options: any) => {
    return {
        exception: (err: any, req: any, res: Response, next: NextFunction) => {
            const date = new Date();
            console.error(`[ShazaM] Common Error: ${(err.message.developerMessage || err.message.userMessage || err.message)}`);

            options.typeError = `Common Error`;

            if (req && req.headers && !req._browserInfo) {
                req._browserInfo = checkBrowser(req.headers['user-agent']);
            }

            if ((options.slack || options.telegram || options.discord) && (err.statusCode == null || err.statusCode >= 500 && err.statusCode <= 599)) {
                options.customize = {
                    errortype: "Route",
                    color: '#FFFF00'
                };

                if (options.slack)
                    slackAttachment(err, req, date, options);

                if (options.telegram)
                    telegramAttachment(err, req, date, options);

                if (options.discord)
                    discordAttachment(err, req, date, options);
            }

            sendResult(err, req, res, next);
        }
    };
};

export default exceptionMiddleware;