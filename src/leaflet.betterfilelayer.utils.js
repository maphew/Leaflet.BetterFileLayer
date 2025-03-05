import JSZip from "jszip";

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

/**
 * Transform the simple style spec from feature props to Leaflet Path styles options
 *
 * @param {Object} feature
 * @returns {Object} Leaflet path styling options
 */
export function simpleStyleToLeafletStyle(feature) {
  // https://github.com/mapbox/simplestyle-spec
  const simpleStyleSpec = {
    stroke: "color", // the color of a line as part of a polygon, polyline, or multigeometry
    "stroke-opacity": "opacity", // the opacity of the line component of a polygon, polyline, or multigeometry
    "stroke-width": "weight", // the width of the line component of a polygon, polyline, or multigeometry
    fill: "fillColor",
    "fill-opacity": "fillOpacity",
  };

  let leafletPathStyle = {};

  for (const prop in feature.properties) {
    const style = simpleStyleSpec[prop] || null;

    if (style) {
      leafletPathStyle[style] = feature.properties[prop];
    }
  }

  return leafletPathStyle;
}

/**
 * Filters a property based on a blacklist of property names considered not required info to
 * be displayed
 *
 * @param {String} prop Property name
 * @returns {Boolean} Returns true if property is in blacklist and need to be sanitized
 */
export function filterProperty(prop) {
  const blackList = [
    "marker-size",
    "marker-symbol",
    "marker-color",
    "stroke",
    "stroke-opacity",
    "stroke-width",
    "fill",
    "fill-opacity",
    "styleHash",
    "styleUrl",
    "styleMapHash",
    "stroke-dasharray",
  ];

  return blackList.includes(prop);
}

/**
 * Calculate the area of a GeoJSON polygon in square kilometers
 * Uses the Shoelace formula (Gauss's area formula) for calculating the area of a polygon
 * 
 * @param {Object} geometry GeoJSON geometry object
 * @returns {Number} Area in square kilometers
 */
export function calculateAreaInSquareKm(geometry) {
  // Only calculate area for polygons
  if (!geometry || (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon')) {
    return 0;
  }

  let totalArea = 0;
  
  // Function to calculate area of a single polygon ring
  const calculateRingArea = (ring) => {
    if (ring.length < 3) {
      return 0;
    }
    
    let area = 0;
    // Earth radius in kilometers
    const R = 6371;
    
    for (let i = 0; i < ring.length - 1; i++) {
      const p1 = ring[i];
      const p2 = ring[i + 1];
      
      // Convert to radians
      const p1Lat = p1[1] * Math.PI / 180;
      const p1Lng = p1[0] * Math.PI / 180;
      const p2Lat = p2[1] * Math.PI / 180;
      const p2Lng = p2[0] * Math.PI / 180;
      
      // Calculate area using haversine formula
      area += (p2Lng - p1Lng) * (2 + Math.sin(p1Lat) + Math.sin(p2Lat));
    }
    
    // Calculate the final area
    area = Math.abs(area * R * R / 2);
    return area;
  };
  
  if (geometry.type === 'Polygon') {
    // Calculate area of outer ring
    const outerRing = geometry.coordinates[0];
    totalArea = calculateRingArea(outerRing);
    
    // Subtract areas of holes (inner rings)
    for (let i = 1; i < geometry.coordinates.length; i++) {
      totalArea -= calculateRingArea(geometry.coordinates[i]);
    }
  } else if (geometry.type === 'MultiPolygon') {
    // Calculate area for each polygon in the multi-polygon
    for (const polygon of geometry.coordinates) {
      // Add area of outer ring
      const outerRing = polygon[0];
      let polygonArea = calculateRingArea(outerRing);
      
      // Subtract areas of holes (inner rings)
      for (let i = 1; i < polygon.length; i++) {
        polygonArea -= calculateRingArea(polygon[i]);
      }
      
      totalArea += polygonArea;
    }
  }
  
  return totalArea;
}
