import * as L from "leaflet";
import "./leaflet.betterfilelayer.css";
import {
  csvLoad, geojsonLoad, gpxLoad, kmlLoad, topojsonLoad, wktLoad,
} from "./leaflet.omnivore";

L.Control.BetterFileLayer = L.Control.extend({
  options: {
    position: 'topleft',
    importOptions: {
      "text/csv": {
        delimiter: ';',
        latfield: 'LAT',
        lonfield: 'LONG',
      },
    },
    text: {
      title: "Import a layer",
    },
  },

  initialize(options) {
    L.setOptions(this, options);
  },

  onAdd() {
    const container = L.DomUtil.create("div", "leaflet-control");
    const inputContainer = L.DomUtil.create("div", "leaflet-control-better-filelayer", container);
    const input = L.DomUtil.create("input", "", inputContainer);

    input.title = this.options.text.title;
    input.type = "file";
    input.multiple = true;

    if (this.options.formats) {
      input.accept = this.options.formats.join(',');
    } else {
      input.accept = '.gpx,.kml,.geojson,.json,.txt,.csv,.topojson,.wkt';
    }

    L.DomEvent.addListener(input, "change", this._load, this);

    const mapContainer = this._map.getContainer();

    L.DomEvent.addListener(mapContainer, "dragover", L.DomEvent.stopPropagation)
      .addListener(mapContainer, "dragover", L.DomEvent.preventDefault)
      .addListener(mapContainer, "drop", L.DomEvent.stopPropagation)
      .addListener(mapContainer, "drop", L.DomEvent.preventDefault)
      .addListener(mapContainer, "drop", this._load, this);

    return container;
  },

  _load(e) {
    const fileLoaders = {
      geojson: geojsonLoad,
      json: geojsonLoad,
      kml: kmlLoad,
      csv: csvLoad,
      wkt: wktLoad,
      gpx: gpxLoad,
      topojson: topojsonLoad,
    };

    let files;
    switch (e.type) {
      case "drop":
        files = e.dataTransfer.files;
        break;
      case "change":
        files = e.target.files;
        break;
      default:
        files = undefined;
        break;
    }

    for (const file of files) {
      const fileExtension = file.name.toLowerCase().split('.').at(-1);

      const loader = fileLoaders[fileExtension] || undefined;

      const loaderOption = this.options.importOptions[file.type] || {};

      if (!loader) {
        return;
      }

      loader(URL.createObjectURL(file), loaderOption)
        .then((layer) => {
          const addedLayer = this._map.addLayer(layer);

          this._map.fitBounds(layer.getBounds());

          this._map.fire("bfl:layerloaded", { layer: addedLayer }, this);
        }).catch((error) => {
          this._map.fire("bfl:error", error);
        });
    }
  },

  onRemove() {
  },
});

L.Map.mergeOptions({
  betterFileLayerControl: false,
});

L.Map.addInitHook(function () {
  if (this.options.betterFileLayerControl) {
    L.Control.betterFileLayer()
      .addTo(this);
  }
});

L.Control.betterFileLayer = (options) => new L.Control.BetterFileLayer(options);
