var http  = require('http')
var pmx   = require('pmx').init({
  http : true,
  ports : true,
  network : true
});
var probe = pmx.probe();

var meter = probe.meter({
  name    : 'req/min',
  seconds : 60
});

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
