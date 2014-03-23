
function render_history(ctx) { 
    $('#container').html(JSON.stringify(ctx));
}

/* Triggered when the chrome://history page is visited */
document.addEventListener('DOMContentLoaded', function () {
  if (chrome.extension.getBackgroundPage()._nodes) {
    // Sync nodes from content.js via background.js
    nodes = chrome.extension.getBackgroundPage()._nodes;
    render_history(nodes);
  }
});

/*
  Listens for requests from background.js and replies with a msg
  containing url and html
*/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var msg = {
    url: window.location.href,
    html: document.body.innerHTML
  }
  sendResponse(msg);
});
