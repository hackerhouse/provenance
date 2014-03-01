var db;
db.nodeDB = null;

db.nodeDB.open = function() {
  var version = 1;
  var request = indexedDB.open("todos", version);

  request.onsuccess = function(e) {
    db.nodeDB = e.target.result;
    // Do some more stuff in a minute
  };

  request.onerror = db.nodeDB.onerror;
};
