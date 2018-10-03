const functions = require('firebase-functions');
const expressApp = require('./lib/urlAnalyzerApp');

// forward requsts to the express app
const analyzerEndpoints = functions.https.onRequest(expressApp.urlAnalyzerApp);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

module.exports = {
    analyzerEndpoints
};