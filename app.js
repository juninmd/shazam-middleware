const exceptionMiddleware = require('./bin/middleware/exceptionMiddleware')
const logMiddleware = require('./bin/middleware/logMiddleware.js')

module.exports = (options) => {
    return {
        exception: exceptionMiddleware(options).exception,
        log: logMiddleware(options).log,
        handler: require('./handler')(options)
    }
}