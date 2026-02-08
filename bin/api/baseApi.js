const request = require('request');

/**
 * Sends a standardized API response.
 * @param {number} statusCode - The HTTP status code.
 * @param {object} message - The message object containing developerMessage and userMessage.
 * @param {any} content - The main content of the response.
 * @param {object|null} details - Additional error details or metadata.
 * @param {Function} callback - The callback to execute with the formatted response.
 */
const sendApiResponse = (statusCode, message, content, details, callback) => {
    const response = {
        statusCode: statusCode,
        content: content,
        message: message
    };

    if (details)
        response.details = details;

    callback(response);
};

/**
 * Validates the HTTP response and handles network/system errors.
 * @param {Error|null} error - The error object from the request, if any.
 * @param {object} response - The HTTP response object.
 * @param {object} options - The original request options.
 * @param {Function} callback - The callback to execute with the result.
 */
const validateRequest = (error, response, options, callback) => {
    try {
        options.headers = {};
        if (error) {
            const status = response ? response.statusCode : 500;
            if (error.code === 'ECONNREFUSED') {
                sendApiResponse(status, {
                    developerMessage: `A conexão foi recusada pelo servidor ${error.address}:${error.port}, aparentemente está off-line.`,
                    userMessage: 'Não conseguimos nos comunicar com alguma Api, tente novamente.'
                }, error, { isApiError: true }, callback);
                return;
            }
            else if (error.code !== 'ETIMEDOUT' && error.code !== 'ESOCKETTIMEDOUT') {
                sendApiResponse(status, {
                    developerMessage: 'Erro não esperado pelo sistema',
                    userMessage: 'Ocorreu alguma falha inesperada em alguma api, tente novamente'
                }, typeof (error) == "object" ? error : { erro: 'error' }, { isApiError: true }, callback);
                return;
            }
            else {
                sendApiResponse(status, {
                    developerMessage: 'Time Out',
                    userMessage: 'Alguma api demorou mais do que o esperado para responder, tente novamente.'
                }, null, { isApiError: true }, callback);
                return;
            }
        }

        if (!response) {
            // response is undefined here, so we can't access response.statusCode
            // Defaulting to 500
            sendApiResponse(500, {
                developerMessage: 'Falha inesperada',
                userMessage: 'Erro na chamada de Api! Tente outra vez.'
            }, null, { isApiError: true }, callback);
            return;
        }

        if (response.statusCode == 200 && response.body == "ok") {
            sendApiResponse(response.statusCode, {}, { sucesso: response.body }, null, callback);
            return;
        }

        sendApiResponse(response.statusCode, {
            developerMessage: 'Falha inesperada',
            userMessage: 'Erro na chamada de Api! Tente outra vez.'
        }, null, { isApiError: true}, callback);
        return;
    }
    catch (err) {
        // If response is undefined, err might occur if we try to access it.
        // Using safe navigation for status code.
        const status = response ? response.statusCode : 500;
        sendApiResponse(status, {
            developerMessage: err.message,
            userMessage: 'Falha não tratada no sistema.'
        }, err.message, { isSystemProblem: true }, callback);
    }
}

module.exports = {
    /**
     * Performs an HTTP request using the underlying request library.
     * @param {object} options - The request options (url, method, headers, etc.).
     * @returns {Promise<any>} A promise resolving to the response content or rejecting with an error.
     */
    requestApi: (options) => {
        return new Promise((resolve, reject) => {
            request(options, (error, response) => {
                validateRequest(error, response, options, (result) => {
                    if (result.statusCode >= 200 && result.statusCode <= 299) {
                        return resolve(result.content);
                    } else if (result.content) {
                        return reject(result);
                    }
                    else {
                        return reject({ message: { userMessage: "Nenhuma informação foi retornada da sua requisição!" } }, null);
                    }
                })
            });
        })
    },

};
