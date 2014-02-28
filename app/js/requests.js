/*
  Prepares ajax POST request to record a ctx
*/
function $insert_node(ctx, callback) {
    cb = (callback !== undefined) ? callback : function(response) {
	console.log("Inserted ctx node to db");
    };
    switch(_srv.storage) {
        case 'local':
	    console.log('[NotImplemented] Saving ctx node (localstore).');
   	    break;
        default:
	    var req = {
		type: 'POST',
		url: _srv.url + '/api/v1/nodes/',
		data: ctx
	    };
	    $.ajax(req).done(function(response){callback(response)});
    }
}