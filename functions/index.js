const functions = require('firebase-functions');
const opts = {memory: '2GB', timeoutSeconds: 60};

module.exports = {
    'analyzeAndReport': functions.runWith(opts).https.onRequest(require('./lib/urlAnalyzer.f')),
    'analyze': functions.runWith(opts).https.onRequest(require('./lib/analyze.f')),
    'batchAnalysis': functions.https.onRequest(require('./lib/batchAnalysis.f')),
};
