const baseApi = require('./baseApi');

module.exports = (options, content) => {

    let parameters = {
        url: options.discord.webhookUrl,
        method: 'POST',
        body: content,
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        json: true
    };

    if (options.discord.username) {
        parameters.body.username = options.discord.username;
    }
    if (options.discord.avatarUrl) {
        parameters.body.avatar_url = options.discord.avatarUrl;
    }

    baseApi.requestApi(parameters)
        .then((q) => {
            console.log(`[ShazaM] Notified on Discord`);
        })
        .catch((err) => {
            console.error(`[ShazaM] Discord Error: ${err.message && err.message.developerMessage || err}`);
        });
};
