var pmx       = require('pmx')
var benchrest = require('bench-rest')

var pmx = require('pmx').init({
  http : true
});

pmx.action('benchmark', function(data, reply) {
  var data = JSON.parse(data)

  if (data.concurrent === undefined || data.nbr === undefined)
    return reply('bad params, example : { "concurrent" : 1000, "nbr": 10000 }')
    
  var runOptions = {
    limit: data.concurrent,   
    iterations: data.nbr 
  };
  benchrest(process.env.TARGET, runOptions)
    .on('error', function (err, ctxName) { console.error('Failed in %s with err: ', ctxName, err); })
    .on('end', function (stats, errorCount) {
      console.log('error count: ', errorCount);
      console.log('stats', stats);
      reply({ stats: stats, errors: errorCount});
    });
});

