
var axm = require('..');
var request = require('request');

function fork() {
  return require('child_process').fork(__dirname + '/transaction/app.mock.js', []);
}

describe('AXM transaction', function() {
  it('should have right properties', function(done) {
    axm.should.have.property('http');
    done();
  });

  var app;

  it('should receive configuration flag', function(done) {
    app = fork();

    app.once('message', function(data) {
      data.type.should.eql('axm:option:configuration');
      done();
    });

  });


  it('should get query summary on http request', function(done) {

    app.on('message', function(data) {
      if (data.type == 'axm:option:configuration')
        return false;

      data.type.should.eql('http:transaction');
      process.kill(app.pid);
      done();
    });


    setTimeout(function() {
      request('http://127.0.0.1:9007/', function(req, res) {});
    }, 500);
  });

});
