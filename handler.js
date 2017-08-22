const consign = require('consign');

module.exports = (options) => {
    console.log("[Shazam-Middleware] Handlers Activated");

    consign({
        verbose: false
    })
        .include('./bin/handler')
        .into(options);
};