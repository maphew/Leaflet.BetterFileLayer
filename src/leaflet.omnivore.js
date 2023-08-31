import * as L from "leaflet";
import * as xhr from "@mapbox/corslite";
import { addData } from "./leaflet.omnivore.utils";
import {
  topojsonParse, csvParse, wktParse, kmlParse, polylineParse, gpxParse,
} from "./leaflet.omnivore.parsers";

/**
 * Load a [GeoJSON](http://geojson.org/) document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {object}
 */
export function geojsonLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson();
  xhr(url, (err, response) => {
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
export function topojsonLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson();
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
export function csvLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson();
  xhr(url, onload);

  function onload(err, response) {
    let error;
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
export function gpxLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson();
  xhr(url, onload);

  function onload(err, response) {
    let error;
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
export function kmlLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson();
  xhr(url, onload);

  function onload(err, response) {
    let error;
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
export function wktLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson();
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
export function polylineLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson();
  xhr(url, onload);

  function onload(err, response) {
    if (err) return layer.fire('error', { error: err });
    polylineParse(response.responseText, options, layer);
    layer.fire('ready');
  }

  return layer;
}
