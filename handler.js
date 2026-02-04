const commonHandler = require('./bin/handler/commonHandler');

module.exports = (options) => {
    console.log("[ShazaM] Handlers Activated");

    commonHandler(options, 'Global Error', 'uncaughtException');
    commonHandler(options, 'Promise Error', 'unhandledRejection');
};