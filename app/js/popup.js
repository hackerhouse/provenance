
var ctx; // persist context

function render_popup() { 
    alert(JSON.stringify(ctx));
}

/* Listen for clicks to trigger the extension popup */
document.addEventListener('DOMContentLoaded', function () {
    if (chrome.extension.getBackgroundPage()._ctx) {
	// Sync / update ctx from content.js via background.js
	ctx = chrome.extension.getBackgroundPage()._ctx;
	ctx.tab = chrome.extension.getBackgroundPage()._tab;
	render_popup();
    }
});
