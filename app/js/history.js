
function render_history(tab) { 
    $('#container').html(JSON.stringify(tab));
}

function init() {
  db.open(); // open displays the data previously saved
}


/* Triggered when the chrome://history page is visited */
document.addEventListener('DOMContentLoaded', function () {
    if (chrome.extension.getBackgroundPage()._tab) {
	// Sync / update ctx from content.js via background.js
	tab = chrome.extension.getBackgroundPage()._tab;
	render_history(tab);
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
