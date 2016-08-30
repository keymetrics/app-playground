var pmx       = require('pmx')
var benchrest = require('bench-rest')

var pmx = require('pmx').init({
  http : true
});



    
  var runOptions = {
    limit: 1000,   
    iterations: 20000 
  };
  benchrest(process.env.TARGET || 'http://localhost:3000', runOptions)
    .on('error', function (err, ctxName) { console.error('Failed in %s with err: ', ctxName, err); })
    .on('end', function (stats, errorCount) {
      console.log('error count: ', errorCount);
      console.log('stats', stats);
    });


