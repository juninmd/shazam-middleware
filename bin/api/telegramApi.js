const baseApi = require('./baseApi');

module.exports = (options, content) => {

    let parameters = {
        url: `https://api.telegram.org/bot${options.telegram.botToken}/sendMessage`,
        method: 'POST',
        body: {
            chat_id: options.telegram.chatId,
            text: content,
            parse_mode: 'MarkdownV2'
        },
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        json: true
    };

    baseApi.requestApi(parameters)
        .then((q) => {
            console.log(`[ShazaM] Notified on Telegram Chat #${options.telegram.chatId}`);
        })
        .catch((err) => {
            console.error(`[ShazaM] Telegram Error: ${err.message && err.message.developerMessage || err}`);
        });
};
