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


        // we'll now add an ID to each layer so we can fire the popup outside of the map
    layer._leaflet_id = 'csoLayerID' + count;
    count++;

// function to create a list in the right hand column with links that will launch the pop-ups on the map
function createListForClick(dataset) {
    // use d3 to select the div and then iterate over the dataset appending a list element with a link for clicking and firing
    // first we'll create an unordered list ul elelemnt inside the <div id='list'></div>. The result will be <div id='list'><ul></ul></div>
    var ULs = d3.select("#list")
                .append("ul");


    // create list elements (li) with the dataset we have 
    
    ULs.selectAll("li")
         .data(dataset.features)
         .enter()
         .append("li")
         .html(function(d) { 
             return '<a href="#">' + d.properties.sewer_infrastructure_annual_dis + '</a>'; 
         })
         .on('click', function(d, i) {
             var leafletId = 'csoLayerID' + i;
             map._layers[leafletId].fire('click');
         });


    };

        // using L.geojson add CSOs to map
    sewerInfrastructureGeoJSON = L.geoJson(sewerInfrastructure, {
        pointToLayer: CSOPointToLayer,
        onEachFeature: CSOClick

    });
}


// adding neighborhood layer
$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var neighborhoods = data;

//showing population density
var PopStyle = function (feature){
    var value = feature.properties.Pop/feature.properties.sq_mile;
    var fillColor = null;
    if(value >= 0 && value <=5000){
        fillColor = "#f0f9e8";
    }
    if(value >5000 && value <=10000){
        fillColor = "#ccebc5";
    }
    if(value >10000 && value<=50000){
        fillColor = "#a8ddb5";
    }
    if(value > 50000 && value <=1000000){
        fillColor = "#7bccc4";
    }
    if(value > 100000 && value <=150000) { 
        fillColor = "#43a2ca";
    }
    if(value > 150000) { 
        fillColor = "#0868ac";
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



    var neighborhoodClick = function (feature, layer) {

        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG);
    }

    neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
        style: PopStyle,
        onEachFeature: neighborhoodClick
    }).addTo(map);


    // add sewer layer
    sewerInfrastructureGeoJSON.addTo(map);

    // create layer controls
    createLayerControls(); 

});

// adding data from the API
// set a global variable to use in the D3 scale below
// uses jQuery geoJSON to grab data from API
$.getJSON( "https://data.cityofnewyork.us/resource/erm2-nwe9.json?$$app_token=rQIMJbYqnCnhVM9XNPHE9tj0g&complaint_type=Sewer&status=Open", function( data ) {
    var dataset = data;
    // draw the dataset on the map
    plotAPIData(dataset);

});

// create a leaflet layer group to add your API dots to so we can add these to the map
var apiLayerGroup = L.layerGroup();

// since these data are not geoJson, we have to build our dots from the data by hand
function plotAPIData(dataset) {
    // set up D3 ordinal scle for coloring the dots just once
    var ordinalScale = setUpD3Scale(dataset);
    //console.log(ordinalScale("Noise, Barking Dog (NR5)"));


    // loop through each object in the dataset and create a circle marker for each one using a jQuery for each loop
    $.each(dataset, function( index, value ) {

        // check to see if lat or lon is undefined or null
        if ((typeof value.latitude !== "undefined" || typeof value.longitude !== "undefined") || (value.latitude && value.longitude)) {
            // create a leaflet lat lon object to use in L.circleMarker
            var latlng = L.latLng(value.latitude, value.longitude);
     
            var apiMarker = L.circleMarker(latlng, {
                stroke: false,
                fillColor: ordinalScale(value.descriptor),
                fillOpacity: 1,
                radius: 2
            });

            // bind a simple popup so we know what the noise complaint is
            apiMarker.bindPopup(value.descriptor);

            // add dots to the layer group
            apiLayerGroup.addLayer(apiMarker);

        }

    });

    apiLayerGroup.addTo(map);

}

function setUpD3Scale(dataset) {
    //console.log(dataset);
    // create unique list of descriptors
    // first we need to create an array of descriptors
    var descriptors = [];

    // loop through descriptors and add to descriptor array
    $.each(dataset, function( index, value ) {
        descriptors.push(value.descriptor);
    });

    // use underscore to create a unique array
    var descriptorsUnique = _.uniq(descriptors);

    // create a D3 ordinal scale based on that unique array as a domain
    var ordinalScale = d3.scale.category20()
        .domain(descriptorsUnique);

    return ordinalScale;

}


function createLayerControls(){

    // add in layer controls
    var baseMaps = {
        "CartoDB": CartoDBTiles,
    };

    var overlayMaps = {
        "CSO outfalls": sewerInfrastructureGeoJSON,
        "Population": neighborhoodsGeoJSON
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);

}




