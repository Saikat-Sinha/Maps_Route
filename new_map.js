

function initMap() {
    var API_key = "AIzaSyDHoaPyBOHcUQcck0-LEAw6AsVTMt7Wqho";
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: {lat: 20.5937,
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
    });

    directionsDisplay.setMap(map);
    var url = document.location.href,
        params = url.split('?')[1].split('&');
    var startGeoLat = params[0].split('=')[1];
    var startGeoLng = params[1].split('=')[1];
    var startGeoLoc = decodeURIComponent(params[2].split('=')[1]);
    var destGeoLat = params[3].split('=')[1];
    var destGeoLng = params[4].split('=')[1];
    var destGeoLoc = decodeURIComponent(params[5].split('=')[1]);

    console.log(decodeURIComponent(params));

    if(params[6] !== undefined){
        console.log(decodeURIComponent(params[6]));
        if(decodeURIComponent(params[6].split('=')[1]).split('.')){
            var waysArr = decodeURIComponent(params[6].split('=')[1]).split('.');
        }
        else{
            var waysArr = decodeURIComponent(params[6].split('=')[1]);
        }

        var waysGeo = [];
        for(var j= 0; j< waysArr.length; j++){
            var newGeoObj = {
                location: waysArr[j],
                stopover: true
            };
            waysGeo.push(newGeoObj);
        }
    }




    calculateAndDisplayRoute(directionsService, directionsDisplay);


    function calculateAndDisplayRoute(directionsService, directionsDisplay){



        var waypts = waysGeo;
        var startOriginPtslat = startGeoLat;
        var startOriginPtslng = startGeoLng;
        var destOriginPtslat = destGeoLat;
        var destOriginPtslng = destGeoLng;

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
}
