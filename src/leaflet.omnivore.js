import "./polyfills";
import * as L from "leaflet";
import * as shp from "shpjs";
import { readFileDataAsArrayBuffer, readFileDataAsText } from "./leaflet.omnivore.utils";
import {
  csvParse,
  gpxParse,
  kmlParse,
  polylineParse,
  topojsonParse,
  wktParse,
} from "./leaflet.omnivore.parsers";

/**
 * Load a [GeoJSON](http://geojson.org/) document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {Promise<Object>}
 */
export async function geojsonLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(url);

  try {
    layer.addData(JSON.parse(data));
    return layer;
  } catch (err) {
    throw Error("GeoJSON not valid");
  }
}

/**
 * Load a [TopoJSON](https://github.com/mbostock/topojson) document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {Promise<Object>}
 */
export async function topojsonLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(url);

  const parsedData = topojsonParse(data, options);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("topoJSON not valid");
  }
}

/**
 * Load a CSV document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {Promise<Object>}
 */
export async function csvLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(url);

  const parsedData = csvParse(data, options);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("Spatial data in CSV not valid");
  }
}

/**
 * Load a GPX document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {Promise<Object>}
 */
export async function gpxLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(url);

  const parsedData = gpxParse(data, options);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("GPX not valid");
  }
}

/**
 * Load a [KML](https://developers.google.com/kml/documentation/) document into a layer and return the layer.
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {Promise<Object>}
 */
export async function kmlLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(url);

  const parsedData = kmlParse(data, options);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("KML not valid");
  }
}

/**
 * Load a WKT (Well Known Text) string into a layer and return the layer
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {Promise<Object>}
 */
export async function wktLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(url);

  const parsedData = wktParse(data, options);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("WKT not valid");
  }
}

/**
 * Load a polyline string into a layer and return the layer
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {Object}
 */
export async function polylineLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsText(url);

  const parsedData = polylineParse(data, options);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("Polyline not valid");
  }
}

/**
 * Reads the zipped shapefile and return the layer
 *
 * @param {string} url
 * @param {object} options
 * @param {object} customLayer
 * @returns {Object}
 */
export async function shapefileLoad(url, options, customLayer) {
  let layer = customLayer || L.geoJson(null, { ...options.layerOptions });

  const data = await readFileDataAsArrayBuffer(url);

  const parsedData = await shp(data);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("Shapefile not Valid");
  }
}
