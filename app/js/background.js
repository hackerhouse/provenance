var coll = new Collector();
var _nodes, _ctx; // tracks state of content.js's tab & ctx

db.open();

function setup_nodes() {
    for (nid in _nodes) {
        var ns = _nodes[nid];
        if (ns && ns.length) {
            var node = ns[0];
            var tabId = node.source.tabId;
            chrome.tabs.get(tabId, function (tab) {
                if (_ctx) {
                    node.source.html = _ctx.html;
                }
                _nodes[nid] = node;	  

                if (tab && tab.title) {
                    var opts = {'format': 'png', 'quality': 100};
                    try {
                        chrome.tabs.captureVisibleTab(tab.windowId, opts, function(dataUrl) {
                            _nodes[nid].source.screenCap = dataUrl;
                            db.addNode(_nodes[nid]);
                        });
                    } catch (err) {
                        console.log("yep, we're doomed");
                    }
                }
            });
        }
    }
}


/*
   Listen for ctx notifications from content.js and collector & handle msgs
   */
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

    if (request && request.message) {
        console.log(request);
        switch(request.type) {
            case 'record': 
                _ctx = request.message;
            break;
            case 'saveDataState':	
                if (request.message.completed) {
                _nodes = request.message.completed;
                setup_nodes();
            }
        }
    }
});
