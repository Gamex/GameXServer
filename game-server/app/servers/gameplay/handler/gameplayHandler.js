var async = require('async');
var userDao = require('../../../dao/userDao');
var Code = require('../../../../../shared/code');
var PM = require('../../../gameobject/playerManager');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};


var pro = Handler.prototype;


//pro.xxx = function(msg, session, next) {
//
//};
