
var axm = require('../..');

var obj = axm.enableProbes();

obj.it_works = true;
obj.value = 20;

setTimeout(function() {
  obj.it_works = false;
  obj.value = 99;

  setTimeout(function() {
    axm.stopProbes();
  }, 1100);
}, 1100);
