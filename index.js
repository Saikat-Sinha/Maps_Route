/*Global variables:  Arrays to store future Geocode data*/
var waysGeoCodeArr = [];
var startGeoCodeArr = {};
var destGeoCodeArr = {};



    var removeWays = function(i) {
        waysGeoCodeArr.splice(i,1);
        $('#'+ i).remove();
    };


/*   Map initialization function  */
function initMap() {
    //firebase Config
    var config = {
        apiKey: "AIzaSyDSbvayl0GDnF6AcIp8lymbCz56tKAnIwg",
        authDomain: "maps-route-1500324598753.firebaseapp.com",
        databaseURL: "https://maps-route-1500324598753.firebaseio.com",
        projectId: "maps-route-1500324598753",
        storageBucket: "",
        messagingSenderId: "150903818209"
    };
    firebase.initializeApp(config);

    /*Caching API key for Google maps */
    var API_key = "AIzaSyDHoaPyBOHcUQcck0-LEAw6AsVTMt7Wqho";
    /* Caching variable id from form*/
    var startingPoint = $('#startPt');
    /* Caching Waypoint add button */
    var wayPtBtn = $('#wayPt');

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;



    var database = firebase.database();
    var ref = database.ref('map_par');
    var data = {
        WaysGeo: waysGeoCodeArr,
        StartGeo: startGeoCodeArr,
        DestGeo: destGeoCodeArr
    };


    ref.on('value', gotData, errData);
    
    function gotData(fireData) {
        // console.log(fireData.val());
        var Data = fireData.val();
        var keys = Object.keys(Data);
        // console.log(keys);
        for(var i = 0; i<keys.length; i++){
            var k = keys[i];
            var DestGeo = Data[k].DestGeo;
            var StartGeo = Data[k].StartGeo;
            var WaysGeo = Data[k].WaysGeo;
            // console.log(WaysGeo);

            // $('#data_list').after('Start: '+ StartGeo.location +', Destination: '+DestGeo.location + ', WayPoints: '+ (WaysGeo[0].location == "undefined"? WaysGeo[0].location:""));
        if(WaysGeo){
            $('#data_list').after(`<a href="#" onclick="MyWindow = window.open('map.html?startGeoLat=${encodeURIComponent(StartGeo.lat)}&startGeoLng=${encodeURIComponent(StartGeo.lng)}&startGeoLoc=${StartGeo.location}&destGeoLat=${encodeURIComponent(DestGeo.lat)}&destGeoLng=${encodeURIComponent(DestGeo.lng)}&destGeoLoc=${encodeURIComponent(DestGeo.location)}&waysGeoLoc=${encodeURIComponent(WaysGeo.map(entry=>entry.location).join("."))}','MyWindow', width= 600, height=300)" class="rem-link"><li class="lis panel panel-info"><b>Start: </b>${StartGeo.location}<br> <b>Destination: </b>${DestGeo.location} <br><b>WayPoints: </b><br>${WaysGeo.map(entry=>entry.location).join(", <br>")}</li></a>`);
        }
        else{
            $('#data_list').after(`<a href="#" onclick="MyWindow = window.open('map.html?startGeoLat=${encodeURIComponent(StartGeo.lat)}&startGeoLng=${encodeURIComponent(StartGeo.lng)}&startGeoLoc=${StartGeo.location}&destGeoLat=${encodeURIComponent(DestGeo.lat)}&destGeoLng=${encodeURIComponent(DestGeo.lng)}&destGeoLoc=${encodeURIComponent(DestGeo.location)}','MyWindow',width=600, height= 300)" class="rem-link"><li class="lis panel panel-info"><b>Start: </b>${StartGeo.location} <br><b>Destination: </b>${DestGeo.location}</a>`);
        }
        }
    }

    function errData(fireErr) {
        console.log(fireErr);
    }

    /* add waypoints button click handler */
    wayPtBtn.click(function () {
        var wayInp = $("#wayPtInput").val();
        geoCode(wayInp, 'wayInput');
        console.log(waysGeoCodeArr);
    });

    /*Adding submit event listener */
    startingPoint.submit(function (e) {
        e.preventDefault();
        var startInp = $('#startPtInput').val();
        geoCode(startInp, 'startInput');
        var destInp = $('#destPtInput').val();
        geoCode(destInp, 'destInput');
        setTimeout(function () {
            calculateAndDisplayRoute(directionsService, directionsDisplay);
            ref.push(data);
        },1000);

        console.log(startGeoCodeArr);
        console.log(destGeoCodeArr);
    });


    /*Template function for adding way points data in DOM*/
    function addWayPointsToHTML() {
        $( ".point" ).remove();
        for(var i=0; i<waysGeoCodeArr.length; i++){
            $('.point-addr').after(`
                    <li class="point panel panel-default" id=${i}>
                        <span>${waysGeoCodeArr[i].location}</span>
                        <i onclick="removeWays(${i})" class="glyphicon glyphicon-remove btn-circle-sp pull-righ"></i>
                    </li> 
                    `);
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
                else if(geoCodeFor === "destInput"){
                    destGeoCodeArr.lat = response.results[0].geometry.location.lat;
                    destGeoCodeArr.lng = response.results[0].geometry.location.lng;
                    destGeoCodeArr.location = formattedAddress;
                }
                else if(geoCodeFor === "wayInput"){
                    waysGeoCodeArr.push(newGeoObj);
                    addWayPointsToHTML();
                }
            }
        });
    }
    console.log(waysGeoCodeArr);



    function calculateAndDisplayRoute(directionsService, directionsDisplay){
        var waypts = waysGeoCodeArr;

        var startOriginPtslat = startGeoCodeArr.lat;
        var startOriginPtslng = startGeoCodeArr.lng;
        var destOriginPtslat = destGeoCodeArr.lat;
        var destOriginPtslng = destGeoCodeArr.lng;

        directionsService.route({
            origin: new google.maps.LatLng(startOriginPtslat, startOriginPtslng),
            destination: new google.maps.LatLng(destOriginPtslat, destOriginPtslng),
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            }
            else {
                console.log('Directions request failed due to ' + status);
            }
        });
    }

    //map options
    var options = {
        zoom: 5,
        center:{
            lat: 20.5937,
            lng: 78.9629
        },
        styles: [
            {
                "stylers": [
                    {
                        "hue": "#2c3e50"
                    },
                    {
                        "saturation": 250
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 50
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]
    };
    //new Map
    var map = new google.maps.Map(document.getElementById('map'), options);

    var startPtInput = document.getElementById('startPtInput');
    var destPtInput = document.getElementById('destPtInput');
    var wayPtInput = document.getElementById('wayPtInput');
    var autoComplete1 = new google.maps.places.Autocomplete(startPtInput);
    var autoComplete2 = new google.maps.places.Autocomplete(destPtInput);
    var autoComplete3 = new google.maps.places.Autocomplete(wayPtInput);

    directionsDisplay.setMap(map);
}