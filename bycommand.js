/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	api = require('./routes/api'),
	config = require('./config');

var app = module.exports = express();

// Configuration

app.configure(function () {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});

app.configure('development', function () {
	app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

app.configure('production', function () {
	app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partial/:name', routes.partial);

// JSON API

app.get('/api/:img', api.img);
app.post('/api/login', api.login);
app.post('/api/update', api.update);
// redirect all others to the index (HTML5 history)
app.get('/*', routes.index);

// Start server

app.listen(config.port, config.host, function () {
	console.log("Server started, port " + config.port);
});
