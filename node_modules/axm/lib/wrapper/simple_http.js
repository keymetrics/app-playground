
var Proxy     = require('../utils/proxy.js');
var Transport = require('../utils/transport.js');

var HttpWrap = module.exports = function(http) {

  Proxy.wrap(http.Server.prototype, ['on', 'addListener'], function(addListener) {
    return function(event, listener) {

      if (!(event === 'request' && typeof listener === 'function')) return addListener.apply(this, arguments);

      return addListener.call(this, event, function(request, response) {
        var self = this;
        var args = arguments;

        var http_start = {
          url    : request.url,
          method : request.method,
          start  : Date.now()
        };

        response.once('finish', function() {

          Transport.send({
            type : 'http:transaction',
            data : {
              url        : http_start.url,
              method     : http_start.method,
              time       : Date.now() - http_start.start,
              code       : response.statusCode,
              size       : response.getHeader('Content-Length') || null
            }
          });
        });

        return listener.apply(self, args);
      });
    };
  });
  return http;
};
