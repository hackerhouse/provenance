function Collector() {
  this._completed = {};

  chrome.webNavigation.onCompleted.addListener(
      this.onCompleted.bind(this));

}

Collector.prototype = {

  /**
   * Persists our state to the storage API.
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
   * Handler for the 'onCompleted` event. Pulls the request's data from the
   * '_pending' object, combines it with the completed event's data, and pushes
   * a new NavigationCollector.Request object onto 'completed_'.
   */
  onCompleted: function(data) {
    this._completed[data.url].push({
      id: this.parseId(data),
      tabId: data.tabId,
      source: this._pending[id].source,
      transitionQualifiers: this._pending[id].transitionQualifiers,
      transitionType: this._pending[id].transitionType,
      url: data.url
    });
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
