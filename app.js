
var axm = require('axm');

/**
 * Report any uncaught errors
 */
axm.catchAll();
/**
 * Enable HTTP latency monitoring
 */
axm.http();

var users_db = {
  'alex'  : 'str',
  'jeni'  : 'oiu'
};


var probe = axm.probe();

/**
 * Probe system #1 - Metrics
 *
 * Probe values that can be read instantly.
 */
var rt_users = probe.metric({
  name : 'User count',
  value : function() {
    return Object.keys(users_db).length;
  }
});

/**
 * Probe system #2 - Meter
 *
 * Probe things that are measured as events / interval.
 */
var meter = probe.meter({
  name    : 'req/min',
  seconds : 60
});

/**
 * Use case for Meter Probe
 *
 * Create a mock http server
 */
var http  = require('http');

http.createServer(function(req, res) {
  // Then mark it at every connections
  meter.mark();
  res.end('Thanks');
}).listen(5005);


/**
 * Probe system #3 - Histograms
 *
 * Measuring the event loop delay
 */

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
  histogram.update(delay);
}, TIME_INTERVAL);

/**
 * Probe system #4 - Counter
 *
 * Measure things that increment or decrement
 */
var counter = probe.counter({
  name : 'Downloads'
});

/**
 * Now let's create some remote action
 * And act on the Counter probe we just created
 */
axm.action('decrement', {comment : 'Increment downloads'}, function(reply) {
  // Decrement the previous counter
  counter.dec();
  reply({success : true});
});

axm.action('increment', {comment : 'Decrement downloads'}, function(reply) {
  // Increment the previous counter
  counter.inc();
  reply({success : true});
});

axm.action('throw error', {comment : 'Throw a random error'}, function(reply) {
  // Increment the previous counter
  throw new Error('This error will be caught!');
});

/**
 * Create an action that hit the HTTP server we just created
 * So we can see how the meter probe behaves
 */
axm.action('do:http:query', function(reply) {
  var options = {
    hostname : '127.0.0.1',
    port     : 5005,
    path     : '/users',
    method   : 'GET',
    headers  : { 'Content-Type': 'application/json' }
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (data) {
      console.log(data);
    });
  });
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  req.end();

  reply({success : true});
});
