var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
var sync = require('pomelo-sync-plugin');
var connectorFilter = require('./app/servers/connector/filter/connectorFilter');
var gameplayCommon = require('./app/servers/gameplay/handler/common');
var gameplayFilter = require('./app/servers/gameplay/filter/gameplayFilter');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'GameXServer');


//app.route('auth', routeUtil.auth);
//app.route('gameplay', routeUtil.gameplay);

app.loadConfig('mysql', app.getBase() + '/../shared/config/mysql.json');

// Configure database
app.configure('production|development', 'auth|connector|master|gameplay', function () {
    var dbclient = require('./app/dao/mysql/mysql').init(app);
    app.set('dbclient', dbclient);
    //app.load(pomelo.sync, {path:__dirname + '/app/dao/mapping', dbclient: dbclient});
    app.use(sync, {sync: {path: __dirname + '/app/dao/mapping', dbclient: dbclient}});
});
// app configuration
app.configure('production|development', 'connector', function () {
    app.before(connectorFilter());
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            heartbeat: 10,
            useDict: true,
            useProtobuf: true
        });
});

app.configure('production|development', 'gate', function () {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            useProtobuf: true
        });

});
// Configure for auth server
app.configure('production|development', 'auth', function () {
    // load session congfigures
    app.set('session', require('./config/session.json'));
});


// Configure for auth server
app.configure('production|development', 'gameplay', function () {
    // load session congfigures
    app.set('session', require('./config/session.json'));
    app.set('DTUnit', require('./config/data/DTUnit.json'));

    app.filter(pomelo.filters.serial());

    app.before(gameplayFilter());
    app.set('errorHandler', gameplayCommon.ErrorHandler);

});

// start app
app.start();

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});

