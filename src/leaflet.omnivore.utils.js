import JSZip from "jszip";

/**
 * Download a blob object by its url and read it as a text
 *
 * @param {string} blobUrl
 * @returns {Promise}
 */
export function readFileDataAsText(blobUrl) {
  return fetch(blobUrl)
    .then((response) => response.blob())
    .then((blob) => blob.text())
    .catch((err) => null);
}

/**
 * Download a blob object by its url and read it as an array buffer
 *
 * @param {string} blobUrl
 * @returns {Promise}
 */
export function readFileDataAsArrayBuffer(blobUrl) {
  return fetch(blobUrl)
    .then((response) => response.blob())
    .then((blob) => blob.arrayBuffer())
    .catch((err) => null);
}

/**
 * Parse a XML string like to XML
 *
 * @param {string} str
 * @returns {XMLDocument}
 */
export function parseXML(str) {
  if (typeof str === 'string') {
    return (new DOMParser()).parseFromString(str, 'text/xml');
  }
  return str;
}

/**
 * Gets the object returned from extractShpComponents function and create a list of
 * in-memory zipped shapefiles from every key.
 * In summary: Gets the shapefile components (.shp, .dbf, .prj ...) grouped by name and zip compress
 * @param {Object} shapes
 * @returns {Array}
 */
export async function zipShpComponents(shapes) {
  const zips = [];

  for (const shapeName in shapes) {
    const zip = new JSZip();

    for (const component of shapes[shapeName]) {
      zip.file(component.name, component.arrayBuffer());
    }

    const blob = await zip.generateAsync({ type: "blob" });

    const shpZip = new File([blob], `${shapeName}.zip`, { type: "application/zip" });

    zips.push(shpZip);
  }

  return zips;
}
