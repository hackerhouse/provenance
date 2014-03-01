
function render_history(ctx) { 
    $('#container').html(JSON.stringify(ctx));
}

function init() {
  db.open(); // open displays the data previously saved
}


/* Triggered when the chrome://history page is visited */
document.addEventListener('DOMContentLoaded', function () {
    if (chrome.extension.getBackgroundPage()._ctx) {
	// Sync / update ctx from content.js via background.js
	ctx = chrome.extension.getBackgroundPage()._ctx;
	render_history(ctx);
    }
});

/*
  Listens for requests from background.js and replies with a msg
  containing url and html
*/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var msg = {url: window.location.href,
	       html: document.body.innerHTML
	      }
    sendResponse(msg);
});
