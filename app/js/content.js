/**
 *  content_script: Automatically/immediately run every time a user
 *  visits a new page or opens a new tab
 */

/*
  Notify the background.js script that the browser's page is done
  loading. Send the page's url and html content (and or other assets)
  as a payload. A callback may be provided as an option argument.
*/
function notify_bg_to(type, message, callback) {
  cb = (callback !== undefined) ? callback : function(response) { };
  chrome.extension.sendMessage({
    'type': type,
    'message': message,
  }, cb);
}

/*
  Listen for requests from background.js and replies with a msg
  containing url and html
*/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var msg = {
    url: window.location.href,
    html: document.body.innerHTML
  }
  sendResponse(msg);
});

/*
  capture() compiles and submits information about the browser's
  current context.
 */
(function capture() {
  var ctx = {
    url: window.location.href,
    html: document.body.innerHTML
  };

  // share ctx with background.js
  notify_bg_to('record', ctx);
  console.log('page hit');
})();
