const request = require('request');
let RequestMessage = require('./requestMessage.json')

const sendApiResponse = (statusCode, message, content, details) => {
    RequestMessage.statusCode = statusCode;
    RequestMessage.content = content;
    RequestMessage.message = message;
    if (details)
        RequestMessage.details = details;
    callback(RequestMessage);
}

const validateRequest = (error, response, options, callback) => {
    try {
        options.headers = {};
        if (error) {
            if (error.code === 'ECONNREFUSED') {
                sendApiResponse(response.statusCode, {
                    developerMessage: `A conexão foi recusada pelo servidor ${error.address}:${error.port}, aparentemente está off-line.`,
                    userMessage: 'Não conseguimos nos comunicar com alguma Api, tente novamente.'
                }, error, { isApiError: true });
                return;
            }
            else if (error.code !== 'ETIMEDOUT' && error.code !== 'ESOCKETTIMEDOUT') {
                sendApiResponse(response.statusCode, {
                    developerMessage: 'Erro não esperado pelo sistema',
                    userMessage: 'Ocorreu alguma falha inesperada em alguma api, tente novamente'
                }, typeof (error) == "object" ? error : { erro: 'error' }, { isApiError: true });
                return;
            }
            else {
                sendApiResponse(response.statusCode, {
                    developerMessage: 'Time Out',
                    userMessage: 'Alguma api demorou mais do que o esperado para responder, tente novamente.'
                }, null, { isApiError: true });
                return;
            }
        }

        if (!response) {
            sendApiResponse(response.statusCode, {
                developerMessage: 'Falha inesperada',
                userMessage: 'Erro na chamada de Api! Tente outra vez.'
            }, null, { isApiError: true });
            return;
        }

        if (response.statusCode == 200 && response.body == "ok") {
            sendApiResponse(response.statusCode, {}, { sucesso: response.body });
            return;
        }

        sendApiResponse(response.statusCode, {
            developerMessage: 'Falha inesperada',
            userMessage: 'Erro na chamada de Api! Tente outra vez.'
        }, null, { isApiError: true });
        return;
    }
    catch (err) {
        sendApiResponse(response.statusCode, {
            developerMessage: err.message,
            userMessage: 'Falha não tratada no sistema.'
        }, err.message, { isSystemProblem: true });
    }
}

module.exports = {
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
