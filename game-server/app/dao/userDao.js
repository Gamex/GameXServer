//var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
//var dataApi = require('../util/dataApi');
//var Player = require('../domain/entity/player');
//var User = require('../domain/user');
//var consts = require('../consts/consts');
//var equipmentsDao = require('./equipmentsDao');
//var bagDao = require('./bagDao');
//var fightskillDao = require('./fightskillDao');
//var taskDao = require('./taskDao');
var async = require('async');
var utils = require('../util/utils');
//var consts = require('../consts/consts');
var token = require('../../../shared/token');
var Code = require('../../../shared/code');

var userDao = module.exports;

/**
 * Get user Info by username.
 * @param {String} username
 * @param {String} passwd
 * @param {function} cb
 */
userDao.getUserInfo = function (username, cb) {
	var sql = 'select * from Users where userName = ?';
	var args = [username];

	pomelo.app.get('dbclient').query(sql,args,function(err, res) {
		if(err !== null) {
			utils.invokeCallback(cb, err, null);
		} else {
			var userId = 0;
			if (!!res && res.length === 1) {
				var rs = res[0];
				utils.invokeCallback(cb,null, rs);
			} else {
				utils.invokeCallback(cb, null, {uid:-1});
			}
		}
	});
};



userDao.kickAllUser = function(callback)
{
	var dbc = pomelo.app.get('dbclient');
	
	sql = 'call kickOnlineUsers';
	args = []
	dbc.query(sql, args, function(err, res)
	{
		if (err != null)
		{
			console.log(err);
			utils.invokeCallback(callback, null, Code.FAIL);
		}
		else
		{
			utils.invokeCallback(callback, null, Code.OK);
		}
	});
};


userDao.Login = function(un, pwd, callback)
{	
	var dbc = pomelo.app.get('dbclient');
	sql = 'select login(?, ?) as uid';
	args = [un, pwd];
	dbc.query(sql, args, function(err, res){
		if (err != null)
		{
			console.log(err);
			utils.invokeCallback(callback, null, Code.FAIL);
		}
		else
		{
			if (res[0].uid >= 0)
			{
				utils.invokeCallback(callback, null, Code.OK, res[0].uid);
			}
			else
			{
				utils.invokeCallback(callback, null, Code.FAIL);
			}
		}
	});
	
	
};



userDao.logout = function(uid, callback)
{
	var dbc = pomelo.app.get('dbclient');
	sql = 'delete from OnlineUser where uid = ?'
	args = [uid];
	
	dbc.query(sql, args, function(err, res)
	{
		utils.invokeCallback(callback, err);
	});
};

