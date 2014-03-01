function Collector() {
  this._pending = {};
  this._completed = {};

  chrome.webNavigation.onCreatedNavigationTarget.addListener(
      this.createdNavigationTargetListener.bind(this));
  chrome.webNavigation.onBeforeNavigate.addListener(
      this.onBeforeNavigateListener.bind(this));
  chrome.webNavigation.onCommitted.addListener(
      this.onCommittedListener.bind(this));
  chrome.webNavigation.onCompleted.addListener(
    this.onCompleted.bind(this));

}

Collector.prototype = {

  /**
   * Persists our state to the storage API.
   * @private
   */
  saveDataState: function() {
    chrome.runtime.sendMessage({
      type: 'saveDataState',
      message: {
        completed: this._completed
      }
    });
  },

  /**
    Creates an empty entry in the pending array if one doesn't already exist,
    and prepopulates the errored and completed arrays for ease of insertion
    later.

    @param {!string} id The request's ID, as produced by parseId_.
    @param {!string} url The request's URL.
   **/
  prepareUrlStorage: function(id, url) {
    this._pending[id] = this._pending[id] || {
      source: {
        tabId: null,
        frameId: null
      },
      newTab: null,
      transitionType: null,
      url: null,
      screenCap: null,
      timestamp: null
    };
    this._completed[url] = this._completed[url] || [];
  },

  /**
   * Handler for the 'onCreatedNavigationTarget' event. Updates the
   * pending request with a source frame/tab, and notes that it was opened in a
   * new tab.
   *
   * Pushes the request onto the
   * '_pending' object, and stores it for later use.
   *
   * @param {!Object} data The event data generated for this request.
   * @private
   */
  createdNavigationTargetListener: function(data) {
    var id = this.parseId(data);
    this.prepareUrlStorage(id, data.url);
    this._pending[id].newTab = data.tabId;
    this._pending[id].source = {
      tabId: data.sourceTabId,
      frameId: data.sourceFrameId
    };
    this._pending[id].timestamp = data.timeStamp;
  },

  /**
   * Handler for the 'onBeforeNavigate' event. Pushes the request onto the
   * '_pending' object, and stores it for later use.
   *
   * @param {!Object} data The event data generated for this request.
   * @private
   */
  onBeforeNavigateListener: function(data) {
    var id = this.parseId(data);
    this.prepareUrlStorage(id, data.url);
    this._pending[id].start = this._pending[id].start || data.timeStamp;
  },

  /**
   * Handler for the 'onCommitted' event. Updates the pending request with
   * transition information.
   *
   * Pushes the request onto the
   * '_pending' object, and stores it for later use.
   *
   * @param {!Object} data The event data generated for this request.
   * @private
   */
  onCommittedListener: function(data) {
    var id = this.parseId(data);
    this.prepareUrlStorage(id, data.url);
    this._pending[id].transitionType = data.transitionType;
    this._pending[id].transitionQualifiers = data.transitionQualifiers;
  },


  /**
   * Handler for the 'onCompleted` event. Pulls the request's data from the
   * '_pending' object, combines it with the completed event's data, and pushes
   * a new NavigationCollector.Request object onto 'completed_'.
   *
   * @param {!Object} data The event data generated for this request.
   * @private
   */
  onCompleted: function(data) {
    var id = this.parseId(data);
    this._completed[data.url].push({
      openedInNewWindow: this._pending[id].openedInNewWindow,
      source: this._pending[id].source,
      transitionQualifiers: this._pending[id].transitionQualifiers,
      transitionType: this._pending[id].transitionType,
      url: data.url
    });
    delete this._pending[id];
    var saveData = this.saveDataState.bind(this);
    saveData();
  },


  /**
    tabId ffunction from webnavigation API example.
    **/
  parseId: function(data) {
    return data.tabId + '-' + (data.frameId ? data.frameId : 0);
  }
};
