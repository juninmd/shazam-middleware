import exceptionMiddleware from './bin/middleware/exceptionMiddleware';
import logMiddleware from './bin/middleware/logMiddleware';
import handlers from './handler';

const shazamFactory = (options: any) => {
    if (options.env === undefined) {
        options.env = process.env;
    }
    return {
        exception: exceptionMiddleware(options).exception,
        log: logMiddleware(options).log,
        handler: handlers(options)
    };
};

export default shazamFactory;