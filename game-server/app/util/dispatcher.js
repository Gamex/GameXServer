var crc = require('../../node_modules/pomelo/node_modules/crc/lib/crc');

module.exports.dispatch = function(uid, connectors) {
    var index = Number(uid) % connectors.length;
	return connectors[index];
};
