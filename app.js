module.exports = (options) => {
    return {
        exception: require('./exception')(options),
        log: require('./log')(options),
        handler: require('./handler')(options)
    }
}