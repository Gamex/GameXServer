var tokenService = require('../../../../../shared/token');
var userDao = require('../../../dao/userDao');
var Code = require('../../../../../shared/code');
var token = require('../../../../../shared/token');
var async = require('async');

var DEFAULT_SECRET = 'pomelo_session_secret';
var DEFAULT_EXPIRE = 6 * 60 * 60 * 1000;	// default session expire time: 6 hours

module.exports = function(app) {
	return new Remote(app);
};

var Remote = function(app) {
	this.app = app;
	var session = app.get('session') || {};
	this.secret = session.secret || DEFAULT_SECRET;
	this.expire = session.expire || DEFAULT_EXPIRE;
};

var pro = Remote.prototype;

/**
 * Auth token and check whether expire.
 *
 * @param  {String}   token token string
 * @param  {Function} cb
 * @return {Void}
 */
pro.auth = function(msg, callback) {
    
    var userName = msg.userName;
    var password = msg.password;
    if (!userName || !password)
    {
        cb(null, Code.FAIL);
        return;
    }
    
    var UserId;
    async.waterfall([
    	function(cb)
    	{
    		userDao.getUserInfo(userName, cb);
    	},
    	function(res, cb)
    	{
    		if (res.uid == -1)
    		{
    			// can't find the user
    			callback(null, Code.ENTRY.FA_USER_NOT_EXIST);
    		}
    		else
    		{
    			if (res.password == password)
    			{
		    		UserId = res.uid;
		    		userDao.getToken(UserId, password, cb);
	    		}
	    		else
	    		{
	    			callback(null, Code.ENTRY.FA_USER_PWD_ERROR);
	    		}
    		}
    	}
    	],
    	function(err, t)
    	{
           if (err == null)
           {
           		if (t === undefined)
           		{
           			callback(null, Code.ENTRY.FA_USER_ALREADY_LOGIN);
           		}
           		else
           		{
	               callback(null, Code.OK, UserId, t);
           		}
               return;
           }
           else
           {
	           callback(err);
	           return;
           }
		});
};

/**
 * Check the token whether expire.
 *
 * @param  {Object} token  token info
 * @param  {Number} expire expire time
 * @return {Boolean}        true for not expire and false for expire
 */
var checkExpire = function(token, expire) {
	if(expire < 0) {
		// negative expire means never expire
		return true;
	}

	return (Date.now() - token.timestamp) < expire;
};
