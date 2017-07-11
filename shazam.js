const apiRequest = require('./apiRequest');

let body = {
    text: "Problema na aplicação",
    username: process.env.username,
    channel: process.env.channel,
    icon_url: process.env.icon,
    attachments: [
        {
            color: "#ff0000",
            title: 'Nome do Erro',
            title_link: "https://api.slack.com/",
            footer: 'Verbo' + " - " + '500',
            footer_icon: "https://platform.slack-edge.com/img/default_application_icon.png",
            ts: Math.round(new Date().getTime() / 1000)
        }
    ]
};

let options = {
    url: process.env.url,
    method: 'POST',
    body: body,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    json: true
};
apiRequest.requestApi(options)
    .then(q => {
        console.log(q);
    })
    .catch(err => {
        console.log(err);
    });