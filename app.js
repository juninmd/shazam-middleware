const exceptionMiddleware = require('./bin/middleware/exceptionMiddleware')
const logMiddleware = require('./bin/middleware/logMiddleware.js')
const handlers = require('./handler')

module.exports = (options) => {
    return {
        exception: exceptionMiddleware(options).exception,
        log: logMiddleware(options).log,
        handler: handlers(options)
    }
}