import browser from 'browser-detect';

const CACHE_LIMIT = 5000;
const uaCache = new Map<string, any>();

const checkBrowser = (agent: string | undefined): any => {
    if (!agent) {
        return {
            mobile: false,
            name: '?',
            version: ''
        };
    }

    if (uaCache.has(agent)) {
        const result = uaCache.get(agent);
        uaCache.delete(agent);
        uaCache.set(agent, result);
        return result;
    }

    if (agent.indexOf('PostmanRuntime') === 0) {
        let postman = agent.split('/');
        const result = {
            mobile: false,
            name: postman[0],
            version: postman[1]
        };
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

    if (uaCache.size >= CACHE_LIMIT) {
        uaCache.delete(uaCache.keys().next().value);
    }
    uaCache.set(agent, br);

    return br;
};

export default checkBrowser;

// Display strings for alerts: unknown parts read "Unknown" instead of "?", "" or "undefined".
export const describeBrowser = (info: any): { agent: string; os: string; mobile: string } => {
    const name = info && info.name && info.name !== '?' ? String(info.name) : '';
    const version = info && info.version ? String(info.version) : '';
    return {
        agent: [name, version].filter(Boolean).join(' ') || 'Unknown',
        os: info && info.os ? String(info.os) : 'Unknown',
        mobile: info && info.mobile ? 'YES' : 'NO',
    };
};
