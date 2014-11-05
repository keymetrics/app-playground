
## Emit Events

```javascript
var axm = require('axm');


axm.emit('user:register', {
  user : 'Alex registered',
  email : 'thorustor@gmail.com'
});
```

## Make function triggerable

```javascript
var axm = require('axm');

axm.action('db:clean', function(reply) {
  clean.db();
  reply({success : true});
});
```
