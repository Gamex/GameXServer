var async = require('async');
var userDao = require('../../../dao/userDao');
var Code = require('../../../../../shared/code');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};


var pro = Handler.prototype;


pro.getPlayerInfo = function(msg, session, next) {
	if(!session || !session.uid) {
		next(null, {code: Code.FA_GAMEPLAY_NOT_LOGIN});
		return;
	}
	
	userDao.getPlayerInfo(session.uid, function(err, code, pif)
	{
		if (err != null || code != Code.OK)
    	{
    		next(null, {code: Code.FAIL});
    	}
    	else
    	{
    		next(null, {code: code, player: pif});
    	}
	});
};


