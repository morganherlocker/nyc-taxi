nyc-taxi
---

This project creates animations from NYC taxi trip data, released under a [FOIL request](http://www.ag.ny.gov/bureau/foil).

##How it works

The raw trip data contains only a small amount of metadata, along with origin and destination lat/lon pairs. Using OpenStreetMap and OSRM (a routing engine), we can guess the trips that taxis took between their start and stop points. Each segment of the route is indexed into a leveldb database, which can be scanned for reading data, in order, for any slice of time.

##Usage

###Setup

*Note: you must follow the platform-specific install steps for [node-canvas](https://github.com/Automattic/node-canvas) before you begin*

```
npm install
```

####Download trips

```
make trips
```

####Download OpenStreetMap extract and process graph

```
make osrm
```

####Route the trips to create an edge database

```
node route.js
```

###Rendering

####Gif

```
make gif
```

####MP4

```
make video
```
