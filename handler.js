const consign = require('consign');

module.exports = (options) => {
    console.log("[ShazaM] Handlers Activated");

    consign({
        verbose: false
    })
        .include('./bin/handler')
        .into(options);
};