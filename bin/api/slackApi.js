const baseApi = require('./baseApi');

module.exports = (options, attachments) => {

    let paramters = {
        url: options.slack.urlHook,
        method: 'POST',
        body: {
            text: "*" + options.api.name + " - " + options.api.version + "*",
            username: (options.slack.botusername || "Shazam"),
            channel: options.slack.channel,
            icon_url: (options.slack.iconUrl || "http://dclegends.wiki/images/d/d9/Shazam_Billy_Batson_Portrait.png"),
            attachments
        },
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        json: true
    };

    baseApi.requestApi(paramters)
        .then((q) => {
            console.log(`[ShazaM] Notified on #${options.slack.channel}`);
        })
        .catch((err) => {
            console.log(`[ShazaM] ${err.message.developerMessage}`);
        });
};