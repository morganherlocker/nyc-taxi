var Canvas = require('canvas')
var fs = require('fs')
var leftpad = require('leftpad')
var byline = require('byline')
var level = require('level')
var polyline = require('polyline')
var moment = require('moment')
var queue = require('queue-async')

               //YY-MM-DD-hh-mm-ss
var startTime = '15-01-01-01-00-00'
var stopTime =  '15-01-01-02-00-00'

var frameInc = 5
var clear = 0.15
var size = 1000
var canvas = new Canvas(size, size)
var ctx = canvas.getContext('2d')
var frame = 0
var count = 0
var bbox = [
  -74.03823852539062,
  40.84082704020004,
  -73.80271911621094,
  40.68584503000695
  ]

var xdiff = bbox[2] - bbox[0]
var ydiff = bbox[3] - bbox[1]

var routes = level('./data/routes')
var time = moment(startTime, 'YY-MM-DD-HH-mm-ss')

ctx.strokeStyle = 'rgba(255, 220, 20, 0.75)'
ctx.lineWidth = 2.5

var q = queue(1)
fs.readFile(__dirname + '/data/satellite.png', function(err, bg){
  img = new Canvas.Image
  img.src = bg
  ctx.drawImage(img, 0, 0, size, size)

  while(time.format('YY-MM-DD-HH-mm-ss') < stopTime){
    var start = time.format('YY-MM-DD-HH-mm-ss')
    var stop = time.add(frameInc, 's').format('YY-MM-DD-HH-mm-ss')
    
    q.defer(function(start, stop, done){
      routes.createReadStream({gte: start, lt: stop})
      .on('data', function(data) {
        if(data.value){
          var line = JSON.parse(data.value)
          
          ctx.beginPath()
          ctx.shadowColor = 'rgba(255, 120, 20, 1)'
          ctx.shadowBlur = 7
          ctx.globalAlpha = 1
          ctx.globalCompositeOperation = 'lighter';
          ctx.moveTo(~~(((line[0][0]-bbox[0])/xdiff) * size), ~~(((line[0][1]-bbox[1])/ydiff) * size))
          ctx.lineTo(~~(((line[1][0]-bbox[0])/xdiff) * size), ~~(((line[1][1]-bbox[1])/ydiff) * size))
          ctx.stroke()
          if(data.key > stopTime) throw new Error(data.key)
        }
      })
      .on('close', function(){
        fs.writeFileSync('frames/' + leftpad(frame++, 5) + '.png', canvas.toBuffer())
        ctx.globalAlpha = clear
        ctx.globalCompositeOperation = "none";
        ctx.shadowBlur = 0
        ctx.drawImage(img, 0, 0, size, size);

        done()
      })
    }, start, stop)
  }
  q.awaitAll(function(){})
});

