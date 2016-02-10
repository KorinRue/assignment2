// This script demonstrates some simple things one can do with leaflet.js


var map = L.map('map').setView([40.71,-73.93], 11);

// set a tile layer to be CartoDB tiles 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

// add these tiles to our map
map.addLayer(CartoDBTiles);


// create global variables we can use for layer controls
var neighborhoodsGeoJSON;
var sewerInfrastructureGeoJSON;


// adding neighborhood layer
$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var neighborhoods = data;

    // neighborhood choropleth map
    // let's use % in poverty to color the neighborhood map
    var povertyStyle = function (feature){
        var value = feature.properties.PovertyPer;
        var fillColor = null;
        if(value >= 0 && value <=0.1){
            fillColor = "#fee5d9";
        }
        if(value >0.1 && value <=0.15){
            fillColor = "#fcbba1";
        }
        if(value >0.15 && value<=0.2){
            fillColor = "#fc9272";
        }
        if(value > 0.2 && value <=0.3){
            fillColor = "#fb6a4a";
        }
        if(value > 0.3 && value <=0.4) { 
            fillColor = "#de2d26";
        }
        if(value > 0.4) { 
            fillColor = "#a50f15";
        }

        var style = {
            weight: 1,
            opacity: .1,
            color: 'white',
            fillOpacity: 0.75,
            fillColor: fillColor
        };

        return style;
    }

    var povertyClick = function (feature, layer) {
        var percent = feature.properties.PovertyPer * 100;
        percent = percent.toFixed(0);
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Percent in Poverty: </strong>" + percent + "%");
    }

    neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
        style: povertyStyle,
        onEachFeature: povertyClick
    }).addTo(map);

// adding CSO layer
$.getJSON( "geojson/sewer_infrastructure.geojson", function( data ) {

    // ensure jQuery has pulled all data out of the geojson file
    var sewerInfrastructure = data;


    // style for CSO points
     var CSOPointToLayer = function (feature, latlng){
        var CSOpoint = L.circle(latlng, 100, {
        if(feature equals 'OUTFALL'){
            stroke: false,
            fillColor: '#2ca25f',
            fillOpacity: 1
        });

        return CSOpoint;  
    }

    // function that binds popup data to CSO layer
    var CSOClick = function (feature, layer) {
        // let's bind some feature properties to a pop up
        layer.bindPopup(feature.properties.feature);
    }

    // using L.geojson add subway lines to map
    sewerInfrastructureGeoJSON = L.geoJson(sewerInfrastructure, 100, {
        pointToLayer: CSOPointToLayer,
        onEachFeature: CSOClick
    }).addTo(map);

});


    // create layer controls
    createLayerControls(); 

});


function createLayerControls(){

    // add in layer controls
    var baseMaps = {
        "CartoDB": CartoDBTiles,
    };

    var overlayMaps = {
        "CSO outfalls": sewerInfrastructureGeoJSON,
        "Povery Map": neighborhoodsGeoJSON
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);


};




