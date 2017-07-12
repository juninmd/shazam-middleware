const request = require('request');

module.exports = {
    requestApigee: (options, callback) => {
        request(options, (error, response) => {
            module.exports.validateRequest(error, response, options, (result) => {
                if (!result.isSuccess) {
                    callback(result, null);
                } else if (result.content && result.content.records.length > 0) {
                    callback(null, result.content.records[0]);
                }
                else {
                    callback({ message: { userMessage: "Nenhuma informação foi retornada da sua Requisição!" } }, null);
                }
            })
        });
    },
    requestApi: (options) => {
        return new Promise((resolve, reject) => {
            request(options, (error, response) => {
                module.exports.validateRequest(error, response, options, (result) => {
                    if (!result.isSuccess) {
                        return reject(result);
                    } else if (result.content) {
                        return resolve(result.content);
                    }
                    else {
                        return reject({ message: { userMessage: "Nenhuma informação foi retornada da sua requisição!" } }, null);
                    }
                })
            });
        })
    },
    validateRequest: (error, response, options, callback) => {
        options.headers = {};
        let RequestMessage = {
            content: {},
            message: {
                developerMessage: '',
                userMessage: ''
            },
            options: options,
            details: {
            },
            isSuccess: false,
            statusCode: 0
        };

        /**
         * Método responsável pelo callback ao método invocador
         * 
         * @param {any} statusCode
         * @param {any} message
         * @param {any} content
         */
        function sendApigeeResponse(statusCode, message, content, details) {
            statusCode = TratarStatusCode(statusCode);
            RequestMessage.isSuccess = statusCode == 200 || statusCode == 202;
            RequestMessage.statusCode = statusCode;
            RequestMessage.content = content;
            RequestMessage.message = message;
            if (details)
                RequestMessage.details = details;
            callback(RequestMessage);
            return;
        }

        try {
            if (error) {
                if (error.code == 'ECONNREFUSED') {
                    sendApigeeResponse(500, {
                        developerMessage: `A conexão foi recusada pelo servidor ${error.address}:${error.port}, aparentemente está off-line.`,
                        userMessage: 'Não conseguimos nos comunicar com alguma Api, tente novamente.'
                    }, error, { isApiError: true });
                    return;
                }
                else if (error.code !== 'ETIMEDOUT' && error.code !== 'ESOCKETTIMEDOUT') {
                    sendApigeeResponse(500, {
                        developerMessage: 'Erro não esperado pelo sistema',
                        userMessage: 'Ocorreu alguma falha inesperada em alguma api, tente novamente'
                    }, typeof (error) == "object" ? error : { erro: 'error' }, { isApiError: true });
                    return;
                }
                else {
                    sendApigeeResponse(500, {
                        developerMessage: 'Time Out',
                        userMessage: 'Alguma api demorou mais do que o esperado para responder, tente novamente.'
                    }, null, { isApiError: true });
                    return;
                }
            }

            if (!response) {
                sendApigeeResponse(500, {
                    developerMessage: 'Falha inesperada',
                    userMessage: 'Erro na chamada de Api! Tente outra vez.'
                }, null, { isApiError: true });
                return;
            }

            if (response.statusCode = 200 && response.body == "ok") {
                sendApigeeResponse(200, {}, { sucesso: response.body });
                return;
            }

            sendApigeeResponse(500, {
                developerMessage: 'Falha inesperada',
                userMessage: 'Erro na chamada de Api! Tente outra vez.'
            }, null, { isApiError: true });
            return;
        }
        catch (err) {
            sendApigeeResponse(500, {
                developerMessage: err.message,
                userMessage: 'Falha não tratada no sistema.'
            }, err.message, { isSystemProblem: true });
        }
    }
};

function TratarStatusCode(status) {
    switch (status) {
        case 200:
        case 202:
        case 404:
        case 304:
        case 204:
        case 401:
        case 400:
            return status;
        default:
            return 500;
    }
}