var _ctx, _tab; // tracks state of content.js's tab & ctx

/*
  Listen for notifications from content.js and receive msgs
*/
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request) {
	switch(request.method) {
	    case 'record': 
  	        _ctx = request.data;
	}
    }
});

/*
  Attempt to refresh/sync latest _tab data on tab activity
*/
chrome.tabs.onActivated.addListener(function(t){
    chrome.tabs.get(t.tabId, function(tab) {
	_tab = tab;
    });
});




/*
  sync_popup is invoked via the popup.js to recieve changes from
  content.js as needed.
 */
function sync_popup() {
    if (_tab && _tab.tabId) {
	var tabid = _tab.tabId;
	chrome.tabs.sendMessage(tabid, {method: ""}, function(response) {
	    if (response && response.network) {
		if (response.network.network && response.network.netid) {
		    _network = response.network;
		}
	    }
	});
    }
}

