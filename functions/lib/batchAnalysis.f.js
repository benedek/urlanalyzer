const express = require('express');
const analyzer = require('./batchAnalysis');
const reporting = require('./processResponses');

const batchAnalyzerApp = express();

batchAnalyzerApp.get("/", async (req, res, next) => {
    let targetUrls = req.query['targetUrls'];
    if (targetUrls == undefined)
        res.status(400)
            .contentType('application/json')
            .send(JSON.stringify("targetUrls query param must be set"));
    if (typeof targetUrls == 'string') {
        targetUrls = [targetUrls];
    }
    const results = await analyzer.makeRequests(targetUrls);
    const markup = reporting.buildMarkup(results);
    res.status(200)
        .contentType('text/html')
        .send(markup);
});

module.exports = batchAnalyzerApp;