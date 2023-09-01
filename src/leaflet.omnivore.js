import * as L from "leaflet";
import { readFileData } from "./leaflet.omnivore.utils";
import {
  topojsonParse, csvParse, wktParse, kmlParse, polylineParse, gpxParse,
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
  let layer = customLayer || L.geoJson();

  const data = await readFileData(url);

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
  let layer = customLayer || L.geoJson();

  const data = await readFileData(url);

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
  let layer = customLayer || L.geoJson();

  const data = await readFileData(url);

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
  let layer = customLayer || L.geoJson();

  const data = await readFileData(url);

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
  let layer = customLayer || L.geoJson();

  const data = await readFileData(url);

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
  let layer = customLayer || L.geoJson();

  const data = await readFileData(url);

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
  let layer = customLayer || L.geoJson();

  const data = await readFileData(url);

  const parsedData = polylineParse(data, options);

  try {
    layer.addData(parsedData);
    return layer;
  } catch (err) {
    throw Error("Polyline not valid");
  }
}
