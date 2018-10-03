const URL = require('url');
const fs = require('fs');

const __main = () => {
    const rawData = fs.readFileSync('responses.json', { encoding: 'UTF-8' });
    const markup = processJson(rawData);
    console.log(markup);
    // let data = '';    
    // process.stdin.resume();
    // process.stdin.setEncoding('utf8');

    // process.stdin.on('data', function (chunk) {
    //     data += chunk;
    // });

    // process.stdin.on('end', function () {
    //     var markup = processJson(data)
    //     console.log(markup);
    // });
};

const processJson = (json) => {
    let data = json;
    data.sort(SORT.byUrlHostname);
    const optimizable = data.filter(FILTERS.withoutPublicCacheHeader);
    const nonOptimizable = data.filter(FILTERS.withPublicCacheHeader);
    const optimizableMarkup = generateMarkup(optimizable, 'optimizable');
    const nonOptimizableMarkup = generateMarkup(nonOptimizable, 'nonoptimizable');
    return `${optimizableMarkup}${nonOptimizableMarkup}`;
}

const FILTERS = {
    withPublicCacheHeader: (response) => response.hasOwnProperty('cache-control')
        ? response['cache-control'].includes('public')
        : false,
    withoutPublicCacheHeader: (response) => !FILTERS.withPublicCacheHeader(response),
};
const SORT = {
    byUrlHostname: (a, b) => {
        const aUrl = a['requestUrl'];
        const bUrl = b['requestUrl'];
        return URL.parse(aUrl).path.localeCompare(URL.parse(bUrl).path);
    },
};

const generateMarkup = (data, title) => {
    const headerWhitelist = ['requestUrl', 'status', 'content-type', 'cache-control', 'pragma'];
    let markup = '<h1>' + title + '</h1><table>';    
    data.forEach(row => {
        markup += '<tr>';        
        headerWhitelist.forEach(h => {
            if(row.hasOwnProperty(h))
                markup += `<td>${row[h]}</td>`;
            else
                markup += `<td>${h} not-present</td>`;
        });
        markup += '</tr>';
    });
    markup += '</table>'
    return markup;
};

module.exports = {
    buildMarkup: processJson
};

// __main();

