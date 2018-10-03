const express = require('express');
const analyzer = require('./urlAnalyzer');
const reporting = require('./processResponses');

const urlAnalyzerApp = express();

urlAnalyzerApp.get("/", async (req, res, next) => {
    const targetUrl = req.query['targetUrl'];
    if (targetUrl == undefined)
        res.status(400)
            .contentType('application/json')
            .send(JSON.stringify("targetUrl query param must be set"));
    const results = await analyzer.analyzeUrl(targetUrl);    
    const markup = reporting.buildMarkup(results);
    res.status(200)
        .contentType('text/html')
        .send(markup);
});

module.exports = urlAnalyzerApp;