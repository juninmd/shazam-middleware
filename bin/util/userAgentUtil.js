const browser = require('browser-detect');

// LRU Cache simulation (simple limit)
const CACHE_LIMIT = 5000;
const uaCache = new Map();

const checkBrowser = (agent) => {
    // Optimization: Early return to avoid expensive browser-detect call
    if (!agent) {
        return {
            mobile: false,
            name: '?',
            version: ''
        }
    }

    // Optimization: Check cache first
    if (uaCache.has(agent)) {
        const result = uaCache.get(agent);
        // Refresh LRU
        uaCache.delete(agent);
        uaCache.set(agent, result);
        return result;
    }

    // Optimization: Handle Postman explicitly before parsing
    if (agent.indexOf('PostmanRuntime') === 0) {
        let postman = agent.split('/');
        const result = {
            mobile: false,
            name: postman[0],
            version: postman[1]
        };
        // Update cache (LRU eviction)
        if (uaCache.size >= CACHE_LIMIT) {
            uaCache.delete(uaCache.keys().next().value);
        }
        uaCache.set(agent, result);
        return result;
    }

    let br = browser(agent);
    if (br.name == undefined) {
        br = {
            mobile: false,
            name: '?',
            version: ''
        };
    }

    // Update cache (LRU eviction)
    if (uaCache.size >= CACHE_LIMIT) {
        uaCache.delete(uaCache.keys().next().value);
    }
    uaCache.set(agent, br);

    return br;
}

module.exports = checkBrowser;
