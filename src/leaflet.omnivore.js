import * as L from "leaflet";
import * as xhr from "corslite";
import {addData} from "./leaflet.omnivore.utils";
import {topojsonParse, csvParse, wktParse, kmlParse, polylineParse, gpxParse} from "./leaflet.omnivore.parsers";

/**
 * Load a [GeoJSON](http://geojson.org/) document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */
function geojsonLoad(url, options, customLayer) {
    var layer = customLayer || L.geoJson();
    xhr(url, function(err, response) {
        if (err) return layer.fire('error', { error: err });
        addData(layer, JSON.parse(response.responseText));
        layer.fire('ready');
    });
    return layer;
}

/**
 * Load a [TopoJSON](https://github.com/mbostock/topojson) document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */
function topojsonLoad(url, options, customLayer) {
    var layer = customLayer || L.geoJson();
    xhr(url, onload);
    function onload(err, response) {
        if (err) return layer.fire('error', { error: err });
        topojsonParse(response.responseText, options, layer);
        layer.fire('ready');
    }
    return layer;
}

/**
 * Load a CSV document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */
function csvLoad(url, options, customLayer) {
    var layer = customLayer || L.geoJson();
    xhr(url, onload);
    function onload(err, response) {
        var error;
        if (err) return layer.fire('error', { error: err });
        function avoidReady() {
            error = true;
        }
        layer.on('error', avoidReady);
        csvParse(response.responseText, options, layer);
        layer.off('error', avoidReady);
        if (!error) layer.fire('ready');
    }
    return layer;
}

/**
 * Load a GPX document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */
function gpxLoad(url, options, customLayer) {
    var layer = customLayer || L.geoJson();
    xhr(url, onload);
    function onload(err, response) {
        var error;
        if (err) return layer.fire('error', { error: err });
        function avoidReady() {
            error = true;
        }
        layer.on('error', avoidReady);
        gpxParse(response.responseXML || response.responseText, options, layer);
        layer.off('error', avoidReady);
        if (!error) layer.fire('ready');
    }
    return layer;
}

/**
 * Load a [KML](https://developers.google.com/kml/documentation/) document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */
function kmlLoad(url, options, customLayer) {
    var layer = customLayer || L.geoJson();
    xhr(url, onload);
    function onload(err, response) {
        var error;
        if (err) return layer.fire('error', { error: err });
        function avoidReady() {
            error = true;
        }
        layer.on('error', avoidReady);
        kmlParse(response.responseXML || response.responseText, options, layer);
        layer.off('error', avoidReady);
        if (!error) layer.fire('ready');
    }
    return layer;
}

/**
 * Load a WKT (Well Known Text) string into a layer and return the layer
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */
function wktLoad(url, options, customLayer) {
    var layer = customLayer || L.geoJson();
    xhr(url, onload);
    function onload(err, response) {
        if (err) return layer.fire('error', { error: err });
        wktParse(response.responseText, options, layer);
        layer.fire('ready');
    }
    return layer;
}

/**
 * Load a polyline string into a layer and return the layer
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */
function polylineLoad(url, options, customLayer) {
    var layer = customLayer || L.geoJson();
    xhr(url, onload);
    function onload(err, response) {
        if (err) return layer.fire('error', { error: err });
        polylineParse(response.responseText, options, layer);
        layer.fire('ready');
    }
    return layer;
}
