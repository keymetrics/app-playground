
var axm = require('axm');

/**
 * Inject this first before requiring http
 *
 * Enable http latency monitoring
 */
axm.http();

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');

/**
 * Catch all uncaught exceptions
 */
axm.catchAll();



var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3900);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  res.send('v2');
});




var probes = axm.enableProbe();

/**
 * Simple counter probing
 */
probes.counter = 0;

setInterval(function() {
  probes.counter++;
}, 1000);

/**
 * Function probing
 */
probes["fn probe"] = function() {
  return Math.floor(Math.random() * 100);
};

/**
 * Function probing #2
 */
probes["key map"] = Object.keys({'sock1':null, 'sock2':null }).length;

/**
 * Record Express HTTP errors
 */
app.use(axm.expressErrorHandler());

var counter1min;

setInterval(function () {
  counter1min = 0;
}, 60 * 1000);

app.use('*', function(next) {
  counter1min++;
  next();
});

var server = http.createServer(app).listen(app.get('port'), function(){
  probes['listening'] = true;
  console.log("Express server listening on port " + app.get('port'));
});


probes['http connections'] = server._connections;
