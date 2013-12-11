var async = require('async');
var userDao = require('../../../dao/userDao');
var Code = require('../../../../../shared/code');
var PM = require('../../../gameobject/playerManager');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;

    if (app.serverId.search('gameplay-server-') == 0)
    {
        app.set('errorHandler', EH);      // error handler for next(new Error(''));
    }
};


var EH = function(err, msg, resp, session, next)
{
    var uid = session.uid;
//    session.kick(uid, null);
    session.__sessionService__.app.rpc.connector.connectorRemote.kickUser(session, null);
    next(null, {code: Code.FAIL});
};


var pro = Handler.prototype;


pro.getHomeInfo = function(msg, session, next)
{
    var pid = session.settings.playerId;
    userDao.getHomeInfo(pid, function(err, rs){
        if (err)
        {
            next(null, {code: Code.FAIL});
        }
        else
        {
            next(null, {code: Code.OK, info: rs});
        }
    });
}


pro.build = function(msg, session, next) {
//    next(new Error('abcdefg'));
	next(null, {code: Code.OK});
};


