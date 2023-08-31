import { csv2geojson } from "csv2geojson";
import { parse as wktParser } from "wellknown";
import { decode as polylineParser } from "@mapbox/polyline";
import { feature as topojsonParser } from "topojson-client";
import { kml as kmlParser, gpx as gpxParser } from "@mapbox/togeojson";
import { addData, parseXML } from "./leaflet.omnivore.utils";

export function topojsonParse(data, options, layer) {
  let o = typeof data === 'string'
    ? JSON.parse(data) : data;
  layer = layer || L.geoJson();
  for (let i in o.objects) {
    let ft = topojsonParser(o, o.objects[i]);
    if (ft.features) {
      addData(layer, ft.features);
    } else {
      addData(layer, ft);
    }
  }
  return layer;
}

export function csvParse(csv, options, layer) {
  layer = layer || L.geoJson();
  options = options || {};
  csv2geojson(csv, options, onparse);

  function onparse(err, geojson) {
    if (err) return layer.fire('error', { error: err });
    addData(layer, geojson);
  }

  return layer;
}

export function gpxParse(gpx, options, layer) {
  let xml = parseXML(gpx);
  if (!xml) {
    return layer.fire('error', {
      error: 'Could not parse GPX',
    });
  }
  layer = layer || L.geoJson();
  let geojson = gpxParser(xml);
  addData(layer, geojson);
  return layer;
}

export function kmlParse(gpx, options, layer) {
  let xml = parseXML(gpx);
  if (!xml) {
    return layer.fire('error', {
      error: 'Could not parse KML',
    });
  }
  layer = layer || L.geoJson();
  let geojson = kmlParser(xml);
  addData(layer, geojson);
  return layer;
}

export function polylineParse(txt, options, layer) {
  layer = layer || L.geoJson();
  options = options || {};
  let coords = polylineParser(txt, options.precision);
  let geojson = {
    type: 'LineString',
    coordinates: [],
  };
  for (let i = 0; i < coords.length; i++) {
    // polyline returns coords in lat, lng order, so flip for geojson
    geojson.coordinates[i] = [coords[i][1], coords[i][0]];
  }
  addData(layer, geojson);
  return layer;
}

export function wktParse(wkt, options, layer) {
  layer = layer || L.geoJson();
  let geojson = wktParser(wkt);
  addData(layer, geojson);
  return layer;
}
