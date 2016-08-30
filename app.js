var http  = require('http')
var pmx   = require('pmx').init({
  http : true
});

var probe = pmx.probe();

var TIME_INTERVAL = 1000;

var oldTime = process.hrtime();

var histogram = probe.histogram({
  name        : 'Loop delay',
  measurement : 'mean',
  unit        : 'ms'
});

setInterval(function() {
  var newTime = process.hrtime();
  var delay = (newTime[0] - oldTime[0]) * 1e3 + (newTime[1] - oldTime[1]) / 1e6 - TIME_INTERVAL;
  oldTime = newTime;
  // Now we update the metric
  histogram.update(delay);
}, TIME_INTERVAL);


var meter = probe.meter({
  name    : 'req/min',
  seconds : 60
});

var http  = require('http');

http.createServer(function(req, res) {
  meter.mark();
  res.end('Thanks');
}).listen(process.env.PORT);



pmx.action('throw error', {comment : 'Throw a random error'}, function(reply) {
  throw new Error('This error will be caught!');
});

pmx.action('get env', function(reply) {
  reply(process.env);
});

pmx.action('modules version', {comment : 'Get modules version'}, function(reply) {
  reply(process.versions);
});
