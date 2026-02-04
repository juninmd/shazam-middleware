module.exports = {
    getip: (req) => {
        return req.ip ||
            req._remoteAddress ||
            (req.connection && req.connection.remoteAddress) ||
            undefined
    }
};