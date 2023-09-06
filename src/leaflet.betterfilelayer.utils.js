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
