//set map 
var map = L.map('map').setView([40.71,-73.93], 11);

// set a tile layer to be CartoDB tiles 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
    
     
// add these tiles to our map
map.addLayer(CartoDBTiles);



//layer control variables
//var csoOutfallGeoJSON;
var csoDrainageGeoJSON;


//add CSO drainage area data
/*
$.getJSON( "geoJSON/cso_drainage_area.geojson" , function( data ) {

    var csoDrainage = data;

    var drainageStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };

csoDrainageGeoJSON = L.geoJson(csoDrainage, {
    style: drainageStyle
}).addTo(map);

});
*/
//add CSO outfalls
$.getJSON( "geoJSON/sewer_infrastructure.geojson" , function(data) {

    var csoOutfall = data;
/*

//filter to get just CSOs
    var csos = L.geoJson(csoOutfall, {
        filter: function(feature, layer) {
            return feature.properties.FEATURE == "OUTFALL";
        }
    });
*/

   //stlye CSOs
   var outfallMarker = {
    radius: 5,
    fillColor: "#de2d26",
    color: "#fee0d2",
    weight: 0.5,
    opacity: 1,
    fillOpacity: 1
};



csoOutfallGeoJSON = L.geoJson(csoOutfall, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, outfallMarker);
}
}).addTo(map);

});


/*
// adding data from the API - sewer related complaints
// set a global variable to use in the D3 scale below
// uses jQuery geoJSON to grab data from API
$.getJSON( "https://data.cityofnewyork.us/resource/erm2-nwe9.json?$$app_token=rQIMJbYqnCnhVM9XNPHE9tj0g&complaint_type=Sewer&status=Open", function( data ) {
    var dataset = data;
    // draw the dataset on the map
    plotAPIData(dataset);

});

// create a leaflet layer group to add your API dots to so we can add these to the map
var apiLayerGroup = L.layerGroup();


function plotAPIData(dataset) {
    // set up D3 ordinal scle for coloring the dots just once
    var ordinalScale = setUpD3Scale(dataset);


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

//geocoder (address locator)
//L.Control.geocoder().addTo(map);
*/