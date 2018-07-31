const io = require('@pm2/io')
const http = require('http')

io.init({
  network: {
    traffic: true
  }
})


/**
 * Probe system #1 - Histograms
 *
 * Measuring the event loop delay
 */

const TIME_INTERVAL = 1000

let oldTime = process.hrtime()

const histogram = io.histogram({
  name: 'Loop delay',
  measurement: 'mean',
  unit: 'ms'
})

setInterval(() => {
  const newTime = process.hrtime()
  const delay = (newTime[0] - oldTime[0]) * 1e3 + (newTime[1] - oldTime[1]) / 1e6 - TIME_INTERVAL
  oldTime = newTime
  // Now we update the metric
  histogram.update(delay)
}, TIME_INTERVAL)


/**
 * Probe system #2 - Metrics
 *
 * Probe values that can be read instantly.
 */
let randomVariable = 0

setInterval(() => {
  randomVariable++
}, 400)

io.metric({
  name: 'Var count',
  value: () => {
    return randomVariable
  }
})

/**
 * Probe system #3 - Meter
 *
 * Probe things that are measured as events / interval.
 */
const meter = io.meter({
  name: 'req/min',
  timeframe: 60
})

/**
 * Use case for Meter Probe
 *
 * Create a mock http server
 */

http.createServer((req, res) => {
  // Then mark it at every connections
  meter.mark()
  res.end('Thanks')
}).listen(5005)


/**
 * Probe system #4 - Counter
 *
 * Measure things that increment or decrement
 */
const counter = io.counter({
  name: 'Downloads'
})

/**
 * Now let's create some remote action
 * And act on the Counter probe we just created
 */
io.action('decrement', { comment: 'Increment downloads' }, (cb) => {
  counter.dec()
  cb({ success: true })
})

io.action('increment', { comment : 'Decrement downloads' }, (cb) => {
  // Increment the previous counter
  counter.inc()
  cb({ success: true })
})

io.action('throw error', { comment: 'Throw a random error ' }, (cb) => {
  // Increment the previous counter
  throw new Error('This error will be caught!')
})

io.action('send event', { comment: 'Sends an event' }, (cb) => {
  io.emit('event:sent', {
    msg: 'You sent a custom event!'
  })
  cb('Sent event!')
})

io.action('get env', (cb) => {
  cb(process.env)
})

io.action('modules version', { comment: 'Get modules version' }, (cb) => {
  cb(process.versions)
})

io.action('Action with params', { comment: 'Returns sent params' }, (data, cb) => {
  // Replies the received data
  cb(`Data received: ${JSON.stringify(data)}`)
})

/**
 * Create an action that hit the HTTP server we just created
 * So we can see how the meter probe behaves
 */
io.action('do:http:query', (cb) => {
  const options = {
    hostname: '127.0.0.1',
    port: 5005,
    path: '/users',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }

  const req = http.request(options, (res) => {
    res.setEncoding('utf8')
    res.on('data', (data) => {
      console.log(data)
    })
  })

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`)
  })

  req.end()

  cb({ success: true })
})
