export interface NormalizedError {
    developerMessage: string;
    userMessage: string;
    statusCode: number;
    stack?: string;
}

const DEFAULT_USER_MESSAGE =
    'An unexpected crash occurred by the application, but do not worry, it has already been automatically reported to developers.';

export const normalizeError = (err: any): NormalizedError => {
    let developerMessage: string | undefined;
    let userMessage: string | undefined;
    let stack: string | undefined;

    if (err !== null && typeof err === 'object') {
        if (typeof err.message === 'object' && err.message !== null) {
            developerMessage = err.message.developerMessage || err.message.userMessage;
            userMessage = err.message.userMessage;
        } else if (typeof err.message === 'string') {
            developerMessage = err.message;
        }

        if (!developerMessage) {
            developerMessage = err.developerMessage || err.userMessage;
        }

        if (!userMessage) {
            userMessage = err.userMessage;
        }

        if (typeof err.stack === 'string') {
            stack = err.stack;
        }
    } else if (typeof err === 'string') {
        developerMessage = err;
    }

    if (!developerMessage || typeof developerMessage !== 'string') {
        developerMessage = 'Unknown error';
    }

    if (!userMessage || typeof userMessage !== 'string') {
        userMessage = DEFAULT_USER_MESSAGE;
    }

    let statusCode = 500;
    const rawStatusCode = err !== null && typeof err === 'object' ? (err.statusCode ?? err.status) : undefined;
    const parsedCode = typeof rawStatusCode === 'number' ? rawStatusCode : (typeof rawStatusCode === 'string' ? Number(rawStatusCode) : NaN);

    if (Number.isInteger(parsedCode) && parsedCode >= 400 && parsedCode <= 599) {
        statusCode = parsedCode;
    }

    return {
        developerMessage,
        userMessage,
        statusCode,
        stack,
    };
};

export default normalizeError;
