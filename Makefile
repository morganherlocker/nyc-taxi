trips:
	curl https://storage.googleapis.com/tlc-trip-data/2015/yellow_tripdata_2015-01.csv -o data/2015-01.csv;

osrm:
	curl http://osm-extracted-metros.s3.amazonaws.com/new-york.osm.bz2 -o ./data/osrm/nyc.osm.bz2;
	./node_modules/osrm/lib/binding/osrm-extract -p ./profile/car.lua ./data/osrm/nyc.osm.bz2;
	./node_modules/osrm/lib/binding/osrm-prepare -p ./profile/car.lua ./data/osrm/nyc.osrm;
	./node_modules/osrm/lib/binding/osrm-datastore ./data/osrm/nyc.osrm;

draw:
	rm -rf frames;
	mkdir frames;
	echo "drawing frames.."
	node draw.js;
	echo "..complete";

video:
	rm -rf frames;
	mkdir frames;
	echo "drawing frames..";
	node draw.js;
	echo "rendering video..";
	ffmpeg -pattern_type glob -i 'frames/*.png' -y out/trips.mp4;
	echo "..complete";

gif:
	rm -rf frames;
	mkdir frames;
	echo "drawing frames..";
	node draw.js;
	echo "rendering gif..";
	convert -delay 10 -loop 0 frames/*.png out/trips.gif;
	echo "complete";