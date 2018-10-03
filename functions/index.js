const functions = require('firebase-functions');
const expressApp = require('./lib/urlAnalyzerApp');

const opts = {memory: '2GB', timeoutSeconds: 60};

// forward requsts to the express app
const analyzerEndpoints = functions.runWith(opts).https.onRequest(expressApp.urlAnalyzerApp);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

module.exports = {
    analyzerEndpoints
};
