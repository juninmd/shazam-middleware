module.exports = (options) => {
    console.log("[ShazaM] Handlers Activated");

    require('./bin/handler/globalHandler')(options);
    require('./bin/handler/promiseHandler')(options);
};