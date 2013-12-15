var async = require('async');
var userDao = require('../../../dao/userDao');
var Code = require('../../../../../shared/code');
var PM = require('../../../gameobject/playerManager');

var handler = module.exports;


handler.ErrorHandler = function(err, msg, resp, session, next)
{
    var uid = session.uid;

    session.__sessionService__.app.rpc.connector.connectorRemote.kickUser(session, null);
    next(null, {code: Code.FAIL});
};




