

var axm = require('../..');

axm.http();

var redis = require('redis'),
    client = redis.createClient();

var express = require('express');
var app = express();


app.get('/', function(req, res) {
  client.set("stringokey", 'yaya');

  client.get("stringokey", function(err, rep) {
    res.send(202, rep);
  });
});

app.get('/nothing', function(req, res) {
  res.send('yes');
});


app.get('/slowly', function(req, res) {
  setTimeout(function() {
    res.send('yes');
  }, 100);
});


app.get('/nothing2', function(req, res) {
  setTimeout(function() {
    res.send('yes');
  }, 1000);
});


app.listen(9007);
