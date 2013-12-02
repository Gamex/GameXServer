var async = require('async');
var userDao = require('../../../dao/userDao');
var Code = require('../../../../../shared/code');
var PM = require('../../../gameobject/playerManager');
var utils = require('../../../util/utils');

module.exports = function(app) {
	return new Remote(app);
};

var Remote = function(app) {
	this.app = app;
};

var pro = Remote.prototype;


pro.getPlayerInfo = function(uid, callback) {
	var self = this;

	userDao.getPlayerInfo(uid, function(err, code, pif) {
		if (err != null || code != Code.OK) {
			callback(err);
		} else {
			if (PM.createPlayer(pif)) {
				p = PM.getPlayer(pif.pid);
			}
			callback(null, pif);
		}
	});
};


pro.playerLeave = function(pid, callback) {
	if (!PM.removePlayer(pid)) {
		utils.invokeCallback(callback, new Error('fail to remove player!'));
		return;
	}

	utils.invokeCallback(callback, null);
}