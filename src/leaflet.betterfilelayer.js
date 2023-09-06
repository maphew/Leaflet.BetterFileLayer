import * as L from "leaflet";
import "./leaflet.betterfilelayer.css";
import {
  csvLoad,
  geojsonLoad,
  gpxLoad,
  kmlLoad,
  polylineLoad,
  shapefileLoad,
  topojsonLoad,
  wktLoad,
} from "./leaflet.omnivore";
import {
  extractShpComponents,
  filterShpComponents,
  getFileBaseName,
  getFileExtension,
} from "./leaflet.betterfilelayer.utils";
import { zipShpComponents } from "./leaflet.omnivore.utils";

L.Control.BetterFileLayer = L.Control.extend({
  options: {
    position: 'topleft',
    importOptions: {
      csv: {
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
    if (this.options.button) {
      L.DomEvent.addListener(this.options.button, "change", this._load, this);
      this._enableDragAndDrop();
      return L.DomUtil.create("div");
    }

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

    this._enableDragAndDrop();

    return container;
  },

  _enableDragAndDrop() {
    const mapContainer = this._map.getContainer();

    L.DomEvent.addListener(mapContainer, "dragover", L.DomEvent.stopPropagation)
      .addListener(mapContainer, "dragover", L.DomEvent.preventDefault)
      .addListener(mapContainer, "drop", L.DomEvent.stopPropagation)
      .addListener(mapContainer, "drop", L.DomEvent.preventDefault)
      .addListener(mapContainer, "drop", this._load, this);
  },

  _disableDragAndDrop() {
    const mapContainer = this._map.getContainer();

    L.DomEvent.removeListener(mapContainer, "dragover", L.DomEvent.stopPropagation)
      .removeListener(mapContainer, "dragover", L.DomEvent.preventDefault)
      .removeListener(mapContainer, "drop", L.DomEvent.stopPropagation)
      .removeListener(mapContainer, "drop", L.DomEvent.preventDefault)
      .removeListener(mapContainer, "drop", this._load, this);
  },

  async _load(e) {
    const fileLoaders = {
      geojson: geojsonLoad,
      json: geojsonLoad,
      kml: kmlLoad,
      csv: csvLoad,
      wkt: wktLoad,
      gpx: gpxLoad,
      topojson: topojsonLoad,
      polyline: polylineLoad,
      zip: shapefileLoad,
    };

    let files;
    switch (e.type) {
      case "drop":
        files = Array.of(...e.dataTransfer.files);
        break;
      case "change":
        files = Array.of(...e.target.files);
        break;
      default:
        files = [];
        break;
    }

    if (!files.length) {
      return;
    }

    const shpComponents = extractShpComponents(files);

    if (Object.keys(shpComponents).length) {
      const processedShps = await zipShpComponents(shpComponents);

      const notShpFiles = filterShpComponents(files);

      files = [...notShpFiles, ...processedShps];
    }

    for (const file of files) {
      const loader = fileLoaders[getFileExtension(file.name)] || null;

      if (loader) {
        const loaderOption = this.options.importOptions[file.type] || {};

        loaderOption.layerOptions = {
          name: getFileBaseName(file.name),
          id: L.Util.stamp({}),
          zIndex: 999,
          onEachFeature: (feature, layer) => {
            if (feature.properties) {
              layer.bindPopup(
                Object.keys(feature.properties)
                  .map((k) => `${k} : ${feature.properties[k]}`)
                  .join("<br />"),
                {
                  maxHeight: 200,
                },
              );
            }
          },
        };

        const layer = await loader(URL.createObjectURL(file), loaderOption);

        const addedLayer = layer.addTo(this._map);

        this._map.fitBounds(layer.getBounds());

        this._map.fire("bfl:layerloaded", { layer: addedLayer }, this);
      }
    }
  },

  onRemove() {
    this._disableDragAndDrop();
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
