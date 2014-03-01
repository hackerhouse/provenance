function Collector() {
  this._pending = {};
  this._completed = {};

  chrome.webNavigation.onCreatedNavigationTarget.addListener(
      this.createdNavigationTargetListener.bind(this)
  );
  chrome.webNavigation.onBeforeNavigate.addListener(
      this.onBeforeNavigateListener.bind(this)
  );
  chrome.webNavigation.onCommitted.addListener(
      this.onCommittedListener.bind(this)
  );
  chrome.webNavigation.onCompleted.addListener(
    this.onCompletedListener.bind(this);
  );
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
    }).bind(this);
  },

  /**
    Creates an empty entry in the pending array if one doesn't already exist,
    and prepopulates the errored and completed arrays for ease of insertion
    later.

    @param {!string} id The request's ID, as produced by parseId_.
    @param {!string} url The request's URL.
   **/
  prepareUrlStorage: function(id, url) {
    this._pending = this._pending[id] || {
      source: {
        tabId: null
        frameId: null
      }
      newTab: null
      transitionType: null
      url: null
      screenCap: null
      timestamp: null
    }
  }

  /**
   * Handler for the 'onCreatedNavigationTarget' event. Updates the
   * pending request with a source frame/tab, and notes that it was opened in a
   * new tab.
   *
   * Pushes the request onto the
   * 'pending_' object, and stores it for later use.
   *
   * @param {!Object} data The event data generated for this request.
   * @private
   */
  createdNavigationTargetListener: function(data) {
    var tabid = this.parseId(data);
    this.prepareUrlStorage(tabid, data.url);
    this.pending_[tabid].newTab = data.tabId;
    this.pending_[tabid].source = {
      tabId: data.sourceTabId,
      frameId: data.sourceFrameId
    };
    this.pending_[tabid].timestamp = data.timeStamp;
  },

  /**
   * Handler for the 'onBeforeNavigate' event. Pushes the request onto the
   * 'pending_' object, and stores it for later use.
   *
   * @param {!Object} data The event data generated for this request.
   * @private
   */
  onBeforeNavigateListener: function(data) {
    var tabid = this.parseId(data);
    this.prepareUrlStorage(tabid, data.url);
    this.pending_[tabid].start = this.pending_[tabid].start || data.timeStamp;
  },

  /**
   * Handler for the 'onCommitted' event. Updates the pending request with
   * transition information.
   *
   * Pushes the request onto the
   * 'pending_' object, and stores it for later use.
   *
   * @param {!Object} data The event data generated for this request.
   * @private
   */
  onCommittedListener: function(data) {
    var id = this.parseId(data);
    this.prepareUrlStorage(id, data.url);
    this.pending_[id].transitionType = data.transitionType;
    this.pending_[id].transitionQualifiers = data.transitionQualifiers;
  },


  /**
   * Handler for the 'onCompleted` event. Pulls the request's data from the
   * 'pending_' object, combines it with the completed event's data, and pushes
   * a new NavigationCollector.Request object onto 'completed_'.
   *
   * @param {!Object} data The event data generated for this request.
   * @private
   */
  onCompleted: function(data) {
    var id = this.parseId(data);
    this._completed[data.url].push({
      duration: (data.timeStamp - this.pending_[id].start),
      openedInNewWindow: this.pending_[id].openedInNewWindow,
      source: this.pending_[id].source,
      transitionQualifiers: this.pending_[id].transitionQualifiers,
      transitionType: this.pending_[id].transitionType,
      url: data.url
    });
    delete this.pending_[id];
    this.saveDataState();
  },


  /**
    tabId ffunction from webnavigation API example.
    **/
  parseId: function(data) {
    return data.tabId + '-' + (data.frameId ? data.frameId : 0);
  }
};
