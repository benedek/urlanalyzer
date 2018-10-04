const got = require('got');

/**
 * 
 * @param {Array<string>} urls 
 */
const makeRequests = async (urls) => {
    const ENDPOINT = process.env['P_ANALYZER_EP'];
    try {
        var allRequests = urls
            .map(url => {
                console.info('Making request to ', url);
                const ep = `${ENDPOINT}?targetUrl=${encodeURIComponent(url)}`;
                console.info('EP: ', ep);
                return got(ep).catch((e) => { console.error('Error while making request', ep); });
            });
        var allResponses = await Promise.all(allRequests);
        var merged = allResponses
            .filter(r => r.statusCode == 200)
            .map(r => r.body)
            // .map(r => { console.log(r + '\n\n\n'); return r; })
            .map(b => JSON.parse(b))
            .reduce(flatten, [])
            .reduce(mergeResponses, {})
            ;
        const reportArray = Object.values(merged);
        return reportArray;
    } catch (e) {
        console.error(e);
        return [];
    }
}


const flatten = (prev, current) => {
    return prev.concat(current);
};

/**
 * 
 * @param {Array<object>} responses 
 */
const mergeResponses = (prev, current) => {
    if (current['requestUrl'] in prev)
        return prev;
    prev[current['requestUrl']] = current;
    return prev;
}

module.exports = {
    makeRequests
};