var coll = new Collector();
var _ctx; // tracks state of content.js's tab & ctx

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request) {
    console.log('Event/Action received.');
    console.log(request);
    _ctx = request;
  }
});
