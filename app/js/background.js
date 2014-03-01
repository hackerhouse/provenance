
var coll = new Collector();
var _tab; // tracks state of content.js's tab & ctx

/*
  Attempt to refresh/sync latest _tab data on tab activity
*/
chrome.tabs.onActivated.addListener(function(t){
    chrome.tabs.get(t.tabId, function(tab) {
	if (tab && tab.url !== 'chrome://history/') {
	    _tab = tab;
	}
    });
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request) {
	console.log('received request');
    }
});
