const app = require('express')();

const shazam = require('../app')({
    api: {
        name: 'My App',
        version: 1
    }
});

shazam.handler;
app.use(shazam.log);

app.get('/undefined', (req, res, next) => {
    blablabla
});

app.get('/promise', (req, res, next) => {
    return new Promise((resolve, reject) => {
        promiseError
    })
});

app.listen(8272, () => {
    console.log("Aplicação Rodando");
});

module.exports = app;