
var axm = require('axm');
var fs  = require('fs');

fs.readFile('/var/run/rethinkdb/default/pid_file', function(err, data) {
  var pid = data.toString();

  axm.configureModule({
    name : 'RethinkDB',
    version : '1.0',
    pid : 4611,
    errors : false,
    latency : false,
    versioning : false,
    show_module_meta : true,
    author : 'Alexandre Strzelewicz'
  });

});

var rdb = require('rethinkdb');

rdb.connect({
  host: 'localhost',
  port: 28015
}, function(err, con) {
  if (err) throw err;
  // Do query to create probes [...]
  // Todo
});
