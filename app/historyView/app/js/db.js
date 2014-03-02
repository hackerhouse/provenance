var db = {};
db.db = null;

db.open = function() {
  var version = 1;
  var request = indexedDB.open("dendwrite", version);

  // We can only create Object stores in a versionchange transaction.
  request.onupgradeneeded = function(e) {
    db.db = e.target.result;

    // A versionchange transaction is started automatically.
    e.target.transaction.onerror = db.onerror;

    if(db.objectStoreNames.contains("dendwrite")) {
      db.deleteObjectStore("dendwrite");
    }

    var store = db.createObjectStore("dendwrite",
      {keyPath: "timeStamp"});
  };

  request.onsuccess = function(e) {
    console.log(e);
    db.db = e.target.result;
    db.getAllNodes();
    console.log('it opened');
  };

  request.onerror = db.onerror;
};

db.getAllNodes = function() {
  var nodeStore = db.db;
  var trans = nodeStore.transaction(["dendwrite"], "readwrite");
  var store = trans.objectStore("dendwrite");

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false)
      return;

    result.continue();
  };

  cursorRequest.onerror = db.onerror;
};

db.addNode = function(node) {
  var nodeStore = db.db;
  var trans = nodeStore.transaction(["dendwrite"], "readwrite");
  var store = trans.objectStore("dendwrite");
  var request = store.put(node);

  request.onsuccess = function(e) {
    // Re-render all the nodes 
    db.getAllNodes();
  };

  request.onerror = function(e) {
    console.log(e.value);
  };
};
