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

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
pro.entry = function(msg, session, next) {
  	var token = msg.token, pwd = msg.password, self = this;

	if(!token) {
		next(new Error('invalid entry request: empty token'), {code: Code.FAIL});
		return;
	}

	var uid, players, player;
	async.waterfall([
		function(cb) {
			// auth token
			self.app.rpc.auth.authRemote.checkToken(session, token, pwd, cb);
		}, function(code, uerId, cb) {
			// query player info by user id
			if(code !== Code.OK) {
				next(null, {code: code});
				return;
			}

			if(!uerId) {
				next(null, {code: Code.ENTRY.FA_USER_NOT_EXIST});
				return;
			}

			uid = uerId;
			self.app.get('sessionService').kick(uid, cb);
			session.bind(uid, cb);
		}, function(cb) {
//			session.set('playername', player.name);
//			session.set('playerId', player.id);
			session.on('closed', onUserLeave.bind(null, self.app));
			session.pushAll(cb);
		}
	], function(err) {
		if(err) {
			next(err, {code: Code.FAIL});
			return;
		}

		next(null, {code: Code.OK});
	});

};



var onUserLeave = function (app, session, reason) {
	if(!session || !session.uid) {
		return;
	}
//	console.log('user leave: ' + session.uid);

	app.rpc.auth.authRemote.userLeave(session, session.uid, function(err){
		if (err != null)
		{
			console.log(err);
		}
		});
};


