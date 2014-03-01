var db;

db.open = function() {
  var version = 1;
  var request = indexedDB.open("dendwrite", version);

  request.onsuccess = function(e) {
    db.= e.target.result;
    // Do some more stuff in a minute
  };

  request.onerror = db.onerror;
};

db.open = function() {
  var version = 1;
  var request = indexedDB.open("dendwrite", version);

  // We can only create Object stores in a versionchange transaction.
  request.onupgradeneeded = function(e) {
    var db = e.target.result;

    // A versionchange transaction is started automatically.
    e.target.transaction.onerror = db.onerror;

    if(db.objectStoreNames.contains("dendwrite")) {
      db.deleteObjectStore("dendwrite");
    }

    var store = db.createObjectStore("dendwrite",
      {keyPath: "timeStamp"});
  };

  request.onsuccess = function(e) {
    db.db = e.target.result;
    db.getAllNodes();
  };

  request.onerror = db.onerror;
};

db.addNode = function(dendwriteText) {
  var db = db;
  var trans = db.transaction(["dendwrite"], "readwrite");
  var store = trans.objectStore("dendwrite");
  var request = store.put({
    "text": ,
    "timeStamp" : new Date().getTime()
  });

  request.onsuccess = function(e) {
    // Re-render all the dendwrite's
    db.getAllNodes();
  };

  request.onerror = function(e) {
    console.log(e.value);
  };
};
