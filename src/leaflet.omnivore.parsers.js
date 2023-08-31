import {addData, parseXML} from "./leaflet.omnivore.utils";
import {csv2geojson} from "csv2geojson";
import {parse as wktParser} from "wellknown"
import {decode as polylineParser} from "polyline"
import {feature as topojsonParser} from "topojson";
import {kml as kmlParser, gpx as gpxParser } from "togeojson";


export function topojsonParse(data, options, layer) {
    var o = typeof data === 'string' ?
        JSON.parse(data) : data;
    layer = layer || L.geoJson();
    for (var i in o.objects) {
        var ft = topojsonParser(o, o.objects[i]);
        if (ft.features) addData(layer, ft.features);
        else addData(layer, ft);
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
    var xml = parseXML(gpx);
    if (!xml) return layer.fire('error', {
        error: 'Could not parse GPX'
    });
    layer = layer || L.geoJson();
    var geojson = gpxParser(xml);
    addData(layer, geojson);
    return layer;
}


export function kmlParse(gpx, options, layer) {
    var xml = parseXML(gpx);
    if (!xml) return layer.fire('error', {
        error: 'Could not parse KML'
    });
    layer = layer || L.geoJson();
    var geojson = kmlParser(xml);
    addData(layer, geojson);
    return layer;
}

export function polylineParse(txt, options, layer) {
    layer = layer || L.geoJson();
    options = options || {};
    var coords = polylineParser(txt, options.precision);
    var geojson = { type: 'LineString', coordinates: [] };
    for (var i = 0; i < coords.length; i++) {
        // polyline returns coords in lat, lng order, so flip for geojson
        geojson.coordinates[i] = [coords[i][1], coords[i][0]];
    }
    addData(layer, geojson);
    return layer;
}

export function wktParse(wkt, options, layer) {
    layer = layer || L.geoJson();
    var geojson = wktParser(wkt);
    addData(layer, geojson);
    return layer;
}
