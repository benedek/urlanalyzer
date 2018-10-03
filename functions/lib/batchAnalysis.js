const got = require('got');

/**
 * 
 * @param {Array<string>} urls 
 */
const makeRequests = async (urls) => {
    const ENDPOINT = process.env['P_ANALYZER_EP'];    
    var allRequests = urls
        .map(url => got(`${ENDPOINT}?targetUrl=${encodeURIComponent(url)}`));
    var allResponses = await Promise.all(allRequests);
    var merged = allResponses
        .filter(r => r.statusCode == 200)
        .map(r => r.body)
        .map(b => JSON.parse(b))
        .reduce(flatten, [])
        .reduce(mergeResponses, {});
    const reportArray = Object.values(merged);
    return reportArray;
}


const flatten = (prev, current) => {
    return prev.concat(current);
};

/**
 * 
 * @param {Array<object>} responses 
 */
const mergeResponses = (prev, current) => {
    if(current['requestUrl'] in prev)
        return prev;
    prev[current['requestUrl']] = current;
    return prev;
}

module.exports = {
    makeRequests
};