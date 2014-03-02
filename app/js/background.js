var coll = new Collector();
var _nodes, _ctx; // tracks state of content.js's tab & ctx

/*
  Listen for ctx notifications from content.js and receive msgs
*/
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request) {
	switch(request.method) {
	case 'record': 
	    console.log(request);
	    _ctx = request.data;
	}
    }
});

function build_node(node, callback) {

}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request && request.message) {
    var nodes = request.message.completed;
    if (nodes) {
      _nodes = nodes;
      for (nid in _nodes) {
        var node = nodes[nid];
        if (node && node.source) {
          var tabId = node.source.tabId;
    
          chrome.tabs.get(tabId, function (tab) {
            var opts = {'format': 'png', 'quality': 100};
	    tab.captureVisibleTab(node.source.frameId, opts, function(dataUrl) {
	      node.source.screenCap = dataUrl;
 	      node.source.html = _ctx.html;
	      _nodes[nid] = node

              // DB code here
              console.log('Event/Action received.');	    
            });	
          });
        }
      }
    }
  }
});
