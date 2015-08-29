var byline = require('byline')
var OSRM = require('osrm')
var fs = require('fs')
var level = require('level')
var report = require('./report')
var polyline = require('polyline')
var moment = require('moment')

var routes = level('./data/route-segments')
var osrm = new OSRM('./data/new-york_new-york.osrm')
var stream = byline(fs.createReadStream('./data/15-01.csv', { encoding: 'utf8' }))

var count = 0
stream.on('data', function(line) {
  var trip = parseLine(line)
  osrm.route({coordinates: trip.coordinates, printInstructions: true}, function(err, route) {
    if(route.route_geometry){
      var coords = polyline.decode(route.route_geometry, 6)
      for(var i = 0; i < coords.length-1; i++){
        var segment = [[coords[i][1],coords[i][0]], [coords[i+1][1],coords[i+1][0]]]
        var seconds = route.route_summary.total_time * (i / coords.length)
        var key = moment(trip.startTime).add(seconds, 's').format('YY-MM-DD-HH-mm-ss-')+i
        routes.put(key, JSON.stringify(segment), function(){
          report(count++)
        })
      }
    }
  })
})

function parseLine(line){
  var cells = line.split(',')
  var trip = {
    startTime: cells[1],
    stopTime: cells[2],
    coordinates: [[+cells[6], +cells[5]], [+cells[10], +cells[9]]]
  }
  return trip
}