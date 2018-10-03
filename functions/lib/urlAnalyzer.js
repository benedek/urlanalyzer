const puppeteer = require('puppeteer');
const URL = require('url');

const analyzeUrl = async (targetUrl) => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--single-process'
        ]
    });
    const page = await browser.newPage();
    page.setCacheEnabled(false);
    let allResponseHeaders = [];
    page.on('response', (res) => {
        let headers = res.headers();
        headers["requestUrl"] = res.url();
        allResponseHeaders.push(headers);
    });
    await page.goto(targetUrl, { "waitUntil": "networkidle0" });

    allResponseHeaders = removeCORS(URL.parse(targetUrl).host, allResponseHeaders);
    await browser.close();
    return allResponseHeaders;
};

/**
 * 
 * @param {string} hostnameSuffix
 * @param {Array} allHeaders 
 */
const removeCORS = (hostnameSuffix, allHeaders) => {
    return allHeaders.filter(v =>
        URL.parse(v['requestUrl']).hostname.endsWith(hostnameSuffix)
    );
};


module.exports = {
    analyzeUrl: analyzeUrl
};