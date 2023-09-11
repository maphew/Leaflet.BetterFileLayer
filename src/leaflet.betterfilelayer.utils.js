/**
 * Returns the file's extension without dot
 *
 * @param {string} fileName
 * @returns {string}
 */
export function getFileExtension(fileName) {
  return fileName.toLowerCase().split('.').at(-1);
}

/**
 * Returns the filename without extension
 *
 * @param {string} fileName
 * @returns {string}
 */
export function getFileBaseName(fileName) {
  return fileName.toLowerCase().split('.').at(0);
}

/**
 * Converts the value in bytes to kilobytes
 *
 * @param {int} size
 * @returns {string}
 */
export function bytesToKilobytes(size) {
  return (size / 1024).toFixed(4);
}

/**
 * Group the shapefile components (shp, dbf, prj...) by filename and returns an object where the
 * keys are the filename and the value is a list with the shapefile components associated
 *
 * @param {FileList} files
 * @returns {Object}
 */
export function extractShpComponents(files) {
  let shpComponents = {};
  const shpComponentsExtensions = ["shp", "shx", "dbf", "prj"];

  for (const file of files) {
    if (shpComponentsExtensions.includes(getFileExtension(file.name))) {
      if (!Object.hasOwnProperty.call(shpComponents, getFileBaseName(file.name))) {
        shpComponents[getFileBaseName(file.name)] = [];
      }
      shpComponents[getFileBaseName(file.name)].push(file);
    }
  }

  return shpComponents;
}

/**
 * Filters all files that are part of a shapefile's components (shp, dbf, prj...)
 *
 * @param {FileList} files
 * @returns {Array}
 */
export function filterShpComponents(files) {
  const filteredFiles = [];
  const shpComponentsExtensions = ["shp", "shx", "dbf", "prj"];

  for (let i = 0; i <= files.length - 1; i++) {
    if (!shpComponentsExtensions.includes(getFileExtension(files[i].name))) {
      filteredFiles.push(files[i]);
    }
  }

  return filteredFiles;
}

export function getStyle(feat) {
  // https://github.com/mapbox/simplestyle-spec
  const simpleStyleSpec = {
    stroke: "color", // the color of a line as part of a polygon, polyline, or multigeometry
    "stroke-opacity": "opacity", // the opacity of the line component of a polygon, polyline, or multigeometry
    "stroke-width": "weight", // the width of the line component of a polygon, polyline, or multigeometry
    fill: "fillColor",
    "fill-opacity": "fillOpacity",
  };

  let leafletPathStyle = {};

  for (const prop in feat.properties) {
    const style = simpleStyleSpec[prop] || null;

    if (style) {
      leafletPathStyle[style] = feat.properties[prop];
    }
  }

  return leafletPathStyle;
}
