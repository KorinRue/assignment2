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

// adding CSO layer
$.getJSON( "geojson/sewer_infrastructure.geojson", function( data ) {

    // ensure jQuery has pulled all data out of the geojson file
    var sewerInfrastructure = data;

     var CSOPointToLayer = function (feature, latlng){
        if(feature.properties.feature == 'OUTFALL') {
            var fillColor = '#ff0000'
            var fillOpacity = 1;
        } else {
            var fillColor = '#ffffff'
            var fillOpacity = 0;
        }

        var CSOpoint = L.circle(latlng, 100, {
                stroke: false,
                fillColor: fillColor,
                fillOpacity: fillOpacity
            });

        return CSOpoint;  
    }

    // function that binds popup data to CSO layer
    var CSOClick = function (feature, layer) {
        // let's bind some feature properties to a pop up
        layer.bindPopup(feature.properties.feature);
    }

    // using L.geojson add subway lines to map
    sewerInfrastructureGeoJSON = L.geoJson(sewerInfrastructure, {
        pointToLayer: CSOPointToLayer,
        onEachFeature: CSOClick
    });


});

// adding neighborhood layer
$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var neighborhoods = data;
/*
//this didn't work
var populationStyle = function (feature){
    var value = feature.properties.pop; //eventually want to make this population density
    var fillColor = null;
    if(value >= 0 && value <=5000){
        fillColor = "#fee5d9";
    }
    if(value >5000 && value <=10000){
        fillColor = "#fcbba1";
    }
    if(value >10000 && value<=50000){
        fillColor = "#fc9272";
    }
    if(value > 50000 && value <=1000000){
        fillColor = "#fb6a4a";
    }
    if(value > 100000 && value <=150000) { 
        fillColor = "#de2d26";
    }
    if(value > 150000) { 
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

*/

function getColor(d) { //used a leaflet example for this, but its not returning the style I want!
    return  d > 150000 ? '#0868ac' :
            d > 100000 ? '#43a2ca' :
            d > 50000 ? '#7bccc4' :
            d > 10000 ? '#a8ddb5' :
            d > 5000 ? '#ccebc5' :
                        '#f0f9e8';
}
function style(feature) {
    return{
        fillColor: getColor(feature.properties.pop),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}
L.geoJson(neighborhoods, {style: style}).addTo(map);

/*
    // plain neighborhood map
    var featureStyle = {
        "color": '#000080',
        "weight": 2,
        "opacity": 1
    };
*/
    var neighborhoodClick = function (feature, layer) {

        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG);
    }

    neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
        onEachFeature: neighborhoodClick
    }).addTo(map);

    // add sewer layer
    sewerInfrastructureGeoJSON.addTo(map);

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




