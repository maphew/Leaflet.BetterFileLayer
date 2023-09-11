# Leaflet.BetterFileLayer

### Load your spatialized files into Leaflet the way it should be.

---

This is a [Leaflet](http://leafletjs.com/) plugin for loading your spatialized data in leaflet based on [leaflet-omnivore](https://github.com/mapbox/leaflet-omnivore) and [Leaflet.FileLayer](https://github.com/makinacorpus/Leaflet.FileLayer) plugins.
This plugin was made looking for a convenient and easy to use plugin for loading external spatial files to leaflet. 

It currently supports:

* [GeoJSON](http://geojson.org/)
* [JSON](http://geojson.org/) (Using the GeoJSON structure)
* [CSV](http://en.wikipedia.org/wiki/Comma-separated_values) (via [csv2geojson](https://github.com/mapbox/csv2geojson))
* [GPX](https://wiki.openstreetmap.org/wiki/GPX)
* [KML](http://developers.google.com/kml/documentation/)
* [WKT](http://en.wikipedia.org/wiki/Well-known_text) (via [wellknown](https://github.com/mapbox/wellknown))
* [TopoJSON](https://github.com/mbostock/topojson) (via [topojson-client](https://github.com/topojson/topojson-client))
* [Encoded Polylines](https://developers.google.com/maps/documentation/utilities/polylinealgorithm) (via [polyline](https://github.com/mapbox/polyline))
* [Shapefile](https://en.wikipedia.org/wiki/Shapefile) (via [shpjs](https://github.com/calvinmetcalf/shapefile-js/tree/gh-pages)) (zipped or separate files)

## Installation

```commandline
npm install leaflet-better-filelayer
```

## Demo

Checkout the [Demo](https://gabriel-russo.github.io/Leaflet.BetterFileLayer/example/)

Below gif show an example of loading a separated shapefile using drag and drop.

Note: The plugin only looks for `.shp`, `.dbf`, `.shx`, `.prj` with the same name.

![example](docs/images/example.gif)

## Usage

As map option:

```js
const map = L.map('map', { betterFileLayerControl: true })
```

Or like any control

```js
L.Control.betterFileLayer().addTo(map);
```

## Docs

### Options:
```js
// The Options object
options = {
  position: 'topleft', // Leaflet control position
  fileSizeLimit: 1024, // File size limit in kb (default: 1024 kb)
  style: () => {}, // Overwrite the default BFL GeoJSON style function
  onEachFeature: () => {}, // Overwrite the default BFL GeoJSON onEachFeature function
  layer: L.customLayer, // If you want a custom layer to be used (must be a GeoJSON class inheritance)
  // Restrict accepted file formats (default: .gpx, .kml, .geojson, .json, .csv, .topojson, .wkt, .shp, .shx, .prj, .dbf, .zip)
  formats:['.geojson', '.kml', '.gpx'],
  importOptions: { // Some file types may have import options, for now, just csv is documented
    csv: {
      delimiter: ';',
      latfield: 'LAT',
      lonfield: 'LONG',
    },
  },
  text: { // If you need translate
    title: "Import a layer", // Plugin Button Text
  },
}
```

### Events

| Event Name                   | Data               | Description                                                                                              |
|------------------------------|--------------------|----------------------------------------------------------------------------------------------------------|
| `bfl:layerloaded`            | { layer: L.Layer } | Event fired when the data is sucessfuly loaded on map. It returns the layer reference                    |
| `bfl:layerloaderror`         | { layer: string }  | Event fired when the loader fails to load your file. It returns the name of the file                     |
| `bfl:filenotsupported`       | { layer: string }  | Event fired when the loader does not support the file type of your file. It returns the name of the file |
| `bfl:layerisempty`         | { layer: string }  | Event fired when the layer haven't any features. It returns the name of the file                         |


### Custom html button

If you are developing a web application and you want to use your own html button outside the map container, you can use the following code:

```js
// Note: The button have to be type "file"
// Example: <input type="file" accept=".gpx,.kml,.geojson,.json" multiple />
const options = {
  button: document.getElementById('my-button'), // Your html button HTML reference
}

const control = L.Control.betterFileLayer(options)
  .addTo(map);
```
After that, the plugin will bind an "on change" event on this button, waiting for files.

You can see the example [here](https://gabriel-russo.github.io/Leaflet.BetterFileLayer/example/with-button.html)

`Note:` The Drag and Drop event listener will bind it self automatically

## Development

Install the development dependencies
```commandline
npm install --save-dev
```

Start the webpack watch to compile and save at dist/ after any change
```commandline
npm run dev
```

Open `index.html` in your browser and start editing

### Test

To run unity tests:
```commandline
npm run test
```

## Authors
- Gabriel Russo

## Credits

- Copyright (c) 2014, Mapbox
- Copyright (c) 2012, Michael Bostock
- Copyright (c) 2012 Makina Corpus

See [License](https://github.com/gabriel-russo/Leaflet.BetterFileLayer/blob/master/LICENSE) for more details
