

/*Caching API key for Google maps */
var API_key = "AIzaSyDHoaPyBOHcUQcck0-LEAw6AsVTMt7Wqho";
/* Caching variable id from form*/
var startingPoint = $('#startPt');
/* Caching Waypoint add button */
var wayPtBtn = $('#wayPt');


/*Global variables:  Arrays to store future Geocode data*/
var waysGeoCodeArr = [];
var startGeoCodeArr = {};
var destGeoCodeArr = {};

function removeWays(i) {
    waysGeoCodeArr.splice(i,1);
    $('#'+ i).remove();
    console.log(waysGeoCodeArr);
}


/* add waypoints button click handler */
wayPtBtn.click(function () {
    var wayInp = $("#wayPtInput").val();
    geoCode(wayInp, 'wayInput');
});

/*Template function for adding way points data in DOM*/
function addWayPointsToHTML() {
    $( ".point" ).remove();
    for(var i=0; i<waysGeoCodeArr.length; i++){
        $('.point-addr').after(`
                    <li class="point" id=${i}>
                        <span>${waysGeoCodeArr[i].location}</span>
                        <button type="button" onclick="removeWays(${i})" class="btn btn-default btn-circle pull-right click-rem"><i class="glyphicon glyphicon-remove"></i></button>
                    </li> `);
    }

}


/* Maps Geo-code API function */
function geoCode(address, geoCodeFor) {
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=" + API_key,
        success: function (response) {
            var formattedAddress =  response.results[0].formatted_address;     //Formatted Address to the Input
            var newGeoObj = {
                location: formattedAddress,
                stopover: true
            };
            if(geoCodeFor === "startInput"){
                startGeoCodeArr.lat = response.results[0].geometry.location.lat;
                startGeoCodeArr.lng = response.results[0].geometry.location.lng;
                startGeoCodeArr.location = formattedAddress;
            }
            if(geoCodeFor === "destInput"){
                destGeoCodeArr.lat = response.results[0].geometry.location.lat;
                destGeoCodeArr.lng = response.results[0].geometry.location.lng;
                destGeoCodeArr.location = formattedAddress;
            }
            if(geoCodeFor === "wayInput"){
                waysGeoCodeArr.push(newGeoObj);
                addWayPointsToHTML();
            }
        }
    });

// function geoCode(address, geoCodeFor) {
//     axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
//         params: {
//             address: address,
//             key: API_key
//         }
//     })
//         .then(function (response) {
//             var formattedAddress =  response.data.results[0].formatted_address;     //Formatted Address to the Input
//             var lat = response.data.results[0].geometry.location.lat;               //Latitude of the input address
//             var lng = response.data.results[0].geometry.location.lng;               //Longitude of the input address
//             var newGeoObj = {
//                 location: formattedAddress,
//                 stopover: true
//             };
//             var newGeoObj1 = {
//                 location: formattedAddress,
//                 // stopover: true
//                 lat: lat,
//                 lng: lng
//             };
//             if(geoCodeFor === "startInput"){
//                 startGeoCodeArr.lat = newGeoObj1.lat;
//                 startGeoCodeArr.lng = newGeoObj1.lng;
//                 startGeoCodeArr.location = newGeoObj1.location;
//             }
//             if(geoCodeFor === "destInput"){
//                 destGeoCodeArr.lat = newGeoObj1.lat;
//                 destGeoCodeArr.lng = newGeoObj1.lng;
//                 destGeoCodeArr.location = newGeoObj1.location;
//             }
//             if(geoCodeFor === "wayInput"){
//                 waysGeoCodeArr.push(newGeoObj);
//                 addWayPointsToHTML();
//             }
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
}
startingPoint.submit(function (e) {
    e.preventDefault();
    var startInp = $('#startPtInput').val();
    var destInp = $('#destPtInput').val();
    geoCode(startInp, 'startInput');
    geoCode(destInp, 'destInput');
    // calculateAndDisplayRoute(directionsService, directionsDisplay);
    console.log(startGeoCodeArr);
});


/*   Map initialization function  */
function initMap() {

    /*Adding submit event listener */


    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    //map options
    var options = {
        zoom: 5,
        center:{
            lat: 20.5937,
            lng: 78.9629
        }
    };
    //new Map
    var map = new google.maps.Map(document.getElementById('map'), options);

    directionsDisplay.setMap(map);


    function calculateAndDisplayRoute(directionsService, directionsDisplay){
        var waypts = waysGeoCodeArr;

        directionsService.route({
            origin: new google.maps.LatLng(startGeoCodeArr.lat, startGeoCodeArr.lng),
            destination: new google.maps.LatLng(destGeoCodeArr.lat, destGeoCodeArr.lng),
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                for (var i = 0; i < route.legs.length; i++) {
                    var routeSegment = i + 1;
                    console.log(routeSegment+ ", "+ route.legs[i].start_address+ ", "+ route.legs[i].end_address +", " + route.legs[i].distance.text);

                }
            }
            else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

}