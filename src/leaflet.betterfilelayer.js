import * as L from "leaflet";

L.Control.BetterFileLayer = L.Control.extend({
   options: {

   },

    initialize(options){

    },

    onAdd(){

    },

    onRemove(){

    }
});

L.Map.mergeOptions({
    betterFileLayerControl: false,
})

L.Map.addInitHook(function () {
    if (this.options.betterFileLayerControl) {
        L.Control.betterFileLayer().addTo(this);
    }
})

L.Control.betterFileLayer = (options) => new L.Control.BetterFileLayer(options);
