# Leaflet.BetterFileLayer

---

### Load your spatialized files in Leaflet without too much effort.

![](docs/images/ai.jpg)

This is a [Leaflet](http://leafletjs.com/) plugin for loading your spatialized data in leaflet based on [leaflet-omnivore](https://github.com/mapbox/leaflet-omnivore) and [Leaflet.FileLayer](https://github.com/makinacorpus/Leaflet.FileLayer) plugins.
This plugin was made looking for a definitive, expansible and easy to use plugin for loading external spatial files to leaflet. 

It currently supports:

* [CSV](http://en.wikipedia.org/wiki/Comma-separated_values) (via [csv2geojson](https://github.com/mapbox/csv2geojson))
* [GPX](https://wiki.openstreetmap.org/wiki/GPX)
* [KML](http://developers.google.com/kml/documentation/)
* [WKT](http://en.wikipedia.org/wiki/Well-known_text) (via [wellknown](https://github.com/mapbox/wellknown))
* [TopoJSON](https://github.com/mbostock/topojson) (via [topojson-client](https://github.com/topojson/topojson-client))
* [Encoded Polylines](https://developers.google.com/maps/documentation/utilities/polylinealgorithm) (via [polyline](https://github.com/mapbox/polyline))
* [Shapefile](https://en.wikipedia.org/wiki/Shapefile) (via [shpjs](https://github.com/calvinmetcalf/shapefile-js/tree/gh-pages)) (zipped or in separate files)

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
// Default plugin options object, change wathever you want
options = {
  position: 'topleft',
  importOptions: { // Some file types may have import options, for now, just csv is documented
    csv: {
      delimiter: ';',
      latfield: 'LAT',
      lonfield: 'LONG',
    },
  },
  text: {
    title: "Import a layer", // Plugin Button Text
  },
}
```

### Events

| Event Name                     | Data               | Description                                                                                               |
|--------------------------------|--------------------|-----------------------------------------------------------------------------------------------------------|
| `bfl:layerloaded`              | { layer: L.Layer } | Event fired when the data is sucessfuly loaded on map. It returns the layer reference                     |
| `bfl:layerloaderror`           | { layer: string }  | Event fired when the loader fails to load your file. It returns the name of the file                      |
| `bfl:filenotsupported`         | { layer: string }  | Event fired when the loader does not support the file type of your file. It returns the name of the file  |


### Custom html button

If you are developing a web application and you want to use your own html button outside the map container, you can use the following code:

```js
// Note: The button have to be type "file"
// Example: <input type="file" accept=".gpx,.kml,.geojson,.json" multiple />
const options = {
  button: document.getElementById('my-button'), // Your html button HTML reference
}

const control = L.Control.qgsmeasure(options)
  .addTo(map);
```
After that, the plugin will bind an "on change" event on this button, waiting for files.

You can see the example [here](https://gabriel-russo.github.io/Leaflet.BetterFileLayer/example/with-button.html)

`Note:` The Drag and Drop event listener will bind it self automatically

## Development

Install dependencies
```commandline
npm install --save-dev
```

Compile and save at dist/ after any change
```commandline
npm run dev
```

Open `index.html` in your browser and start editing


## Authors
- Gabriel Russo

## Credits

- Copyright (c) 2014, Mapbox
- Copyright (c) 2012, Michael Bostock

See [License](https://github.com/gabriel-russo/Leaflet.BetterFileLayer/blob/master/LICENSE) for more details
